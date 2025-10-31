import React, { useEffect } from "react";

export default function TrainingInfo({ progressData, setProgressData }) {
  useEffect(() => {
    const evtSource = new EventSource(
      "http://localhost:8000/training-progress"
    );
    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgressData(data);
    };
    return () => evtSource.close();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow h-64 overflow-y-auto">
      <h2 className="font-bold mb-2">Training Info</h2>
      <p>
        Status: <span className="font-semibold">{progressData.status}</span>
      </p>
      <p>Progress: {progressData.progress}%</p>
      <div className="mt-2 text-sm font-mono">
        {progressData.logs.slice(-10).map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>
    </div>
  );
}
