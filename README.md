# RateStore - Professional Store Rating Platform

A comprehensive full-stack web application for store ratings with role-based access control.

## 🚀 Features

### Multi-Role Authentication System
- **System Administrator**: Complete platform management
- **Normal User**: Store discovery and rating capabilities
- **Store Owner**: Performance analytics and rating monitoring

### Core Functionalities
- **Store Management**: Add, view, and manage store listings
- **Rating System**: 1-5 star rating system with validation
- **User Management**: Role-based user creation and management
- **Advanced Search**: Filter stores by name, address, and other criteria
- **Analytics Dashboard**: Real-time statistics and insights
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Technology Stack

### Frontend
- **React.js 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Nest.js** with TypeScript
- **MySQL** database
- **TypeORM** for database operations
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Passport.js** for authentication strategies

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Role-specific dashboards
│   ├── layout/        # Layout components
│   └── ui/           # Reusable UI components
├── contexts/          # React contexts
├── services/          # API services
├── types/            # TypeScript types
└── utils/            # Utility functions
```

### Backend Structure
```
backend/src/
├── auth/             # Authentication module
├── admin/            # Admin-specific functionality
├── stores/           # Store management
├── ratings/          # Rating system
└── users/            # User management
```

## 📋 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MySQL server
- npm or yarn

### Database Setup
1. Create a MySQL database named `ratestore`
2. Update database credentials in `backend/.env`

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Setup
```bash
npm install
npm run dev
```

### Full Development Setup
```bash
npm run install:backend
npm run dev:full
```

## 🔐 User Roles & Permissions

### System Administrator
- ✅ Add new stores, users, and admin users
- ✅ View comprehensive dashboard with statistics
- ✅ Manage user listings with advanced filters
- ✅ View detailed user and store information
- ✅ Full platform oversight

### Normal User
- ✅ User registration and authentication
- ✅ Store discovery and search
- ✅ Submit and modify ratings (1-5 stars)
- ✅ View personal rating history
- ✅ Password management

### Store Owner
- ✅ Authentication and password management
- ✅ View store performance dashboard
- ✅ Monitor customer ratings and feedback
- ✅ Track rating analytics and trends

## 📊 Form Validations

### User Registration
- **Name**: 20-60 characters
- **Email**: Standard email format validation
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters, must include uppercase letter and special character

### Store Management
- **Name**: Maximum 60 characters
- **Email**: Valid email format
- **Address**: Maximum 400 characters

### Rating System
- **Rating**: Integer between 1 and 5
- **One rating per user per store**
- **Ability to modify existing ratings**

## 🔒 Security Features

- **JWT-based authentication**
- **Role-based access control**
- **Password hashing with bcryptjs**
- **Input validation and sanitization**
- **CORS configuration**
- **Helmet.js for security headers**

## 🎨 Design Features

- **Modern, professional interface**
- **Responsive design for all devices**
- **Intuitive navigation with role-based sidebar**
- **Interactive components with hover effects**
- **Consistent color scheme and typography**
- **Smooth animations and transitions**

## 🚀 Production Deployment

### Backend Production
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Production
```bash
npm run build
npm run preview
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile devices** (< 768px)
- **Tablets** (768px - 1024px)
- **Desktop** (> 1024px)

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=ratestore
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://your-frontend-url.com
```

## 📈 Performance Optimizations

- **Code splitting** with React.lazy
- **Optimized bundle size** with Vite
- **Database query optimization** with TypeORM
- **Caching strategies** for frequently accessed data
- **Lazy loading** for improved performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

