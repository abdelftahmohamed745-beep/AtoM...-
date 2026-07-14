/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Egypt Shipping Courier Integration (Aramex / Bosta)
// Integrates with local Egypt delivery couriers to handle dynamic rates, shipping labels, and real-time package tracking.

import { Order, Address } from '../types';
import { EGYPT_GOVERNORATES } from '../constants';

export interface ShipmentDetails {
  trackingNumber: string;
  carrier: 'Bosta' | 'Aramex';
  status: 'pickup_scheduled' | 'out_for_delivery' | 'delivered' | 'returned';
  labelUrl: string;
}

/*
  TODO: Production Bosta/Aramex Setup Instructions
  
  1. For Bosta:
     Sign up on bosta.co, get API key.
     Endpoint: POST https://api.bosta.co/api/v1/deliveries
     Headers: { "Authorization": apiKey }
     Body: {
       "type": 10, // Regular delivery
       "specs": { "packageDetails": { "itemsCount": 2, "description": "Luxury Items" } },
       "receiver": { "firstName": name, "phone": phone },
       "address": { "firstLine": street, "city": city, "zone": zone }
     }
     
  2. For Aramex:
     Aramex uses SOAP or XML APIs requiring account numbers and entity hashes.
     Integrate using Aramex Shipment Creation API endpoints.
*/

export class ShippingService {
  async calculateDynamicFee(governorateId: string, weightKg: number = 1): Promise<number> {
    const gov = EGYPT_GOVERNORATES.find(g => g.id === governorateId);
    if (!gov) return 50; // Default flat rate
    
    // Simple weight calculation multiplier: base fee + 10 EGP per extra kg above 2kg
    const baseFee = gov.shippingFee;
    if (weightKg > 2) {
      return baseFee + Math.ceil(weightKg - 2) * 10;
    }
    return baseFee;
  }

  async createShipment(order: Order): Promise<ShipmentDetails> {
    console.log(`[Shipping Service] Registering shipment for Order: ${order.id}`);
    
    // Select carrier based on address. Delta & Upper Egypt usually use Aramex; Cairo/Alex use Bosta.
    const isCairoOrAlex = ['cairo', 'giza', 'alexandria'].includes(order.shippingAddress.governorateEn.toLowerCase());
    const carrier = isCairoOrAlex ? 'Bosta' : 'Aramex';

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          trackingNumber: `${carrier === 'Bosta' ? 'BST' : 'AMX'}-${Math.floor(1000000 + Math.random() * 9000000)}`,
          carrier,
          status: 'pickup_scheduled',
          labelUrl: `https://example.com/shipping-labels/${order.id}.pdf`
        });
      }, 800);
    });
  }

  async trackShipment(trackingNumber: string): Promise<{ status: string; updates: { date: string; location: string; note: string }[] }> {
    return {
      status: 'out_for_delivery',
      updates: [
        { date: new Date().toISOString(), location: 'Cairo Hub', note: 'Shipment handed over to courier driver' },
        { date: new Date(Date.now() - 86400000).toISOString(), location: 'El-Marg Sorting Center', note: 'Package scanned' },
        { date: new Date(Date.now() - 172800000).toISOString(), location: 'AtoM Warehouse', note: 'Pickup completed by courier' }
      ]
    };
  }
}

export const shippingService = new ShippingService();
