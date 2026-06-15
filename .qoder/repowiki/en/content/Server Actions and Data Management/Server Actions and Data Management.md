# Server Actions and Data Management

<cite>
**Referenced Files in This Document**
- [auth.ts](file://app/actions/auth.ts)
- [registration.ts](file://app/actions/registration.ts)
- [admin.ts](file://app/actions/admin.ts)
- [coding-classes.ts](file://app/actions/coding-classes.ts)
- [email.ts](file://lib/email.ts)
- [supabase.ts](file://lib/supabase.ts)
- [supabase-admin.ts](file://lib/supabase-admin.ts)
- [supabase.ts](file://types/supabase.ts)
- [admin-login-page.tsx](file://app/admin/page.tsx)
- [admin-dashboard-page.tsx](file://app/admin/dashboard/page.tsx)
- [package.json](file://package.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document explains the server actions and data management architecture for the Rhema Expert Solutions platform. It covers authentication and session management, protected routes, course registration systems, administrative workflows, and the integration with Supabase. It also documents error handling, security considerations, and provides practical guidance for extending the system with new server actions while maintaining data consistency and performance.

## Project Structure
The platform organizes server-side logic under app/actions and integrates with Supabase via dedicated client libraries. Administrative UI is implemented in app/admin/dashboard/page.tsx, which orchestrates server actions for CRUD operations and displays real-time data.

```mermaid
graph TB
subgraph "Client UI"
A_AdminLogin["Admin Login Page<br/>(app/admin/page.tsx)"]
A_Dashboard["Admin Dashboard<br/>(app/admin/dashboard/page.tsx)"]
end
subgraph "Server Actions"
S_Auth["Auth Actions<br/>(app/actions/auth.ts)"]
S_Registration["Competition Registration<br/>(app/actions/registration.ts)"]
S_CodingClasses["Coding Class Registration<br/>(app/actions/coding-classes.ts)"]
S_Admin["Admin Actions<br/>(app/actions/admin.ts)"]
end
subgraph "Libraries"
L_Email["Email Utilities<br/>(lib/email.ts)"]
L_SupaPublic["Public Supabase Client<br/>(lib/supabase.ts)"]
L_SupaAdmin["Admin Supabase Client<br/>(lib/supabase-admin.ts)"]
end
subgraph "Database"
D_Schema["Supabase Tables<br/>(rhema_content, rhema_services, rhema_clients,<br/>rhema_team, rhema_competitions, rhema_newsletter,<br/>rhema_registrations, rhema_coding_class_registrations)"]
end
A_AdminLogin --> S_Auth
A_Dashboard --> S_Admin
A_Dashboard --> S_Registration
A_Dashboard --> S_CodingClasses
S_Auth --> L_SupaAdmin
S_Registration --> L_SupaAdmin
S_CodingClasses --> L_SupaAdmin
S_Admin --> L_SupaAdmin
S_Registration --> L_Email
S_CodingClasses --> L_Email
L_SupaAdmin --> D_Schema
L_SupaPublic --> D_Schema
```

**Diagram sources**
- [admin-login-page.tsx:1-52](file://app/admin/page.tsx#L1-L52)
- [admin-dashboard-page.tsx:1-1055](file://app/admin/dashboard/page.tsx#L1-L1055)
- [auth.ts:1-55](file://app/actions/auth.ts#L1-L55)
- [registration.ts:1-131](file://app/actions/registration.ts#L1-L131)
- [coding-classes.ts:1-157](file://app/actions/coding-classes.ts#L1-L157)
- [admin.ts:1-198](file://app/actions/admin.ts#L1-L198)
- [email.ts:1-134](file://lib/email.ts#L1-L134)
- [supabase.ts:1-25](file://lib/supabase.ts#L1-L25)
- [supabase-admin.ts:1-19](file://lib/supabase-admin.ts#L1-L19)

**Section sources**
- [admin-login-page.tsx:1-52](file://app/admin/page.tsx#L1-L52)
- [admin-dashboard-page.tsx:1-1055](file://app/admin/dashboard/page.tsx#L1-L1055)
- [auth.ts:1-55](file://app/actions/auth.ts#L1-L55)
- [registration.ts:1-131](file://app/actions/registration.ts#L1-L131)
- [coding-classes.ts:1-157](file://app/actions/coding-classes.ts#L1-L157)
- [admin.ts:1-198](file://app/actions/admin.ts#L1-L198)
- [email.ts:1-134](file://lib/email.ts#L1-L134)
- [supabase.ts:1-25](file://lib/supabase.ts#L1-L25)
- [supabase-admin.ts:1-19](file://lib/supabase-admin.ts#L1-L19)

## Core Components
- Authentication and Session Management: Secure login, session cookie, and auth checks.
- Course Registration Systems: Competition and coding class registration with validation and email notifications.
- Administrative Functions: CRUD operations for services, clients, team, competitions, newsletter, and general settings.
- Supabase Integration: Public client for read-only access and admin client for privileged operations.
- Email Notifications: Automated admin alerts for new registrations.

**Section sources**
- [auth.ts:7-43](file://app/actions/auth.ts#L7-L43)
- [registration.ts:22-84](file://app/actions/registration.ts#L22-L84)
- [coding-classes.ts:20-76](file://app/actions/coding-classes.ts#L20-L76)
- [admin.ts:21-36](file://app/actions/admin.ts#L21-L36)
- [email.ts:23-44](file://lib/email.ts#L23-L44)
- [supabase-admin.ts:14-18](file://lib/supabase-admin.ts#L14-L18)

## Architecture Overview
The system uses Next.js Server Actions to encapsulate data mutations and protect routes via cookie-based sessions. Admin pages call server actions that interact with Supabase using an admin client bypassing Row Level Security for privileged operations. Public-facing data retrieval uses a separate public client.

```mermaid
sequenceDiagram
participant U as "Admin User"
participant UI as "Admin Dashboard (Client)"
participant SA as "Server Action (admin.ts)"
participant SC as "Supabase Admin Client"
participant DB as "Supabase Database"
U->>UI : "Click Save/Edit/Delete"
UI->>SA : "Invoke action with validated payload"
SA->>SC : "Execute insert/update/delete/select"
SC->>DB : "SQL operation"
DB-->>SC : "Result/Error"
SC-->>SA : "Result/Error"
SA-->>UI : "{success : true/false, data?}"
UI->>UI : "Revalidate path and refresh UI"
```

**Diagram sources**
- [admin-dashboard-page.tsx:66-102](file://app/admin/dashboard/page.tsx#L66-L102)
- [admin.ts:38-98](file://app/actions/admin.ts#L38-L98)
- [supabase-admin.ts:14-18](file://lib/supabase-admin.ts#L14-L18)

## Detailed Component Analysis

### Authentication and Session Management
- Login validates against stored admin password (retrieved from rhema_content or environment variable), sets a secure httpOnly cookie upon success, and returns structured results.
- Logout deletes the session cookie and redirects to the admin landing page.
- checkAuth reads the session cookie to enforce protected routes.

```mermaid
sequenceDiagram
participant C as "Client (Admin Login)"
participant A as "login (auth.ts)"
participant DB as "Supabase (rhema_content)"
participant CK as "Cookies"
C->>A : "Submit password"
A->>DB : "select(value) where section='admin' and key='password'"
DB-->>A : "value or none"
alt "Password matches"
A->>CK : "set('rhema_admin_auth'='true')"
A-->>C : "{success : true}"
else "Mismatch"
A-->>C : "{success : false, error}"
end
```

**Diagram sources**
- [auth.ts:7-43](file://app/actions/auth.ts#L7-L43)
- [admin-login-page.tsx:12-23](file://app/admin/page.tsx#L12-L23)

**Section sources**
- [auth.ts:7-43](file://app/actions/auth.ts#L7-L43)
- [admin-login-page.tsx:12-23](file://app/admin/page.tsx#L12-L23)

### Protected Route Configuration
- The dashboard verifies authentication on mount and redirects unauthenticated users to the login page.
- Server actions enforce authentication internally for sensitive operations.

```mermaid
flowchart TD
Start(["Load Admin Dashboard"]) --> CheckAuth["checkAuth()"]
CheckAuth --> AuthOK{"Authenticated?"}
AuthOK --> |Yes| FetchData["fetchDashboardData()"]
AuthOK --> |No| Redirect["redirect('/admin')"]
FetchData --> Render["Render UI"]
```

**Diagram sources**
- [admin-dashboard-page.tsx:54-64](file://app/admin/dashboard/page.tsx#L54-L64)
- [admin.ts:14-19](file://app/actions/admin.ts#L14-L19)

**Section sources**
- [admin-dashboard-page.tsx:54-64](file://app/admin/dashboard/page.tsx#L54-L64)
- [admin.ts:14-19](file://app/actions/admin.ts#L14-L19)

### Course Registration System
- Competition Registration:
  - Validates required fields, inserts a pending registration, selects the inserted row, sends an admin email, and returns structured results.
- Coding Class Registration:
  - Validates required fields (including course selections), inserts a pending registration, selects the inserted row, sends an admin email, and returns structured results.

```mermaid
sequenceDiagram
participant U as "User"
participant UI as "Registration Form"
participant SA as "submitRegistration / submitCodingClassRegistration"
participant SC as "Supabase Admin Client"
participant EM as "Email Service"
U->>UI : "Submit form"
UI->>SA : "formData"
SA->>SC : "insert(...).select()"
SC-->>SA : "data/error"
alt "Success"
SA->>EM : "sendCompetitionRegistrationEmail / sendCodingClassRegistrationEmail"
EM-->>SA : "result"
SA-->>UI : "{success : true, data}"
else "Error"
SA-->>UI : "{success : false, error}"
end
```

**Diagram sources**
- [registration.ts:22-84](file://app/actions/registration.ts#L22-L84)
- [coding-classes.ts:20-76](file://app/actions/coding-classes.ts#L20-L76)
- [email.ts:46-86](file://lib/email.ts#L46-L86)

**Section sources**
- [registration.ts:22-84](file://app/actions/registration.ts#L22-L84)
- [coding-classes.ts:20-76](file://app/actions/coding-classes.ts#L20-L76)
- [email.ts:46-86](file://lib/email.ts#L46-L86)

### Enrollment Processing and Status Updates
- Competition Registrations:
  - Admin can update status and delete entries.
- Coding Class Registrations:
  - Admin can update status via a dropdown and edit registration details; deletion supported.

```mermaid
flowchart TD
A["Admin Selects Status Change"] --> B["updateCodingClassStatus(id, status)"]
B --> C{"Authorized?"}
C --> |Yes| D["Supabase update(status)"]
C --> |No| E["Return Unauthorized"]
D --> F["Revalidate Path and Refresh"]
```

**Diagram sources**
- [admin-dashboard-page.tsx:1000-1024](file://app/admin/dashboard/page.tsx#L1000-L1024)
- [coding-classes.ts:98-116](file://app/actions/coding-classes.ts#L98-L116)

**Section sources**
- [admin-dashboard-page.tsx:1000-1024](file://app/admin/dashboard/page.tsx#L1000-L1024)
- [coding-classes.ts:98-116](file://app/actions/coding-classes.ts#L98-L116)

### Administrative Functions
- Dashboard Data Fetch:
  - Concurrently loads services, clients, team, competitions, newsletter, and settings; ensures admin password exists in settings.
- CRUD Operations:
  - Save/edit services, clients, team members, competitions, newsletter posts, and general settings.
  - Delete arbitrary items by table and ID.
  - Toggle competition activity flag.
- Revalidation:
  - Uses Next.js revalidatePath after mutations to keep UI in sync.

```mermaid
classDiagram
class AdminActions {
+saveService(data)
+saveClient(data)
+saveTeam(data)
+saveCompetition(data)
+saveNewsletter(data)
+saveSetting(data)
+deleteItem(table, id)
+toggleCompetition(id, isActive)
+fetchDashboardData()
}
class SupabaseAdmin {
+from(table)
+select()
+insert(rows)
+update(changes)
+delete()
+eq(column, value)
+order(column, options)
}
AdminActions --> SupabaseAdmin : "uses"
```

**Diagram sources**
- [admin.ts:21-198](file://app/actions/admin.ts#L21-L198)
- [supabase-admin.ts:14-18](file://lib/supabase-admin.ts#L14-L18)

**Section sources**
- [admin.ts:21-198](file://app/actions/admin.ts#L21-L198)

### Supabase Integration and Data Models
- Public Client:
  - Designed for read-only access with runtime checks for environment configuration.
- Admin Client:
  - Uses Service Role Key to bypass RLS for privileged operations; falls back to Anon Key with warnings.
- Data Types:
  - Strongly typed interfaces for tables including content, services, clients, team, competitions, newsletter, registrations, and coding class registrations.

```mermaid
classDiagram
class SupabasePublic {
+createClient(url, anonKey)
+isSupabaseConfigured()
}
class SupabaseAdmin {
+createClient(url, serviceRoleKey|anonKey)
}
class Types {
<<interface>> RhemaContent
<<interface>> RhemaService
<<interface>> RhemaClient
<<interface>> RhemaTeam
<<interface>> RhemaCompetition
<<interface>> RhemaNewsletter
<<interface>> RhemaRegistration
<<interface>> RhemaCodingClassRegistration
}
SupabasePublic <.. Types : "used by"
SupabaseAdmin <.. Types : "used by"
```

**Diagram sources**
- [supabase.ts:16-24](file://lib/supabase.ts#L16-L24)
- [supabase-admin.ts:14-18](file://lib/supabase-admin.ts#L14-L18)
- [supabase.ts:5-98](file://types/supabase.ts#L5-L98)

**Section sources**
- [supabase.ts:16-24](file://lib/supabase.ts#L16-L24)
- [supabase-admin.ts:14-18](file://lib/supabase-admin.ts#L14-L18)
- [supabase.ts:5-98](file://types/supabase.ts#L5-L98)

### Email Notifications
- Sends HTML emails to administrators for new competition and coding class registrations.
- Gracefully handles missing SMTP credentials with warnings and structured errors.

**Section sources**
- [email.ts:23-44](file://lib/email.ts#L23-L44)
- [email.ts:46-86](file://lib/email.ts#L46-L86)
- [email.ts:88-133](file://lib/email.ts#L88-L133)

## Dependency Analysis
- Runtime Dependencies:
  - @supabase/supabase-js for database operations.
  - nodemailer for email delivery.
- Internal Dependencies:
  - Server actions depend on Supabase admin client and email utilities.
  - Admin dashboard depends on server actions for all data operations.

```mermaid
graph LR
Pkg["package.json"] --> Supabase["@supabase/supabase-js"]
Pkg --> Nodemailer["nodemailer"]
Auth["app/actions/auth.ts"] --> SupaAdmin["lib/supabase-admin.ts"]
Reg["app/actions/registration.ts"] --> SupaAdmin
Coding["app/actions/coding-classes.ts"] --> SupaAdmin
Admin["app/actions/admin.ts"] --> SupaAdmin
Reg --> Email["lib/email.ts"]
Coding --> Email
Dashboard["app/admin/dashboard/page.tsx"] --> Admin
Dashboard --> Reg
Dashboard --> Coding
```

**Diagram sources**
- [package.json:11-18](file://package.json#L11-L18)
- [auth.ts:1-55](file://app/actions/auth.ts#L1-L55)
- [registration.ts:1-131](file://app/actions/registration.ts#L1-L131)
- [coding-classes.ts:1-157](file://app/actions/coding-classes.ts#L1-L157)
- [admin.ts:1-198](file://app/actions/admin.ts#L1-L198)
- [email.ts:1-134](file://lib/email.ts#L1-L134)
- [supabase-admin.ts:1-19](file://lib/supabase-admin.ts#L1-L19)
- [admin-dashboard-page.tsx:1-1055](file://app/admin/dashboard/page.tsx#L1-L1055)

**Section sources**
- [package.json:11-18](file://package.json#L11-L18)
- [auth.ts:1-55](file://app/actions/auth.ts#L1-L55)
- [registration.ts:1-131](file://app/actions/registration.ts#L1-L131)
- [coding-classes.ts:1-157](file://app/actions/coding-classes.ts#L1-L157)
- [admin.ts:1-198](file://app/actions/admin.ts#L1-L198)
- [email.ts:1-134](file://lib/email.ts#L1-L134)
- [supabase-admin.ts:1-19](file://lib/supabase-admin.ts#L1-L19)
- [admin-dashboard-page.tsx:1-1055](file://app/admin/dashboard/page.tsx#L1-L1055)

## Performance Considerations
- Concurrency:
  - Use Promise.all for fetching related datasets in admin dashboard to minimize round trips.
- Caching:
  - Leverage Next.js automatic caching and revalidation via revalidatePath after mutations.
- Network Efficiency:
  - Prefer single insert/select operations and batch updates where possible.
- Environment Safety:
  - Ensure SUPABASE_SERVICE_ROLE_KEY is present to avoid RLS bypass failures and degraded performance due to retries.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Authentication Failures:
  - Verify admin password exists in rhema_content or environment variable; confirm cookie is set with correct attributes.
- Supabase Client Issues:
  - Confirm NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are configured; check SUPABASE_SERVICE_ROLE_KEY presence for admin operations.
- Email Delivery Problems:
  - Ensure SMTP_USER and SMTP_PASS are set; review logs for transport errors.
- Unexpected Errors:
  - Server actions return structured {success, error} responses; log and surface user-friendly messages.

**Section sources**
- [auth.ts:7-43](file://app/actions/auth.ts#L7-L43)
- [supabase.ts:10-13](file://lib/supabase.ts#L10-L13)
- [supabase-admin.ts:7-9](file://lib/supabase-admin.ts#L7-L9)
- [email.ts:24-27](file://lib/email.ts#L24-L27)
- [registration.ts:79-83](file://app/actions/registration.ts#L79-L83)
- [coding-classes.ts:71-75](file://app/actions/coding-classes.ts#L71-L75)

## Conclusion
The platform implements a robust server-action-driven architecture with clear separation of concerns between authentication, data operations, and presentation. Supabase integration is handled via dedicated clients, and administrative workflows are protected and efficient. Extending the system requires adding new server actions, integrating with Supabase, and ensuring proper validation, error handling, and revalidation.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### Practical Examples

- Implementing a New Server Action
  - Define a new action in app/actions/<resource>.ts with 'use server'.
  - Use supabaseAdmin for privileged operations; wrap in try/catch and return {success, data?} or {success, error}.
  - Invoke from client components and revalidate as needed.

- Handling Asynchronous Operations
  - Use Promise.all for concurrent reads.
  - Use async/await for write operations and propagate errors.

- Managing Data Consistency
  - Perform insert/select in sequence to return created records.
  - Use transactions where supported by Supabase or orchestrate multiple operations atomically in actions.

**Section sources**
- [admin.ts:49-56](file://app/actions/admin.ts#L49-L56)
- [admin-dashboard-page.tsx:66-102](file://app/admin/dashboard/page.tsx#L66-L102)