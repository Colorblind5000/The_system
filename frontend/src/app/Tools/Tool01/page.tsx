"use client";
import { useState } from "react";

export default function Tool01() {
  const [text, setText]   = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("file") as HTMLInputElement)
                   .files?.[0];
    if (!file) return;
    setLoading(true);
    const body = new FormData();
    body.append("file", file);
    const res  = await fetch("/api/ocr", { method: "POST", body });
    const json = await res.json();
    setText(json.text);
    setLoading(false);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Image → Text (OCR)</h1>
      <p>Upload an image and extract the text with Azure AI Vision.</p>

      <form onSubmit={handleUpload}>
        <input name="file" type="file" accept="image/*" required />
        <button type="submit">Run OCR</button>
      </form>

      {loading && <p>Processing…</p>}
      {text && (
        <>
          <h2>Result</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
        </>
      )}
    </main>
  );
}
