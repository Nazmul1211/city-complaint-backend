import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Read from process.env instead of the env() helper so commands that do
    // not need a database (e.g. `prisma generate` in postinstall) don't fail
    // when DATABASE_URL is absent — like on Vercel's build machine.
    url: process.env.DATABASE_URL ?? '',
  },
})