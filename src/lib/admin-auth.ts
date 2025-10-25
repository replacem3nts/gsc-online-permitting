import { NextRequest } from 'next/server'
import { verifyAdminToken } from './auth'

export function getAdminFromRequest(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  return verifyAdminToken(token)
}

export function requireAdminAuth(handler: (request: NextRequest, admin: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    const admin = getAdminFromRequest(request)
    
    if (!admin) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return handler(request, admin)
  }
}


