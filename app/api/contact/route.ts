import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import * as z from 'zod'
import { db } from '@/lib/db/client'
import { profile } from '@/lib/db/schema'

// Initialize Resend (you'll need to add RESEND_API_KEY to your environment variables)
const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    const { name, email, subject, message } = validatedData

    // For now, we'll create a simple email template
    // In production, you should use a proper email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #555;">Message:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
            ${message}
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 14px;">
          <p>This message was sent through the contact form on shagunkhare.com</p>
        </div>
      </div>
    `

    // Get profile email from database
    const profileData = await db.select().from(profile).limit(1)
    const contactEmail = profileData.length > 0 && profileData[0].contactEmail 
      ? profileData[0].contactEmail 
      : 'shagunkhare.st@gmail.com' // Fallback to Shagun's email

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <hello@contact.shagunkhare.com>', // Using your verified domain
      to: [contactEmail], // Use profile email or fallback
      subject: `Contact Form: ${subject}`,
      html: emailHtml,
      replyTo: email, // Allow Shagun to reply directly to the sender
    })

    // Check if email sending failed
    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data?.id)

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
