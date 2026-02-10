import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({ apiKey });
    const voices = await client.voices.getAll();

    return NextResponse.json({
      success: true,
      voices: voices.voices.map(voice => ({
        voice_id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description,
        labels: voice.labels,
        preview_url: voice.preview_url
      }))
    });

  } catch (error) {
    console.error("Error fetching voices:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch voices", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, description, files } = await req.json();

    if (!name || !files || files.length === 0) {
      return NextResponse.json(
        { error: "Name and audio files are required" },
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
    
    // Create voice clone (this is a simplified example)
    // In practice, you'd need to handle file uploads properly
    const voice = await client.voices.add({
      name,
      description,
      files: files.map(file => ({
        file_name: file.name,
        mime_type: file.type,
        file_data: file.data // Base64 encoded audio data
      }))
    });

    return NextResponse.json({
      success: true,
      voice: {
        voice_id: voice.voice_id,
        name: voice.name,
        status: 'created'
      }
    });

  } catch (error) {
    console.error("Error creating voice:", error.message);
    return NextResponse.json(
      { error: "Failed to create voice", details: error.message },
      { status: 500 }
    );
  }
}