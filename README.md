# Greenwich Shellfish Permit Application

A Next.js application for managing shellfish permit applications for the Town of Greenwich.

## Features

- **Permit Application Form**: Complete form with validation for all required user information
- **Payment Integration**: Simulated payment flow with third-party integration
- **Admin Dashboard**: Full CRUD operations for managing permit applications
- **CSV Export**: Export all permit data for administrative purposes
- **Authentication**: Secure admin login system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.local .env
   ```

   Update the `.env` file with your configuration:

   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="admin123"
   ```

4. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Create the admin user:

   ```bash
   # The admin user will be created automatically when you first access the admin login
   # Default credentials: admin / admin123
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. **Apply for Permit**: Visit the homepage and fill out the permit application form
2. **Complete Payment**: After form submission, you'll be redirected to the payment page
3. **Confirmation**: After payment, you'll receive a confirmation page

### For Administrators

1. **Login**: Visit `/admin/login` and use the admin credentials
2. **Dashboard**: View all permit applications with payment status
3. **Manage Users**: Edit, delete, or create new permit applications
4. **Export Data**: Download CSV files of all permit data

## Application Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard and login
│   ├── api/               # API routes
│   ├── payment/           # Payment flow pages
│   └── terms/             # Terms of service
├── components/            # React components
├── lib/                   # Utility functions and configurations
└── generated/             # Prisma generated client
```

## API Endpoints

- `POST /api/permit-application` - Submit permit application
- `POST /api/update-payment` - Update payment status
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Create user (admin only)
- `PUT /api/admin/users/[id]` - Update user (admin only)
- `DELETE /api/admin/users/[id]` - Delete user (admin only)
- `GET /api/admin/export-csv` - Export users as CSV (admin only)

## Database Schema

### User Model

- Personal information (name, height, age, sex, eye color)
- Contact information (email, phone, address)
- Permit details (type, payment status)
- Terms acceptance and communication preferences

### Admin Model

- Username and hashed password for authentication

## Security Features

- Password hashing with bcrypt
- JWT-based authentication for admin routes
- Input validation with Zod schemas
- Email uniqueness constraints
- Protected admin routes

## Payment Integration

The application includes a simulated payment system. In production, this would integrate with:

- Stripe
- PayPal
- Square
- Or other payment processors

## Deployment

1. Set up a production database (PostgreSQL recommended)
2. Update environment variables for production
3. Build the application: `npm run build`
4. Deploy to your preferred platform (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
