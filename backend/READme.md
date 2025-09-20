## Deployment + Database Migration Challenge
- Solved deployment challenge by configuring Prisma migrations to run automatically during Render builds. Adapted local PostgreSQL setup to a hosted environment by adjusting connection strings and build scripts, enabling successful user authentication on the live realtime polling app.

### Challenge 
- When deploying the realtime polling backend (Node.js + Express + Prisma + PostgreSQL) to Render, the database schema migrations weren’t running on the hosted PostgreSQL database. Locally, everything worked fine with Prisma, but on Render, the app couldn’t reach the database (P1001 errors) and migrations didn’t apply automatically.

### Root Causes 
#### 1. Different environments
- Local .env pointed to a local PostgreSQL instance.
- Render used a hosted PostgreSQL instance with a different connection string.

#### 2. Database connection issues
- The hosted database required sslmode=require.
- The free Render plan doesn’t allow shell access, making it impossible to run npx prisma migrate deploy directly in the instance.
#### 3. Deployment flow
- Prisma migrations weren’t included in the Render build pipeline, so schema updates never reached the hosted DB.

### Solution
- Updated .env to use Render’s DATABASE_URL (with ?sslmode=require).
- Modified package.json scripts to add:
    - postinstall → run prisma generate.
    - postdeploy → run prisma migrate deploy.
- Configured Render’s build command to execute: **npm install && npm run postdeploy**  
- Redeployed, which successfully ran Prisma migrations against the hosted DB.
- Verified functionality by registering and logging in users via the frontend. 

### Outcome
- Backend and database now deploy cleanly to Render with automatic migrations.
- Authentication (register/login) works on the live system, proving the database is properly synced.
- Learned how to adapt local-only workflows (like migrations) to cloud deployment environments with limited access.