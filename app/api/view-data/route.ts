import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL;
    let dbEntries = [];
    let fileEntries = [];

    try {
        // 1. Try to fetch from Postgres
        if (dbUrl) {
            try {
                const sql = neon(dbUrl);
                dbEntries = await sql`SELECT * FROM user_signups ORDER BY created_at DESC;`;
            } catch (dbError: any) {
                console.error('[API] Database Fetch Error:', dbError.message);
            }
        }

        // 2. Try to fetch from local file (Only if NOT on Vercel)
        if (!process.env.VERCEL) {
            try {
                const filePath = path.join(process.cwd(), 'data', 'submissions.json');
                const content = await fs.readFile(filePath, 'utf-8');
                fileEntries = JSON.parse(content);
            } catch (fileError) {
                // File doesn't exist yet, which is fine
            }
        }

        return Response.json({
            db: dbEntries,
            file: fileEntries
        });
    } catch (error: any) {
        console.error('[API] Error viewing data:', error.message);
        return Response.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
