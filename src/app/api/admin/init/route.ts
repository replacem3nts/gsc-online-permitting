import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { hashPassword } from '../../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: adminUsername }
    })
    
    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        admin: {
          id: existingAdmin.id,
          username: existingAdmin.username
        }
      })
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(adminPassword)
    
    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username: adminUsername,
        password: hashedPassword
      }
    })
    
    return NextResponse.json({
      message: 'Admin user created successfully',
      admin: {
        id: admin.id,
        username: admin.username
      }
    })
    
  } catch (error) {
    console.error('Error creating admin user:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
