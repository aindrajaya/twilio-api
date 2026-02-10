import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const callSid = formData.get("CallSid") || "Unknown";
    const fromNumber = formData.get("From") || "Unknown";
    
    console.log(`Incoming ElevenLabs call: CallSid=${callSid}, From=${fromNumber}`);

    // Get the host from headers to construct the WebSocket URL
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') === 'https' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${host}/api/elevenlabs/media-stream`;

    // Generate TwiML response to connect the call to our WebSocket stream
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}" />
  </Connect>
</Response>`;

    return new Response(twimlResponse, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error handling incoming call:', error.message);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, there was an error processing your call. Please try again later.</Say>
  <Hangup />
</Response>`;

    return new Response(errorTwiml, {
      status: 500,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "ElevenLabs inbound call endpoint",
    usage: "Configure this URL as your Twilio webhook for incoming calls",
    method: "POST"
  });
}