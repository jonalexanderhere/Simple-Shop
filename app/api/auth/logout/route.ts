import { NextResponse } from 'next/server'

export async function POST() {
  console.log("API Route - logout called")
  
  const response = NextResponse.json({ 
    success: true, 
    message: 'Logged out successfully' 
  })
  
  // Remove the admin token cookie
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/'
  })
  
  console.log("API Route - logout cookie cleared")
  return response
}