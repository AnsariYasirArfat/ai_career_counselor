# AI Career Counselor Chat Application

A modern, full-stack AI-powered career counseling application built with Next.js 15, TypeScript, tRPC, TanStack Query, PostgreSQL, Prisma, and Google Gemini AI. This application provides intelligent career guidance through conversational AI with user authentication, persistent chat sessions, real-time streaming, and advanced search capabilities.


## 🚀 Live Demo
[View Live on Vercel](https://ai-career-counselor-chat.vercel.app/)

## 📋 Project Overview

This project is a comprehensive career counseling platform featuring:

- **User Authentication**: Secure login/signup with Google OAuth and email/password
- **AI-Powered Career Guidance**: Intelligent conversations with Google Gemini AI for personalized career advice
- **Real-time Streaming**: Live AI response streaming for instant user experience
- **Auto-Title Generation**: AI-generated session titles based on conversation content
- **Persistent Chat Sessions**: Save and continue conversations with full message history
- **Advanced Search**: Find and filter chat sessions with real-time search functionality
- **Responsive Design**: Modern UI with dark/light theme support for desktop and mobile
- **Real-time Updates**: Optimistic UI updates with TanStack Query for instant user feedback
- **Markdown Rendering**: Rich text formatting for AI responses with proper styling
- **Cursor-based Pagination**: Efficient infinite scrolling for chat sessions and messages
- **Soft Delete**: Safe deletion with data recovery capabilities for chat sessions
- **Mobile-First Design**: Drawer navigation and responsive components for mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.1 with App Router
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: ShadCN component library & Radix UI primitives
- **Icons**: Lucide React
- **Markdown**: React Markdown for AI response rendering
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast notifications
- **Real-time**: tRPC subscriptions for streaming

### Backend
- **API Layer**: tRPC for type-safe API communication with subscriptions
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: Google Gemini API with streaming support
- **Authentication**: NextAuth.js v5 with Google OAuth and credentials
- **Validation**: Zod for input validation
- **Security**: bcryptjs for password hashing
- **Deployment**: Vercel with Neon PostgreSQL

### Development Tools
- **Database**: Prisma with migrations
- **Type Safety**: End-to-end TypeScript
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm

## Setup & Run Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon, Supabase, or local)
- Google Gemini API key
- Google OAuth credentials (optional)

### Clone the repository:
```bash
git clone https://github.com/AnsariYasirArfat/ai_career_counselor
cd ai_career_counselor
```

### Install dependencies:
```bash
npm install
```

### Environment Variables:
Create a `.env.local` file:
```env
DATABASE_URL="your_postgresql_connection_string"

GEMINI_API_KEY="your_gemini_api_key"
AI_MODEL="ai_model_name"

# NextAuth Configuration
AUTH_SECRET="http://localhost:3000"

# Optional Google OAuth
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"
```

## Screenshots
![Desktop Image ](/public/screenshots/AI-Career-Counselor.png)
![Desktop Image Light](/public/screenshots/AI-Career-Counselor-light.png)
![Registration](/public/screenshots/register.png)
![Login](/public/screenshots/login.png)
![Chat Room](/public/screenshots/chat_light.png)
![Edit Title](/public/screenshots/edit_title.png)
![Search Chats](/public/screenshots/search.png)


### Database Setup:
```bash
npx prisma generate
npx prisma db push
```

### Run the development server:
```bash
npm run dev
```

### Open in your browser:
Navigate to `http://localhost:3000`

## Project Structure

```
/
├─ app/                           # Next.js App Router
│  ├─ api/trpc/[trpc]/            # tRPC API routes
│  ├─ api/auth/[...nextauth]/     # NextAuth.js API routes
│  ├─ (protected)/                # Protected routes
│  │  ├─ chats/[id]/              # Individual chat pages
│  │  ├─ search/                  # Search functionality
│  │  └─ layout.tsx               # Protected layout
│  ├─ auth/                       # Authentication pages
│  │  ├─ signin/                  # Sign in page
│  │  ├─ signup/                  # Sign up page
│  │  └─ layout.tsx                # Auth layout
│  ├─ globals.css                 # Global styles
│  ├─ layout.tsx                  # Root layout
│  ├─ page.tsx                    # Home page
│  ├─ error.tsx                   # Error boundary
│  └─ not-found.tsx               # 404 page
├─ components/                    # React components
│  ├─ auth/                       # Authentication components
│  │  └─ GoogleButton.tsx         # Google OAuth button
│  ├─ ChatRoom/                   # Chat interface components
│  │  ├─ ChatInput.tsx            # Message input
│  │  ├─ MessageList.tsx          # Message display with infinite scroll
│  │  ├─ MarkdownRenderer.tsx     # AI response formatting
│  │  ├─ TypingIndicator.tsx      # Loading states
│  │  └─ ChatRoomSkeleton.tsx     # Chat loading skeleton
│  ├─ Dashboard/                  # Main dashboard components
│  │  ├─ Sidebar.tsx              # Chat sessions sidebar
│  │  ├─ DrawerSidebar.tsx        # Mobile drawer sidebar
│  │  ├─ ChatRoomList.tsx         # Sessions list with pagination
│  │  ├─ ChatRoomListSkeleton.tsx # Sessions loading skeleton
│  │  ├─ NewChat.tsx              # New chat button
│  │  ├─ NewChatModal.tsx         # Create new chat modal
│  │  ├─ Header.tsx                # App header
│  │  └─ UserMenu.tsx             # User dropdown menu
│  ├─ Search/                     # Search functionality
│  │  ├─ SearchBar.tsx            # Search input component
│  │  ├─ SearchChatRoomList.tsx   # Search results display
│  │  └─ SearchListSkeleton.tsx   # Search loading skeleton
│  ├─ common/                     # Shared components
│  │  ├─ AppShell.tsx             # Main app layout
│  │  ├─ ConfirmModal.tsx         # Confirmation modal
│  │  ├─ ModeToggle.tsx           # Theme toggle
│  │  └─ SpinnerLoader.tsx        # Loading indicators
│  ├─ providers/                  # Context providers
│  │  ├─ AuthProvider.tsx         # Authentication provider
│  │  ├─ theme-provider.tsx       # Theme provider
│  │  └─ trpc-query-provider.tsx  # tRPC query provider
│  └─ ui/                         # ShadCN UI components
│     ├─ button.tsx               # Button component
│     ├─ card.tsx                 # Card component
│     ├─ dialog.tsx               # Modal dialog
│     ├─ drawer.tsx                # Mobile drawer
│     ├─ input.tsx                 # Input component
│     ├─ skeleton.tsx              # Loading skeleton
│     ├─ sonner.tsx                # Toast notifications
│     └─ ...                       # Other UI components
├─ server/                        # tRPC backend
│  ├─ routers/                    # API route handlers
│  │  ├─ auth.ts                  # Authentication procedures
│  │  └─ chat.ts                  # Chat-related procedures
│  ├─ trpc.ts                     # tRPC configuration
│  └─ index.ts                    # Root router
├─ lib/                           # Utility libraries
│  ├─ ai/                         # AI integration
│  │  ├─ gemini.ts                # Google Gemini client
│  │  └─ prompts.ts               # AI system prompts
│  ├─ auth.ts                     # NextAuth configuration
│  ├─ error-handling.ts           # Error handling utilities
│  ├─ prisma.ts                   # Database client
│  ├─ utils.ts                    # Helper functions
│  └─ validations/                # Zod validation schemas
│     ├─ auth.ts                  # Auth validation schemas
│     ├─ chat.ts                  # Chat validation schemas
│     └─ index.ts                 # Validation exports
├─ hooks/                         # Custom React hooks
│  ├─ useDebounce.ts              # Search debouncing
│  └─ useInfiniteScroll.ts        # Infinite scroll logic
└─ prisma/                        # Database schema
   ├─ schema.prisma               # Database models
   └─ migrations/                 # Database migrations
```

## Key Features & Implementation Details

### User Authentication & Security

**Authentication Methods:**
- Google OAuth integration with NextAuth.js
- Email/password authentication with bcryptjs hashing
- Session management with secure JWT tokens
- Protected routes with middleware

**Security Features:**
- Password hashing with bcryptjs
- CSRF protection
- Secure session handling
- Input validation with Zod schemas

### AI Career Counseling & Streaming

**Google Gemini Integration:**
- Specialized system prompt for career counseling expertise
- Context management with recent message history (8000 char limit)
- Timeout handling and error recovery
- Model configuration with environment variables

**Real-time Streaming Features:**
- Live AI response streaming using tRPC subscriptions
- Token-by-token response delivery for instant feedback
- Optimistic UI updates with streaming message handling
- Automatic session title generation on first message
- Error handling and recovery for streaming failures

**Conversation Flow:**
- Persistent chat sessions with full message history
- Real-time AI responses with typing indicators
- Markdown rendering for formatted AI responses
- Message timestamps and copy-to-clipboard functionality
- Auto-generated session titles based on conversation content

### Chat Session Management

**Session Operations:**
- Create new chat sessions with custom titles
- Auto-generate titles using AI based on first message
- Update session titles manually
- Soft delete with `deletedAt` timestamp for data recovery
- Session search with real-time filtering
- Active session highlighting in sidebar

**Data Persistence:**
- PostgreSQL with Prisma ORM for reliable data storage
- Optimistic updates for instant UI feedback
- Cache invalidation and synchronization across components
- Background refetching for data freshness

### Advanced Search & Navigation

**Search Functionality:**
- Debounced search input (300ms delay)
- Real-time filtering of chat sessions
- Pagination support for large result sets
- Search history and recent sessions

**Navigation:**
- Responsive sidebar with drawer for mobile
- Breadcrumb navigation and active state indicators
- Smooth transitions and loading states

### State Management with TanStack Query

**Server State:**
- `useInfiniteQuery` for paginated chat sessions and messages
- `useMutation` for create, update, and delete operations
- `useSubscription` for real-time streaming responses
- Automatic cache invalidation and background refetching
- Optimistic updates for instant user feedback

**Cache Management:**
- Intelligent cache updates on mutations
- Cross-component state synchronization
- Background refetching for data freshness
- Streaming message cache management

## Database Design

**Schema Design:**
```sql
User {
  id: String (CUID)
  name: String?
  email: String (unique)
  emailVerified: DateTime?
  image: String?
  passwordHash: String?
  createdAt: DateTime
  updatedAt: DateTime
  accounts: Account[]
  sessions: Session[]
  ChatSession: ChatSession[]
}

ChatSession {
  id: String (CUID)
  title: String
  userId: String (Foreign Key)
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime? (Soft delete)
  user: User
  messages: Message[]
}

Message {
  id: String (CUID)
  sessionId: String (Foreign Key)
  role: MessageRole (USER | ASSISTANT)
  content: String
  createdAt: DateTime
  session: ChatSession
}
```

**Relationships:**
- One-to-many: User → ChatSessions
- One-to-many: ChatSession → Messages
- One-to-many: User → Accounts (OAuth)
- One-to-many: User → Sessions
- Soft delete implementation for data recovery

## API Endpoints

### tRPC Procedures:

**Authentication Router (`auth`):**
- `auth.register` - User registration with email/password

**Chat Router (`chat`):**
- `chat.getChatSessions` - Paginated chat sessions with cursor-based pagination
- `chat.searchChatSessions` - Search chat sessions with real-time filtering
- `chat.getMessages` - Paginated messages for a session with infinite scroll
- `chat.createChatSession` - Create new chat session with custom title
- `chat.updateSessionTitle` - Update existing session title
- `chat.sendMessage` - Send message and get AI response (non-streaming)
- `chat.sendMessageStream` - **Real-time streaming AI responses** with tRPC subscription
- `chat.deleteChatSession` - Soft delete chat session with recovery option

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📸 Features Showcase

- **User Authentication**: Secure login with Google OAuth and email/password
- **Real-time Streaming**: Live AI response streaming for instant user experience
- **Auto-Title Generation**: AI-generated session titles based on conversation content
- **Intelligent Conversations**: AI-powered career guidance with context awareness
- **Persistent Sessions**: Never lose your conversation history
- **Advanced Search**: Find specific conversations quickly
- **Responsive Design**: Works seamlessly on all devices with mobile drawer
- **Real-time Updates**: Instant feedback with optimistic UI
- **Rich Formatting**: Markdown support for AI responses
- **Data Safety**: Soft delete with recovery options
- **Theme Support**: Dark/light mode with smooth transitions

---

### Ansari Yaseer Arfat
- [Resume](https://drive.google.com/file/d/1BQsv5BPnOruKEPNQrLbV21srXyED1lZq/view)
- [Github Account](https://github.com/AnsariYasirArfat)
- [LinkedIn Profile](https://www.linkedin.com/in/yaseeransari)

---
