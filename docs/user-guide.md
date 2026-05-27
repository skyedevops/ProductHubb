# User Guide: Quoting System

## Creating a Quote
1. Navigate to **Quotes** $\rightarrow$ **Create New Quote**.
2. Enter the **Quote Number** (internal reference) and **Customer ID**.
3. Use the **Product Catalog** sidebar to add items to your quote.
4. Adjust quantities in the table. The system automatically calculates the subtotal, 10% tax, and grand total.
5. Click **Create Quote** to save the draft.

## Managing Versions
ProductHubb uses **Immutable Versioning** to maintain an audit trail of what was sent to customers.

- **Drafts**: You can edit quotes freely while they are in `Draft` status.
- **Versioning**: When you need to modify a quote that has already been sent or approved, use the **Create New Version** button.
- **Result**: The system creates a new record (e.g., `Q-001_v2`) linked to the original. The original quote remains unchanged, preserving the historical record of what the customer was previously quoted.

## Exporting PDFs
To generate an official document for a client:
1. Open the **Quote Details** page.
2. Click the **Download PDF** (or use the `/api/quotes/:id/pdf` endpoint).
3. The generated PDF includes all laenest product snapshots, calculations, and version metadata.
