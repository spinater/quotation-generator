# Entity: Quotation Management

## Overview

Quotation management is a core feature of the Thai Quotation Generator that handles the creation, storage, retrieval, and PDF generation of Thai quotations (ใบเสนอราคา).

## Core Responsibilities

1. **Create Quotations**: Generate new quotation documents with items, pricing, and customer information
2. **Store Quotations**: Persist quotation data in PostgreSQL database
3. **Retrieve Quotations**: Fetch historical quotations for viewing and editing
4. **Generate PDFs**: Create professional PDF documents with Thai fonts and bilingual support
5. **Calculate Totals**: Handle automatic calculations for subtotals, VAT, and grand totals
6. **Number Generation**: Auto-generate unique quotation numbers

## Data Structure

### Quotation Model

```typescript
interface Quotation {
  id: string;                    // UUID primary key
  quotationNumber: string;       // Auto-generated (e.g., "QT-2024-0001")
  companyId: string;            // Foreign key to Company
  
  // Customer Information
  customerName: string;
  customerAddress: string;
  customerTaxId?: string;       // Optional
  customerPhone?: string;       // Optional
  
  // Dates
  issueDate: Date;
  validUntil: Date;
  
  // Financial
  subtotal: number;             // Sum of all items
  vatAmount: number;            // 7% VAT (if applicable)
  total: number;                // Subtotal + VAT
  
  // Additional
  notes?: string;
  language: 'th' | 'en';        // Thai or English
  
  // Relations
  items: QuotationItem[];
  company?: Company;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Quotation Item Model

```typescript
interface QuotationItem {
  id: string;
  quotationId: string;
  description: string;          // Item description (multi-line supported)
  quantity: number;
  unit: string;                 // e.g., "ชิ้น", "เครื่อง", "บาท"
  pricePerUnit: number;
  amount: number;               // quantity × pricePerUnit
  order: number;                // For sorting items
  parentItemId?: string;        // For sub-items
  subItems?: QuotationItem[];   // Nested sub-items
}
```

## Key Features

### 1. Auto-Number Generation

Quotation numbers follow the pattern: `QT-YYYY-NNNN`
- `QT` = Quotation prefix
- `YYYY` = Current year
- `NNNN` = Sequential number (padded to 4 digits)

Example: `QT-2024-0001`, `QT-2024-0002`, etc.

### 2. Sub-Items Support

Quotations support hierarchical item structure:
- Main items (parentItemId = null)
- Sub-items (parentItemId = main item id)
- Sub-items displayed with indentation in PDF
- Each sub-item has its own quantity and unit

### 3. VAT Calculation

- VAT is optional (can be toggled)
- VAT rate: 7% (standard Thai VAT)
- Calculation: `vatAmount = subtotal × 0.07`
- Total: `total = subtotal + vatAmount`

### 4. Thai Bahttext Conversion

Amount in words (Thai):
- Example: 1,234.56 → "หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์"
- Uses `bahttext` utility function
- Displayed at bottom of quotation PDF

### 5. Bilingual Support

- Default language: Thai (`th`)
- Optional: English (`en`)
- All labels translated
- Date formatting localized
- Number formatting localized

## PDF Generation

### Technology

- Library: `@react-pdf/renderer`
- Fonts: Sarabun (primary), NotoSansThai (fallback)
- Font registration required before PDF generation

### Layout Features

- Company logo and details (top left)
- Quotation title and number (top right)
- Customer information section
- Items table with columns:
  - No. (ลำดับ)
  - Description (รายการ)
  - Quantity (จำนวน)
  - Unit (หน่วย)
  - Price/Unit (ราคาต่อหน่วย)
  - Amount (จำนวนเงิน)
- Sub-items with indentation
- Totals section (subtotal, VAT, total)
- Amount in words (Thai bahttext)
- Notes section
- Signature section
- Bank details (optional)

### Known Issues

**Postal Code Truncation:**
- Thai addresses with postal codes may truncate in PDF
- Example: "40000" may appear as "400"
- Root cause: @react-pdf/renderer Thai/number word-break issue
- **Workaround**: Add 2 trailing spaces to address strings
- Data is intact; issue is rendering only

## API Endpoints

### Create Quotation
```
POST /api/quotations
Body: { companyId, customer info, items, dates, etc. }
Response: Created quotation with generated ID and number
```

### Get Quotations
```
GET /api/quotations?page=1&limit=10&companyId=xxx
Response: Paginated list of quotations
```

### Get Quotation by ID
```
GET /api/quotations/[id]
Response: Single quotation with all items and company details
```

### Update Quotation
```
PUT /api/quotations/[id]
Body: Updated quotation data
Response: Updated quotation
```

### Delete Quotation
```
DELETE /api/quotations/[id]
Response: Success confirmation
```

### Get Next Number
```
GET /api/quotations/next-number?year=2024
Response: { nextNumber: "QT-2024-0042" }
```

## Business Rules

1. **Required Fields**:
   - Company ID (must exist)
   - Customer name
   - Customer address
   - Issue date
   - Valid until date
   - At least one item

2. **Optional Fields**:
   - Customer tax ID
   - Customer phone
   - Notes

3. **Validation**:
   - Valid until must be after issue date
   - All numeric values must be >= 0
   - Item quantities must be > 0
   - Price per unit must be >= 0

4. **Calculations**:
   - Item amount = quantity × pricePerUnit
   - Subtotal = sum of all main item amounts
   - VAT amount = subtotal × 0.07 (if VAT enabled)
   - Total = subtotal + VAT amount

5. **Soft Delete** (optional):
   - Consider implementing soft delete instead of hard delete
   - Add `deletedAt` field
   - Filter out deleted records in queries

## Integration Points

### Dependencies
- Company Management (requires valid company)
- PDF Generation (fonts, rendering)
- Database (Prisma + PostgreSQL)

### Used By
- Quotation Form UI
- Quotation List Page
- Quotation Detail Page
- PDF Preview/Download

## Performance Considerations

1. **Pagination**: Always paginate quotation lists
2. **Indexing**: Index on quotationNumber, companyId, createdAt
3. **Eager Loading**: Include company and items in single query when needed
4. **Caching**: Consider caching company details (rarely change)
5. **PDF Generation**: Generate PDFs on-demand, don't pre-generate

## Security Considerations

1. Validate all user inputs
2. Sanitize customer data before storage
3. Prevent SQL injection (Prisma handles this)
4. Implement rate limiting for PDF generation
5. Consider authentication/authorization (future)
6. Don't expose internal IDs in URLs (use UUIDs)

## Testing Requirements

1. **Unit Tests**:
   - Number generation logic
   - Calculation functions
   - Validation functions
   - Bahttext conversion

2. **Integration Tests**:
   - API endpoints
   - Database operations
   - PDF generation

3. **E2E Tests**:
   - Create quotation flow
   - Edit quotation flow
   - View quotation PDF

## Future Enhancements

1. Quotation templates
2. Duplicate quotation feature
3. Convert quotation to invoice
4. Email quotation PDF
5. Quotation status tracking (draft, sent, accepted, rejected)
6. Quotation expiry notifications
7. Multi-currency support
8. Discount support
9. Tax exemption support
10. Attachment support (images, documents)

## Related Entities

- [Company Management](./company-management.md)
- [Receipt Management](./receipt-management.md)
- [PDF Generation](./pdf-generation.md)
- [Database Schema](./database-schema.md)

## Last Updated

Created: 2024-01-XX
Updated: 2024-01-XX