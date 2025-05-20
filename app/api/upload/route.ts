// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log(formData);
    
    const file = formData.get('file');

    // Validate file exists
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No PDF file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are accepted' },
        { status: 415 }
      );
    }

    // Process PDF
    const arrayBuffer = await file.arrayBuffer();
    const { text } = await pdfParse(Buffer.from(arrayBuffer));

    return NextResponse.json({ 
      success: true,
      filename: file.name,
      text: text.substring(0, 500) + '...' // Return preview
     });
  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}