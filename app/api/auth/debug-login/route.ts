import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log("DEBUG - Login endpoint called")
  
  try {
    const body = await request.json()
    const { email, password } = body
    
    console.log("DEBUG - Received credentials:", { 
      email, 
      password: password ? `${password.length} chars` : "empty"
    })

    // Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    
    console.log("DEBUG - Environment variables:", { 
      adminEmail: adminEmail || "NOT_SET", 
      adminPassword: adminPassword ? `${adminPassword.length} chars` : "NOT_SET"
    })

    // Trim whitespace from inputs
    const trimmedEmail = email?.trim().toLowerCase() || ""
    const trimmedPassword = password?.trim() || ""
    const trimmedAdminEmail = adminEmail?.trim().toLowerCase() || ""
    const trimmedAdminPassword = adminPassword?.trim() || ""

    console.log("DEBUG - Comparison details:", {
      inputEmail: `"${trimmedEmail}"`,
      envEmail: `"${trimmedAdminEmail}"`,
      emailMatch: trimmedEmail === trimmedAdminEmail,
      inputPassword: `"${trimmedPassword}"`,
      envPassword: `"${trimmedAdminPassword}"`,
      passwordMatch: trimmedPassword === trimmedAdminPassword,
      emailLength: trimmedEmail.length,
      envEmailLength: trimmedAdminEmail.length,
      passwordLength: trimmedPassword.length,
      envPasswordLength: trimmedAdminPassword.length
    })

    // Validate credentials with trimmed values
    if (trimmedEmail === trimmedAdminEmail && trimmedPassword === trimmedAdminPassword) {
      console.log("DEBUG - Credentials match!")
      
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        debug: {
          emailMatch: true,
          passwordMatch: true,
          inputEmail: trimmedEmail,
          envEmail: trimmedAdminEmail
        }
      })
    } else {
      console.log("DEBUG - Credentials don't match")
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password',
          debug: {
            emailMatch: trimmedEmail === trimmedAdminEmail,
            passwordMatch: trimmedPassword === trimmedAdminPassword,
            inputEmail: trimmedEmail,
            envEmail: trimmedAdminEmail,
            inputPassword: trimmedPassword,
            envPassword: trimmedAdminPassword
          }
        },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('DEBUG - Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}
