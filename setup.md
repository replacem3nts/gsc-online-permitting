# Setup Instructions

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Create admin user:**
   - The application will automatically create an admin user on first run
   - Default credentials: `admin` / `admin123`
   - You can change these in the `.env` file

## Manual Admin User Creation

If you need to create the admin user manually, you can use Prisma Studio:

1. **Open Prisma Studio:**

   ```bash
   npx prisma studio
   ```

2. **Navigate to the Admin table**

3. **Add a new record with:**
   - `username`: admin
   - `password`: [hashed password - use bcrypt with salt rounds 12]

## Testing the Application

1. **User Flow:**

   - Visit http://localhost:3000
   - Fill out the permit application form
   - Complete the payment process
   - View the confirmation page

2. **Admin Flow:**
   - Visit http://localhost:3000/admin/login
   - Login with admin credentials
   - View the dashboard with all applications
   - Test CRUD operations and CSV export

## Troubleshooting

### Prisma Client Issues

If you encounter Prisma client import issues:

```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Database Issues

If the database is corrupted:

```bash
rm dev.db
npx prisma db push
```

### Environment Variables

Make sure your `.env` file contains:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```


