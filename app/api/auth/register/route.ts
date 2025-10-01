import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log("API Route - register endpoint called")
  
  try {
    const body = await request.json()
    const { email, password, name, phone } = body
    
    console.log("API Route - received registration data:", { 
      email, 
      name,
      phone,
      password: password ? `${password.length} chars` : "empty"
    })

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email, password, and name are required'
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please enter a valid email address'
        },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters long'
        },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'An account with this email already exists'
        },
        { status: 409 }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
      options: {
        data: {
          name: name,
          phone: phone || null
        }
      }
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json(
        { 
          success: false, 
          message: authError.message || 'Failed to create account'
        },
        { status: 400 }
      )
    }

    // Create user profile in our users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        name: name,
        phone: phone || null,
        is_verified: false,
        is_active: true
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail the registration if profile creation fails
      // The user can still verify their email
    }

    console.log("API Route - registration successful")
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        email: email.toLowerCase(),
        name: name,
        needsVerification: true
      }
    })

  } catch (error) {
    console.error('API Route - registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
