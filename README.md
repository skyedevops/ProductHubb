# ProductHubb 🚀

ProductHubb is a high-performance, production-grade quoting system designed for scalable business operations. It allows sales teams to manage product catalogs, generate versioned quotes, and export official PDF documents for clients.

## 🏗 Architecture Overview

ProductHubb is implemented as a **Monorepo** managed by **Turborepo**, ensuring strict type safety and shared logic across the entire stack.

- **Frontend (`apps/web`)**: Next.js (App Router) with Tailwind CSS and shadcn/ui.
- **Backend (`apps/api`)**: Node.js/Express with TypeScript and MongoDB (via Mongoose).
- **Shared (`packages/shared`)**: Zod schemas and TypeScript interfaces.
- **Infrastructure (`infra/`)**: AWS Infrastructure as Code via Terraform.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (Local or Atlas)
- AWS Account (for deployment)

### Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in `apps/api`:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/producthubb
   JWT_SECRET=your-secret-key
   ```

3. **Run Development Mode**:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3001` and the frontend at `http://localhost:3000`.

## 🛠 Tech Stack
- **Language**: TypeScript
- **Frontend**: React, Next.js, TanStack Query, Zustand
- **Backend**: Express, Mongoose, Zod, PDFKit
- **Infrastructure**: AWS (ECS Fargate, DocumentDB, S3, VPC)
- **CI/CD**: GitLab CI

## 📜 Development Standards
Refer to [CLAUDE.md](./CLAUDE.md) for detailed naming conventions, commit standards, and architectural guardrails.
