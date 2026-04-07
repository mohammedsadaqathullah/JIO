import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const dbUrl = process.env.DATABASE_URL;
        const sql = dbUrl && (dbUrl.includes('neon.tech') || dbUrl.includes('neon.ms')) ? neon(dbUrl) : null;

        let dbData = [];
        if (sql) {
            try {
                dbData = await sql`SELECT * FROM user_signups ORDER BY created_at DESC;`;
            } catch (e) {
                console.error('DB fetch failed', e);
            }
        }

        let fileData = [];
        try {
            const filePath = path.join(process.cwd(), 'data', 'submissions.json');
            const content = await fs.readFile(filePath, 'utf-8');
            fileData = JSON.parse(content);
        } catch (e) {
            // File not found is OK
        }

        return Response.json({
            db: dbData,
            file: fileData,
            total: dbData.length + fileData.length
        });
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
