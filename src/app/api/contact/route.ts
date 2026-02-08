import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Homespun Contact Form <onboarding@resend.dev>', // Resend verified sender
      to: ['harsh.homespun@gmail.com'], // Your email
      replyTo: email, // Customer's email for easy reply
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #8B4513 0%, #704010 100%);
                color: white;
                padding: 30px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #ffffff;
                border: 1px solid #e0e0e0;
                border-top: none;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 20px;
              }
              .field label {
                display: block;
                font-weight: bold;
                color: #8B4513;
                margin-bottom: 5px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .field p {
                margin: 0;
                padding: 12px;
                background: #f9f9f9;
                border-left: 3px solid #8B4513;
                border-radius: 4px;
              }
              .message-content {
                background: #f9f9f9;
                padding: 20px;
                border-left: 3px solid #8B4513;
                border-radius: 4px;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <label>From</label>
                <p>${name}</p>
              </div>
              <div class="field">
                <label>Email</label>
                <p><a href="mailto:${email}">${email}</a></p>
              </div>
              <div class="field">
                <label>Subject</label>
                <p>${subject}</p>
              </div>
              <div class="field">
                <label>Message</label>
                <div class="message-content">${message}</div>
              </div>
              <div class="footer">
                <p>This message was sent via the Homespun contact form</p>
                <p>You can reply directly to this email to respond to ${name}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
