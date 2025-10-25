import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2))
}

if (!fs.existsSync(ADMINS_FILE)) {
  fs.writeFileSync(ADMINS_FILE, JSON.stringify([], null, 2))
}

export interface User {
  id: string
  firstName: string
  lastName: string
  height: string
  age: number
  sex: string
  eyeColor: string
  mailingAddress: string
  email: string
  phoneNumber: string
  permitType: string
  termsAccepted: boolean
  communicationsOptIn: boolean
  paymentCompleted: boolean
  paymentId?: string
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: string
  username: string
  password: string
  createdAt: string
  updatedAt: string
}

// Helper functions
function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading users:', error)
    return []
  }
}

function writeUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error writing users:', error)
    throw error
  }
}

function readAdmins(): Admin[] {
  try {
    const data = fs.readFileSync(ADMINS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading admins:', error)
    return []
  }
}

function writeAdmins(admins: Admin[]): void {
  try {
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2))
  } catch (error) {
    console.error('Error writing admins:', error)
    throw error
  }
}

// Database operations
export const db = {
  // User operations
  users: {
    async findMany(): Promise<User[]> {
      return readUsers()
    },

    async findUnique(where: { email?: string; id?: string }): Promise<User | null> {
      const users = readUsers()
      if (where.email) {
        return users.find(user => user.email === where.email) || null
      }
      if (where.id) {
        return users.find(user => user.id === where.id) || null
      }
      return null
    },

    async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
      const users = readUsers()
      const now = new Date().toISOString()
      const newUser: User = {
        ...data,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now
      }
      users.push(newUser)
      writeUsers(users)
      return newUser
    },

    async update(where: { id: string }, data: Partial<User>): Promise<User | null> {
      const users = readUsers()
      const userIndex = users.findIndex(user => user.id === where.id)
      if (userIndex === -1) return null

      users[userIndex] = {
        ...users[userIndex],
        ...data,
        updatedAt: new Date().toISOString()
      }
      writeUsers(users)
      return users[userIndex]
    },

    async delete(where: { id: string }): Promise<User | null> {
      const users = readUsers()
      const userIndex = users.findIndex(user => user.id === where.id)
      if (userIndex === -1) return null

      const deletedUser = users.splice(userIndex, 1)[0]
      writeUsers(users)
      return deletedUser
    }
  },

  // Admin operations
  admin: {
    async findUnique(where: { username?: string; id?: string }): Promise<Admin | null> {
      const admins = readAdmins()
      if (where.username) {
        return admins.find(admin => admin.username === where.username) || null
      }
      if (where.id) {
        return admins.find(admin => admin.id === where.id) || null
      }
      return null
    },

    async create(data: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>): Promise<Admin> {
      const admins = readAdmins()
      const now = new Date().toISOString()
      const newAdmin: Admin = {
        ...data,
        id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now
      }
      admins.push(newAdmin)
      writeAdmins(admins)
      return newAdmin
    }
  }
}


