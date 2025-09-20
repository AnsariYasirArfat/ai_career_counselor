# AI Career Counselor Chat Application

A modern, full-stack AI-powered career counseling application built with Next.js 15, TypeScript, tRPC, TanStack Query, PostgreSQL, Prisma, and Google Gemini AI. This application provides intelligent career guidance through conversational AI, with persistent chat sessions and advanced search capabilities.

## 🚀 Live Demo
[View Live on Vercel](https://ai-career-counselor-chat.vercel.app/)

## 📋 Project Overview

This project is a comprehensive career counseling platform featuring:

- **AI-Powered Career Guidance**: Intelligent conversations with Google Gemini AI for personalized career advice
- **Persistent Chat Sessions**: Save and continue conversations with full message history
- **Advanced Search**: Find and filter chat sessions with real-time search functionality
- **Responsive Design**: Modern UI with dark/light theme support for desktop and mobile
- **Real-time Updates**: Optimistic UI updates with TanStack Query for instant user feedback
- **Markdown Rendering**: Rich text formatting for AI responses with proper styling
- **Cursor-based Pagination**: Efficient infinite scrolling for chat sessions and messages
- **Soft Delete**: Safe deletion with data recovery capabilities for chat sessions

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

## Setup & Run Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon, Supabase, or local)
- Google Gemini API key

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
AI_MODEL="gemini-1.5-flash" # Optional
AI_TIMEOUT_MS="20000" # Optional
```

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

## ��️ Project Structure

```
/
├─ app/                           # Next.js App Router
│  ├─ api/trpc/[trpc]/            # tRPC API routes
│  ├─ chats/[id]/                 # Individual chat pages
│  ├─ search/                     # Search functionality
│  ├─ globals.css                 # Global styles
│  ├─ layout.tsx                  # Root layout
│  └─ page.tsx                    # Home page
├─ components/                    # React components
│  ├─ ChatRoom/                   # Chat interface components
│  │  ├─ ChatInput.tsx            # Message input with file upload
│  │  ├─ MessageList.tsx          # Message display with infinite scroll
│  │  ├─ MarkdownRenderer.tsx     # AI response formatting
│  │  └─ TypingIndicator.tsx      # Loading states
│  ├─ Dashboard/                  # Main dashboard components
│  │  ├─ Sidebar.tsx              # Chat sessions sidebar
│  │  ├─ ChatRoomList.tsx         # Sessions list with pagination
│  │  ├─ NewChatModal.tsx         # Create new chat session
│  │  └─ Header.tsx               # App header with navigation
│  ├─ Search/                     # Search functionality
│  │  ├─ SearchBar.tsx            # Search input component
│  │  └─ SearchChatRoomList.tsx   # Search results display
│  ├─ common/                     # Shared components
│  │  ├─ AppShell.tsx             # Main app layout
│  │  └─ SpinnerLoader.tsx        # Loading indicators
│  └─ ui/                         # ShadCN UI components
├─ server/                        # tRPC backend
│  ├─ routers/                    # API route handlers
│  │  └─ chat.ts                  # Chat-related procedures
│  ├─ trpc.ts                     # tRPC configuration
│  └─ index.ts                    # Root router
├─ lib/                           # Utility libraries
│  ├─ ai/                         # AI integration
│  │  └─ gemini.ts                # Google Gemini client
│  ├─ prisma.ts                   # Database client
│  └─ utils.ts                    # Helper functions
├─ hooks/                         # Custom React hooks
│  ├─ useDebounce.ts              # Search debouncing
│  └─ useInfiniteScroll.ts        # Infinite scroll logic
└─ prisma/                        # Database schema
   ├─ schema.prisma               # Database models
   └─ migrations/                 # Database migrations
```

## Key Features & Implementation Details

### AI Career Counseling

**Google Gemini Integration:**
- Specialized system prompt for career counseling expertise
- Context management with recent message history (8000 char limit)
- Timeout handling and error recovery
- Model configuration with environment variables

**Conversation Flow:**
- Persistent chat sessions with full message history
- Real-time AI responses with typing indicators
- Markdown rendering for formatted AI responses
- Message timestamps and copy-to-clipboard functionality

### Chat Session Management

**Session Operations:**
- Create new chat sessions with custom titles
- Soft delete with `deletedAt` timestamp for data recovery
- Session search with real-time filtering
- Active session highlighting in sidebar

**Data Persistence:**
- PostgreSQL with Prisma ORM for reliable data storage
- Optimistic updates for instant UI feedback
- Cache invalidation and synchronization across components

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
- Automatic cache invalidation and background refetching
- Optimistic updates for instant user feedback

**Cache Management:**
- Intelligent cache updates on mutations
- Cross-component state synchronization
- Background refetching for data freshness

## 🧩 How Core Features Are Implemented

### Real-Time Chat Experience

**Message Flow:**
1. User sends message → Optimistic UI update
2. Message saved to database → Real message replaces optimistic
3. AI generates response → Typing indicator shown
4. AI response saved → UI updated with formatted response

**Performance Optimizations:**
- Cursor-based pagination for efficient data loading
- Context trimming for AI API calls
- Debounced search to reduce API calls
- Infinite scroll with virtual scrolling

## Screenshots
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
### Database Design

**Schema Design:**
```sql
ChatSession {
  id: String (CUID)
  title: String
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime? (Soft delete)
  messages: Message[]
}

Message {
  id: String (CUID)
  sessionId: String (Foreign Key)
  role: MessageRole (USER | ASSISTANT)
  content: String
  createdAt: DateTime
}
```

**Relationships:**
- One-to-many: ChatSession → Messages
- Soft delete implementation for data recovery
- Proper indexing for performance

### AI Integration Architecture

**Google Gemini Setup:**
- Environment-based API key management
- Model selection with fallbacks
- Timeout and error handling
- Context window management

## Environment Variables

```env
# Required
DATABASE_URL="postgresql://username:password@host:port/database"
GEMINI_API_KEY="your_gemini_api_key"

# Optional
AI_MODEL="gemini-1.5-flash"
AI_TIMEOUT_MS="20000"
```

## API Endpoints

### tRPC Procedures:
- `chat.getChatSessions` - Paginated chat sessions
- `chat.searchChatSessions` - Search chat sessions
- `chat.getMessages` - Paginated messages for a session
- `chat.createChatSession` - Create new chat session
- `chat.sendMessage` - Send message and get AI response
- `chat.deleteChatSession` - Soft delete chat session

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📸 Features Showcase

- **Intelligent Conversations**: AI-powered career guidance with context awareness
- **Persistent Sessions**: Never lose your conversation history
- **Advanced Search**: Find specific conversations quickly
- **Responsive Design**: Works seamlessly on all devices
- **Real-time Updates**: Instant feedback with optimistic UI
- **Rich Formatting**: Markdown support for AI responses
- **Data Safety**: Soft delete with recovery options
---

### Ansari Yaseer Arfat
- [Resume](https://drive.google.com/file/d/1BQsv5BPnOruKEPNQrLbV21srXyED1lZq/view)
- [Github Account](https://github.com/AnsariYasirArfat)
- [LinkedIn Profile](https://www.linkedin.com/in/yaseeransari)

---