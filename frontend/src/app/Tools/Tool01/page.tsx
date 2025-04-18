"use client";
import { useState } from "react";

export default function OCRTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const runOCR = async () => {
    if (!file) return;
    setLoading(true);

    const body = new FormData();
    body.append("image", file);               // field name *must* be "image"

    const res = await fetch("http://localhost:5000/api/ocr", {
      method: "POST",
      body,
    });

    const data = await res.json();
    setText(data.text || data.error || "Unexpected error");
    setLoading(false);
  };

  return (
    <main className="flex flex-col gap-4 max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Hybrid OCR</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        disabled={!file || loading}
        onClick={runOCR}
        className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Processing…" : "Execute"}
      </button>

      <textarea
        readOnly
        value={text}
        className="w-full h-60 p-2 border rounded resize-none"
      />
    </main>
  );
}
