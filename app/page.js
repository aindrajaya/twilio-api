"use client"
import Image from 'next/image'
import FirstPage from './components/firstPage'
import ElevenLabsPanel from './components/ElevenLabsPanel'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Twilio Reminder functionality */}
          <div>
            <FirstPage />
          </div>
          
          {/* New ElevenLabs AI Voice functionality */}
          <div>
            <ElevenLabsPanel />
          </div>
        </div>
        
        {/* Integration Info */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
            🚀 Twilio + ElevenLabs Integration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                📱
              </div>
              <h3 className="font-semibold mb-2">SMS Reminders</h3>
              <p className="text-sm text-gray-600">
                Schedule and send SMS reminders with custom messages
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                🎙️
              </div>
              <h3 className="font-semibold mb-2">AI Voice Calls</h3>
              <p className="text-sm text-gray-600">
                Make intelligent voice calls with conversational AI
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                🔊
              </div>
              <h3 className="font-semibold mb-2">Text-to-Speech</h3>
              <p className="text-sm text-gray-600">
                Convert text to natural-sounding speech with multiple voices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
