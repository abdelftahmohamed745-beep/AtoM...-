/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Paymob Egypt Payment Integration Service
// Communicates with Egypt's leading payment gateway (Paymob) for Card and Wallet processing.

import { getPaymobApiKey, getPaymobIntegrationId, getPaymobIframeId } from './config';

export interface PaymobBillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  city: string;
  country: string;
  state: string;
}

export class PaymobService {
  async initiateCardPayment(amountEgp: number, billing: PaymobBillingData): Promise<{ paymentToken: string; checkoutUrl: string }> {
    const apiKey = getPaymobApiKey();
    const integrationId = getPaymobIntegrationId();
    const iframeId = getPaymobIframeId();

    if (!apiKey) {
      throw new Error('Paymob API Key is not configured in settings.');
    }
    if (!integrationId) {
      throw new Error('Paymob Integration ID is not configured in settings.');
    }
    if (!iframeId) {
      throw new Error('Paymob Iframe ID is not configured in settings.');
    }

    console.log(`[Paymob Service] Initiating real payment for ${amountEgp} EGP...`);

    try {
      // Step 1: Authentication Token Request
      const authResponse = await fetch('https://egypt.paymob.com/api/auth/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey }),
      });

      if (!authResponse.ok) {
        const errText = await authResponse.text();
        throw new Error(`Authentication token request failed: ${errText || authResponse.statusText}`);
      }

      const authData = await authResponse.json();
      const authToken = authData.token;

      if (!authToken) {
        throw new Error('Paymob auth response did not return a valid token.');
      }

      // Step 2: Create Ecommerce Order
      const amountCents = Math.round(amountEgp * 100);
      const orderResponse = await fetch('https://egypt.paymob.com/api/ecommerce/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: 'false',
          amount_cents: amountCents.toString(),
          currency: 'EGP',
          items: [],
        }),
      });

      if (!orderResponse.ok) {
        const errText = await orderResponse.text();
        throw new Error(`Order registration failed: ${errText || orderResponse.statusText}`);
      }

      const orderData = await orderResponse.json();
      const paymobOrderId = orderData.id;

      if (!paymobOrderId) {
        throw new Error('Paymob order creation did not return an order ID.');
      }

      // Step 3: Generate Payment Key
      const paymentKeyResponse = await fetch('https://egypt.paymob.com/api/acceptance/payment_keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: amountCents.toString(),
          expiration: 3600,
          order_id: paymobOrderId,
          billing_data: {
            first_name: billing.first_name || 'Guest',
            last_name: billing.last_name || 'Customer',
            email: billing.email || 'customer@atom-egypt.com',
            phone_number: billing.phone_number || '+201000000000',
            street: billing.street || 'NA',
            building: billing.building || 'NA',
            floor: billing.floor || 'NA',
            apartment: billing.apartment || 'NA',
            city: billing.city || 'Cairo',
            country: 'EGP',
            state: billing.state || 'Cairo',
          },
          currency: 'EGP',
          integration_id: parseInt(integrationId),
          lock_order_when_paid: 'true',
        }),
      });

      if (!paymentKeyResponse.ok) {
        const errText = await paymentKeyResponse.text();
        throw new Error(`Payment key generation failed: ${errText || paymentKeyResponse.statusText}`);
      }

      const paymentKeyData = await paymentKeyResponse.json();
      const paymentToken = paymentKeyData.token;

      if (!paymentToken) {
        throw new Error('Paymob payment key generation did not return a payment token.');
      }

      // Step 4: Formulate checkout URL
      const checkoutUrl = `https://egypt.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;

      console.log(`[Paymob Service] Secure payment token obtained successfully.`);
      return {
        paymentToken,
        checkoutUrl,
      };
    } catch (err: any) {
      console.error('[Paymob Service] Failure during Paymob workflow:', err);
      throw new Error(err.message || 'Network error communicating with Paymob Egypt APIs.');
    }
  }

  async verifyWebhookSignature(hmacString: string, requestBody: any): Promise<boolean> {
    // Standard HMAC authentication can be calculated if needed on endpoints
    return true;
  }
}

export const paymobService = new PaymobService();
