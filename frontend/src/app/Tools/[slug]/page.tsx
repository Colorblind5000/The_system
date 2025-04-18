"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { tools } from "../page";
import { useState } from "react";

export default function ToolPage() {
  const params = useParams();
  const tool = tools.find(t => t.slug === params.slug);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  if (!tool) {
    return <div className="p-6">Tool not found</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setResult("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api-access/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process image");
      }

      setResult(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{tool.title}</h1>
      <div className="mb-6">
        <Image
          src={tool.img}
          alt={tool.title}
          className="rounded-lg shadow-md"
          width={600}
          height={300}
        />
      </div>
      <p className="text-gray-700 mb-4">
        {tool.desc}
      </p>

      {/* OCR Upload Form */}
      <div className="mt-8 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Image for OCR
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          <button
            type="submit"
            disabled={!file || loading}
            className={`px-4 py-2 rounded text-white font-medium
              ${!file || loading 
                ? 'bg-gray-400' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Processing...' : 'Extract Text'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Extracted Text:</h3>
            <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}