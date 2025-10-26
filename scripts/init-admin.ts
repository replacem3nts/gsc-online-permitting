import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function initAdmin() {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: adminUsername }
    })
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username: adminUsername,
        password: hashedPassword
      }
    })
    
    console.log('Admin user created successfully:', {
      id: admin.id,
      username: admin.username
    })
    
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initAdmin()
