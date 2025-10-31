import React from "react";

export default function TrainingResults({ metrics }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">Training Results</h2>
      {metrics.final_loss ? (
        <div>
          <p>Final Loss: {metrics.final_loss}</p>
          <p>Accuracy: {metrics.accuracy}</p>
          <button className="mt-2 bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Download Model
          </button>
        </div>
      ) : (
        <p>No results yet.</p>
      )}
    </div>
  );
}
