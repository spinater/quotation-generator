#!/bin/bash
# Try migration with explicit connection string
export DATABASE_URL="postgresql://admin:4OjI\!qe1psjdnR2VG8p0\$QE-I\!@45.136.237.124:55320/company_management?schema=public"
npx prisma migrate dev --name init
