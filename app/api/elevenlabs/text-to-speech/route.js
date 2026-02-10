import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export async function POST(req) {
  try {
    const { text, voiceId, modelId } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({ apiKey });

    // Generate audio from text
    const audio = await client.textToSpeech.convert(
      voiceId || "21m00Tcm4TlvDq8ikWAM", // Default voice (Rachel)
      {
        text,
        model_id: modelId || "eleven_multilingual_v2",
        output_format: "mp3_44100_128",
      }
    );

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Error generating speech:", error.message);
    return NextResponse.json(
      { error: "Failed to generate speech", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "ElevenLabs Text-to-Speech endpoint",
    usage: "POST with { text, voiceId?, modelId? }",
    example: {
      text: "Hello, this is a test message from ElevenLabs!",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      modelId: "eleven_multilingual_v2"
    },
    availableVoices: {
      "21m00Tcm4TlvDq8ikWAM": "Rachel",
      "29vD33N1CtxCmqQRPOHJ": "Drew",
      "2EiwWnXFnvU5JabPnv8n": "Clyde",
      "CYw3kZ02Hs0563khs1Fj": "Dave",
      "IKne3meq5aSn9XLyUdCD": "Fin"
    }
  });
}