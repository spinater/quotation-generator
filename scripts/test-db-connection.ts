#!/usr/bin/env tsx

/**
 * Database Connection Test Script
 * Tests PostgreSQL connection for Thai Quotation Generator
 *
 * Usage:
 *   npm run test:db
 *   or
 *   npx tsx scripts/test-db-connection.ts
 */

import { PrismaClient } from '@prisma/client';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDatabaseConnection() {
  console.log('');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('   Thai Quotation Generator - Database Connection Test', 'bright');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  console.log('');

  // Check if .env file exists
  log('📋 Step 1: Checking environment variables...', 'blue');

  if (!process.env.DATABASE_URL) {
    log('❌ ERROR: DATABASE_URL not found in environment variables', 'red');
    console.log('');
    log('Please create a .env file with your database connection:', 'yellow');
    console.log('');
    console.log('  1. Copy .env.example to .env:');
    console.log('     cp .env.example .env');
    console.log('');
    console.log('  2. Edit .env and add your database credentials:');
    console.log('     DATABASE_URL="postgresql://USER:PASS@localhost:5432/quotation_db?schema=public"');
    console.log('');
    process.exit(1);
  }

  // Mask password in URL for display
  const maskedUrl = process.env.DATABASE_URL.replace(
    /:([^:@]+)@/,
    ':****@'
  );
  log(`✅ DATABASE_URL found: ${maskedUrl}`, 'green');
  console.log('');

  // Test connection
  log('📋 Step 2: Testing database connection...', 'blue');

  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  try {
    // Test basic connection
    await prisma.$connect();
    log('✅ Successfully connected to database!', 'green');
    console.log('');

    // Test query
    log('📋 Step 3: Testing database query...', 'blue');
    const result = await prisma.$queryRaw`SELECT version()`;
    log('✅ Database query successful!', 'green');
    console.log('');

    // Get PostgreSQL version
    if (Array.isArray(result) && result.length > 0) {
      const version = (result[0] as any).version;
      log('📊 PostgreSQL Information:', 'magenta');
      console.log(`   ${version}`);
      console.log('');
    }

    // Check if tables exist
    log('📋 Step 4: Checking database schema...', 'blue');

    try {
      const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `;

      if (tables.length === 0) {
        log('⚠️  No tables found in database', 'yellow');
        console.log('');
        log('This is normal if you haven\'t run migrations yet.', 'yellow');
        console.log('');
        log('To create tables, run:', 'cyan');
        console.log('  npx prisma migrate dev --name init');
        console.log('');
      } else {
        log(`✅ Found ${tables.length} table(s):`, 'green');
        tables.forEach((table, index) => {
          console.log(`   ${index + 1}. ${table.table_name}`);
        });
        console.log('');

        // Check for expected tables
        const expectedTables = [
          'companies',
          'quotations',
          'quotation_items',
          'receipts',
          'receipt_items',
        ];

        const existingTableNames = tables.map(t => t.table_name);
        const missingTables = expectedTables.filter(
          t => !existingTableNames.includes(t)
        );

        if (missingTables.length > 0) {
          log('⚠️  Missing expected tables:', 'yellow');
          missingTables.forEach((table) => {
            console.log(`   - ${table}`);
          });
          console.log('');
          log('To create missing tables, run:', 'cyan');
          console.log('  npx prisma migrate dev --name init');
          console.log('');
        } else {
          log('✅ All expected tables exist!', 'green');
          console.log('');

          // Check if there's data
          log('📋 Step 5: Checking for data...', 'blue');

          const companyCount = await prisma.company.count();
          const quotationCount = await prisma.quotation.count();
          const receiptCount = await prisma.receipt.count();

          if (companyCount === 0) {
            log('⚠️  No companies found in database', 'yellow');
            console.log('');
            log('To add sample data, run:', 'cyan');
            console.log('  npm run prisma:seed');
            console.log('');
          } else {
            log('✅ Data found:', 'green');
            console.log(`   - Companies: ${companyCount}`);
            console.log(`   - Quotations: ${quotationCount}`);
            console.log(`   - Receipts: ${receiptCount}`);
            console.log('');

            // Get default company
            const defaultCompany = await prisma.company.findFirst({
              where: { isDefault: true },
            });

            if (defaultCompany) {
              log('📋 Default Company:', 'magenta');
              console.log(`   Name: ${defaultCompany.name}`);
              console.log(`   Tax ID: ${defaultCompany.taxId}`);
              console.log(`   Phone: ${defaultCompany.phone}`);
              console.log('');
            }
          }
        }
      }
    } catch (error: any) {
      log('⚠️  Could not check database schema', 'yellow');
      console.log(`   ${error.message}`);
      console.log('');
    }

    // Success summary
    log('═══════════════════════════════════════════════════════════', 'cyan');
    log('   ✅ Database Connection Test: SUCCESS', 'green');
    log('═══════════════════════════════════════════════════════════', 'cyan');
    console.log('');
    log('Your database is ready to use!', 'green');
    console.log('');
    log('Next steps:', 'cyan');
    console.log('  1. Run migrations (if needed): npx prisma migrate dev --name init');
    console.log('  2. Seed database (if needed): npm run prisma:seed');
    console.log('  3. Start dev server: npm run dev');
    console.log('  4. Open app: http://localhost:3000');
    console.log('');
    log('Or view your database in Prisma Studio:', 'cyan');
    console.log('  npx prisma studio');
    console.log('');

  } catch (error: any) {
    console.log('');
    log('═══════════════════════════════════════════════════════════', 'red');
    log('   ❌ Database Connection Test: FAILED', 'red');
    log('═══════════════════════════════════════════════════════════', 'red');
    console.log('');
    log('Error Details:', 'red');
    console.log(`   ${error.message}`);
    console.log('');

    // Provide helpful error messages
    if (error.message.includes('connect ECONNREFUSED')) {
      log('🔍 Troubleshooting: Connection Refused', 'yellow');
      console.log('');
      console.log('This usually means PostgreSQL is not running or not accessible.');
      console.log('');
      console.log('Try these steps:');
      console.log('');
      console.log('  1. Check if PostgreSQL is running:');
      console.log('     pg_isready');
      console.log('');
      console.log('  2. Start PostgreSQL (macOS with Homebrew):');
      console.log('     brew services start postgresql@14');
      console.log('');
      console.log('  3. Start PostgreSQL (Ubuntu/Debian):');
      console.log('     sudo service postgresql start');
      console.log('');
      console.log('  4. Start PostgreSQL (Docker):');
      console.log('     docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres');
      console.log('');
    } else if (error.message.includes('password authentication failed')) {
      log('🔍 Troubleshooting: Authentication Failed', 'yellow');
      console.log('');
      console.log('Your username or password is incorrect.');
      console.log('');
      console.log('Check your .env file and verify:');
      console.log('  1. Username is correct');
      console.log('  2. Password is correct');
      console.log('  3. No extra spaces in DATABASE_URL');
      console.log('');
      console.log('To reset PostgreSQL password (if needed):');
      console.log('  sudo -u postgres psql');
      console.log('  ALTER USER postgres PASSWORD \'newpassword\';');
      console.log('');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      log('🔍 Troubleshooting: Database Does Not Exist', 'yellow');
      console.log('');
      console.log('The database "quotation_db" doesn\'t exist yet.');
      console.log('');
      console.log('Create it with:');
      console.log('  createdb -U postgres quotation_db');
      console.log('');
      console.log('Or using psql:');
      console.log('  psql -U postgres');
      console.log('  CREATE DATABASE quotation_db;');
      console.log('  \\q');
      console.log('');
    } else {
      log('🔍 Troubleshooting: General Database Error', 'yellow');
      console.log('');
      console.log('Check your .env file and verify:');
      console.log('  1. DATABASE_URL is correctly formatted');
      console.log('  2. Host and port are correct');
      console.log('  3. Database name is correct');
      console.log('');
      console.log('Example DATABASE_URL:');
      console.log('  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quotation_db?schema=public"');
      console.log('');
    }

    log('Need more help? Check the documentation:', 'cyan');
    console.log('  - INSTALLATION.md');
    console.log('  - START_HERE.md');
    console.log('');

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection()
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
