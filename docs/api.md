# API Reference

All API requests must include a Bearer token in the `Authorization` header for protected endpoints.

## Authentication
| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register a new user |
| `/api/auth/login` | `POST` | Public | Login and receive JWT |

## Product Catalog
| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/products` | `GET` | Auth | List all products in the catalog |
| `/api/products` | `POST` | Admin | Create a new product |

## Quotes
| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/quotes` | `POST` | Auth | Create a new quote |
| `/api/quotes` | `GET` | Auth | List quotes for current user |
| `/api/quotes/:id` | `GET` | Auth | Get detailed quote view |
| `/api/quotes/:id/version` | `POST` | Auth | Create a new version of a quote |
| `/api/quotes/:id/pdf` | `GET` | Auth | Download PDF export |

### Quote Request Body (POST `/api/quotes`)
```json
{
  "quoteNumber": "Q-2026-001",
  "customerId": "CUST-123",
  "status": "Draft",
  "items": [
    { "productId": "SKU-123", "quantity": 2 }
  ]
}
```
