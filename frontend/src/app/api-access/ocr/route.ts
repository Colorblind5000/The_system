// frontend/src/app/api-access/ocr/route.ts

import { NextResponse } from 'next/server';

// Use the Node.js runtime so FormData+fetch work as expected
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1) Read the incoming form-data
    const formData = await request.formData();
    const file = formData.get('image') as Blob;        // ← NB: was 'file'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // 2) Re-package it for the Python API
    const pythonApiFormData = new FormData();
    pythonApiFormData.append('image', file);

    // 3) Send to your Flask endpoint
    const response = await fetch('http://localhost:5000/api/ocr', {
      method: 'POST',
      body: pythonApiFormData,
    });

    if (!response.ok) {
      throw new Error(`Python OCR failed: ${response.statusText}`);
    }

    // 4) Forward the JSON back to the client
    const result = await response.json();
    return NextResponse.json(result);

  } catch (err) {
    console.error('OCR Processing Error:', err);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
