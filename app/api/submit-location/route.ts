import { neon } from '@neondatabase/serverless';
import fs from 'fs/promises';
import path from 'path';

// Initialize neon only if DATABASE_URL is present and looks like a Neon URL
// Otherwise, we'll use local file fallback
const dbUrl = process.env.DATABASE_URL;
const sql = dbUrl && (dbUrl.includes('neon.tech') || dbUrl.includes('neon.ms')) ? neon(dbUrl) : null;

interface RequestBody {
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
}

async function saveToLocalFile(data: any) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'submissions.json');

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    let submissions = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      submissions = JSON.parse(fileContent);
    } catch (e) {
      // File doesn't exist or is empty
    }

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

    // Validate phone number if provided
    if (body.phoneNumber) {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(body.phoneNumber.replace(/\D/g, ''))) {
        return Response.json(
          { error: 'Invalid phone number. Please enter 10 digits.' },
          { status: 400 }
        );
      }
    }

    // Validate coordinates if provided
    if (typeof body.latitude === 'number' || typeof body.longitude === 'number') {
      if (
        typeof body.latitude !== 'number' ||
        typeof body.longitude !== 'number' ||
        body.latitude < -90 ||
        body.latitude > 90 ||
        body.longitude < -180 ||
        body.longitude > 180
      ) {
        return Response.json(
          { error: 'Invalid location coordinates.' },
          { status: 400 }
        );
      }
    }

    let result;

    if (sql) {
      try {
        const dbResult = await sql`
          INSERT INTO user_signups (latitude, longitude, phone_number)
          VALUES (
            ${body.latitude ?? null}, 
            ${body.longitude ?? null}, 
            ${body.phoneNumber ?? null}
          )
          RETURNING id, created_at;
        `;
        result = { id: dbResult[0].id, timestamp: dbResult[0].created_at };
      } catch (dbError) {
        console.warn('[API] Database insertion failed, falling back to local file:', dbError);
        const fileEntry = await saveToLocalFile(body);
        result = { id: fileEntry.id, timestamp: fileEntry.created_at };
      }
    } else {
      console.log('[API] Using local file storage (No Neon DATABASE_URL found)');
      const fileEntry = await saveToLocalFile(body);
      result = { id: fileEntry.id, timestamp: fileEntry.created_at };
    }

    return Response.json({
      success: true,
      message: 'Your data has been saved successfully!',
      id: result.id,
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error('[API] Error submitting data:', error);
    return Response.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
