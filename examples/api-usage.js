// Example usage of the Twilio Reminder API

// 1. Test the health check endpoint
fetch('http://localhost:3000/api/get')
  .then(response => response.json())
  .then(data => console.log('Health check:', data));

// 2. Send an immediate SMS
fetch('http://localhost:3000/api/twiliosend?message=Hello from your reminder app!')
  .then(response => response.json())
  .then(data => console.log('SMS sent:', data));

// 3. Send SMS via POST request
fetch('http://localhost:3000/api/twiliosend', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'This is a test message via POST'
  })
})
  .then(response => response.json())
  .then(data => console.log('SMS sent via POST:', data));

// 4. Schedule a reminder for 30 seconds from now
const thirtySeconds = 30 * 1000; // 30 seconds in milliseconds
fetch(`http://localhost:3000/api/twilio?message=Your scheduled reminder!&time=${thirtySeconds}`)
  .then(response => response.json())
  .then(data => console.log('Reminder scheduled:', data));

// 5. Schedule a reminder for 2 minutes from now
const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds
fetch(`http://localhost:3000/api/twilio?message=Meeting in 5 minutes&time=${twoMinutes}`)
  .then(response => response.json())
  .then(data => console.log('Meeting reminder scheduled:', data));

// Example function to calculate delay for a specific datetime
function scheduleForDateTime(message, targetDate) {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const delay = target - now;
  
  if (delay <= 0) {
    console.log('Target time is in the past!');
    return;
  }
  
  fetch(`http://localhost:3000/api/twilio?message=${encodeURIComponent(message)}&time=${delay}`)
    .then(response => response.json())
    .then(data => console.log('Reminder scheduled for', targetDate, ':', data));
}

// Schedule a reminder for a specific date and time
// scheduleForDateTime('Doctor appointment reminder', '2024-12-25T10:30:00');

// Using curl commands (run these in your terminal):
/*

# Test health check
curl "http://localhost:3000/api/get"

# Send immediate SMS
curl "http://localhost:3000/api/twiliosend?message=Hello%20World"

# Schedule reminder in 1 minute (60000 milliseconds)
curl "http://localhost:3000/api/twilio?message=Test%20reminder&time=60000"

# Send SMS via POST
curl -X POST "http://localhost:3000/api/twiliosend" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message via POST"}'

*/