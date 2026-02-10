import { NextResponse } from "next/server";

export async function GET(req) {
  // Check environment variables
  const twilioConfigured = !!(process.env.ACCOUNT_SID && process.env.AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
  const elevenLabsConfigured = !!(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_AGENT_ID);
  
  return NextResponse.json({ 
    message: 'Twilio + ElevenLabs API is running',
    timestamp: new Date().toISOString(),
    status: {
      twilio: twilioConfigured ? 'configured' : 'not configured',
      elevenlabs: elevenLabsConfigured ? 'configured' : 'not configured'
    },
    endpoints: {
      // Twilio endpoints
      sendSMS: '/api/twiliosend?message=your_message',
      scheduleReminder: '/api/twilio?message=your_message&time=milliseconds',
      
      // ElevenLabs endpoints
      textToSpeech: '/api/elevenlabs/text-to-speech',
      getVoices: '/api/elevenlabs/voices',
      signedUrl: '/api/elevenlabs/signed-url',
      inboundCall: '/api/elevenlabs/inbound-call',
      outboundCall: '/api/elevenlabs/outbound-call',
      
      // WebSocket endpoints
      mediaStream: 'ws://localhost:3000/api/elevenlabs/media-stream'
    },
    setup: {
      twilio: {
        required: ['ACCOUNT_SID', 'AUTH_TOKEN', 'TWILIO_PHONE_NUMBER', 'TWILIO_YOUR_PHONE_NUMBER'],
        webhookUrl: `${req.headers.get('host') || 'localhost:3000'}/api/elevenlabs/inbound-call`
      },
      elevenlabs: {
        required: ['ELEVENLABS_API_KEY', 'ELEVENLABS_AGENT_ID'],
        signUp: 'https://elevenlabs.io/',
        docs: 'https://elevenlabs.io/docs/conversational-ai'
      }
    }
  });
}

export async function POST(req) {
  return NextResponse.json({ 
    message: 'POST request received',
    timestamp: new Date().toISOString()
  });
}