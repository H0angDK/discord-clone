# Full Stack Application

A modern, secure, and scalable full-stack application built with Next.js 15 and Spring Boot 3.4, featuring real-time
capabilities and robust security features.

## 📸 Media

### Screenshots

![Application Dashboard](docs/images/dashboard.png)
*Main application dashboard showing the user interface*

![Authentication Flow](docs/images/auth-flow.png)
*Authentication and user management interface*

### Demo Video

[![Application Demo](docs/images/video-thumbnail.png)](docs/videos/demo.mp4)
*Click the thumbnail to watch the full demo video*

## 🚀 Tech Stack

### Frontend (Client)

- **Framework**: Next.js 15.2.4 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Development**:
    - Turbopack for fast development
    - ESLint for code quality
    - TypeScript for type safety
- **Validation**: Zod for runtime type checking

### Backend (Server)

- **Framework**: Spring Boot 3.4.2
- **Language**: Java 23
- **Security**: Spring Security with JWT authentication
- **Database**:
    - PostgreSQL
    - JPA for data persistence
    - Flyway for database migrations
- **Real-time**: WebSocket support
- **Monitoring**: Spring Boot Actuator
- **Development**: Spring Boot DevTools

### Infrastructure

- **Containerization**: Docker and Docker Compose
- **Build Tools**:
    - Gradle (Backend)
    - npm (Frontend)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- Docker and Docker Compose
- Node.js (for local frontend development)
- JDK 23 (for local backend development)
- PostgreSQL (for local development)

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone [repository-url]
cd [repository-name]
```

2. Start the application using Docker Compose:

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## 🔧 Development Setup

### Frontend Development

```bash
cd client
npm install
npm run dev
```

### Backend Development

```bash
cd server
./gradlew bootRun
```

## 📁 Project Structure

```
.
├── client/                 # Next.js frontend application
│   ├── app/               # Next.js app directory (App Router)
│   ├── components/        # Reusable React components
│   ├── features/         # Feature-specific components
│   ├── actions/          # Server actions
│   ├── types/            # TypeScript type definitions
│   └── public/           # Static assets
│
├── server/                # Spring Boot backend application
│   ├── src/              # Source code
│   │   ├── main/        # Main application code
│   │   └── test/        # Test code
│   └── build.gradle.kts # Gradle build configuration
│
└── docker-compose.yml    # Docker Compose configuration
```

## 🔒 Security Features

- JWT-based authentication
- Spring Security integration
- Secure WebSocket communication
- Input validation using Spring Validation
- Type-safe API with Zod validation

## 📊 Database

- PostgreSQL database
- JPA for object-relational mapping
- Flyway for database migrations
- Lombok for reducing boilerplate code






