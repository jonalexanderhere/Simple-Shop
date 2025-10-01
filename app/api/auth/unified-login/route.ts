import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log("API Route - unified-login endpoint called")
  
  try {
    const body = await request.json()
    const { email, password, userType } = body
    
    console.log("API Route - received credentials:", { 
      email, 
      password: password ? `${password.length} chars` : "empty",
      userType
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

    // Admin credentials (hardcoded)
    const adminEmail = "admin@jonsstore.com"
    const adminPassword = "jonsstore123"
    
    // Member credentials (hardcoded for demo)
    const memberEmail = "member@jonsstore.com"
    const memberPassword = "member123"

    let isAdmin = false
    let isMember = false
    let userRole = "user"

    // Check admin credentials
    if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      isAdmin = true
      userRole = "admin"
      console.log("API Route - admin credentials verified")
    }
    // Check member credentials
    else if (email.toLowerCase() === memberEmail.toLowerCase() && password === memberPassword) {
      isMember = true
      userRole = "member"
      console.log("API Route - member credentials verified")
    }
    // Check if it's a general user trying to login
    else if (userType === "member" || !userType) {
      // For now, allow any email/password combination for members
      // In production, you would check against a database
      isMember = true
      userRole = "member"
      console.log("API Route - member login (any credentials accepted for demo)")
    }
    else {
      console.log("API Route - invalid credentials")
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password'
        },
        { status: 401 }
      )
    }

    // Create session token
    const timestamp = Date.now()
    const token = Buffer.from(`${email}:${timestamp}:${userRole}`).toString('base64')
    
    console.log("API Route - login successful, creating token for role:", userRole)
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: { 
        email: email,
        role: userRole,
        isAdmin: isAdmin,
        isMember: isMember
      }
    })
    
    // Set HTTP-only cookie with secure settings
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    })
    
    console.log("API Route - sending success response with cookie")
    return response

  } catch (error) {
    console.error('API Route - unified login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
