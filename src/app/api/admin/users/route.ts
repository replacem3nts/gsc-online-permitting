import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ users })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request)
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this email address already exists' },
        { status: 400 }
      )
    }
    
    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        height: body.height,
        dateOfBirthMonth: parseInt(body.dateOfBirthMonth),
        dateOfBirthDay: parseInt(body.dateOfBirthDay),
        dateOfBirthYear: parseInt(body.dateOfBirthYear),
        sex: body.sex,
        eyeColor: body.eyeColor,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        town: body.town,
        state: body.state,
        zipCode: body.zipCode,
        email: body.email,
        phoneNumber: body.phoneNumber,
        permitType: body.permitType,
        termsAccepted: body.termsAccepted || false,
        communicationsOptIn: body.communicationsOptIn || false,
        paymentCompleted: body.paymentCompleted || false,
      }
    })
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Error creating user:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
