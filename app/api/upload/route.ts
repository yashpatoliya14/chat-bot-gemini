import { NextRequest, NextResponse } from 'next/server';
// import formidable from 'formidable';
import pdfParse from 'pdf-parse';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = await pdfParse(buffer);
  return NextResponse.json({ text: parsed.text });
}
