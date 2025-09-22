import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log("API Route - verify endpoint called")
  
  const adminToken = request.cookies.get('admin-token')
  console.log("API Route - token exists:", !!adminToken)
  
  return NextResponse.json({ 
    isAuthenticated: !!adminToken,
    user: adminToken ? { email: process.env.ADMIN_EMAIL } : null
  })
}