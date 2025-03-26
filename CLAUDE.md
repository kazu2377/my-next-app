# Development Guidelines

## Commands
- **Build**: `npm run build` - Next.js production build
- **Develop**: `npm run dev` - Start development server
- **Lint**: `npm run lint` - Run ESLint on codebase
- **Deploy**: `npm run deploy` - Deploy to Cloudflare
- **Preview**: `npm run preview` - Preview production build

## Code Style
- **Components**: Use functional components with TypeScript interfaces
- **Imports**: Use absolute imports with `@/` prefix
- **Typing**: Strong typing with TypeScript; prefer interfaces over types
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Early returns for errors; handle edge cases first
- **Server vs Client**: Minimize `use client` usage; prefer server components
- **Functions**: Use function keyword for pure functions; omit semicolons
- **Structure**: Components, subcomponents, helpers, static content, types

## Next.js Patterns
- Follow App Router conventions for routing and state management
- Use server actions for data mutations with proper error handling
- Implement responsive design with Tailwind CSS (mobile-first approach)
- Prioritize Web Vitals (LCP, CLS, FID)