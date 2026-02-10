import { Twilio } from 'twilio';
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const message = params.get("message");
    const time = params.get("time");
    
    if (!message) {
      return NextResponse.json({ error: 'Message parameter is required' }, { status: 400 });
    }
    
    if (!time || isNaN(time) || parseInt(time) < 0) {
      return NextResponse.json({ error: 'Valid time parameter (in milliseconds) is required' }, { status: 400 });
    }

    console.log('Scheduling reminder for:', message, 'in', time, 'milliseconds');

    // Get credentials from environment variables
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const toPhoneNumber = process.env.TWILIO_YOUR_PHONE_NUMBER;

    // Validate environment variables
    if (!accountSid || !authToken || !fromPhoneNumber || !toPhoneNumber) {
      console.error('Missing Twilio environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Create a Twilio client
    const client = new Twilio(accountSid, authToken);

    // Function to send an SMS message
    const sendSMS = async (messageFromCall) => {
      try {
        const message = await client.messages.create({
          body: `Reminder: ${messageFromCall}`,
          from: fromPhoneNumber,
          to: toPhoneNumber,
        });
        console.log("SMS sent:", message.sid);
        return { success: true, messageId: message.sid };
      } catch (error) {
        console.error("Error sending SMS:", error.message);
        throw error;
      }
    };

    // Function to make a call
    const makeCall = async (messageSchedule) => {
      try {
        const call = await client.calls.create({
          twiml: `<Response><Say>Hello! This is your scheduled reminder: ${messageSchedule}. Have a great day!</Say></Response>`,
          from: fromPhoneNumber,
          to: toPhoneNumber,
        });
        console.log(`Call initiated: ${call.sid}`);
        
        // Also send an SMS after the call
        const smsResult = await sendSMS(messageSchedule);
        return { success: true, callId: call.sid, smsResult };
      } catch (error) {
        console.error(`Error making call: ${error.message}`);
        throw error;
      }
    };

    // Function to schedule a call and send a message
    const scheduleCallAndSendSMS = (messageForSchedule, delayInMilliseconds) => {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const result = await makeCall(messageForSchedule);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, parseInt(delayInMilliseconds));
      });
    };

    // Schedule the reminder
    scheduleCallAndSendSMS(message, time).catch(error => {
      console.error('Scheduled reminder failed:', error.message);
    });

    return NextResponse.json({ 
      success: true,
      message: 'Reminder scheduled successfully',
      scheduledFor: new Date(Date.now() + parseInt(time)).toISOString(),
      reminderText: message
    });

  } catch (error) {
    console.error('Error processing request:', error.message);
    return NextResponse.json({ 
      error: 'Failed to schedule reminder',
      details: error.message 
    }, { status: 500 });
  }
}
