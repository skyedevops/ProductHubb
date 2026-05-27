# ProductHubb Detailed Build Roadmap

This document translates the high-level strategic roadmap into a technical implementation plan.

## Phase 2: Refinement & Business Logic (Short Term)

### 2.1 Advanced Pricing Engine
**Goal:** Move from simple unit pricing to a flexible pricing model.
- **Backend Changes:**
    - Update `QuoteItemSchema` to include `discountType` ('percentage' | 'flat') and `discountValue`.
    - Implement `PricingService` to handle tiered pricing logic (e.g., 1-10 units: $100, 11-50: $90).
    - Add validation to ensure discounts don't result in negative totals.
- **Frontend Changes:**
    - Update Quote Editor to allow selecting discount types per line item.
    - Add "Global Discount" field to the quote summary.
- **Milestone:** Ability to generate a quote with a mix of percentage and flat discounts.

### 2.2 Dynamic Tax Engine
**Goal:** Implement accurate, region-aware tax calculations.
- **Backend Changes:**
    - Create `TaxService` to calculate taxes based on `customerId`'s registered address.
    - Define a tax rule schema in MongoDB for different regions (e.g., NY: 8.875%, CA: 7.25%).
    - Update `QuoteModel` to store a breakdown of taxes used for auditability.
- **Frontend Changes:**
    - Display the specific tax rule applied (e.g., "Sales Tax - New York").
- **Milestone:** Quotes automatically calculating tax based on the client's location.

### 2.3 Quote Approval Workflow
**Goal:** Implement a formal review process for high-value quotes.
- **Backend Changes:**
    - Extend `Quote` status enum: `Draft` $\rightarrow$ `PendingApproval` $\rightarrow$ `Approved` $\rightarrow$ `Sent` $\rightarrow$ `Expired`.
    - Create `ApprovalService` to handle status transitions and permission checks (only Managers can approve).
    - Implement a notification trigger (e.g., internal log or email) when a quote enters `PendingApproval`.
- **Frontend Changes:**
    - Add "Request Approval" button for Sales Reps.
    - Create a "Pending Approvals" dashboard for Managers.
- **Milestone:** A quote cannot be "Sent" to a customer until it is in `Approved` status.

### 2.4 UI/UX Polish: The "Power Editor"
**Goal:** Drastically reduce the time to create a professional quote.
- **Frontend Changes:**
    - Implement a full-screen, distraction-free editor.
    - Add drag-and-drop functionality for reordering items.
    - Implement "Quick Search" for products within the editor.
    - Real-time total updates as quantities/discounts change.
- **Milestone:** Reducing the "Click-to-Quote" time by an estimated 50%.

### 2.5 Client Management (Basic CRM)
**Goal:** Centralize customer data.
- **Backend Changes:**
    - Create `Client` model: Name, Company, Address, Email, Phone, TaxID.
    - Implement `ClientRepository` and `ClientService`.
    - Link `Quote` to `Client` via `clientId` (replacing the simple `customerId` string).
- **Frontend Changes:**
    - New "Clients" page with a searchable list.
    - Client detail page showing all associated quotes.
- **Milestone:** Full CRUD for clients with integrated quote history.

---

## Phase 3: Integration & Automation (Mid Term)

### 3.1 Email & Delivery Integration
- **Tech:** AWS SES / SendGrid.
- **Requirement:** Direct PDF delivery with a tracking link to a "View Quote" public page.

### 3.2 External CRM Sync
- **Tech:** Salesforce/HubSpot APIs.
- **Requirement:** Sync `Client` and `Quote` data to the external CRM upon "Approval".

### 3.3 Multi-Tenancy Isolation
- **Requirement:** Implement a global `companyId` filter on all MongoDB queries to support B2B SaaS multi-tenancy.

### 3.4 Electronic Signatures
- **Tech:** DocuSign / HelloSign.
- **Requirement:** Convert `Approved` quotes into signable documents.

---

## Phase 4: Intelligence & Scaling (Long Term)

### 4.1 Analytics & Forecasting
- **Requirement:** Build a dashboard using MongoDB Aggregation pipelines to track win/loss ratios and product demand.

### 4.2 AI-Assisted Quoting
- **Requirement:** Integrate LLM to analyze historical quotes and suggest optimal product bundles based on customer profile.
