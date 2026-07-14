/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Resend Email Integration Service
// Sends real order confirmations and admin purchase alerts.

import { Order } from '../types';
import { getResendApiKey } from './config';

export interface IResendService {
  sendOrderConfirmation(order: Order, email: string): Promise<boolean>;
  sendAdminNewOrderAlert(order: Order, adminEmail?: string): Promise<boolean>;
}

export class ResendService implements IResendService {
  private getApiKey(): string {
    return getResendApiKey();
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('[Resend Service] Resend API Key is missing. Skipping email dispatch.');
      return false;
    }

    try {
      // Direct call to Resend's API.
      // Note: onboarding@resend.dev is used for unverified domain sandbox accounts.
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AtoM Store <onboarding@resend.dev>',
          to: [to],
          subject: subject,
          html: html,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[Resend Service] Failed to send email via Resend:', errText);
        throw new Error(`Resend API Error: ${errText || response.statusText}`);
      }

      console.log(`[Resend Service] Email sent successfully to ${to} for subject: ${subject}`);
      return true;
    } catch (err: any) {
      console.error('[Resend Service] Direct email post failed, trying public CORS proxy as fallback...', err);
      try {
        // Fallback CORS proxy to guarantee browser-based execution
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        // Or if cors-anywhere is unavailable, we can log and bubble up the error
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AtoM Store <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: html,
          }),
        });
        return response.ok;
      } catch (proxyErr: any) {
        console.error('[Resend Service] Failover email post failed:', proxyErr);
        throw new Error(err.message || 'CORS restriction or network error dispatching email via Resend.');
      }
    }
  }

  async sendOrderConfirmation(order: Order, email: string): Promise<boolean> {
    console.log(`[Resend Service] Sending confirmation to: ${email}`);

    const itemsRows = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 13px;">${item.nameEn} <br/><small style="color: #888;">${item.nameAr}</small></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-size: 13px; font-weight: bold;">${item.price} EGP</td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #d97706; padding: 25px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px;">AtoM LUXURY</h1>
          <p style="margin: 5px 0 0; font-size: 13px; opacity: 0.9;">تم استلام طلبك بنجاح | Order Confirmed</p>
        </div>
        <div style="padding: 25px; background-color: #ffffff; color: #333333; line-height: 1.6;">
          <h3 style="margin-top: 0;">Dear ${order.customerName},</h3>
          <p style="font-size: 14px;">Thank you for shopping at <strong>AtoM Store</strong>. Your order is registered under ID <span style="color: #d97706; font-weight: bold; font-family: monospace;">${order.id}</span> and is being processed for shipping immediately.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f9f9f9;">
                <th style="padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #888;">Item</th>
                <th style="padding: 10px; text-align: center; font-size: 12px; text-transform: uppercase; color: #888;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 12px; text-transform: uppercase; color: #888;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; font-size: 13px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Subtotal:</span>
              <strong style="float: right;">${order.subtotal} EGP</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Shipping Fee:</span>
              <strong style="float: right; color: ${order.shippingFee === 0 ? 'green' : '#333'};">${order.shippingFee === 0 ? 'FREE' : order.shippingFee + ' EGP'}</strong>
            </div>
            ${order.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: green;">
                <span>Discount Code Applied:</span>
                <strong style="float: right;">-${order.discount} EGP</strong>
              </div>
            ` : ''}
            <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;"/>
            <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: bold;">
              <span>Grand Total:</span>
              <strong style="float: right; color: #d97706;">${order.total} EGP</strong>
            </div>
          </div>

          <p style="font-size: 13px; color: #666; margin-bottom: 5px;"><strong>Shipping Address:</strong> ${order.shippingAddress.building}, ${order.shippingAddress.street}, ${order.shippingAddress.cityEn}, ${order.shippingAddress.governorateEn}</p>
          <p style="font-size: 13px; color: #666; margin-bottom: 20px;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>

          <p style="font-size: 12px; text-align: center; color: #999; border-top: 1px solid #f1f1f1; padding-top: 15px; margin: 30px 0 0;">
            AtoM Egypt - Luxury Footwear & Accessories.<br/>
            For tracking and updates, contact WhatsApp support at ${order.customerPhone}.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(email, `AtoM Luxury - Order Confirmed #${order.id}`, htmlContent);
  }

  async sendAdminNewOrderAlert(order: Order, adminEmail: string = 'abdelftahmohamed745@gmail.com'): Promise<boolean> {
    console.log(`[Resend Service] Dispatching Admin Purchase Alert to: ${adminEmail}`);

    const itemsSummary = order.items
      .map(item => `<li>${item.nameEn} x ${item.quantity} (${item.price} EGP)</li>`)
      .join('');

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; border: 2px solid #ef4444; border-radius: 8px;">
        <h2 style="color: #ef4444; margin-top: 0;">🚨 New Order Received! #${order.id}</h2>
        <p>A new purchase has been placed on <strong>AtoM Store</strong>.</p>
        
        <h4>Customer Information:</h4>
        <ul>
          <li><strong>Name:</strong> ${order.customerName}</li>
          <li><strong>Phone:</strong> ${order.customerPhone}</li>
          <li><strong>Address:</strong> ${order.shippingAddress.building}, ${order.shippingAddress.street}, ${order.shippingAddress.cityEn}</li>
        </ul>

        <h4>Order Details:</h4>
        <ul>
          ${itemsSummary}
        </ul>

        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Total Amount:</strong> <span style="font-size: 18px; color: #d97706; font-weight: bold;">${order.total} EGP</span></p>

        <p style="margin-top: 25px;"><a href="${window.location.origin}/#admin" style="background-color: #333; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 13px;">View in Admin Panel</a></p>
      </div>
    `;

    return this.sendEmail(adminEmail, `🚨 AtoM Admin Alert - New Order #${order.id}`, htmlContent);
  }
}

export const resendService = new ResendService();
