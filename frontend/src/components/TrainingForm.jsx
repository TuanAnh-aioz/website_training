import React, { useState } from "react";

export default function TrainingForm() {
  const [params, setParams] = useState({
    // Model
    model_name: "ResNet11",
    pretrained: false,
    num_classes: 10,
    // Dataset
    batch_size: 64,
    num_workers: 4,
    val_ratio: 0.2,
    // Train
    epochs: 5,
    optimizer: "Adam",
    scheduler: "StepLR",
    loss: "CrossEntropy",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParams({
      ...params,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:8000/start-training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    alert("Training started!");
  };

  return (
    <div className="space-y-4">
      {/* ===== Model ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2 text-blue-600">Model</h2>
        <div className="space-y-2">
          {/* Model Name */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Model Name</span>
            <select
              name="model_name"
              value={params.model_name}
              onChange={handleChange}
              className="border p-1 rounded w-32"
            >
              <option>ResNet11</option>
              <option>ResNet34</option>
              <option>ResNet52</option>
              <option>CustomCNN</option>
            </select>
          </div>
          {/* Pretrained */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Pretrained</span>
            <input
              type="checkbox"
              name="pretrained"
              checked={params.pretrained}
              onChange={handleChange}
              className="h-5 w-5 accent-green-600"
            />
          </div>
          {/* Number of Classes */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Number Classes</span>
            <input
              type="number"
              name="num_classes"
              value={params.num_classes}
              onChange={handleChange}
              className="border p-1 rounded w-24"
            />
          </div>
        </div>
      </div>

      {/* ===== Dataset ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2 text-blue-600">Dataset</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Batch Size</span>
            <input
              type="number"
              name="batch_size"
              value={params.batch_size}
              onChange={handleChange}
              className="border p-1 rounded w-24"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Num Workers</span>
            <input
              type="number"
              name="num_workers"
              value={params.num_workers}
              onChange={handleChange}
              className="border p-1 rounded w-24"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Val Ratio</span>
            <input
              type="number"
              step="0.01"
              name="val_ratio"
              value={params.val_ratio}
              onChange={handleChange}
              className="border p-1 rounded w-24"
            />
          </div>
        </div>
      </div>

      {/* ===== Train ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2 text-blue-600">Train</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Epochs</span>
            <input
              type="number"
              name="epochs"
              value={params.epochs}
              onChange={handleChange}
              className="border p-1 rounded w-24"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Optimizer</span>
            <select
              name="optimizer"
              value={params.optimizer}
              onChange={handleChange}
              className="border p-1 rounded w-32"
            >
              <option>Adam</option>
              <option>SGD</option>
              <option>RMSprop</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Scheduler</span>
            <select
              name="scheduler"
              value={params.scheduler}
              onChange={handleChange}
              className="border p-1 rounded w-32"
            >
              <option>StepLR</option>
              <option>CosineAnnealing</option>
              <option>None</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold w-28">Loss</span>
            <select
              name="loss"
              value={params.loss}
              onChange={handleChange}
              className="border p-1 rounded w-32"
            >
              <option>CrossEntropy</option>
              <option>MSE</option>
              <option>FocalLoss</option>
            </select>
          </div>
        </div>
      </div>

      {/* Start Training Button */}
      <button
        onClick={handleSubmit}
        className="mt-2 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Start Training
      </button>
    </div>
  );
}
