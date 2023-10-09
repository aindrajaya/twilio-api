import { Twilio } from 'twilio';
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);
  const message = params.get("message");
  const time = params.get("time");
  console.log(message, "data message")
  console.log(time, "time message")

  // const fromPhoneNumber = "+12565677801";
  // const toPhoneNumber = "+phone";
  // const accountSid = 'YOUR_ACCOUNT_SID';
  // const authToken = 'YOUR_AUTH_TOKEN';

  const accountSid = 'AC656458a960f2caefbcd7942e6efcae4b';
  const authToken = 'db4fc39d2add636c455c05ec6ea1eb68';
  const fromPhoneNumber = '+12565677801';
  const toPhoneNumber = '+6281263589080';

  // Create a Twilio client
  const client = new Twilio(accountSid, authToken);

  try {
    // Function to send an SMS message
    const sendSMS = (messageFromCall) => {
      return client.messages
        .create({
          body: `${messageFromCall}`,
          from: fromPhoneNumber,
          to: toPhoneNumber,
        })
        .then((message) => {
          console.log("Message sent:", message.sid);
          return NextResponse.json({ message: 'SMS sent successfully' });
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          return NextResponse.json({ error: 'Failed to send SMS' });
        });
    };

    // Function to make a call and send messages
    const makeCall = (messageSchedule) => {
      return client.calls
        .create({
          twiml: `<Response><Say>Welcome to the Twilio call with messages example. Your today reminder is ${messageSchedule}</Say></Response>`,
          from: fromPhoneNumber,
          to: toPhoneNumber,
        })
        .then((call) => {
          console.log(`Call SID: ${call.sid}`);
          // Return the result of sending the SMS
          // return sendSMS(messageSchedule);
        })
        .catch((error) => {
          console.error(`Error making call: ${error.message}`);
          return NextResponse.json({ error: 'Failed to call and send SMS' });
        });
    };

    // Example: Send a message with a scheduled call
    // const scheduledTimeMillis = /* Calculate the scheduled time in milliseconds */
    // const scheduledMessage = "Your scheduled message";

    // Function to schedule a call and send a message
    const scheduleCallAndSendSMS = (messageForSchedule) => {
      setTimeout(() => {
        // Call makeCall with the message to initiate the call and send SMS
        makeCall(messageForSchedule);
      }, time);
    };

    // You can call scheduleCallAndSendSMS to initiate the process
    scheduleCallAndSendSMS(message);

    return NextResponse.json({ message: 'Call and sent message successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send SMS' });
  }
}
