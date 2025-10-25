import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    
    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        height: true,
        dateOfBirthMonth: true,
        dateOfBirthDay: true,
        dateOfBirthYear: true,
        sex: true,
        eyeColor: true,
        permitType: true,
        email: true,
        phoneNumber: true,
        addressLine1: true,
        addressLine2: true,
        town: true,
        state: true,
        zipCode: true,
        paymentCompleted: true,
        paymentDate: true,
        permitNumber: true,
        tempPermitExpirationDate: true,
        permitScreenshot: true,
        createdAt: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(user)
    
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
