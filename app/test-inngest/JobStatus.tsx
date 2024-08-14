"use client";

import { useEffect, useState } from "react";

interface JobStatusProps {
  jobId: string;
}

export default function JobStatus({ jobId }: JobStatusProps) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const response = await fetch(`/api/job-status?jobId=${jobId}`);
      const data = await response.json();
      if (response.ok) {
        setStatus(data.status);
      } else {
        console.error("Failed to fetch job status");
      }
    };

    setStatus(null);
    const intervalId = setInterval(checkStatus, 5000); // 5秒ごとにチェック

    return () => clearInterval(intervalId);
  }, [jobId]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold">Job Status</h2>
      <p>Job ID: {jobId}</p>
      <p>Status: {status || "Checking..."}</p>
    </div>
  );
}
