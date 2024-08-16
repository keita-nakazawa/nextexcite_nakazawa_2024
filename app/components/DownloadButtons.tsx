"use client";

import { useState } from "react";

export default function DownloadButtons() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (type: "large" | "small") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/download?type=${type}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = type === "large" ? "large_file.wav" : "small_file.mid";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => handleDownload("large")} disabled={isLoading}>
        Download Large WAV
      </button>
      <button onClick={() => handleDownload("small")} disabled={isLoading}>
        Download Small MIDI
      </button>
      {isLoading && <p>Downloading...</p>}
    </div>
  );
}
