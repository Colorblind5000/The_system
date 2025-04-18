import { NextResponse } from 'next/server';

// Configure to use Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create form data to send to Python backend
    const pythonApiFormData = new FormData();
    pythonApiFormData.append('file', file);

    // Send to Python backend
    const response = await fetch('http://localhost:5000/ocr', {
      method: 'POST',
      body: pythonApiFormData,
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('OCR Processing Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' }, 
      { status: 500 }
    );
  }
}
