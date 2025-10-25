import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    const body = await request.json()
    
    // Check if email is being changed and if it already exists
    if (body.email) {
      const existingUser = await prisma.user.findFirst({
        where: { 
          email: body.email,
          id: { not: id }
        }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { message: 'A user with this email address already exists' },
          { status: 400 }
        )
      }
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.firstName && { firstName: body.firstName }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.height && { height: body.height }),
        ...(body.age && { age: parseInt(body.age) }),
        ...(body.sex && { sex: body.sex }),
        ...(body.eyeColor && { eyeColor: body.eyeColor }),
        ...(body.mailingAddress && { mailingAddress: body.mailingAddress }),
        ...(body.email && { email: body.email }),
        ...(body.phoneNumber && { phoneNumber: body.phoneNumber }),
        ...(body.permitType && { permitType: body.permitType }),
        ...(body.termsAccepted !== undefined && { termsAccepted: body.termsAccepted }),
        ...(body.communicationsOptIn !== undefined && { communicationsOptIn: body.communicationsOptIn }),
        ...(body.paymentCompleted !== undefined && { paymentCompleted: body.paymentCompleted }),
      }
    })
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Error updating user:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = await params
    
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'User deleted successfully' })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
