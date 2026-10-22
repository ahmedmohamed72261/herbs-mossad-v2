import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface ContactRequestBody {
  name: string;
  company?: string;
  email: string;
  phone: string;
  product_name?: string;
  quantity?: string;
  destination?: string;
  specifications?: string;
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const {
      name,
      company = '',
      email,
      phone,
      product_name = '',
      quantity = '',
      destination = '',
      specifications = '',
      message = '',
    }: ContactRequestBody = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required fields.',
      });
    }

    const payload = {
      name,
      email,
      phone,
      subject: `RFQ: ${product_name || 'Egyptian Botanicals'} (${quantity || 'Bulk'}) to ${destination || 'Global'}`,
      message: `Client / Company: ${name} (${company || 'Individual Importer'})\n` +
        `Product: ${product_name}\n` +
        `Quantity: ${quantity}\n` +
        `Destination Country/Port: ${destination}\n` +
        `Specifications: ${specifications || 'Standard Export Quality'}\n` +
        `Additional Notes: ${message || 'None'}\n` +
        `Date: ${new Date().toISOString()}`,
    };

    // Forward to remote Laravel backend if available
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://herbs-v2-backend.vercel.app/api';
    try {
      await axios.post(`${backendUrl}/contact-messages`, payload, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (backendError: any) {
      // Log for monitoring but continue so client request is acknowledged
      console.warn('Backend API notification status:', backendError?.message || backendError);
    }

    // Optional: If SMTP / notification webhook exists in env, it can trigger here

    return res.status(200).json({
      success: true,
      message: 'Your RFQ has been received by Herbivaeg export team. We will review and respond within 24 hours.',
      whatsapp_dispatch: `https://wa.me/966582848394`,
    });
  } catch (error: any) {
    console.error('Contact handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process inquiry. Please contact directly via WhatsApp at +966 58 284 8394.',
    });
  }
}
