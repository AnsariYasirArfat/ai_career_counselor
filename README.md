# AI Career Counselor Chat Application

A modern, full-stack AI-powered career counseling application built with Next.js, TypeScript, tRPC, TanStack Query, PostgreSQL, and Prisma. Features intelligent career guidance through conversational AI, persistent chat sessions, and a responsive design.

## 🚀 Live Demo

[View Live on Vercel](https://ai-career-counselor-chat.vercel.app/)

## 📋 Project Overview

This project is a comprehensive career counseling platform that provides:

- **AI-Powered Career Guidance**: Intelligent conversations with Google Gemini AI for personalized career advice
- **Persistent Chat Sessions**: Save and continue conversations with full message history
- **Real-time Messaging**: Instant AI responses with optimistic UI updates
- **Search Functionality**: Find and filter through previous chat sessions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: System preference detection with manual toggle
- **Markdown Support**: Rich text rendering for AI responses with proper formatting

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: ShadCN component library & Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Markdown**: React Markdown for AI response rendering

### Backend

- **API Layer**: tRPC for type-safe API communication
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: Google Gemini API
- **Validation**: Zod for input validation
- **Deployment**: Vercel with Neon PostgreSQL

### Development Tools

- **Database**: Prisma with migrations
- **Type Safety**: End-to-end TypeScript
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm

## 🛠️ Setup & Run Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Google Gemini API key

### 1. Clone the repository:

```bash
git clone https://github.com/AnsariYasirArfat/ai_career_counselor
cd ai-career-counselor
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Environment Setup:

Create a `.env.local` file in the root directory:

```env
# Base Url
NEXT_PUBLIC_BASE_URL=http://your-domain.com

# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# AI Configuration
GEMINI_API_KEY="your-gemini-api-key"
AI_MODEL="gemini-1.5-flash"
AI_TIMEOUT_MS="20000"
```

### 4. Database Setup:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Run the development server:

```bash
npm run dev
```

### 6. Open in your browser:

Navigate to `http://localhost:3000`

## 🗂️ Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── api/trpc/[trpc]/         # tRPC API routes
│   ├── chats/[id]/              # Dynamic chat room pages
│   ├── search/                  # Search page
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ChatRoom/                # Chat interface components
│   │   ├── ChatInput.tsx        # Message input with file upload
│   │   ├── MessageList.tsx      # Message display with infinite scroll
│   │   ├── MarkdownRenderer.tsx # AI response markdown rendering
│   │   └── ChatRoomSkeleton.tsx # Loading states
│   ├── Dashboard/               # Main dashboard components
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── ChatRoomList.tsx     # Chat sessions list
│   │   ├── NewChatModal.tsx     # Create new chat modal
│   │   └── Header.tsx           # App header
│   ├── Search/                  # Search functionality
│   │   ├── SearchBar.tsx        # Search input component
│   │   └── SearchChatRoomList.tsx # Search results
│   ├── common/                  # Shared components
│   │   ├── AppShell.tsx         # Main app layout
│   │   ├── ModeToggle.tsx       # Theme toggle
│   │   └── SpinnerLoader.tsx    # Loading indicators
│   ├── providers/               # Context providers
│   │   ├── theme-provider.tsx   # Theme context
│   │   └── trpc-query-provider.tsx # tRPC + TanStack Query setup
│   └── ui/                      # Reusable UI components
│       ├── button.tsx           # Button component
│       ├── dialog.tsx           # Modal dialogs
│       └── ...                  # Other UI primitives
├── server/                      # Backend API
│   ├── routers/                 # tRPC routers
│   │   └── chat.ts              # Chat-related API endpoints
│   ├── trpc.ts                  # tRPC configuration
│   └── index.ts                 # Main API router
├── lib/                         # Utility libraries
│   ├── ai/                      # AI integration
│   │   └── gemini.ts            # Google Gemini API client
│   ├── generated/prisma/        # Generated Prisma client
│   └── prisma.ts                # Prisma client instance
├── prisma/                      # Database schema and migrations
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migration files
├── hooks/                       # Custom React hooks
│   ├── useDebounce.ts           # Debounce hook for search
│   └── useInfiniteScroll.ts     # Infinite scroll hook
└── public/                      # Static assets
    └── oration_logo.png         # App logo
```

## ⚙️ Key Features & Implementation Details

### AI Career Counseling

**Google Gemini Integration:**

- Uses Google Gemini 1.5 Flash model for career guidance
- System prompt optimized for career counseling context
- Context management with recent message history (last 20 messages)
- Error handling with fallback responses
- Request timeout protection (20 seconds)

**Markdown Support:**

- AI responses rendered with React Markdown
- Support for headings, lists, code blocks, links, and emphasis
- Tailwind CSS styling for consistent design
- Copy-to-clipboard functionality for all messages

### Chat Session Management

**Persistent Storage:**

- PostgreSQL database with Prisma ORM
- Soft delete implementation for data recovery
- Cursor-based pagination for performance
- Real-time optimistic updates

**Session Features:**

- Create new chat sessions with custom titles
- Continue previous conversations
- Search through chat history
- Delete sessions (soft delete)
- Infinite scroll for message history

### State Management

**TanStack Query Integration:**

- Server state management with caching
- Optimistic updates for instant UI feedback
- Automatic refetching and invalidation
- Error handling and loading states

**tRPC Type Safety:**

- End-to-end type safety from database to frontend
- Automatic API client generation
- Input validation with Zod schemas
- Type-safe error handling

### Database Schema

```prisma
model ChatSession {
  id        String    @id @default(cuid())
  title     String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Soft delete
  message   Message[]
}

model Message {
  id        String      @id @default(cuid())
  sessionId String
  role      MessageRole
  content   String
  createdAt DateTime    @default(now())
  session   ChatSession @relation(fields: [sessionId], references: [id])
}

enum MessageRole {
  USER
  ASSISTANT
}
```

### API Endpoints

**Chat Management:**

- `getChatSessions` - Paginated list of chat sessions
- `createChatSession` - Create new chat session
- `deleteChatSession` - Soft delete chat session
- `searchChatSessions` - Search through chat sessions

**Messaging:**

- `getMessages` - Paginated message history
- `sendMessage` - Send user message and get AI response

### Responsive Design

**Mobile-First Approach:**

- Collapsible sidebar for mobile devices
- Touch-friendly interface elements
- Optimized message display for small screens
- Responsive typography and spacing

**Theme Support:**

- System preference detection
- Manual dark/light mode toggle
- Consistent theming across all components
- Smooth theme transitions

## 🧩 How Core Features Are Implemented

### Real-Time Messaging Flow

1. **User sends message** → Optimistic update shows message immediately
2. **Message saved to database** → User message persisted
3. **AI context built** → Recent 20 messages fetched for context
4. **Gemini API called** → AI generates career guidance response
5. **AI response saved** → Assistant message persisted
6. **UI updated** → Both messages displayed with proper formatting

### Search Implementation

- **Debounced search input** (300ms delay) for performance
- **Database-level search** using PostgreSQL `ILIKE` for case-insensitive matching
- **Cursor pagination** for large result sets
- **Real-time results** with instant UI updates

### Optimistic Updates

- **Instant UI feedback** for all user actions
- **Rollback on error** if server operations fail
- **Cache invalidation** to keep data consistent
- **Background refetching** for data synchronization

## 📸 Screenshots
![Desktop Image 1](/public/screenshots/image1.png)
![Desktop Image 2](/public/screenshots/image2.png)
![Desktop Image 3](/public/screenshots/image3.png)
![Desktop Image 4](/public/screenshots/image4.png)
![Desktop Image 5](/public/screenshots/image5.png)
![Desktop Image 6](/public/screenshots/image6.png)
![Desktop Image 7](/public/screenshots/image7.png)

![Mobile Image 8](/public/screenshots/image8.png)
![Mobile Image 9](/public/screenshots/image9.png)
![Mobile Image 10](/public/screenshots/image10.png)
![Mobile Image 11](/public/screenshots/image11.png)

## 🚀 Deployment

### Vercel Deployment

1. **Connect GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard: 
   - `NEXT_PUBLIC_BASE_URL`
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `AI_MODEL`
   - `AI_TIMEOUT_MS`
3. **Deploy** - Vercel automatically builds and deploys

### Database Setup

1. **Create Neon PostgreSQL database**
2. **Get connection string** and add to environment variables
3. **Run migrations** in production:
   ```bash
   npx prisma db push
   ```

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

## 🙏 Acknowledgments

- **Google Gemini** for AI capabilities
- **Vercel** for hosting and deployment
- **Neon** for PostgreSQL database
- **Next.js** team for the amazing framework
- **tRPC** for type-safe APIs
- **TanStack Query** for server state management
- **Prisma** for database toolkit
- **Radix UI** for accessible components
- **Tailwind CSS** for styling

---

**Built with ❤️ for better career guidance through AI**
