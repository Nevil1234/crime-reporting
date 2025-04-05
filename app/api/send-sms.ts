import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { to, body } = await request.json()
  
  try {

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = require('twilio')(accountSid, authToken)

    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })

    console.log('SMS sent to:', to, 'Content:', body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('SMS sending failed:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}