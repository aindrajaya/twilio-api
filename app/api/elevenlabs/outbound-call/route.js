import { NextResponse } from "next/server";
import { Twilio } from "twilio";

export async function POST(req) {
  try {
    const { number, prompt, firstMessage } = await req.json();

    if (!number) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Get Twilio credentials
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhoneNumber) {
      return NextResponse.json(
        { error: "Twilio credentials not configured" },
        { status: 500 }
      );
    }

    const client = new Twilio(accountSid, authToken);
    
    // Get the host from headers to construct the webhook URL
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    
    // Create the webhook URL with parameters
    const webhookUrl = `${protocol}://${host}/api/elevenlabs/outbound-call-twiml?prompt=${encodeURIComponent(
      prompt || "You are a helpful AI assistant. Be friendly and professional."
    )}&firstMessage=${encodeURIComponent(
      firstMessage || "Hello! How can I help you today?"
    )}`;

    console.log(`Initiating outbound call to ${number} with webhook: ${webhookUrl}`);

    const call = await client.calls.create({
      from: fromPhoneNumber,
      to: number,
      url: webhookUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Outbound call initiated successfully",
      callSid: call.sid,
      status: call.status,
      to: number,
      from: fromPhoneNumber
    });

  } catch (error) {
    console.error("Error initiating outbound call:", error.message);
    return NextResponse.json(
      { error: "Failed to initiate outbound call", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "ElevenLabs outbound call endpoint",
    usage: "POST with { number, prompt?, firstMessage? }",
    example: {
      number: "+1234567890",
      prompt: "You are a sales assistant helping customers with product inquiries.",
      firstMessage: "Hi! I'm calling about your recent inquiry. How can I help you today?"
    }
  });
}