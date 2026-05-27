# ProductHubb System Walkthrough Script

This script is designed for a high-level product demo or a recorded video walkthrough. It focuses on the "Golden Path" of a user creating a professional quote.

---

## Scene 1: Authentication & Entry
**Visual:** The Login Page (`/login`). User enters credentials and clicks "Sign In".
**Narration:** 
"Welcome to ProductHubb, our production-grade quoting system. We start at the secure login gateway. The system uses JWT-based authentication with Role-Based Access Control to ensure that only authorized sales representatives and managers can access sensitive pricing and client data."
**Technical Highlight:** 
- Secure session management.
- RBAC ensuring data isolation between different user roles.

---

## Scene 2: The Product Catalog
**Visual:** The Catalog Page (`/catalog`). A searchable list of products with prices and SKUs.
**Narration:**
"Once inside, we land on the Product Catalog. This is the single source of truth for our pricing. Instead of manual entry, sales reps browse a curated list of products. Each item here is synchronized across the platform using our shared type system, ensuring that the base price seen here is exactly what gets injected into the final quote."
**Technical Highlight:**
- Centralized product management.
- Use of `packages/shared` for consistent product schemas.

---

## Scene 3: Building the Quote
**Visual:** New Quote Editor (`/quotes/new`). User adding products from the catalog to the quote, adjusting quantities.
**Narration:**
"Now, let's create a new quote. The editor is designed for speed and accuracy. As we add products, the system calculates subtotals and taxes in real-time. Notice the immutable versioning—every time a quote is updated, we maintain a snapshot of the prices used, protecting us from mid-deal price fluctuations in the main catalog."
**Technical Highlight:**
- Real-time state management via Zustand/TanStack Query.
- Immutable price snapshotting in the `QuoteModel`.

---

## Scene 4: Review & Finalization
**Visual:** Quote Detail View (`/quotes/[id]`). A polished summary of the quote, showing total, tax, and valid-until date.
**Narration:**
"Finally, we arrive at the Quote Detail view. This is the professional face of the deal. From here, the system generates a server-side PDF that is ready for the customer. The quote is now tracked in our database with a specific status—starting as a 'Draft' and moving toward 'Sent' once the manager approves the terms."
**Technical Highlight:**
- Server-side PDF generation.
- Status-driven workflow (Draft $\rightarrow$ Sent $\rightarrow$ Approved).

---

## Closing: The Vision
**Visual:** Transition to the Build Roadmap or a "Thank You" slide.
**Narration:**
"What you've seen is the foundation. Our roadmap includes advanced tiered pricing, automated tax engines for different regions, and an AI-assisted quoting engine to help our team suggest the most winning product bundles. ProductHubb isn't just a generator; it's a strategic sales asset."
