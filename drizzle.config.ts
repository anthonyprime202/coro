import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: "./src/lib/server/database/schema.ts",
	out: "./migrations",
	dialect: 'postgresql',
	migrations: {
		prefix: 'supabase'
	},
	dbCredentials: {
		url: process.env.DATABASE_URL as string
	}
})
