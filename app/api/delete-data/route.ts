import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(request: Request) {
    try {
        const { id, source } = await request.json();
        const dbUrl = process.env.DATABASE_URL;

        if (source === 'Postgres' || source === 'Local Storage') {
            if (dbUrl) {
                const sql = neon(dbUrl);
                await sql`DELETE FROM user_signups WHERE id = ${id};`;
                return Response.json({ success: true, message: 'Entry deleted from database' });
            }
        }

        // Attempt local file delete if NOT on Vercel
        if (!process.env.VERCEL) {
            try {
                const filePath = path.join(process.cwd(), 'data', 'submissions.json');
                const content = await fs.readFile(filePath, 'utf-8');
                let submissions = JSON.parse(content);
                submissions = submissions.filter((s: any) => s.id !== id);
                await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));
                return Response.json({ success: true, message: 'Entry deleted from local storage' });
            } catch (err) {
                console.warn('[API] Local file delete failed:', err);
            }
        }

        return Response.json({ error: 'Delete failed. If on Vercel, check DATABASE_URL.' }, { status: 400 });
    } catch (error: any) {
        console.error('[API] Delete error:', error.message);
        return Response.json({ error: 'Failed to delete: ' + error.message }, { status: 500 });
    }
}
