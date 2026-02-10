import { Twilio } from 'twilio';
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const message = params.get("message");
    
    if (!message) {
      return NextResponse.json({ error: 'Message parameter is required' }, { status: 400 });
    }

    console.log('Sending message:', message);

    // Get credentials from environment variables
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const toPhoneNumber = process.env.TWILIO_YOUR_PHONE_NUMBER;

    // Validate environment variables
    if (!accountSid || !authToken || !fromPhoneNumber || !toPhoneNumber) {
      console.error('Missing Twilio environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const client = new Twilio(accountSid, authToken);

    const sentMessage = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: toPhoneNumber,
    });

    console.log('Message sent successfully:', sentMessage.sid);
    return NextResponse.json({ 
      success: true,
      message: 'SMS sent successfully',
      messageId: sentMessage.sid
    });
    
  } catch (error) {
    console.error('Error sending message:', error.message);
    return NextResponse.json({ 
      error: 'Failed to send SMS',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('Sending message via POST:', message);

    // Get credentials from environment variables
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const toPhoneNumber = process.env.TWILIO_YOUR_PHONE_NUMBER;

    // Validate environment variables
    if (!accountSid || !authToken || !fromPhoneNumber || !toPhoneNumber) {
      console.error('Missing Twilio environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const client = new Twilio(accountSid, authToken);

    const sentMessage = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: toPhoneNumber,
    });

    console.log('Message sent successfully:', sentMessage.sid);
    return NextResponse.json({ 
      success: true,
      message: 'SMS sent successfully',
      messageId: sentMessage.sid
    });
    
  } catch (error) {
    console.error('Error sending message:', error.message);
    return NextResponse.json({ 
      error: 'Failed to send SMS',
      details: error.message 
    }, { status: 500 });
  }
}
