"use client";

import { useState } from "react";

interface ImageProcessingFormProps {
  onJobCreated: (jobId: string) => void;
}

export default function ImageProcessingForm({ onJobCreated }: ImageProcessingFormProps) {
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/process-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
    const data = await response.json();
    if (response.ok) {
      onJobCreated(data.jobId);
    } else {
      console.error("Failed to start image processing");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter image URL"
        className="mr-2 border p-2"
      />
      <button type="submit" className="rounded bg-blue-500 p-2 text-white">
        Process Image
      </button>
    </form>
  );
}
