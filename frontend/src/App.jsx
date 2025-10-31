import React, { useState } from "react";
import TrainingForm from "./components/TrainingForm";
import TrainingInfo from "./components/TrainingInfo";
import TrainingResults from "./components/TrainingResults";

export default function App() {
  const [progressData, setProgressData] = useState({
    status: "Idle",
    progress: 0,
    logs: [],
    metrics: {},
  });

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        AIOZ Training Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <TrainingForm />
        </div>
        <div className="md:col-span-2 space-y-4">
          <TrainingInfo
            progressData={progressData}
            setProgressData={setProgressData}
          />
          <TrainingResults metrics={progressData.metrics} />
        </div>
      </div>
    </div>
  );
}
