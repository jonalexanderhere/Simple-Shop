import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log("API Route - verify endpoint called")
  
  try {
    const authToken = request.cookies.get('auth-token')
    console.log("API Route - token exists:", !!authToken)
    
    if (!authToken) {
      return NextResponse.json({ 
        isAuthenticated: false,
        user: null
      })
    }

    // Verify token format and validity
    try {
      const decoded = Buffer.from(authToken.value, 'base64').toString('utf-8')
      const [email, timestamp, role] = decoded.split(':')
      
      // Check if token is not too old (24 hours)
      const tokenAge = Date.now() - parseInt(timestamp)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      
      if (tokenAge > maxAge) {
        console.log("API Route - token expired")
        return NextResponse.json({ 
          isAuthenticated: false,
          user: null
        })
      }
      
      console.log("API Route - token valid")
      return NextResponse.json({ 
        isAuthenticated: true,
        user: { 
          email: email,
          role: role || 'admin'
        }
      })
    } catch (error) {
      console.log("API Route - invalid token format")
      return NextResponse.json({ 
        isAuthenticated: false,
        user: null
      })
    }
  } catch (error) {
    console.error('API Route - verify error:', error)
    return NextResponse.json({ 
      isAuthenticated: false,
      user: null
    })
  }
}