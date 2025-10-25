import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/admin-auth'
import { createObjectCsvWriter } from 'csv-writer'

// Define User type locally since Prisma types aren't available
type User = {
  id: string
  firstName: string
  lastName: string
  height: string
  dateOfBirthMonth: number
  dateOfBirthDay: number
  dateOfBirthYear: number
  sex: string
  eyeColor: string
  addressLine1: string
  addressLine2: string | null
  town: string
  state: string
  zipCode: string
  email: string
  phoneNumber: string
  permitType: string
  termsAccepted: boolean
  communicationsOptIn: boolean
  paymentCompleted: boolean
  paymentId: string | null
  createdAt: Date
  updatedAt: Date
}

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
    
    // Define CSV row type
    type CsvRow = {
      'First Name': string
      'Last Name': string
      'Email': string
      'Phone Number': string
      'Height': string
      'Date of Birth': string
      'Sex': string
      'Eye Color': string
      'Address Line 1': string
      'Address Line 2': string
      'Town': string
      'State': string
      'ZIP Code': string
      'Permit Type': string
      'Terms Accepted': string
      'Communications Opt-in': string
      'Payment Completed': string
      'Payment ID': string
      'Created At': string
      'Updated At': string
    }

    // Convert users to CSV format
    const csvData: CsvRow[] = users.map((user: User): CsvRow => ({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'Phone Number': user.phoneNumber,
      'Height': user.height,
      'Date of Birth': `${user.dateOfBirthMonth}/${user.dateOfBirthDay}/${user.dateOfBirthYear}`,
      'Sex': user.sex,
      'Eye Color': user.eyeColor,
      'Address Line 1': user.addressLine1,
      'Address Line 2': user.addressLine2 || '',
      'Town': user.town,
      'State': user.state,
      'ZIP Code': user.zipCode,
      'Permit Type': user.permitType,
      'Terms Accepted': user.termsAccepted ? 'Yes' : 'No',
      'Communications Opt-in': user.communicationsOptIn ? 'Yes' : 'No',
      'Payment Completed': user.paymentCompleted ? 'Yes' : 'No',
      'Payment ID': user.paymentId || '',
      'Created At': user.createdAt.toISOString(),
      'Updated At': user.updatedAt.toISOString()
    }))
    
    // Create CSV content
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone Number', 'Height', 'Date of Birth',
      'Sex', 'Eye Color', 'Address Line 1', 'Address Line 2', 'Town', 'State', 'ZIP Code',
      'Permit Type', 'Terms Accepted', 'Communications Opt-in', 'Payment Completed', 
      'Payment ID', 'Created At', 'Updated At'
    ]
    
    const csvContent = [
      headers.join(','),
      ...csvData.map((row: CsvRow) => 
        headers.map((header: string) => {
          const value = row[header as keyof CsvRow] || ''
          // Escape commas and quotes in CSV
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      )
    ].join('\n')
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="shellfish-permits-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
    
  } catch (error) {
    console.error('Error exporting CSV:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
