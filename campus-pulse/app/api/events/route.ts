import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { EventType } from '@/types/types';


const dataPath = path.join(process.cwd(), 'public', 'data', 'events.json');

async function readData() {
  try {
    //console.log(dataPath)
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error)
    return []; // empty array if file doesn't exist
  }
}

export async function GET() {
  const events = await readData() as EventType[];
  return NextResponse.json(events);
}
