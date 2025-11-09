# Doors22 Dashboard

Modern admin dashboard for managing the Doors22 AI-powered social media automation system.

## Features

### 🎯 Core Functionality
- **Dashboard Home** - Overview metrics, pending posts, latest trends, system status
- **Pending Approval** - Review and approve/edit/reject AI-generated content
- **Content Calendar** - View scheduled and posted content with filters
- **Analytics** - Performance metrics with charts (pie/bar charts)
- **Trends** - AI-powered trend analysis and insights
- **Logs** - System activity monitoring and event tracking

### 🔐 Authentication
- JWT-based authentication
- Protected routes
- Persistent login sessions

### 🎨 UI/UX
- Modern gradient design system
- Responsive layout (mobile-first)
- Smooth animations and transitions
- Real-time data updates with SWR
- Interactive charts with Recharts

### 🔄 Approval Workflow
- Pending → Approve → Auto-post at scheduled time
- Pending → Edit → Auto-approve → Auto-post
- Pending → Reject → Archive (never posts)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** SWR (stale-while-revalidate)
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Authentication:** JWT

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running at http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Default Login Credentials
```
Email: admin@doors22.com
Password: admin123
```

## Project Structure

```
doors22-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── page.tsx        # Dashboard Home
│   │   │   ├── approval/       # Pending Approval
│   │   │   ├── content/        # Content Calendar
│   │   │   ├── analytics/      # Analytics & Charts
│   │   │   ├── trends/         # Trend Analysis
│   │   │   └── logs/           # System Logs
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable components
│   │   ├── PostCard.tsx        # Post display card
│   │   ├── StatsCard.tsx       # Metrics card
│   │   └── Sidebar.tsx         # Navigation sidebar
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── usePosts.ts         # Posts data fetching
│   │   └── useTrends.ts        # Trends data fetching
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # API client (Axios)
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript types
│       └── index.ts            # Type definitions
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## Pages Overview

### Dashboard Home (`/dashboard`)
- Total posts, pending, approved, posted counts
- Preview of pending posts (3 latest)
- Latest trend analysis summary
- System status indicators

### Pending Approval (`/dashboard/approval`)
- Grid view of all pending posts
- Media preview (images/videos)
- Approve/Edit/Reject actions
- Edit modal with caption editing
- Real-time updates (10s interval)

### Content Calendar (`/dashboard/content`)
- All posts with status filters
- Type filters (image/video)
- Search functionality
- Scheduled date/time display

### Analytics (`/dashboard/analytics`)
- Total posts metrics
- Status distribution pie chart
- Status breakdown bar chart
- Key insights (approval rate, publishing rate, rejection rate)

### Trends (`/dashboard/trends`)
- Trend analysis history
- Top hashtags
- Content mix (images/videos)
- Popular image/video styles
- Trending topics
- Competitor insights

### Logs (`/dashboard/logs`)
- System activity logs
- Status filtering (success/warning/error/info)
- Log summary statistics

## API Integration

All API calls are handled through `src/lib/api.ts`:

```typescript
// Posts
postsApi.getAll(params)
postsApi.approve(id, data)
postsApi.reject(id, data)
postsApi.edit(id, updates)
postsApi.getStatistics()

// Trends
trendsApi.getAll(params)

// Auth
authApi.login(credentials)
```

## Styling Guide

### Custom Utilities (globals.css)

```css
/* Buttons */
.btn              /* Base button */
.btn-primary      /* Primary gradient button */
.btn-secondary    /* Secondary button */

/* Cards */
.card             /* Base card */
.card-hover       /* Card with hover effect */

/* Status Badges */
.badge            /* Base badge */
.badge-pending    /* Yellow badge */
.badge-approved   /* Green badge */
.badge-rejected   /* Red badge */
.badge-posted     /* Blue badge */

/* Animations */
.animate-fade-in  /* Fade in animation */
.animate-slide-up /* Slide up animation */
```

### Color Palette

```javascript
primary: {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
}
```

## Development

### Build for Production

```bash
npm run build
npm start
```

### Run Linter

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## Deployment

### Deploy to Vercel

```bash
vercel --prod
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://api.doors22.com/api
```

## Key Features Implementation

### Real-time Updates
Uses SWR with `refreshInterval`:
- Pending posts: 10 seconds
- Statistics: 30 seconds
- Trends: 60 seconds

### Approval Workflow
```typescript
// Approve
await postsApi.approve(postId, { approvedBy: 'admin' })

// Edit (auto-approves)
await postsApi.edit(postId, { caption: 'new caption' }, 'admin')

// Reject
await postsApi.reject(postId, {
  reason: 'Poor quality',
  rejectedBy: 'admin'
})
```

### Protected Routes
All dashboard routes are protected with `useAuth`:
```typescript
const { user, loading } = useAuth();
if (!user) redirect('/login');
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images with Next.js Image component
- Code splitting with App Router
- SWR caching for API requests
- Lazy loading for charts

## License

Proprietary - Doors22 Internal Use Only

## Support

For issues or questions, contact the development team.
