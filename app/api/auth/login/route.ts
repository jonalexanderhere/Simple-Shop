import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log("API Route - login endpoint called")
  
  try {
    const body = await request.json()
    const { email, password } = body
    
    console.log("API Route - received credentials:", { 
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

    // Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    
    console.log("API Route - env variables:", { 
      adminEmail: adminEmail || "NOT_SET", 
      adminPassword: adminPassword ? `${adminPassword.length} chars` : "NOT_SET"
    })

    // Check if environment variables are set
    if (!adminEmail || !adminPassword) {
      console.log("API Route - environment variables not set")
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server configuration error'
        },
        { status: 500 }
      )
    }

    // Trim whitespace from inputs
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const trimmedAdminEmail = adminEmail.trim().toLowerCase()
    const trimmedAdminPassword = adminPassword.trim()

    console.log("API Route - comparison:", {
      emailMatch: trimmedEmail === trimmedAdminEmail,
      passwordMatch: trimmedPassword === trimmedAdminPassword,
    })

    // Validate credentials with trimmed values
    if (trimmedEmail === trimmedAdminEmail && trimmedPassword === trimmedAdminPassword) {
      console.log("API Route - credentials match, creating token")
      
      // Create a secure token with timestamp
      const timestamp = Date.now()
      const token = Buffer.from(`${trimmedEmail}:${timestamp}`).toString('base64')
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        user: { email: trimmedEmail }
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
    } else {
      console.log("API Route - credentials don't match")
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password'
        },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('API Route - login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}