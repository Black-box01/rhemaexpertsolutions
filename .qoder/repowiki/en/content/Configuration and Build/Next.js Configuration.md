# Next.js Configuration

<cite>
**Referenced Files in This Document**
- [next.config.ts](file://next.config.ts)
- [package.json](file://package.json)
- [tsconfig.json](file://tsconfig.json)
- [postcss.config.mjs](file://postcss.config.mjs)
- [eslint.config.mjs](file://eslint.config.mjs)
- [app/layout.tsx](file://app/layout.tsx)
- [app/page.tsx](file://app/page.tsx)
- [lib/cloudinary.ts](file://lib/cloudinary.ts)
- [lib/images.ts](file://lib/images.ts)
</cite>

## Update Summary
**Changes Made**
- Updated Next.js configuration section to reflect Cloudinary domain whitelisting and disabled built-in image optimization
- Added new Cloudinary integration section documenting external image processing setup
- Updated image optimization guidance to reflect Cloudinary's role in image handling
- Enhanced deployment strategies with Cloudinary-specific considerations

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Cloudinary Integration](#cloudinary-integration)
7. [Dependency Analysis](#dependency-analysis)
8. [Performance Considerations](#performance-considerations)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Conclusion](#conclusion)
11. [Appendices](#appendices)

## Introduction
This document explains the Next.js configuration for Rhema Expert Solutions, focusing on application settings, build optimization, deployment targets, and runtime behavior. It covers static generation, server-side rendering, client-side routing, environment variable handling, build artifact optimization, performance monitoring setup, customization of Next.js behavior, plugin configuration, experimental features, deployment strategies, and production environment setup. The configuration now includes specialized Cloudinary integration for external image processing and optimization.

## Project Structure
The project follows Next.js App Router conventions with an app directory containing pages, layouts, and shared resources. Key configuration files reside at the repository root and influence build-time and runtime behavior. The architecture now integrates Cloudinary for external image processing and optimization.

```mermaid
graph TB
subgraph "Root Configurations"
N["next.config.ts<br/>Cloudinary domains whitelisted<br/>Built-in image optimization disabled"]
P["package.json"]
T["tsconfig.json"]
PC["postcss.config.mjs"]
E["eslint.config.mjs"]
end
subgraph "App Directory"
L["app/layout.tsx"]
H["app/page.tsx"]
end
subgraph "Cloudinary Integration"
C["lib/cloudinary.ts<br/>Cloudinary client configuration"]
I["lib/images.ts<br/>Image utility functions"]
end
N --> L
N --> H
N --> C
N --> I
P --> L
P --> H
T --> L
T --> H
PC --> L
E --> L
```

**Diagram sources**
- [next.config.ts](file://next.config.ts)
- [package.json](file://package.json)
- [tsconfig.json](file://tsconfig.json)
- [postcss.config.mjs](file://postcss.config.mjs)
- [eslint.config.mjs](file://eslint.config.mjs)
- [app/layout.tsx](file://app/layout.tsx)
- [app/page.tsx](file://app/page.tsx)
- [lib/cloudinary.ts](file://lib/cloudinary.ts)
- [lib/images.ts](file://lib/images.ts)

**Section sources**
- [next.config.ts](file://next.config.ts)
- [package.json](file://package.json)
- [tsconfig.json](file://tsconfig.json)
- [postcss.config.mjs](file://postcss.config.mjs)
- [eslint.config.mjs](file://eslint.config.mjs)
- [app/layout.tsx](file://app/layout.tsx)
- [app/page.tsx](file://app/page.tsx)
- [lib/cloudinary.ts](file://lib/cloudinary.ts)
- [lib/images.ts](file://lib/images.ts)

## Core Components
- Next.js configuration entry point defines application-wide settings with Cloudinary domain whitelisting and disabled built-in image optimization.
- Package scripts orchestrate development, build, and production start commands.
- TypeScript compiler options enable strictness, module resolution, JSX transforms, and Next.js plugin integration.
- PostCSS/Tailwind pipeline integrates Tailwind v4 via a dedicated PostCSS plugin.
- ESLint configuration extends Next.js recommended rulesets for core web vitals and TypeScript.
- Cloudinary integration provides external image processing and optimization capabilities.

Key configuration areas:
- Build and runtime behavior: next.config.ts (updated for Cloudinary integration)
- Scripts and dependencies: package.json
- Type checking and module resolution: tsconfig.json
- Styling pipeline: postcss.config.mjs
- Code quality: eslint.config.mjs
- Application shell and metadata: app/layout.tsx
- Home page rendering and data fetching: app/page.tsx
- External image processing: lib/cloudinary.ts, lib/images.ts

**Section sources**
- [next.config.ts](file://next.config.ts)
- [package.json](file://package.json)
- [tsconfig.json](file://tsconfig.json)
- [postcss.config.mjs](file://postcss.config.mjs)
- [eslint.config.mjs](file://eslint.config.mjs)
- [app/layout.tsx](file://app/layout.tsx)
- [app/page.tsx](file://app/page.tsx)
- [lib/cloudinary.ts](file://lib/cloudinary.ts)
- [lib/images.ts](file://lib/images.ts)

## Architecture Overview
The application uses App Router with a root layout and a home page implementing server-side rendering for dynamic content retrieval. The configuration supports modern tooling, performance-oriented defaults, and external image processing through Cloudinary. Built-in image optimization is disabled as Cloudinary handles all image transformations and optimizations.

```mermaid
graph TB
Dev["Developer Workflow"]
Scripts["npm scripts<br/>dev/build/start"]
NextCfg["Next.js Config<br/>next.config.ts<br/>Cloudinary domains whitelisted<br/>Built-in image optimization disabled"]
TS["TypeScript Compiler<br/>tsconfig.json"]
PostCSS["PostCSS Pipeline<br/>postcss.config.mjs"]
ESL["ESLint<br/>eslint.config.mjs"]
Layout["Root Layout<br/>app/layout.tsx"]
Home["Home Page<br/>app/page.tsx"]
Cloudinary["Cloudinary Integration<br/>lib/cloudinary.ts<br/>lib/images.ts"]
Dev --> Scripts
Scripts --> NextCfg
NextCfg --> Layout
NextCfg --> Home
NextCfg --> Cloudinary
TS --> Layout
TS --> Home
PostCSS --> Layout
ESL --> Layout
ESL --> Home
Cloudinary --> Home
```

**Diagram sources**
- [next.config.ts](file://next.config.ts)
- [package.json](file://package.json)
- [tsconfig.json](file://tsconfig.json)
- [postcss.config.mjs](file://postcss.config.mjs)
- [eslint.config.mjs](file://eslint.config.mjs)
- [app/layout.tsx](file://app/layout.tsx)
- [app/page.tsx](file://app/page.tsx)
- [lib/cloudinary.ts](file://lib/cloudinary.ts)
- [lib/images.ts](file://lib/images.ts)

## Detailed Component Analysis

### Next.js Configuration (next.config.ts)
- Purpose: Central place to configure Next.js behavior, build outputs, and runtime options.
- **Updated**: Now includes Cloudinary domain whitelisting and disabled built-in image optimization since Cloudinary handles image processing and optimization externally.
- Current state: Enhanced configuration supporting external image processing while maintaining minimal footprint.
- Key changes:
  - Cloudinary domains added to remotePatterns for secure image loading
  - Built-in image optimization disabled to prevent conflicts with Cloudinary processing
  - Optimized for external CDN-based image delivery

**Section sources**
- [next.config.ts](file://next.config.ts)

### Cloudinary Integration
- Purpose: External image processing and optimization service integration.
- Implementation: Dedicated library modules handle Cloudinary client configuration and image utility functions.
- Benefits: Advanced image transformations, automatic format optimization, responsive images, and global CDN delivery.
- Configuration: Domain whitelisting ensures secure image loading from Cloudinary servers.

**Section sources**
- [lib/cloudinary.ts](file://lib/cloudinary.ts)
- [lib/images.ts](file://lib/images.ts)

### TypeScript Configuration (tsconfig.json)
- Strict type checking enabled with isolated modules and bundler module resolution.
- Next.js plugin integrated for framework-aware type generation.
- Path aliases configured for clean imports.
- Incremental compilation enabled for faster rebuilds.

**Section sources**
- [tsconfig.json](file://tsconfig.json)

### Styling Pipeline (postcss.config.mjs)
- Tailwind v4 plugin configured via PostCSS.
- Ensures consistent CSS generation and optimization through the build pipeline.

**Section sources**
- [postcss.config.mjs](file://postcss.config.mjs)

### Code Quality (eslint.config.mjs)
- Extends Next.js core web vitals and TypeScript configurations.
- Overrides default ignores to include project-specific paths and exclude generated folders.

**Section sources**
- [eslint.config.mjs](file://eslint.config.mjs)

### Root Layout (app/layout.tsx)
- Defines metadata, fonts, favicon, and global styles.
- Implements Google AdSense account metadata.
- Provides the HTML wrapper and body classes for typography and anti-aliasing.

Rendering model:
- Static generation by default for the root layout.
- Dynamic content can be injected via page-level components.

**Section sources**
- [app/layout.tsx](file://app/layout.tsx)

### Home Page (app/page.tsx)
- Implements server-side rendering to fetch dynamic content from Supabase.
- Uses concurrent data fetching for multiple datasets.
- Falls back to static content when dynamic data is unavailable.
- Integrates components for galleries, hero slides, newsletter ticker, and contact actions.
- **Updated**: Leverages Cloudinary for optimized image delivery instead of Next.js built-in optimization.

Rendering model:
- Server-rendered with dynamic data hydration.
- Client-side interactivity handled by components.
- External image processing through Cloudinary integration.

```mermaid
sequenceDiagram
participant Browser as "Browser"
participant Next as "Next.js Runtime"
participant Supabase as "Supabase Client"
participant Cloudinary as "Cloudinary CDN"
participant Page as "app/page.tsx"
Browser->>Next : Request "/"
Next->>Page : Render Home()
Page->>Supabase : Fetch services, clients, team, competitions, newsletters, content
Supabase-->>Page : Data or Error
Page->>Cloudinary : Load optimized images
Cloudinary-->>Page : Processed images
Page->>Page : Merge dynamic and static content
Page-->>Next : HTML with props
Next-->>Browser : Streamed HTML
```

**Diagram sources**
- [app/page.tsx](file://app/page.tsx)
- [lib/cloudinary.ts](file://lib/cloudinary.ts)
- [lib/images.ts](file://lib/images.ts)

**Section sources**
- [app/page.tsx](file://app/page.tsx)

### Environment Variables and Secrets
- No explicit environment variable files were found in the repository snapshot.
- Recommended pattern:
  - Define environment variables per environment (development, preview, production).
  - Use Next.js built-in environment variable exposure for client-side access prefixed appropriately.
  - Store secrets in platform-managed secret stores or CI/CD secret management.
  - Configure Cloudinary credentials securely for image processing.

### Build Artifact Optimization
- Enable output tracing in next.config.ts for reduced serverless bundle sizes.
- Leverage incremental builds via TypeScript configuration.
- **Updated**: Disable built-in image optimization as Cloudinary handles image processing externally.
- Optimize images using Cloudinary's advanced transformation capabilities and CDN delivery.
- Minimize CSS via Tailwind purging and PostCSS optimization.

### Performance Monitoring Setup
- Integrate Core Web Vitals reporting via Next.js instrumentation and analytics providers.
- Monitor build sizes and bundle composition using Next.js analyzer or external tools.
- Track runtime performance with browser performance APIs and server metrics.
- **Updated**: Monitor Cloudinary image delivery performance and CDN response times.

### Customizing Next.js Behavior
- Add plugins and middleware via next.config.ts and app/middleware.ts.
- Configure redirects, rewrites, headers, and security policies.
- Extend experimental features cautiously and test thoroughly.
- **Updated**: Configure Cloudinary-specific settings and image transformation parameters.

### Deployment Strategies
- Build output: Use the build script to generate optimized artifacts.
- Production start: Use the start script to serve the application.
- Platform-specific guidance:
  - For serverless platforms, enable output tracing and minimize dependencies.
  - For static export, evaluate routes and data requirements carefully.
  - **Updated**: Ensure Cloudinary credentials are properly configured in deployment environments.

**Section sources**
- [package.json](file://package.json)

### Production Environment Setup
- Ensure environment variables are set per environment.
- Validate build artifacts and runtime logs.
- Set up health checks and observability.
- **Updated**: Verify Cloudinary integration and image delivery functionality in production.

## Dependency Analysis
The project relies on Next.js 16, React 19, and Tailwind v4 via PostCSS. Dependencies are declared in package.json and influence build-time behavior and runtime performance. The addition of Cloudinary integration provides external image processing capabilities.

```mermaid
graph LR
Pkg["package.json"]
Next["next"]
React["react / react-dom"]
Tailwind["@tailwindcss/postcss"]
Sharp["sharp-cli"]
Cloudinary["Cloudinary SDK"]
Pkg --> Next
Pkg --> React
Pkg --> Tailwind
Pkg --> Sharp
Pkg --> Cloudinary
```

**Diagram sources**
- [package.json](file://package.json)

**Section sources**
- [package.json](file://package.json)

## Performance Considerations
- Prefer server-side rendering for dynamic content to improve initial load performance.
- Use concurrent data fetching to reduce time-to-first-byte.
- **Updated**: Leverage Cloudinary's CDN for optimized image delivery and transformations.
- Keep TypeScript strict mode enabled for earlier error detection.
- Use incremental builds and efficient module resolution.
- **Updated**: Monitor Cloudinary API usage and optimize image transformation requests.

## Troubleshooting Guide
Common issues and resolutions:
- Build failures due to missing environment variables:
  - Ensure all required environment variables are present in the deployment environment.
- Type errors after updates:
  - Run type checks locally and resolve errors before committing.
- Styling inconsistencies:
  - Verify Tailwind plugin configuration and PostCSS pipeline.
- Slow builds:
  - Enable incremental builds and avoid unnecessary transpilation.
- Runtime errors on serverless:
  - Reduce bundle size using output tracing and remove unused dependencies.
- **Updated**: Cloudinary image loading issues:
  - Verify domain whitelisting in next.config.ts remotePatterns.
  - Check Cloudinary credentials and network connectivity.
  - Ensure proper image transformation parameters are passed to Cloudinary.

**Section sources**
- [eslint.config.mjs](file://eslint.config.mjs)
- [tsconfig.json](file://tsconfig.json)
- [postcss.config.mjs](file://postcss.config.mjs)
- [package.json](file://package.json)
- [next.config.ts](file://next.config.ts)
- [lib/cloudinary.ts](file://lib/cloudinary.ts)

## Conclusion
Rhema Expert Solutions leverages Next.js App Router with server-side rendering for dynamic content and a modern build pipeline with TypeScript, Tailwind, and ESLint. The configuration now includes specialized Cloudinary integration for external image processing and optimization, providing enhanced performance and flexibility. The setup is minimal and extensible, enabling performance optimizations, robust deployment strategies, and consistent developer experience across environments.

## Appendices

### Appendix A: Next.js Rendering Modes in This Project
- Root layout: Static generation by default.
- Home page: Server-side rendering with dynamic data fetching.
- Client-side routing: Automatic via App Router.
- **Updated**: Image processing: Handled externally by Cloudinary CDN.

**Section sources**
- [app/layout.tsx](file://app/layout.tsx)
- [app/page.tsx](file://app/page.tsx)
- [lib/cloudinary.ts](file://lib/cloudinary.ts)

### Appendix B: Recommended next.config.ts Extensions
- Output tracing for serverless deployments.
- Base path and asset prefix for CDN/subpath hosting.
- Experimental flags aligned with project needs.
- Performance budgets and analyzer integration.
- **Updated**: Cloudinary domain whitelisting and external image processing configuration.

**Section sources**
- [next.config.ts](file://next.config.ts)

### Appendix C: Cloudinary Integration Guidelines
- Configure Cloudinary client with appropriate credentials.
- Use utility functions for consistent image transformation parameters.
- Implement fallback mechanisms for image loading failures.
- Monitor Cloudinary API usage and optimize transformation requests.
- Test image delivery performance across different regions and devices.

**Section sources**
- [lib/cloudinary.ts](file://lib/cloudinary.ts)
- [lib/images.ts](file://lib/images.ts)