import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';

// Initialize neon only if DATABASE_URL is present and looks like a Neon URL
// Otherwise, we'll use local file fallback
// Initialize neon database connection
const dbUrl = process.env.DATABASE_URL;
// On Vercel, we always want to use the database.
const sql = dbUrl ? neon(dbUrl) : null;

interface RequestBody {
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
}

// Helper to save to local file (only used during local development)
async function saveToLocalFile(data: any) {
  // If we are on Vercel (or any serverless environment), writing to the filesystem may fail
  if (process.env.VERCEL) {
    console.warn('[API] Skipping local file storage on Vercel.');
    return { id: 'vercel-' + Date.now(), created_at: new Date().toISOString() };
  }

  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'submissions.json');
    await fs.mkdir(dataDir, { recursive: true });

    let submissions = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      submissions = JSON.parse(fileContent);
    } catch (e) { /* ignore */ }

    const newEntry = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString()
    };

    submissions.push(newEntry);
    await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));
    return newEntry;
  } catch (error) {
    console.error('[API] Error saving to local file:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    console.log('[API] New submission received:', body);

    // Basic validation
    if (body.phoneNumber) {
      const digits = body.phoneNumber.replace(/\D/g, '');
      if (digits.length < 10) {
        return Response.json({ error: 'Phone number too short' }, { status: 400 });
      }
    }

    if (sql) {
      try {
        console.log('[API] Saving to database...');
        const dbResult = await sql`
          INSERT INTO user_signups (latitude, longitude, phone_number)
          VALUES (
            ${body.latitude ?? null}, 
            ${body.longitude ?? null}, 
            ${body.phoneNumber ?? null}
          )
          RETURNING id, created_at;
        `;

        return Response.json({
          success: true,
          message: 'Data saved to database!',
          id: dbResult[0].id,
          timestamp: dbResult[0].created_at,
        });
      } catch (dbError: any) {
        console.error('[API] Database Error:', dbError.message);

        // If DATABASE_URL is wrong or connection fails, we only try local file if NOT on vercel
        if (!process.env.VERCEL) {
          const fileEntry = await saveToLocalFile(body);
          return Response.json({
            success: true,
            message: 'Saved to local file (Database failed)',
            id: fileEntry.id,
            timestamp: fileEntry.created_at,
          });
        }

        throw dbError; // On Vercel, re-throw to give a 500 with meaningful logs
      }
    } else {
      // No DATABASE_URL provided
      const fileEntry = await saveToLocalFile(body);
      return Response.json({
        success: true,
        message: 'Saved to local storage',
        id: fileEntry.id,
        timestamp: fileEntry.created_at,
      });
    }
  } catch (error: any) {
    console.error('[API] Critical Error:', error.message);
    return Response.json(
      { error: 'Failed to process request: ' + error.message },
      { status: 500 }
    );
  }
}
