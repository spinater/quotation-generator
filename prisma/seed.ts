import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ========================================
  // 1. Create Initial Admin User
  // ========================================
  console.log("\n📝 Creating initial admin user...");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists:", existingAdmin.email);
  } else {
    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    const adminUser = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "System Administrator",
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("✅ Created admin user:", adminUser.email);
    console.log("   Name:", adminUser.name);
    console.log("   Role:", adminUser.role);
    console.log("   🔐 Password: Admin123! (CHANGE THIS IN PRODUCTION!)");
  }

  // ========================================
  // 2. Create Default Company
  // ========================================
  console.log("\n📝 Creating default company...");

  // Check if default company already exists
  const existingCompany = await prisma.company.findFirst({
    where: { isDefault: true },
  });

  if (existingCompany) {
    console.log("✅ Default company already exists:", existingCompany.name);
    return;
  }

  // Create default company with 2 trailing spaces for postal code workaround
  const defaultCompany = await prisma.company.create({
    data: {
      name: "บริษัท ตัวอย่าง จำกัด",
      nameEn: "Example Company Limited",
      taxId: "0123456789012",
      address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110  ", // Note: 2 trailing spaces
      phone: "02-123-4567",
      email: "info@example.com",
      bankName: "ธนาคารกรุงเทพ",
      bankAccountNumber: "123-4-56789-0",
      bankAccountName: "บริษัท ตัวอย่าง จำกัด",
      isDefault: true,
      isIssuer: true,
      isCustomer: false,
    },
  });

  console.log("✅ Created default company:", defaultCompany.name);
  console.log("   Tax ID:", defaultCompany.taxId);
  console.log("   Phone:", defaultCompany.phone);

  // Optional: Create sample quotation
  const sampleQuotation = await prisma.quotation.create({
    data: {
      quotationNumber: "QT-2024-0001",
      companyId: defaultCompany.id,
      customerName: "บริษัท ลูกค้าตัวอย่าง จำกัด",
      customerAddress:
        "456 ถนนพระราม 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330  ",
      customerTaxId: "0987654321098",
      customerPhone: "02-987-6543",
      issueDate: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      subtotal: 10000,
      vatAmount: 700,
      total: 10700,
      hasVat: true,
      language: "th",
      status: "draft",
      notes: "นี่คือใบเสนอราคาตัวอย่าง",
      items: {
        create: [
          {
            description: "สินค้าตัวอย่าง 1",
            quantity: 2,
            unit: "ชิ้น",
            pricePerUnit: 2500,
            amount: 5000,
            order: 1,
          },
          {
            description: "สินค้าตัวอย่าง 2",
            quantity: 1,
            unit: "ชุด",
            pricePerUnit: 5000,
            amount: 5000,
            order: 2,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  console.log("✅ Created sample quotation:", sampleQuotation.quotationNumber);
  console.log("   Items:", sampleQuotation.items.length);

  // Optional: Create sample receipt
  const sampleReceipt = await prisma.receipt.create({
    data: {
      receiptNumber: "RC-2024-0001",
      companyId: defaultCompany.id,
      customerName: "บริษัท ลูกค้าตัวอย่าง จำกัด",
      customerAddress:
        "456 ถนนพระราม 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330  ",
      customerTaxId: "0987654321098",
      customerPhone: "02-987-6543",
      issueDate: new Date(),
      subtotal: 10000,
      vatAmount: 700,
      total: 10700,
      hasVat: true,
      language: "th",
      paymentMethod: "transfer",
      paymentDate: new Date(),
      notes: "นี่คือใบเสร็จตัวอย่าง",
      items: {
        create: [
          {
            description: "สินค้าตัวอย่าง 1",
            quantity: 2,
            unit: "ชิ้น",
            pricePerUnit: 2500,
            amount: 5000,
            order: 1,
          },
          {
            description: "สินค้าตัวอย่าง 2",
            quantity: 1,
            unit: "ชุด",
            pricePerUnit: 5000,
            amount: 5000,
            order: 2,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  console.log("✅ Created sample receipt:", sampleReceipt.receiptNumber);
  console.log("   Items:", sampleReceipt.items.length);

  console.log("");
  console.log("🎉 Database seeding completed successfully!");
  console.log("");
  console.log("📊 Summary:");
  console.log("   - Users: 1 (Admin)");
  console.log("   - Companies: 1");
  console.log("   - Quotations: 1");
  console.log("   - Receipts: 1");
  console.log("");
  console.log("🔐 Login Credentials:");
  console.log("   Email: admin@example.com");
  console.log("   Password: Admin123!");
  console.log("   ⚠️  IMPORTANT: Change this password after first login!");
  console.log("");
  console.log("🚀 You can now run: npm run dev");
  console.log("📱 Or open Prisma Studio: npx prisma studio");
}

main()
  .catch((e) => {
    console.error("");
    console.error("❌ Error seeding database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
