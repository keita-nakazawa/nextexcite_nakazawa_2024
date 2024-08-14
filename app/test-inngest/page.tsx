"use client";

import { useState } from "react";
import ImageProcessingForm from "./ImageProcessingForm";
import JobStatus from "./JobStatus";

export default function TestInngest() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Image Processing Demo</h1>
      <ImageProcessingForm onJobCreated={setJobId} />
      {jobId && <JobStatus jobId={jobId} />}
    </main>
  );
}
