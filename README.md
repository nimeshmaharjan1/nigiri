# Nigiri - Sushi Menu Management System

A modern, type-safe web application for managing a sushi restaurant's menu. Built with Next.js 15, featuring advanced filtering, pagination, and CRUD operations with comprehensive form validation.

## Technical Stack

### Core Framework

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety throughout the application

### State Management & Data Fetching

- **Zustand** - Lightweight state management for filter and pagination state
- **TanStack Query (React Query)** - Server state management, caching, and data synchronization
- **Axios** - HTTP client for API communication

### Form Management & Validation

- **React Hook Form** - Performant form state management
- **Zod** - Runtime type validation and schema definition
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality, accessible component library
- **Framer Motion** - Declarative animations
- **Radix UI** - Unstyled, accessible UI primitives
- **Sonner** - Toast notifications

## Project Architecture

### State Management Pattern

The application implements a clean separation between client and server state:

**Client State (Zustand)**

- Filter criteria (search query, type, price range)
- Pagination state (current page, items per page)
- UI state (dialog visibility)

**Server State (TanStack Query)**

- Sushi menu data
- Automatic cache invalidation on mutations
- Optimistic updates

### Component Architecture

```
components/
├── sushi/
│   ├── add/              # Create sushi dialog with form
│   ├── delete/           # Archive confirmation dialog
│   ├── filter-section/   # Filter controls (search, type, price)
│   ├── list-card/        # Individual sushi card component
│   ├── pagination-section/ # Reusable pagination UI
│   └── sushi-grid/       # Grid layout with filtering logic
└── ui/                   # Shadcn/ui component library
```

### Type Safety

All data structures are validated at both compile-time and runtime:

```typescript
// Compile-time: TypeScript interfaces
// Runtime: Zod schemas with validation

export const createSushiSchema = z
  .object({
    name: z.string().min(1).max(50),
    type: z.enum(['Nigiri', 'Roll']),
    price: z.string().refine(/* validation */),
    // Conditional fields based on type
  })
  .superRefine(/* conditional validation */);
```

## Key Features

### 1. Advanced Filtering System

- **Text Search**: Filter by name or fish type
- **Type Filter**: Filter by Nigiri or Roll
- **Price Range**: Adjustable price slider
- Automatic page reset on filter changes
- Real-time filtering with useMemo optimization

### 2. Pagination

- Configurable items per page (default: 8)
- Smart page number display with ellipsis
- Showing X-Y of Z items counter
- Disabled state for boundary pages

### 3. CRUD Operations

**Create**

- Conditional form fields (fishType for Nigiri, pieces for Roll)
- Comprehensive Zod validation
- File upload UI with drag-and-drop
- Toast notifications for success/error states

**Read**

- Cached data fetching with React Query
- Loading states
- Error handling

**Delete**

- Confirmation dialog before deletion
- Optimistic UI updates
- Cache invalidation

### 4. Form Validation

Implements conditional validation using Zod's `superRefine`:

- **Nigiri**: Requires fish type
- **Roll**: Requires number of pieces
- **Price**: Must be a valid positive number
- **Name**: Required, max 50 characters

## Project Structure

```
nigiri/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page (35 lines - refactored)
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── sushi/             # Sushi-specific components
│   └── ui/                # Reusable UI components
├── hooks/
│   └── sushi/             # React Query hooks
├── services/
│   └── sushi/             # API service layer
├── store/
│   └── filter.store.ts    # Zustand store
├── types/
│   └── sushi.types.ts     # Zod schemas and TypeScript types
└── lib/
    ├── axios.ts           # Axios instance configuration
    └── utils.ts           # Utility functions
```

## Design Decisions

### 1. Separation of Concerns

The main page component (`app/page.tsx`) was refactored from 234 lines to 35 lines by extracting logic into focused, reusable components. This improves:

- Maintainability
- Testability
- Reusability
- Code readability

### 2. Centralized State Management

Zustand was chosen for client state because:

- Minimal boilerplate
- No providers needed
- TypeScript-first API
- Automatic page reset on filter changes via actions

### 3. Runtime Validation

Zod schemas provide runtime type safety, catching invalid API responses before they reach the UI. This is critical for:

- API contract validation
- Development debugging
- Production error prevention

### 4. Optimistic UI Updates

TanStack Query's cache invalidation ensures UI consistency after mutations without manual state synchronization.

## Installation & Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone repository
git clone <repository-url>

# Navigate to project directory
cd nigiri

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## API Integration

The application expects a REST API with the following endpoints:

```
GET    /sushi          # Fetch all sushi items
POST   /sushi          # Create new sushi item
DELETE /sushi/:id      # Delete sushi item
```

Configure the API base URL in `lib/axios.ts`

## Code Quality

### Type Safety

- 100% TypeScript coverage
- Strict mode enabled
- Runtime validation with Zod

### Component Design

- Compound component patterns
- Controlled components for forms
- Proper prop typing with TypeScript

### Performance Optimizations

- `useMemo` for expensive filtering operations
- React Query caching strategy
- Pagination to limit DOM nodes

## Future Enhancements

- Image upload implementation with cloud storage
- Edit functionality for existing items
- Sorting by various fields
- Export to CSV/PDF
- Advanced analytics dashboard
- Multi-language support
- Role-based access control

## Development Notes

This application demonstrates:

- Modern React patterns and hooks
- Clean architecture principles
- Type-safe development workflow
- Production-ready state management
- Comprehensive form validation
- Accessible UI components
- Professional error handling

---

**Author**: Nimesh Maharjan  
**Built with**: Next.js, TypeScript, and modern React ecosystem  
**Purpose**: Technical demonstration for interview assessment
