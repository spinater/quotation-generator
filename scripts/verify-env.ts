/**
 * Verify Environment Configuration
 *
 * This script checks if your .env file is properly configured
 * and validates the DATABASE_URL format.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

interface EnvCheck {
  name: string;
  value: string | undefined;
  required: boolean;
  valid: boolean;
  message?: string;
}

function checkEnv(): void {
  console.log('\n🔍 Verifying Environment Configuration...\n');
  console.log('=' .repeat(60));

  const checks: EnvCheck[] = [
    {
      name: 'DB_HOST',
      value: process.env.DB_HOST,
      required: false,
      valid: true,
      message: 'Optional - for reference only'
    },
    {
      name: 'DB_PORT',
      value: process.env.DB_PORT,
      required: false,
      valid: true,
      message: 'Optional - for reference only'
    },
    {
      name: 'DB_NAME',
      value: process.env.DB_NAME,
      required: false,
      valid: true,
      message: 'Optional - for reference only'
    },
    {
      name: 'DB_USERNAME',
      value: process.env.DB_USERNAME,
      required: false,
      valid: true,
      message: 'Optional - for reference only'
    },
    {
      name: 'DB_PASSWORD',
      value: process.env.DB_PASSWORD,
      required: false,
      valid: true,
      message: 'Optional - for reference only'
    },
    {
      name: 'DATABASE_URL',
      value: process.env.DATABASE_URL,
      required: true,
      valid: validateDatabaseUrl(process.env.DATABASE_URL),
      message: process.env.DATABASE_URL ? 'Required by Prisma' : 'MISSING - Required!'
    },
    {
      name: 'NEXT_PUBLIC_APP_URL',
      value: process.env.NEXT_PUBLIC_APP_URL,
      required: true,
      valid: validateUrl(process.env.NEXT_PUBLIC_APP_URL),
      message: process.env.NEXT_PUBLIC_APP_URL ? 'Valid URL' : 'MISSING - Required!'
    },
    {
      name: 'NODE_ENV',
      value: process.env.NODE_ENV,
      required: false,
      valid: validateNodeEnv(process.env.NODE_ENV),
      message: process.env.NODE_ENV || 'defaults to "development"'
    }
  ];

  let hasErrors = false;
  let hasWarnings = false;

  // Display results
  for (const check of checks) {
    const status = check.value
      ? (check.valid ? '✅' : '⚠️ ')
      : (check.required ? '❌' : '⚪');

    const displayValue = check.value
      ? (check.name.includes('PASSWORD') || check.name.includes('URL')
          ? maskSensitive(check.value)
          : check.value)
      : 'NOT SET';

    console.log(`\n${status} ${check.name}`);
    console.log(`   Value: ${displayValue}`);
    if (check.message) {
      console.log(`   Note: ${check.message}`);
    }

    if (check.required && !check.value) {
      hasErrors = true;
    }
    if (check.value && !check.valid) {
      hasWarnings = true;
    }
  }

  console.log('\n' + '=' .repeat(60));

  // Validate DATABASE_URL components
  if (process.env.DATABASE_URL) {
    console.log('\n📋 DATABASE_URL Components:\n');
    const components = parseDatabaseUrl(process.env.DATABASE_URL);

    if (components) {
      console.log(`   Protocol: ${components.protocol}`);
      console.log(`   Username: ${components.username}`);
      console.log(`   Password: ${maskSensitive(components.password)}`);
      console.log(`   Host: ${components.host}`);
      console.log(`   Port: ${components.port}`);
      console.log(`   Database: ${components.database}`);
      console.log(`   Schema: ${components.schema || 'public (default)'}`);

      // Check if individual DB vars match DATABASE_URL
      if (process.env.DB_HOST || process.env.DB_PORT || process.env.DB_NAME ||
          process.env.DB_USERNAME || process.env.DB_PASSWORD) {
        console.log('\n🔄 Comparing individual DB variables with DATABASE_URL:\n');

        if (process.env.DB_HOST && process.env.DB_HOST !== components.host) {
          console.log(`   ⚠️  DB_HOST (${process.env.DB_HOST}) doesn't match DATABASE_URL (${components.host})`);
          hasWarnings = true;
        } else if (process.env.DB_HOST) {
          console.log(`   ✅ DB_HOST matches`);
        }

        if (process.env.DB_PORT && process.env.DB_PORT !== components.port) {
          console.log(`   ⚠️  DB_PORT (${process.env.DB_PORT}) doesn't match DATABASE_URL (${components.port})`);
          hasWarnings = true;
        } else if (process.env.DB_PORT) {
          console.log(`   ✅ DB_PORT matches`);
        }

        if (process.env.DB_NAME && process.env.DB_NAME !== components.database) {
          console.log(`   ⚠️  DB_NAME (${process.env.DB_NAME}) doesn't match DATABASE_URL (${components.database})`);
          hasWarnings = true;
        } else if (process.env.DB_NAME) {
          console.log(`   ✅ DB_NAME matches`);
        }

        if (process.env.DB_USERNAME && process.env.DB_USERNAME !== components.username) {
          console.log(`   ⚠️  DB_USERNAME doesn't match DATABASE_URL`);
          hasWarnings = true;
        } else if (process.env.DB_USERNAME) {
          console.log(`   ✅ DB_USERNAME matches`);
        }
      }
    } else {
      console.log('   ❌ Invalid DATABASE_URL format');
      hasErrors = true;
    }
  }

  // Final summary
  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 Summary:\n');

  if (hasErrors) {
    console.log('❌ ERRORS FOUND - Please fix required variables');
    console.log('\nRequired variables:');
    console.log('  - DATABASE_URL (for Prisma)');
    console.log('  - NEXT_PUBLIC_APP_URL (for Next.js)');
    console.log('\nSee SETUP_YOUR_ENV.md for detailed instructions.');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  WARNINGS FOUND - Configuration may have issues');
    console.log('\nYou can proceed, but review the warnings above.');
    console.log('Individual DB variables (DB_HOST, etc.) are optional.');
    console.log('Only DATABASE_URL is required for the app to work.');
    process.exit(0);
  } else {
    console.log('✅ All checks passed! Your .env is properly configured.');
    console.log('\nNext steps:');
    console.log('  1. npm run test:db          # Test database connection');
    console.log('  2. npx prisma generate      # Generate Prisma Client');
    console.log('  3. npx prisma migrate dev   # Create database tables');
    console.log('  4. npm run prisma:seed      # Add sample data');
    console.log('  5. npm run dev              # Start development server');
    process.exit(0);
  }
}

function validateDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  return /^postgresql:\/\/.+:.+@.+:\d+\/.+/.test(url);
}

function validateUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateNodeEnv(env: string | undefined): boolean {
  if (!env) return true; // Optional, defaults to development
  return ['development', 'production', 'test'].includes(env);
}

function maskSensitive(value: string): string {
  if (value.length <= 8) {
    return '*'.repeat(value.length);
  }
  return value.substring(0, 3) + '*'.repeat(value.length - 6) + value.substring(value.length - 3);
}

function parseDatabaseUrl(url: string): {
  protocol: string;
  username: string;
  password: string;
  host: string;
  port: string;
  database: string;
  schema?: string;
} | null {
  try {
    // Format: postgresql://username:password@host:port/database?schema=public
    const regex = /^(\w+):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?$/;
    const match = url.match(regex);

    if (!match) return null;

    const [, protocol, username, password, host, port, database, queryString] = match;

    let schema: string | undefined;
    if (queryString) {
      const params = new URLSearchParams(queryString.substring(1));
      schema = params.get('schema') || undefined;
    }

    return {
      protocol,
      username,
      password,
      host,
      port,
      database,
      schema
    };
  } catch {
    return null;
  }
}

// Run the checks
checkEnv();
