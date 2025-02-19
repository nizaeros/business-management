# Deployment Guide

## Environment Setup

### Local Development
- Copy `.env.example` to `.env.local` and fill in your development environment variables
- Never commit `.env.local` to git

### Production (Vercel)
Set the following environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Environment Files Explained
We use a simple environment setup:

1. `.env.local` - Local development variables (git-ignored)
2. `.env.example` - Template showing required variables (committed to git)

We do NOT use:
- `.env.production` - Not needed (use Vercel environment variables)
- `.env.development` - Not needed (use .env.local)
- Any other env files

This keeps our setup clean and secure, with clear separation between local development and production environments.

## Common Issues and Solutions

### 1. Client Component Issues
- Wrap components using `useSearchParams`, `useRouter`, or other client hooks in Suspense boundaries
- Example:
  ```tsx
  import { Suspense } from 'react';

  export default function Page() {
    return (
      <Suspense fallback={<Loading />}>
        <ClientComponent />
      </Suspense>
    );
  }
  ```

### 2. Static vs Dynamic Pages
- Add `export const dynamic = 'force-dynamic'` for pages that need dynamic rendering
- Use proper caching strategies where applicable

### 3. Environment Variables
- Double-check that all environment variables are properly set in Vercel
- Use the Vercel dashboard to manage environment variables
- Keep production secrets secure and never commit them to the repository

## Pre-deployment Checklist

1. ✅ All environment variables are set
2. ✅ Client components are properly wrapped in Suspense
3. ✅ Static/Dynamic rendering is properly configured
4. ✅ TypeScript and ESLint checks pass
5. ✅ All dependencies are up to date

## Deployment Process

1. Push changes to the `staging` branch
2. Vercel will automatically deploy to preview environment
3. Test the preview deployment
4. If successful, merge to `main` branch
5. Vercel will automatically deploy to production

## Monitoring and Troubleshooting

1. Use Vercel deployment logs for build issues
2. Check Runtime logs for server-side errors
3. Monitor Edge Function execution in Vercel dashboard
4. Use browser console for client-side issues

## Rollback Process

If issues are discovered after deployment:
1. Revert the problematic commit
2. Push the revert to the appropriate branch
3. Vercel will automatically redeploy the previous working version
