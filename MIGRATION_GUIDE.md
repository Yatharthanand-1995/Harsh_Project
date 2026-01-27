# Database Migration Guide

**Date**: 2026-01-27
**Status**: Products moved to database - Migration required before testing

---

## ✅ What Was Completed

### Task #20: Move Products to Database

The products system has been migrated from in-memory data to database queries:

**Files Updated:**
- `prisma/schema.prisma` - Added `bakeryType` and `festivalType` fields to Product model
- `prisma/seed.ts` - Updated to seed these new fields
- `src/app/products/page.tsx` - Now fetches products from Prisma
- `src/app/products/[slug]/page.tsx` - Now fetches product details from Prisma

**Database Schema Changes:**
```prisma
model Product {
  // ... existing fields
  bakeryType   String? // "bread", "pastries", "cookies", "pizza", "sandwiches"
  festivalType String? // "diwali", "holi", "christmas", "new-year", "rakhi"
  // ... more fields

  @@index([bakeryType])
  @@index([festivalType])
}
```

**New Category Added:**
- `frozen` category for "Frozen & Ready to Consume" products

---

## 🚨 CRITICAL: Required Migration Steps

Before you can test the application, you **MUST** run the database migration:

### Step 1: Ensure Database is Running

```bash
# Check if PostgreSQL is running
pg_ctl status

# If not running, start it:
pg_ctl start
# OR
brew services start postgresql
# OR using Docker
docker run --name homespun-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### Step 2: Run the Migration

```bash
# Create and apply migration
npx prisma migrate dev --name add_product_filter_fields

# This will:
# - Add bakeryType and festivalType columns to Product table
# - Add indexes for these fields
# - Apply all pending migrations
```

### Step 3: Regenerate Prisma Client (if needed)

```bash
npx prisma generate
```

### Step 4: Seed the Database

```bash
npm run db:seed

# This will:
# - Create 5 categories (bakery, cakes, festivals, corporate, frozen)
# - Import all products from src/data/products.ts
# - Populate bakeryType and festivalType fields
# - Create test users
```

### Step 5: Verify Migration

```bash
# Open Prisma Studio to inspect data
npx prisma studio

# Should see:
# - Products table with bakeryType and festivalType columns
# - All seeded products
# - 5 categories
```

---

## 📊 What Changed

### Before (In-Memory)
```typescript
// src/app/products/page.tsx
import { PRODUCTS } from '@/data/products'

let filteredProducts = PRODUCTS
if (category) {
  filteredProducts = filteredProducts.filter((p) => p.category === category)
}
```

### After (Database)
```typescript
// src/app/products/page.tsx
import { prisma } from '@/lib/prisma'

const where = {
  isActive: true,
  ...(category && { category: { slug: category } }),
}

const filteredProducts = await prisma.product.findMany({
  where,
  include: { category: true },
  orderBy: { createdAt: 'desc' },
})
```

---

## 🎯 Benefits

### Performance
- ✅ Reduced bundle size - products no longer bundled in client JavaScript
- ✅ Database indexes for faster filtering
- ✅ Efficient pagination (ready for future implementation)

### Scalability
- ✅ Can now handle thousands of products
- ✅ Dynamic product counts from database
- ✅ Real-time stock updates
- ✅ No need to rebuild when products change

### Functionality
- ✅ Full-text search capability (Postgres)
- ✅ Complex filtering at database level
- ✅ Sorting and ordering optimized
- ✅ Related data loaded efficiently (categories, reviews)

---

## 🧪 Testing After Migration

Once migration is complete, test these scenarios:

### 1. Products Page
```bash
npm run dev
# Open http://localhost:3000/products
```

**Verify:**
- ✅ All products display
- ✅ Category filters work (All, Bakery, Cakes, Festivals, Frozen)
- ✅ Product counts accurate
- ✅ Bakery sub-filters work (Bread, Pastries, etc.)
- ✅ Festival sub-filters work (Diwali, Holi, etc.)

### 2. Product Detail Page
```bash
# Open any product
# http://localhost:3000/products/artisan-sourdough-bread
```

**Verify:**
- ✅ Product details display
- ✅ Category name shown correctly
- ✅ Images load
- ✅ Reviews display (if any exist)
- ✅ Stock information correct

### 3. Search (if implemented)
```bash
# Test search functionality
# http://localhost:3000/products?search=bread
```

**Verify:**
- ✅ Search results accurate
- ✅ Partial matches work

---

## 🔄 Rollback (If Needed)

If you encounter issues and need to rollback:

### Option 1: Revert Code Changes
```bash
# Checkout previous version
git checkout HEAD~1 -- src/app/products/page.tsx
git checkout HEAD~1 -- src/app/products/[slug]/page.tsx
git checkout HEAD~1 -- prisma/schema.prisma
git checkout HEAD~1 -- prisma/seed.ts

# Regenerate Prisma client
npx prisma generate
```

### Option 2: Keep Changes, Use Fallback
The in-memory data still exists at `src/data/products.ts` and can be used temporarily if database has issues.

---

## 📝 Migration SQL (Reference)

The migration will generate SQL similar to:

```sql
-- Add new columns
ALTER TABLE "Product" ADD COLUMN "bakeryType" TEXT;
ALTER TABLE "Product" ADD COLUMN "festivalType" TEXT;

-- Add indexes
CREATE INDEX "Product_bakeryType_idx" ON "Product"("bakeryType");
CREATE INDEX "Product_festivalType_idx" ON "Product"("festivalType");

-- Insert frozen category
INSERT INTO "Category" (id, name, slug, description, "order", "isActive", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Frozen & Ready to Consume', 'frozen', 'Frozen products ready to heat and eat', 5, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
```

---

## 🐛 Troubleshooting

### Issue: Migration fails with "relation Product does not exist"
**Solution**: Ensure you've run all previous migrations first
```bash
npx prisma migrate deploy
```

### Issue: Seed fails with "Category not found"
**Solution**: Check that all 5 categories were created
```bash
npx prisma studio
# Verify categories table has 5 rows
```

### Issue: Products page shows no products
**Solution**: Verify products were seeded
```bash
# Check product count
npx prisma studio
# Should see 55+ products

# Or query directly
psql -d homespun -c "SELECT COUNT(*) FROM \"Product\";"
```

### Issue: TypeScript errors about bakeryType/festivalType
**Solution**: Regenerate Prisma client
```bash
npx prisma generate
npm run build
```

### Issue: Database connection error
**Solution**: Check DATABASE_URL in .env
```bash
# Verify .env has valid DATABASE_URL
cat .env | grep DATABASE_URL

# Test connection
npx prisma db pull
```

---

## 📚 Related Documentation

- **FINAL_REPORT.md** - Complete implementation status
- **TESTING_GUIDE.md** - Full testing instructions
- **NEXT_STEPS.md** - Remaining tasks
- **README.md** - Project overview

---

## 🎉 What's Next

After successful migration, you can:

1. **Test the complete application** using TESTING_GUIDE.md
2. **Implement pagination** (Task #21) - now easier with database queries
3. **Add full-text search** - leverage Postgres capabilities
4. **Optimize queries** - add more indexes as needed

---

**Status**: ✅ Code ready - Awaiting database migration

**Action Required**: Run `npx prisma migrate dev --name add_product_filter_fields`

**Estimated Time**: 5-10 minutes for migration + seeding

---

*Last Updated*: 2026-01-27
*Task*: #20 - Move products to database queries
*Build Status*: ✅ SUCCESS
