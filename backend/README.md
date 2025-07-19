# Event Booking Platform Backend

A comprehensive NestJS backend for an event booking platform with JWT authentication, role-based access control, and complete CRUD operations.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 Role-based Access Control (Admin/Customer)
- 🎟️ Event Management
- 📅 Booking System with Capacity Management
- 📚 Swagger API Documentation
- 🧪 Comprehensive Testing Setup
- 🐳 Docker Support
- 🔍 Input Validation
- 🗄️ PostgreSQL Database with TypeORM

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Installation

1. **Clone the repository**

<!-- to be changed when i push -->

```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**

```bash
$ pnpm install
```

3. **Environment Setup**

```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Database Setup**

```bash
# Create PostgreSQL database
createdb event_booking

# Run the application (it will auto-sync the schema in development)
$ pnpm run dev
```

## Available Scripts

```bash
# Development
npm run dev              # Start with hot reload
npm run start:debug      # Start in debug mode

# Production
npm run build           # Build the application
npm run start:prod      # Start production server

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

## API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Events (Public)

- `GET /events` - List all upcoming events
- `GET /events/:id` - Get event details

### Events (Admin Only)

- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `GET /events/:id/bookings` - Get all bookings for event

### Bookings (Customer)

- `POST /bookings` - Book tickets
- `GET /bookings` - View my bookings
- `PUT /bookings/:id` - Cancel booking

### Users (Admin Only)

- `GET /users` - Get all users

## Database Schema

### Users

- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `firstName` (String)
- `lastName` (String)
- `password` (String, Hashed)
- `role` (Enum: admin/customer)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Events

- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `location` (String)
- `date` (DateTime)
- `capacity` (Integer)
- `price` (Decimal)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Bookings

- `id` (UUID, Primary Key)
- `quantity` (Integer)
- `totalAmount` (Decimal)
- `status` (Enum: confirmed/cancelled)
- `userId` (Foreign Key)
- `eventId` (Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Authentication & Authorization

### User Roles

- **Customer**: Can view events, create bookings, manage own bookings
- **Admin**: Can manage events, view all bookings, manage users

### JWT Token Structure

```json
{
  "email": "user@example.com",
  "sub": "user-uuid",
  "role": "customer",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Business Logic

### Booking Rules

- Users cannot book tickets for past events
- Cannot exceed event capacity
- Users can only cancel their own bookings
- Cannot cancel bookings for past events
- Booking status automatically set to 'confirmed'

### Event Management

- Only admins can create, update, delete events
- Events show available spots (capacity - confirmed bookings)
- Events ordered by date (ascending)

## Testing

The application includes comprehensive test setup:

```bash
# Run all tests
npm run test

# Run tests with coverage (target: 65%+)
npm run test:cov

# Run specific test file
npm run test -- users.service.spec.ts
```

## Error Handling

The API uses standard HTTP status codes and returns consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Only 5 spots available",
  "error": "Bad Request"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token expiration (7 days)
- Input validation and sanitization
- Role-based route protection
- CORS enabled for frontend integration

## Docker Support

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DB_HOST=postgres
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: event_booking
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
```

## License

UNLICENSED
