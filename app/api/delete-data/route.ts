import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(request: Request) {
    try {
        const { id, source } = await request.json();

        if (source === 'Postgres') {
            const dbUrl = process.env.DATABASE_URL;
            const sql = dbUrl && (dbUrl.includes('neon.tech') || dbUrl.includes('neon.ms')) ? neon(dbUrl) : null;
            if (sql) {
                await sql`DELETE FROM user_signups WHERE id = ${id};`;
                return Response.json({ success: true, message: 'Entry deleted from database' });
            }
        } else {
            // Delete from local file
            const filePath = path.join(process.cwd(), 'data', 'submissions.json');
            const content = await fs.readFile(filePath, 'utf-8');
            let submissions = JSON.parse(content);

            submissions = submissions.filter((s: any) => s.id !== id);

            await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));
            return Response.json({ success: true, message: 'Entry deleted from local storage' });
        }

        return Response.json({ error: 'Delete failed or invalid source' }, { status: 400 });
    } catch (error) {
        console.error('[API] Delete error:', error);
        return Response.json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}
