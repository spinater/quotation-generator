# Observation: PDF Null Handling in @react-pdf/renderer

**Category:** Technical Issue / Best Practice
**Date:** 2025-01-21
**Severity:** High (Caused runtime errors)
**Status:** Resolved

---

## Summary

The `@react-pdf/renderer` library has strict requirements for valid React children. Passing `null`, `undefined`, or boolean values as children causes internal errors like:

```
TypeError: Cannot read properties of null (reading 'props')
```

This observation documents safe patterns for conditional rendering in PDF components.

---

## The Problem

### Error Manifestation

```javascript
// Browser console error:
installHook.js:1 Error generating PDF preview: 
TypeError: Cannot read properties of null (reading 'props')
```

### Root Cause

In React web applications, this pattern is common and safe:

```typescript
// ✅ Works fine in React DOM:
{items && items.length > 0 && items.map(...)}
```

However, `@react-pdf/renderer` has different internals. When the condition is false:
- React web: receives `false`, which React DOM safely ignores
- React PDF: receives `false`, which causes internal crashes when accessing `.props`

---

## Unsafe Patterns

### 1. Boolean Short-Circuit Evaluation

```typescript
// ❌ UNSAFE - Can pass false/null to children:
{item.subItems && 
  item.subItems.length > 0 && 
  item.subItems.map(...)}
```

**Why it fails:**
- If `item.subItems` is `null`/`undefined`, evaluates to `null`
- If `item.subItems` is empty array, evaluates to `false`
- @react-pdf/renderer tries to access `.props` on `null`/`false`

### 2. Unguarded Array Operations

```typescript
// ❌ UNSAFE - Crashes if items is null/undefined:
const parentItems = invoice.items
  .filter((item) => !item.parentItemId)
  .sort((a, b) => a.order - b.order);
```

### 3. Nested Conditionals

```typescript
// ❌ UNSAFE - Can result in null children:
{condition && (
  <>
    {nestedCondition && <Component />}
  </>
)}
```

---

## Safe Patterns

### 1. Array Fallback with Default Empty Array

```typescript
// ✅ SAFE - Always produces valid array:
const parentItems = (invoice.items || [])
  .filter((item) => !item.parentItemId)
  .sort((a, b) => a.order - b.order);
```

### 2. Direct Array Mapping with Fallback

```typescript
// ✅ SAFE - Empty array maps to empty result:
{(item.subItems || [])
  .sort((a, b) => a.order - b.order)
  .map((subItem) => (
    <View key={subItem.id}>
      <Text>{subItem.description}</Text>
    </View>
  ))}
```

### 3. Explicit Ternary for Optional Sections

```typescript
// ✅ SAFE - Explicit null handling:
{item.notes ? (
  <View style={styles.notesSection}>
    <Text>{item.notes}</Text>
  </View>
) : null}
```

### 4. Filter Before Map

```typescript
// ✅ SAFE - Always valid element array:
{(items || [])
  .filter(item => item.isVisible)
  .map(item => <View key={item.id}>...</View>)}
```

---

## Implementation Guide

### For PDF Components

When creating or modifying PDF components, follow these rules:

1. **Always use array fallbacks:**
   ```typescript
   (array || [])
   ```

2. **Never use `&&` for conditional rendering:**
   ```typescript
   // ❌ DON'T:
   {condition && <Component />}
   
   // ✅ DO:
   {condition ? <Component /> : null}
   ```

3. **Map instead of conditional chains:**
   ```typescript
   // ❌ DON'T:
   {items && items.map(...)}
   
   // ✅ DO:
   {(items || []).map(...)}
   ```

4. **Guard all optional data access:**
   ```typescript
   // ❌ DON'T:
   <Text>{company.email}</Text>
   
   // ✅ DO:
   {company.email && <Text>{company.email}</Text>}
   // or
   {company.email ? <Text>{company.email}</Text> : null}
   ```

### Testing Checklist

Before deploying PDF changes:

- [ ] Test with minimal data (empty arrays)
- [ ] Test with missing optional fields (`undefined`/`null`)
- [ ] Test with no sub-items
- [ ] Test with no notes/optional sections
- [ ] Check browser console for errors
- [ ] Verify both preview and download work

---

## Code Examples

### Complete Safe Pattern Example

```typescript
export const SafePDF: React.FC<Props> = ({ document }) => {
  // ✅ Safe array initialization
  const parentItems = (document.items || [])
    .filter((item) => !item.parentItemId)
    .sort((a, b) => a.order - b.order);

  return (
    <Document>
      <Page>
        {/* ✅ Safe optional field rendering */}
        {document.company.logo ? (
          <Image src={document.company.logo} />
        ) : null}

        {/* ✅ Safe array mapping */}
        {parentItems.map((item, index) => (
          <View key={item.id}>
            <Text>{item.description}</Text>
            
            {/* ✅ Safe nested array mapping */}
            {(item.subItems || [])
              .sort((a, b) => a.order - b.order)
              .map((subItem) => (
                <View key={subItem.id}>
                  <Text>• {subItem.description}</Text>
                </View>
              ))}
          </View>
        ))}

        {/* ✅ Safe optional section */}
        {document.notes ? (
          <View>
            <Text>{document.notes}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};
```

---

## Performance Considerations

### Empty Array Creation

```typescript
(items || [])
```

**Concern:** Does this create a new array on every render?

**Answer:** 
- If `items` is truthy, returns existing array (no allocation)
- If `items` is falsy, creates new empty array
- Empty array creation is negligible performance cost
- PDF generation is not performance-critical (user-triggered action)
- Safety and correctness outweigh minimal performance cost

### Alternative Pattern

```typescript
// Also safe, but more verbose:
const items = useMemo(() => data?.items ?? [], [data?.items]);
```

For PDF components (not re-rendering), direct fallback `(arr || [])` is preferred.

---

## Library-Specific Notes

### @react-pdf/renderer vs React DOM

| Feature | React DOM | @react-pdf/renderer |
|---------|-----------|---------------------|
| Boolean children | Safely ignored | Causes errors |
| Null children | Safely ignored | Can cause errors |
| Undefined children | Safely ignored | Can cause errors |
| Empty array `[]` | Renders nothing | Renders nothing ✓ |
| Conditional `? :` | Works | Works ✓ |

**Key Takeaway:** @react-pdf/renderer requires more explicit null handling than React DOM.

---

## Related Files

- `components/pdf/InvoicePDF.tsx` - Fixed implementation
- `components/pdf/ReceiptPDF.tsx` - Fixed implementation  
- `components/pdf/QuotationPDF.tsx` - Fixed implementation
- `components/PDFDownloadButton.tsx` - PDF generation wrapper
- `.github/tasks/task-2025-01-21-fix-pdf-null-props-error.md` - Fix documentation

---

## Future Improvements

1. **Create PDF Component Linter Rule:**
   - Detect `&&` conditionals in PDF components
   - Warn about array access without fallbacks
   - Suggest safe patterns

2. **PDF Component Template:**
   - Provide safe boilerplate for new PDF components
   - Include all safe patterns pre-implemented

3. **Integration Tests:**
   - Automated PDF generation tests with edge cases
   - Test all PDFs with minimal/empty data
   - Catch null handling issues in CI

4. **Type Safety:**
   - Consider making arrays required (not optional) in TypeScript types
   - Or use stricter types that enforce null checks

---

## References

- @react-pdf/renderer GitHub: https://github.com/diegomura/react-pdf
- React PDF Documentation: https://react-pdf.org/
- Related Issue: "Cannot read properties of null" error in PDF generation
- Project Copilot Instructions: `.github/copilot-instructions.md`

---

## Lessons Learned

1. **Don't assume React patterns work everywhere:** What works in React DOM might not work in @react-pdf/renderer
2. **Test edge cases explicitly:** Always test with empty/null/undefined data
3. **Be defensive with external libraries:** Use safe patterns even if they seem verbose
4. **Document library quirks:** Save future developers from the same issues
5. **Build failed but tests passed:** PDF errors are runtime-only, not caught by TypeScript