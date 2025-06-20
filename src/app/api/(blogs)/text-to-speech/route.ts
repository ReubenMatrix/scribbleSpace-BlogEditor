import { NextResponse } from 'next/server';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    const audioStream = await client.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb",
      {
        outputFormat: "mp3_44100_128",
        text: text,
        modelId: "eleven_multilingual_v2"
      }
    );

    // Convert audio stream (ReadableStream) to buffer
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        chunks.push(value);
      }
      done = streamDone;
    }
    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg'
      }
    });
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}