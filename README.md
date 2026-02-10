# Twilio Reminder App

A Next.js application that allows you to schedule SMS and voice call reminders using Twilio's API. Set up personalized reminders that will call and text you at your specified time.

# Twilio + ElevenLabs AI Voice Assistant

A Next.js application that combines Twilio's communication platform with ElevenLabs' conversational AI to create intelligent voice assistants, SMS reminders, and text-to-speech capabilities. Experience the future of automated communication with lifelike AI conversations.

## 🌟 Features

### ✅ Fully Working with Standard Next.js

- 📱 **SMS Reminders**: Send immediate and scheduled SMS messages
- 📞 **Voice Call Reminders**: Schedule voice calls with custom messages  
- 🎙️ **Text-to-Speech**: Convert text to lifelike speech with ElevenLabs voices
- 🎭 **Voice Library**: Browse and use multiple ElevenLabs voices
- 📊 **API Integration**: RESTful APIs for all Twilio and ElevenLabs features
- 💾 **Persistent Storage**: Reminders saved in local storage
- 🎨 **Modern UI**: React, Tailwind CSS, and smooth transitions

### 🚀 Advanced Features (Requires Production Deployment)

- 🤖 **Real-time Conversational AI**: Live WebSocket-based AI voice conversations
- 📲 **Inbound AI Call Handling**: AI agents that answer phone calls
- 🔄 **Bidirectional Audio Streaming**: Real-time audio between Twilio and ElevenLabs

> **Note**: WebSocket features work best on platforms with WebSocket support (Vercel, Railway, Render, etc.). For local development, the HTTP-based features (SMS, TTS, scheduled calls) work perfectly with standard `next dev`.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Twilio account ([Sign up for free](https://www.twilio.com/try-twilio))
- A Twilio phone number (can use the free trial number)
- An ElevenLabs account ([Sign up for free](https://elevenlabs.io/))
- An ElevenLabs Conversational AI Agent ([Create one here](https://elevenlabs.io/app/conversational-ai))
- ngrok for local development ([Download here](https://ngrok.com/))

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd twilio-reminder-app
npm install
```

### 2. Configure Twilio

1. Go to [Twilio Console](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Get your Twilio phone number from the Phone Numbers section
4. Note your personal phone number (where you want to receive calls/SMS)

### 3. Configure ElevenLabs

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for an account and get your **API Key** from Settings → API Keys
3. Create a **Conversational AI Agent**:
   - Go to [ElevenLabs Conversational AI](https://elevenlabs.io/app/conversational-ai)
   - Click "Create Agent"
   - Configure your agent's personality, voice, and knowledge base
   - Copy the **Agent ID** from the agent's settings

### 4. Environment Setup

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your actual credentials:
```env
# Twilio Configuration
ACCOUNT_SID=your_twilio_account_sid_here
AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_YOUR_PHONE_NUMBER=+1234567890

# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id_here

# Development URL (will be replaced with ngrok URL)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important**: Replace all placeholder values with your actual credentials.

### 5. Install Dependencies and Run

```bash
npm install
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000) using standard Next.js.

### 6. Set Up ngrok for Testing (Required for Phone Calls)

For testing webhooks locally, you'll need ngrok:

```bash
# Install ngrok if you haven't already
npm install -g ngrok

# In a new terminal, start ngrok tunnel
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and configure your Twilio webhook:
- Go to your Twilio Phone Number settings  
- Set the webhook URL to: `https://your-ngrok-url.ngrok.io/api/elevenlabs/inbound-call`
- Set HTTP method to POST

**Note**: The real-time WebSocket streaming for conversational AI works best when deployed to a production environment with WebSocket support (Vercel, Railway, Render, etc.) or using ElevenLabs' Widget/SDK for client-side conversations.

## API Endpoints

### Health Check
- **GET** `/api/get`
- Returns API status, configuration status, and available endpoints

### Twilio Endpoints

#### 1. Send Immediate SMS
- **GET** `/api/twiliosend?message=your_message`
- **POST** `/api/twiliosend` with JSON body: `{"message": "your_message"}`
- Sends an immediate SMS with your message

#### 2. Schedule Reminder (Call + SMS)
- **GET** `/api/twilio?message=your_message&time=delay_in_milliseconds`
- Schedules a voice call and SMS reminder after the specified delay

### ElevenLabs Endpoints

#### 1. Text-to-Speech
- **POST** `/api/elevenlabs/text-to-speech`
- Body: `{"text": "Hello world", "voiceId": "voice_id", "modelId": "model_id"}`
- Converts text to speech audio file

#### 2. Get Available Voices
- **GET** `/api/elevenlabs/voices`
- Returns list of available voices with their IDs and descriptions

#### 3. Get Signed URL for Conversations
- **GET** `/api/elevenlabs/signed-url`
- Returns signed URL for authenticated ElevenLabs conversations

#### 4. Inbound Call Webhook
- **POST** `/api/elevenlabs/inbound-call`
- Twilio webhook endpoint for handling incoming calls with AI

#### 5. Initiate Outbound AI Call
- **POST** `/api/elevenlabs/outbound-call`
- Body: `{"number": "+1234567890", "prompt": "agent_prompt", "firstMessage": "greeting"}`
- Initiates an AI-powered outbound call

### WebSocket Endpoints

#### Media Stream (Requires WebSocket-capable deployment)
- **WebSocket** `/api/elevenlabs/media-stream`
- Real-time audio streaming between Twilio and ElevenLabs
- **Note**: This endpoint requires deployment to a platform with WebSocket support or a separate WebSocket server. For production use, consider deploying to Vercel, Railway, or Render.

## Usage Examples

### Using the Web Interface

The application now features two main panels:

1. **Twilio Reminder Panel** (Left side):
   - Enter your reminder message
   - Select a date and time
   - Click submit to schedule your reminder

2. **ElevenLabs AI Panel** (Right side):
   - **Text-to-Speech**: Convert text to speech with different voices
   - **AI Voice Calls**: Make outbound calls with conversational AI
   - Configure AI prompts and first messages

### API Usage Examples

```bash
# Health check - see all endpoints and configuration status
curl "http://localhost:3000/api/get"

# Send immediate SMS
curl "http://localhost:3000/api/twiliosend?message=Hello%20World"

# Generate speech from text
curl -X POST "http://localhost:3000/api/elevenlabs/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is ElevenLabs speaking!"}'

# Get available voices
curl "http://localhost:3000/api/elevenlabs/voices"

# Initiate AI outbound call
curl -X POST "http://localhost:3000/api/elevenlabs/outbound-call" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "+1234567890",
    "prompt": "You are a friendly customer service agent helping with product inquiries.",
    "firstMessage": "Hi! Thanks for your interest in our products. How can I help you today?"
  }'

# Schedule reminder in 10 seconds
curl "http://localhost:3000/api/twilio?message=Meeting%20reminder&time=10000"
```

### Using JavaScript Fetch

```javascript
// Send immediate SMS
fetch('/api/twiliosend?message=Hello World')
  .then(response => response.json())
  .then(data => console.log(data));

// Generate AI speech
fetch('/api/elevenlabs/text-to-speech', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Welcome to the future of AI conversation!',
    voiceId: '21m00Tcm4TlvDq8ikWAM' // Rachel voice
  })
})
.then(response => response.blob())
.then(audioBlob => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
});

// Make AI outbound call
fetch('/api/elevenlabs/outbound-call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    number: '+1234567890',
    prompt: 'You are a helpful assistant providing appointment reminders.',
    firstMessage: 'Hi! This is a reminder about your appointment tomorrow at 2 PM.'
  })
})
.then(response => response.json())
.then(data => console.log('Call initiated:', data));

// Schedule reminder
fetch('/api/twilio?message=Doctor appointment&time=3600000') // 1 hour
  .then(response => response.json())
  .then(data => console.log(data));
```

## Project Structure

```
twilio-api/
├── app/
│   ├── api/
│   │   ├── get.js                          # Health check & status endpoint
│   │   ├── elevenlabs/
│   │   │   ├── signed-url/
│   │   │   │   └── route.js               # ElevenLabs signed URL for conversations
│   │   │   ├── text-to-speech/
│   │   │   │   └── route.js               # Convert text to speech
│   │   │   ├── voices/
│   │   │   │   └── route.js               # Get available voices & voice cloning
│   │   │   ├── inbound-call/
│   │   │   │   └── route.js               # Handle incoming calls with AI
│   │   │   ├── outbound-call/
│   │   │   │   └── route.js               # Initiate outbound AI calls
│   │   │   └── outbound-call-twiml/
│   │   │       └── route.js               # TwiML for outbound calls
│   │   ├── twilio/
│   │   │   └── route.js                   # Scheduled reminders (call + SMS)
│   │   └── twiliosend/
│   │       └── route.js                   # Immediate SMS sending
│   ├── components/
│   │   ├── firstPage.js                   # Original Twilio reminder UI
│   │   └── ElevenLabsPanel.js            # New AI voice features UI
│   ├── context/
│   │   └── store.js                       # State management for reminders
│   ├── globals.css                        # Global styles
│   ├── layout.js                          # App layout
│   └── page.js                           # Main page with both panels
├── examples/
│   └── api-usage.js                      # API usage examples
├── public/                               # Static assets
├── .env.local.example                   # Environment variables template
└── README.md                           # This file
```

## Architecture

This is a **standard Next.js application** using the App Router with API Routes.

### ✅ What Works with `next dev`

1. **API Routes**: All HTTP endpoints work perfectly with Next.js built-in server
2. **Twilio SMS**: Send SMS via Twilio API
3. **Scheduled Calls**: Schedule voice calls using Twilio
4. **ElevenLabs TTS**: Generate speech audio files
5. **Voice Management**: List and manage ElevenLabs voices
6. **Webhook Endpoints**: Receive Twilio webhooks for call events

### ⚠️ Real-time Conversational AI Considerations

For bidirectional WebSocket streaming (real-time AI voice conversations), you have several options:

**Option 1: ElevenLabs Widget (Easiest)**
- Embed ElevenLabs Conversational AI widget directly in your frontend
- No server-side WebSocket needed
- Works perfectly with Next.js
- [ElevenLabs Widget Docs](https://elevenlabs.io/docs/conversational-ai/guides/conversational-ai-widget)

**Option 2: Deploy to Production**
- Deploy to Vercel, Railway, Render, etc.
- These platforms can handle WebSocket connections for Twilio media streams

**Option 3: Separate Microservice**
- Run a dedicated Node.js WebSocket server alongside Next.js for media streaming
- Next.js handles the UI and simple API calls
- Microservice handles real-time audio proxying

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| **Twilio Configuration** | | |
| `ACCOUNT_SID` | Your Twilio Account SID | `ACxxxxxxxxxxxxxxxxxxxxx` |
| `AUTH_TOKEN` | Your Twilio Auth Token | `your_auth_token_here` |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number | `+1234567890` |
| `TWILIO_YOUR_PHONE_NUMBER` | Your personal phone number | `+1234567890` |
| **ElevenLabs Configuration** | | |
| `ELEVENLABS_API_KEY` | Your ElevenLabs API Key | `your_api_key_here` |
| `ELEVENLABS_AGENT_ID` | Your ElevenLabs Agent ID | `your_agent_id_here` |
| **Development** | | |
| `NEXT_PUBLIC_BASE_URL` | Base URL for webhooks | `https://abc123.ngrok.io` |

## Error Handling

The application includes comprehensive error handling:

- **400 Bad Request**: Missing required parameters
- **500 Internal Server Error**: Twilio API errors or server configuration issues
- **Validation**: Checks for required environment variables
- **User Feedback**: Clear error messages in the UI

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. **New API Routes**: Add files in `app/api/`
2. **UI Components**: Add files in `app/components/`
3. **State Management**: Modify `app/context/store.js`
4. **Styling**: Update Tailwind classes or `globals.css`

## Troubleshooting

### Common Issues

1. **"Server configuration error" or "ElevenLabs credentials not configured"**
   - Check that all environment variables are set in `.env.local`
   - Ensure no extra spaces or quotes around values
   - Verify your ElevenLabs API key is valid
   - Make sure your ElevenLabs Agent ID is correct

2. **SMS/Calls not working**
   - Verify your Twilio account is active
   - Check phone number formats (include country code with +)
   - For trial accounts, verify the destination number is verified

3. **AI conversations not connecting**
   - Ensure your ngrok tunnel is active and URL is correct
   - Verify Twilio webhook is pointing to your ngrok URL + `/api/elevenlabs/inbound-call`
   - Check that your ElevenLabs agent is properly configured
   - Make sure WebSocket connections are not blocked by firewall

4. **"Failed to get signed URL"**
   - Verify your ElevenLabs API key has the correct permissions
   - Check that your ElevenLabs Agent ID exists and is active
   - Ensure your ElevenLabs account is not rate-limited

5. **App not starting or WebSocket errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that Node.js version is 18 or higher
   - Make sure port 3000 is not being used by another application

### Testing Your Setup

1. **Test the health check endpoint**:
```bash
curl http://localhost:3000/api/get
```
This should show the configuration status of both Twilio and ElevenLabs.

2. **Test Twilio SMS** (replace with your message):
```bash
curl "http://localhost:3000/api/twiliosend?message=Test%20message"
```

3. **Test ElevenLabs Text-to-Speech**:
```bash
curl -X POST "http://localhost:3000/api/elevenlabs/text-to-speech" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test"}' \
  --output test-speech.mp3
```

4. **Test AI Voice Call** (use your ngrok URL):
```bash
curl -X POST "https://your-ngrok-url.ngrok.io/api/elevenlabs/outbound-call" \
  -H "Content-Type: application/json" \
  -d '{"number": "+1234567890", "prompt": "You are a test assistant", "firstMessage": "This is a test call"}'
```

5. **Test Inbound Call**:
   - Call your Twilio phone number
   - The AI agent should answer and begin conversation

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Consider using Twilio's webhook validation in production
- Implement rate limiting for production deployments

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure your deployment platform supports:
- Node.js 18+
- Environment variables
- API routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Twilio's [documentation](https://www.twilio.com/docs)
3. Create an issue in the repository

---

**Note**: This app uses Twilio's paid services. SMS messages and phone calls will incur charges according to Twilio's pricing. New accounts receive trial credits to get started.
