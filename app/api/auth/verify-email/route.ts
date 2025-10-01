import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log("API Route - verify-email endpoint called")
  
  try {
    const body = await request.json()
    const { token, type } = body
    
    console.log("API Route - received verification data:", { 
      token: token ? `${token.length} chars` : "empty",
      type
    })

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Verification token is required'
        },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Verify the email with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type || 'email'
    })

    if (error) {
      console.error('Email verification error:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: error.message || 'Invalid or expired verification token'
        },
        { status: 400 }
      )
    }

    if (data.user) {
      // Update user profile to verified
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', data.user.email)

      if (updateError) {
        console.error('Profile update error:', updateError)
        // Don't fail verification if profile update fails
      }

      console.log("API Route - email verification successful")
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email verified successfully! You can now log in.',
        user: {
          email: data.user.email,
          verified: true
        }
      })
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Verification failed'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('API Route - verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
