# Li2 - Sushi Menu Management System

A modern, type-safe web application for managing a sushi restaurant's menu. Built as a technical demonstration showcasing React best practices, state management, and comprehensive E2E testing.

## Tech Stack

- **React 19** with **Next.js 15** (App Router)
- **TypeScript** - Full type safety
- **Zustand** - Client state management (filters, pagination)
- **TanStack Query** - Server state management and caching
- **React Hook Form** + **Zod** - Form validation
- **Tailwind CSS** + **Shadcn/ui** - Styling and components
- **Playwright** - E2E testing
- **Axios** - HTTP client

## Features

### Core Functionality ✅

- ✅ **CRUD Operations** - Create and delete sushi items
- ✅ **Search** - Filter by name or fish type
- ✅ **Type Filter** - Filter by Nigiri or Roll
- ✅ **Price Filter** - Adjustable price range slider
- ✅ **Pagination** - 8 items per page with smart navigation
- ✅ **Conditional Fields**:
  - Nigiri: requires `fishType`
  - Roll: requires `pieces`

### Bonus Features ✅

- ✅ **State Management** - Zustand for client state, React Query for server state
- ✅ **E2E Testing** - 47 comprehensive Playwright tests
- ✅ **Form Validation** - Runtime validation with Zod schemas
- ✅ **Responsive Design** - Mobile and desktop optimized

## Installation & Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

## Testing

### E2E Tests (47 tests)

```bash
# Interactive UI mode (recommended)
pnpm test:e2e:ui

# Headless mode
pnpm test:e2e

# Headed mode (see browser)
pnpm test:e2e:headed

# View test report
pnpm test:e2e:report
```

**Test Coverage:**

- Sushi list display and loading states
- Search and filtering functionality
- Pagination navigation
- CRUD operations (create, delete)
- Form validation
- State management (Zustand + React Query)

## Project Structure

```
nigiri/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── sushi/             # Feature components
│   │   ├── add/           # Create sushi dialog
│   │   ├── delete/        # Delete confirmation
│   │   ├── filter-section.tsx
│   │   ├── list-card/     # Sushi card component
│   │   ├── pagination-section.tsx
│   │   └── sushi-grid.tsx
│   └── ui/                # Shadcn/ui components
├── hooks/                 # React Query hooks
├── services/              # API service layer
├── store/                 # Zustand store
├── types/                 # TypeScript types & Zod schemas
├── tests/                 # Playwright E2E tests
└── lib/                   # Utilities
```

## API Integration

Using the provided API: [Postman Documentation](https://documenter.getpostman.com/view/50390236/2sB3dJzsUT)

**Endpoints:**

- `GET /sushi` - Fetch all sushi items
- `POST /sushi` - Create new sushi item
- `DELETE /sushi/:id` - Delete sushi item

## Key Implementation Details

### State Management

**Client State (Zustand)**

- Filter criteria (search, type, price range)
- Pagination state (current page, items per page)
- Automatic page reset on filter changes

**Server State (React Query)**

- Sushi menu data with caching
- Automatic cache invalidation on mutations
- Optimistic UI updates

### Form Validation

Zod schemas with conditional validation:

```typescript
// Nigiri requires fishType, Roll requires pieces
createSushiSchema
  .object({
    name: z.string().min(1).max(50),
    type: z.enum(['Nigiri', 'Roll']),
    price: z.string().refine(/* valid number */),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'Nigiri' && !data.fishType) {
      ctx.addIssue({ path: ['fishType'], message: 'Required for Nigiri' });
    }
    if (data.type === 'Roll' && !data.pieces) {
      ctx.addIssue({ path: ['pieces'], message: 'Required for Roll' });
    }
  });
```

### Code Quality

- 100% TypeScript coverage
- Strict mode enabled
- Runtime validation with Zod
- Component-based architecture
- Performance optimized (useMemo, React Query caching)

## Development Notes

### Architecture Decisions

1. **Next.js** - Modern React framework with built-in optimizations
2. **Zustand over Redux** - Minimal boilerplate, TypeScript-first
3. **React Query** - Declarative data fetching and caching
4. **Shadcn/ui** - High-quality, accessible components
5. **Playwright** - Reliable E2E testing across browsers

### Performance Optimizations

- `useMemo` for expensive filtering operations
- React Query intelligent caching
- Pagination to limit DOM nodes
- Debounced search input

---

**Author:** Nimesh Maharjan  
**Purpose:** Technical assessment for Li2 Technology  
**Built:** November 2025
