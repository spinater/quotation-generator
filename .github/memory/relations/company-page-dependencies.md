# Company Data Page Dependencies

**Entity:** Company
**Category:** Data Dependencies & Cache Relations
**Last Updated:** 2024-01-20

## Overview

This document maps the dependency relationships between Company data and the pages that consume it. Understanding these dependencies is critical for proper cache invalidation in Next.js 15 App Router.

---

## Dependency Graph

```
┌─────────────────────┐
│   Company (DB)      │
│  - Prisma Model     │
│  - PostgreSQL       │
└──────────┬──────────┘
           │
           │ Actions (CRUD)
           │ lib/actions/companies.ts
           │
           ├──────────────────────────────────────────────────────┐
           │                                                      │
           ▼                                                      ▼
    ┌─────────────┐                                    ┌──────────────────┐
    │  Mutations  │                                    │      Reads       │
    │  (Write)    │                                    │     (Read)       │
    └─────────────┘                                    └──────────────────┘
           │                                                      │
           │                                                      │
           ├─ createCompany()                                    ├─ getCompanies()
           ├─ updateCompany()                                    ├─ getCompanyById()
           ├─ deleteCompany()                                    └─ getDefaultCompany()
           └─ setDefaultCompany()                                         │
                     │                                                    │
                     │                                                    │
                     │ ⚠️ MUST INVALIDATE ALL DEPENDENT PAGES            │
                     │                                                    │
                     └────────────────────────────────────────────────────┘
                                           │
                     ┌─────────────────────┼─────────────────────┐
                     │                     │                     │
                     ▼                     ▼                     ▼
            ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
            │  Invoice Pages │   │ Quotation Pages│   │ Receipt Pages  │
            └────────────────┘   └────────────────┘   └────────────────┘
                     │                     │                     │
                     ▼                     ▼                     ▼
            /invoice/new         /quotation/new         /receipt/new
            (Select Company)     (Select Company)       (Select Company)
```

---

## Pages That Read Company Data

### 1. Company Management (Direct CRUD)

**Path:** `/settings/companies`
**Type:** Server Component
**Data Access:** `getCompanies()`
**Purpose:** List, create, edit, delete companies
**Revalidation:** ✅ Required on all mutations

---

### 2. Invoice Creation

**Path:** `/invoice/new`
**Type:** Server Component
**Data Access:** `prisma.company.findMany()`
**Purpose:** Select company for new invoice
**Usage:** Dropdown selector, display company details
**Revalidation:** ✅ Required on all mutations

**Why:** Users need to see latest company list when creating invoices

---

### 3. Quotation Creation

**Path:** `/quotation/new`
**Type:** Server Component
**Data Access:** `prisma.company.findMany()`
**Purpose:** Select company for new quotation
**Usage:** Dropdown selector, display company details
**Revalidation:** ✅ Required on all mutations

**Why:** Users need to see latest company list when creating quotations

---

### 4. Receipt Creation

**Path:** `/receipt/new`
**Type:** Server Component
**Data Access:** `getCompanies()`
**Purpose:** Select company for new receipt
**Usage:** Dropdown selector, display company details
**Revalidation:** ✅ Required on all mutations

**Why:** Users need to see latest company list when creating receipts

---

### 5. Homepage (Dashboard)

**Path:** `/`
**Type:** Server Component (likely)
**Data Access:** May show default company or company count
**Revalidation:** ✅ Required on mutations (if displays company data)

---

## Revalidation Matrix

| Action              | /settings/companies | /invoice/new | /quotation/new | /receipt/new | / (home) |
|---------------------|---------------------|--------------|----------------|--------------|----------|
| createCompany()     | ✅ Required         | ✅ Required  | ✅ Required    | ✅ Required  | ✅ Yes   |
| updateCompany()     | ✅ Required         | ✅ Required  | ✅ Required    | ✅ Required  | ✅ Yes   |
| deleteCompany()     | ✅ Required         | ✅ Required  | ✅ Required    | ✅ Required  | ✅ Yes   |
| setDefaultCompany() | ✅ Required         | ✅ Required  | ✅ Required    | ✅ Required  | ✅ Yes   |

---

## Implementation

### Current Implementation (Fixed)

All company mutation actions now call:

```typescript
revalidatePath("/settings/companies");
revalidatePath("/");
revalidatePath("/invoice/new");
revalidatePath("/quotation/new");
revalidatePath("/receipt/new");
```

### Pattern

```typescript
// After any mutation that changes company data:
export async function mutateCompany(data: any) {
  try {
    // ... perform mutation ...
    
    // Invalidate all pages that depend on company data
    revalidateCompanyDependencies();
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "..." };
  }
}
```

---

## Future Document Pages

When adding new document types, remember to:

1. Add revalidation paths to company actions
2. Update this dependency map
3. Test that new companies appear without refresh

Example:
- `/estimate/new` → Add to revalidation list
- `/proforma/new` → Add to revalidation list
- `/purchase-order/new` → Add to revalidation list

---

## Related Entities

### Company → Quotation
- **Relation:** One-to-Many
- **FK:** `Quotation.companyId`
- **Pages:** `/quotation`, `/quotation/[id]`, `/quotation/new`
- **Constraint:** Cannot delete company with existing quotations

### Company → Receipt
- **Relation:** One-to-Many
- **FK:** `Receipt.companyId`
- **Pages:** `/receipt`, `/receipt/[id]`, `/receipt/new`
- **Constraint:** Cannot delete company with existing receipts

### Company → Invoice
- **Relation:** One-to-Many
- **FK:** `Invoice.companyId`
- **Pages:** `/invoice`, `/invoice/[id]`, `/invoice/new`
- **Constraint:** Cannot delete company with existing invoices

---

## Cache Invalidation Strategy

### Current Strategy: Path-Based Revalidation

**Advantages:**
- Simple and explicit
- Easy to understand and maintain
- No over-invalidation
- Good for this application size

**Disadvantages:**
- Must remember to update all actions when adding new pages
- Can miss pages if not careful
- Requires manual maintenance

### Alternative: Tag-Based Revalidation

Could refactor to:

```typescript
// Tag company data
const companies = await prisma.company.findMany({
  // ... options
});
unstable_cache(companies, ['companies']);

// Invalidate by tag
revalidateTag('companies');
```

**Advantages:**
- Single tag for all company dependencies
- Automatic coverage of all pages using that tag

**Disadvantages:**
- More complex initial setup
- Need to tag all queries consistently

---

## Best Practices

1. **Always revalidate after mutations**
   - Create, update, delete, status changes
   - Don't forget related pages

2. **Document new dependencies**
   - Update this file when adding new pages
   - Keep revalidation list in sync

3. **Test without browser refresh**
   - After mutations, navigate to dependent pages
   - Verify fresh data without F5

4. **Consider centralization**
   - If paths list grows too large
   - Extract to `revalidateCompanyPages()` helper

---

## Testing Checklist

When testing company CRUD operations:

- [ ] Company list updates in `/settings/companies`
- [ ] New company appears in `/invoice/new` dropdown
- [ ] New company appears in `/quotation/new` dropdown
- [ ] New company appears in `/receipt/new` dropdown
- [ ] Updated company name reflects in all dropdowns
- [ ] Deleted company removed from all dropdowns
- [ ] Default company selection changes appropriately
- [ ] No browser refresh needed for any of above

---

## Related Documentation

- `.github/memory/observations/company-cache-revalidation-fix.md`
- `.github/tasks/task-2024-company-select-refresh-fix.md`
- `lib/actions/companies.ts` (implementation)
- Next.js Revalidation: https://nextjs.org/docs/app/api-reference/functions/revalidatePath

---

## Keywords

`company`, `dependencies`, `cache-invalidation`, `revalidation`, `server-components`, `nextjs`, `page-dependencies`, `data-flow`
