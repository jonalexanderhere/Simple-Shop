import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log("API Route - admin-login endpoint called")
  
  try {
    const body = await request.json()
    const { email, password } = body
    
    console.log("API Route - received admin credentials:", { 
      email, 
      password: password ? `${password.length} chars` : "empty"
    })

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and password are required'
        },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if this is the admin email
    const adminEmail = "admin@jonsstore.com"
    const adminPassword = "jonsstore123"

    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      console.log("API Route - invalid admin credentials")
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid admin credentials'
        },
        { status: 401 }
      )
    }

    // Create a simple admin session token
    const timestamp = Date.now()
    const token = Buffer.from(`${email}:${timestamp}:admin`).toString('base64')
    
    console.log("API Route - admin login successful, creating token")
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Admin login successful',
      user: { 
        email: email,
        role: 'admin'
      }
    })
    
    // Set HTTP-only cookie with secure settings
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    })
    
    console.log("API Route - sending success response with cookie")
    return response

  } catch (error) {
    console.error('API Route - admin login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
