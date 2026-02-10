import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const prompt = url.searchParams.get("prompt");
    const firstMessage = url.searchParams.get("firstMessage");
    
    console.log("Outbound call TwiML requested with prompt:", prompt, "firstMessage:", firstMessage);

    // Get the host from headers to construct the WebSocket URL
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') === 'https' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${host}/api/elevenlabs/outbound-media-stream?prompt=${encodeURIComponent(
      prompt || ""
    )}&firstMessage=${encodeURIComponent(firstMessage || "")}`;

    // Generate TwiML response to connect the call to our WebSocket stream with custom parameters
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}">
      <Parameter name="prompt" value="${prompt || ''}" />
      <Parameter name="firstMessage" value="${firstMessage || ''}" />
    </Stream>
  </Connect>
</Response>`;

    return new Response(twimlResponse, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error generating outbound call TwiML:', error.message);
    
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

export async function GET(req) {
  const url = new URL(req.url);
  const prompt = url.searchParams.get("prompt");
  const firstMessage = url.searchParams.get("firstMessage");
  
  return NextResponse.json({
    message: "ElevenLabs outbound call TwiML endpoint",
    parameters: {
      prompt: prompt || "Not provided",
      firstMessage: firstMessage || "Not provided"
    },
    usage: "This endpoint is called by Twilio when initiating outbound calls"
  });
}