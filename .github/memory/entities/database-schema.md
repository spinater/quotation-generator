# Entity: Database Schema

## Overview

The database schema for the Thai Quotation & Receipt Generator is designed to support multi-company document management, hierarchical item structures, and comprehensive document tracking.

## Database Technology

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Migration Strategy**: Prisma Migrate
- **Schema Location**: `prisma/schema.prisma`

## Core Models

### 1. Company Model

**Purpose**: Store company information for generating quotations and receipts.

**Fields**:
```prisma
model Company {
  id        String   @id @default(uuid())
  
  // Company Details
  name      String   // Thai company name
  nameEn    String?  // English company name (optional)
  taxId     String   @unique
  address   String   @db.Text
  phone     String
  email     String?
  
  // Bank Details
  bankName           String?
  bankAccountNumber  String?
  bankAccountName    String?
  
  // Logo
  logo      String?  @db.Text // URL or base64
  
  // Default Flag
  isDefault Boolean  @default(false)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  quotations Quotation[]
  receipts   Receipt[]
}
```

**Key Features**:
- UUID primary key for security
- Unique tax ID constraint
- Optional English name for bilingual support
- Optional bank details for PDF display
- Logo stored as URL or base64
- `isDefault` flag for quick access to default company
- One-to-many relationships with quotations and receipts

**Indexes**:
- `isDefault` - Fast lookup of default company
- `taxId` - Unique constraint and fast lookup

**Business Rules**:
- Only one company should have `isDefault = true` at a time
- Tax ID must be unique across all companies
- Address should include 2 trailing spaces for PDF rendering workaround

### 2. Quotation Model

**Purpose**: Store quotation documents (ใบเสนอราคา).

**Fields**:
```prisma
model Quotation {
  id              String   @id @default(uuid())
  quotationNumber String   @unique
  
  // Company Reference
  companyId       String
  company         Company  @relation(...)
  
  // Customer Information
  customerName    String
  customerAddress String   @db.Text
  customerTaxId   String?
  customerPhone   String?
  
  // Dates
  issueDate       DateTime @default(now())
  validUntil      DateTime
  
  // Financial
  subtotal        Float    @default(0)
  vatAmount       Float    @default(0)
  total           Float    @default(0)
  hasVat          Boolean  @default(true)
  
  // Additional
  notes           String?  @db.Text
  language        String   @default("th")
  
  // Signature
  signatureUrl    String?  @db.Text
  signatureName   String?
  signatureTitle  String?
  
  // Status
  status          String   @default("draft")
  
  // Soft Delete
  deletedAt       DateTime?
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  items           QuotationItem[]
}
```

**Key Features**:
- Auto-generated quotation number (QT-YYYY-NNNN)
- Foreign key to Company (cascade delete)
- Optional customer tax ID and phone
- VAT toggle with amount storage
- Multi-line notes support
- Signature support for PDF
- Status tracking (draft, sent, accepted, rejected, expired)
- Soft delete capability (deletedAt)
- One-to-many relationship with items

**Indexes**:
- `quotationNumber` - Unique constraint and fast lookup
- `companyId` - Fast filtering by company
- `customerName` - Search functionality
- `issueDate` - Date range queries
- `status` - Filter by status
- `deletedAt` - Filter active/deleted records

**Business Rules**:
- Quotation number must be unique
- Valid until date must be after issue date
- Subtotal = sum of all item amounts
- VAT amount = subtotal × 0.07 (if hasVat = true)
- Total = subtotal + vatAmount
- Cascade delete items when quotation is deleted

### 3. QuotationItem Model

**Purpose**: Store individual line items in quotations with hierarchical structure support.

**Fields**:
```prisma
model QuotationItem {
  id            String    @id @default(uuid())
  
  // Quotation Reference
  quotationId   String
  quotation     Quotation @relation(...)
  
  // Item Details
  description   String    @db.Text
  quantity      Float     @default(1)
  unit          String
  pricePerUnit  Float     @default(0)
  amount        Float     @default(0)
  
  // Hierarchy
  order         Int       @default(0)
  parentItemId  String?
  
  // Self-referential Relations
  parent        QuotationItem?  @relation("QuotationItemHierarchy", ...)
  subItems      QuotationItem[] @relation("QuotationItemHierarchy")
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Key Features**:
- Multi-line description support
- Decimal quantities (for partial units)
- Flexible unit names (Thai/English)
- Pre-calculated amount (quantity × pricePerUnit)
- Order field for custom sorting
- Self-referential hierarchy for sub-items
- Cascade delete when parent quotation or parent item is deleted

**Indexes**:
- `quotationId` - Fast filtering by quotation
- `parentItemId` - Fast lookup of sub-items
- `order` - Efficient sorting

**Business Rules**:
- Main items have `parentItemId = null`
- Sub-items reference parent via `parentItemId`
- Amount should always equal `quantity × pricePerUnit`
- Order determines display sequence in PDF
- Sub-items cascade delete with parent item

### 4. Receipt Model

**Purpose**: Store receipt documents (ใบเสร็จรับเงิน).

**Fields**:
```prisma
model Receipt {
  id            String   @id @default(uuid())
  receiptNumber String   @unique
  
  // Company Reference
  companyId     String
  company       Company  @relation(...)
  
  // Customer Information
  customerName    String
  customerAddress String   @db.Text
  customerTaxId   String?
  customerPhone   String?
  
  // Date
  issueDate       DateTime @default(now())
  
  // Financial
  subtotal        Float    @default(0)
  vatAmount       Float    @default(0)
  total           Float    @default(0)
  hasVat          Boolean  @default(true)
  
  // Payment
  paymentMethod   String?
  paymentDate     DateTime?
  
  // Additional
  notes           String?  @db.Text
  language        String   @default("th")
  
  // Signature
  signatureUrl    String?  @db.Text
  signatureName   String?
  signatureTitle  String?
  
  // Reference
  quotationId     String?
  
  // Soft Delete
  deletedAt       DateTime?
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  items           ReceiptItem[]
}
```

**Key Features**:
- Auto-generated receipt number (RC-YYYY-NNNN)
- Similar structure to Quotation
- Payment method and date tracking
- Optional reference to originating quotation
- All same features as quotation (VAT, signature, soft delete)

**Indexes**:
- `receiptNumber` - Unique constraint and fast lookup
- `companyId` - Fast filtering by company
- `customerName` - Search functionality
- `issueDate` - Date range queries
- `deletedAt` - Filter active/deleted records

**Business Rules**:
- Receipt number must be unique
- Financial calculations same as quotation
- Can optionally reference a quotation ID
- Payment method examples: "cash", "transfer", "cheque"

### 5. ReceiptItem Model

**Purpose**: Store individual line items in receipts with hierarchical structure support.

**Fields**: (Same structure as QuotationItem)

```prisma
model ReceiptItem {
  id            String  @id @default(uuid())
  
  // Receipt Reference
  receiptId     String
  receipt       Receipt @relation(...)
  
  // Item Details
  description   String  @db.Text
  quantity      Float   @default(1)
  unit          String
  pricePerUnit  Float   @default(0)
  amount        Float   @default(0)
  
  // Hierarchy
  order         Int     @default(0)
  parentItemId  String?
  
  // Self-referential Relations
  parent        ReceiptItem?  @relation("ReceiptItemHierarchy", ...)
  subItems      ReceiptItem[] @relation("ReceiptItemHierarchy")
  
  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Key Features**: (Same as QuotationItem)

## Relationships

### Entity Relationship Diagram

```
Company (1) ──< (N) Quotation
Company (1) ──< (N) Receipt

Quotation (1) ──< (N) QuotationItem
Receipt (1) ──< (N) ReceiptItem

QuotationItem (parent) ──< (N) QuotationItem (children) [self-referential]
ReceiptItem (parent) ──< (N) ReceiptItem (children) [self-referential]

Quotation (1) ─── (0..1) Receipt [optional reference]
```

### Relationship Details

1. **Company → Quotations**: One-to-Many (cascade delete)
2. **Company → Receipts**: One-to-Many (cascade delete)
3. **Quotation → QuotationItems**: One-to-Many (cascade delete)
4. **Receipt → ReceiptItems**: One-to-Many (cascade delete)
5. **QuotationItem → SubItems**: Self-referential (cascade delete)
6. **ReceiptItem → SubItems**: Self-referential (cascade delete)
7. **Quotation ← Receipt**: Optional reference (no foreign key constraint)

## Data Types

### Field Type Choices

- **IDs**: UUID (`@default(uuid())`) for security and uniqueness
- **Text Fields**: `String` for short text, `@db.Text` for long content
- **Numbers**: `Float` for financial values (supports decimals)
- **Dates**: `DateTime` with timezone support
- **Booleans**: `Boolean` for flags
- **Optional**: Fields marked with `?` are nullable

### Financial Precision

**Important**: Using `Float` for financial values. Consider these points:

- PostgreSQL stores as `DOUBLE PRECISION`
- Sufficient for typical quotation/receipt amounts
- For high-precision requirements, consider `Decimal` type
- Always round display values to 2 decimal places
- Calculate totals in backend, not client-side

**Example Calculation**:
```typescript
const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
const vatAmount = hasVat ? subtotal * 0.07 : 0;
const total = subtotal + vatAmount;

// Round to 2 decimals
const roundedTotal = Math.round(total * 100) / 100;
```

## Auto-Number Generation

### Quotation Number Format

Pattern: `QT-YYYY-NNNN`
- `QT` = Prefix for quotations
- `YYYY` = Current year (4 digits)
- `NNNN` = Sequential number (4 digits, zero-padded)

Example: `QT-2024-0001`, `QT-2024-0002`, ..., `QT-2024-9999`

### Receipt Number Format

Pattern: `RC-YYYY-NNNN`
- `RC` = Prefix for receipts
- `YYYY` = Current year (4 digits)
- `NNNN` = Sequential number (4 digits, zero-padded)

Example: `RC-2024-0001`, `RC-2024-0002`, ..., `RC-2024-9999`

### Implementation Logic

```typescript
async function getNextQuotationNumber(year: number): Promise<string> {
  const prefix = `QT-${year}-`;
  
  // Find highest number for this year
  const lastQuotation = await prisma.quotation.findFirst({
    where: {
      quotationNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      quotationNumber: 'desc'
    }
  });
  
  let nextNumber = 1;
  if (lastQuotation) {
    const lastNumber = parseInt(lastQuotation.quotationNumber.split('-')[2]);
    nextNumber = lastNumber + 1;
  }
  
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
}
```

## Indexes and Performance

### Index Strategy

1. **Primary Keys**: Automatic B-tree index on all `@id` fields
2. **Unique Constraints**: Automatic unique index on `@unique` fields
3. **Foreign Keys**: Automatic index on relation fields
4. **Custom Indexes**: Added via `@@index([field])` for query optimization

### Query Performance Tips

1. **Always include company filter** when listing documents
2. **Use pagination** for large result sets
3. **Eager load relations** when needed (avoid N+1 queries)
4. **Use soft delete filtering** in all queries
5. **Index date ranges** for reporting queries

### Example Optimized Query

```typescript
// Good: Single query with pagination and eager loading
const quotations = await prisma.quotation.findMany({
  where: {
    companyId: selectedCompanyId,
    deletedAt: null, // Only active records
  },
  include: {
    company: true,
    items: {
      where: { parentItemId: null }, // Only main items
      include: {
        subItems: true, // Eager load sub-items
      },
      orderBy: { order: 'asc' },
    },
  },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: (page - 1) * 20,
});
```

## Migration Strategy

### Initial Migration

```bash
# Create database and tables
npx prisma migrate dev --name init
```

### Schema Changes

```bash
# After modifying schema.prisma
npx prisma migrate dev --name description_of_change
```

### Production Deployment

```bash
# Apply migrations in production
npx prisma migrate deploy
```

### Reset Database (Development Only)

```bash
# WARNING: Deletes all data!
npx prisma migrate reset
```

## Seeding Strategy

### Default Data

Seed script should create:
1. One default company
2. Example quotation (optional)
3. Example receipt (optional)

### Seed Script Location

`prisma/seed.ts` - Executed via `npm run prisma:seed`

## Data Validation

### Application-Level Validation

Use Zod for API validation:

```typescript
import { z } from 'zod';

const quotationSchema = z.object({
  companyId: z.string().uuid(),
  customerName: z.string().min(1),
  customerAddress: z.string().min(1),
  issueDate: z.date(),
  validUntil: z.date(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().positive(),
    unit: z.string().min(1),
    pricePerUnit: z.number().nonnegative(),
  })).min(1),
});
```

### Database Constraints

- Unique constraints on numbers
- Foreign key constraints
- Not null constraints on required fields
- Default values where appropriate

## Backup and Recovery

### Backup Strategy

1. Regular PostgreSQL backups
2. Prisma migration history in version control
3. Seed scripts for reference data

### Recovery Process

1. Restore PostgreSQL backup
2. Run `npx prisma generate`
3. Verify data integrity
4. Run seed script if needed

## Future Enhancements

### Potential Schema Changes

1. **Add User/Authentication**
   - User model
   - Role-based access control
   - Audit logging

2. **Add Templates**
   - QuotationTemplate model
   - Reusable item lists

3. **Add Attachments**
   - Attachment model
   - File storage integration

4. **Add Comments/Notes**
   - Comment model
   - Activity tracking

5. **Add Multi-Currency**
   - Currency field
   - Exchange rate tracking

6. **Add Discounts**
   - Discount field on items
   - Discount types (percent, fixed)

## Related Documentation

- [Quotation Management Entity](./quotation-management.md)
- [Receipt Management Entity](./receipt-management.md)
- [API Endpoints Documentation](../../docs/api/)

## Last Updated

Created: 2024-01-XX
Updated: 2024-01-XX