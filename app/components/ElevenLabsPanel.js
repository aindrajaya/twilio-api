"use client";
import React, { useState, useEffect } from "react";

export default function ElevenLabsPanel() {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [outboundNumber, setOutboundNumber] = useState("");
  const [callPrompt, setCallPrompt] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [isInitiatingCall, setIsInitiatingCall] = useState(false);

  // Fetch available voices
  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/elevenlabs/voices');
      const data = await response.json();
      if (data.success) {
        setVoices(data.voices);
        if (data.voices.length > 0) {
          setSelectedVoice(data.voices[0].voice_id);
        }
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
    }
  };

  const generateSpeech = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate speech');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/elevenlabs/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice,
          modelId: "eleven_multilingual_v2"
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Failed to generate speech');
    } finally {
      setIsGenerating(false);
    }
  };

  const initiateOutboundCall = async () => {
    if (!outboundNumber.trim()) {
      alert('Please enter a phone number');
      return;
    }

    setIsInitiatingCall(true);
    try {
      const response = await fetch('/api/elevenlabs/outbound-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: outboundNumber,
          prompt: callPrompt || "You are a helpful AI assistant. Be friendly and professional.",
          firstMessage: firstMessage || "Hello! How can I help you today?"
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Call initiated successfully! Call SID: ${data.callSid}`);
        setOutboundNumber("");
        setCallPrompt("");
        setFirstMessage("");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call');
    } finally {
      setIsInitiatingCall(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">
        🎙️ ElevenLabs AI Voice Assistant
      </h2>

      {/* Text-to-Speech Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Text-to-Speech</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Voice:</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {voices.map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name} ({voice.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Text to Convert:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={generateSpeech}
          disabled={isGenerating}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Speech'}
        </button>

        {audioUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Generated Audio:</label>
            <audio controls src={audioUrl} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {/* Outbound Call Section */}
      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">AI Voice Calls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number:</label>
            <input
              type="tel"
              value={outboundNumber}
              onChange={(e) => setOutboundNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">AI Prompt (Optional):</label>
          <textarea
            value={callPrompt}
            onChange={(e) => setCallPrompt(e.target.value)}
            placeholder="You are a helpful customer service representative. Be professional and friendly..."
            rows={2}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">First Message (Optional):</label>
          <textarea
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            placeholder="Hello! Thank you for your interest. How can I help you today?"
            rows={2}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={initiateOutboundCall}
          disabled={isInitiatingCall}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitiatingCall ? 'Initiating Call...' : 'Make AI Call'}
        </button>

        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Make sure your ElevenLabs Agent ID is configured and your webhook URL is set up with ngrok for local development.
          </p>
        </div>
      </div>

      {/* Integration Info */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold text-blue-800">Inbound Calls</h4>
            <p className="text-sm text-blue-600 mt-2">
              Configure your Twilio webhook to: <br />
              <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                {window.location.origin}/api/elevenlabs/inbound-call
              </code>
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-semibold text-green-800">WebSocket Stream</h4>
            <p className="text-sm text-green-600 mt-2">
              Media stream endpoint: <br />
              <code className="bg-green-100 px-2 py-1 rounded text-xs">
                {window.location.origin.replace('http', 'ws')}/api/elevenlabs/media-stream
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}