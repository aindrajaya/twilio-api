import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export async function GET() {
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs credentials not configured" },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({ apiKey });
    
    const response = await client.conversationalAi.getSignedUrl({
      agent_id: agentId,
    });

    return NextResponse.json({ 
      success: true,
      signedUrl: response.signed_url 
    });

  } catch (error) {
    console.error("Error getting ElevenLabs signed URL:", error.message);
    return NextResponse.json(
      { error: "Failed to get signed URL", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { agentId } = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({ apiKey });
    
    const response = await client.conversationalAi.getSignedUrl({
      agent_id: agentId || process.env.ELEVENLABS_AGENT_ID,
    });

    return NextResponse.json({ 
      success: true,
      signedUrl: response.signed_url 
    });

  } catch (error) {
    console.error("Error getting ElevenLabs signed URL:", error.message);
    return NextResponse.json(
      { error: "Failed to get signed URL", details: error.message },
      { status: 500 }
    );
  }
}