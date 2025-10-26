import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, paymentId, permitScreenshot } = body
    
    if (!userId || !paymentId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if user already has payment completed
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        paymentCompleted: true, 
        permitNumber: true,
        paymentDate: true,
        tempPermitExpirationDate: true,
        permitScreenshot: true
      }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }
    
    // If payment already completed, update the screenshot if provided, then return
    if (existingUser.paymentCompleted) {
      if (permitScreenshot) {
        // Update the screenshot field even if payment is already completed
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { permitScreenshot: permitScreenshot }
        })
        
        return NextResponse.json({
          message: 'Screenshot updated',
          user: {
            id: updatedUser.id,
            paymentCompleted: updatedUser.paymentCompleted,
            paymentDate: updatedUser.paymentDate,
            permitNumber: updatedUser.permitNumber,
            tempPermitExpirationDate: updatedUser.tempPermitExpirationDate,
            permitScreenshot: updatedUser.permitScreenshot
          }
        })
      }
      
      return NextResponse.json({
        message: 'Payment already completed',
        user: {
          id: userId,
          paymentCompleted: existingUser.paymentCompleted,
          paymentDate: existingUser.paymentDate,
          permitNumber: existingUser.permitNumber,
          tempPermitExpirationDate: existingUser.tempPermitExpirationDate,
          permitScreenshot: existingUser.permitScreenshot
        }
      })
    }
    
    // Generate a unique permit number with retry logic
    let permitNumber = ''
    let attempts = 0
    const maxAttempts = 10
    
    while (attempts < maxAttempts) {
      // Get all completed permits with permit numbers
      const existingPermits = await prisma.user.findMany({
        where: {
          paymentCompleted: true,
          permitNumber: {
            not: null
          }
        },
        select: {
          permitNumber: true
        }
      })
      
      // Convert all permit numbers to integers and find the max
      const permitNumbers = existingPermits
        .map(p => parseInt(p.permitNumber || '0'))
        .filter(n => !isNaN(n))
      
      // Generate next sequential permit number
      if (permitNumbers.length > 0) {
        const maxNumber = Math.max(...permitNumbers)
        permitNumber = String(maxNumber + 1 + attempts).padStart(3, '0')
      } else {
        permitNumber = String(1 + attempts).padStart(3, '0')
      }
      
      // Check if this permit number already exists
      const existingUser = await prisma.user.findUnique({
        where: { permitNumber },
        select: { id: true }
      })
      
      if (!existingUser) {
        // Permit number is unique, we can use it
        break
      }
      
      attempts++
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique permit number after multiple attempts')
    }
    
    // Calculate temporary permit expiration date (14 days from payment date)
    const tempPermitExpirationDate = new Date()
    tempPermitExpirationDate.setDate(tempPermitExpirationDate.getDate() + 14)
    
    // Update the user's payment status
    const updateData: any = {
      paymentCompleted: true,
      paymentId: paymentId,
      paymentDate: new Date(),
      permitNumber: permitNumber,
      tempPermitExpirationDate: tempPermitExpirationDate,
    }
    
    // Only add permitScreenshot if it's provided
    if (permitScreenshot) {
      updateData.permitScreenshot = permitScreenshot
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
    
    return NextResponse.json({
      message: 'Payment status updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        paymentCompleted: updatedUser.paymentCompleted,
        paymentId: updatedUser.paymentId,
        paymentDate: updatedUser.paymentDate,
        permitNumber: updatedUser.permitNumber,
        tempPermitExpirationDate: updatedUser.tempPermitExpirationDate,
        permitScreenshot: updatedUser.permitScreenshot
      }
    })
    
  } catch (error) {
    console.error('Error updating payment status:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
