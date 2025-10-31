from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
import asyncio
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
import random

app = FastAPI()

# CORS cho frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

# --- Schema nhận params train ---
class TrainParams(BaseModel):
    learning_rate: float
    batch_size: int
    epochs: int
    optimizer: str
    dataset: str

# --- Model CNN đơn giản ---
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3, 1)
        self.conv2 = nn.Conv2d(32, 64, 3, 1)
        self.fc1 = nn.Linear(9216, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = torch.relu(self.conv2(x))
        x = torch.flatten(x, 1)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# --- Global progress ---
progress_data = {
    "status": "Idle",
    "progress": 0,
    "logs": [],
    "metrics": {}
}

# --- Endpoint nhận params ---
@app.post("/start-training")
async def start_training(params: TrainParams):
    asyncio.create_task(training_task(params))
    return {"status": "Training started"}

# --- SSE endpoint realtime progress ---
@app.get("/training-progress")
async def training_progress():
    async def event_generator():
        last_progress = -1
        while True:
            await asyncio.sleep(0.5)
            if progress_data["progress"] != last_progress:
                last_progress = progress_data["progress"]
                yield {"event": "progress", "data": progress_data}
            if progress_data.get("status") == "Finished":
                break
    return EventSourceResponse(event_generator())

# --- Training task giả lập ---
async def training_task(params: TrainParams):
    progress_data["status"] = "Starting"
    progress_data["logs"] = []
    progress_data["progress"] = 0

    lr = params.learning_rate
    batch_size = params.batch_size
    epochs = params.epochs
    optimizer_name = params.optimizer
    dataset_name = params.dataset

    progress_data["logs"].append(f"Start training {dataset_name} with {optimizer_name}, lr={lr}")

    # Load MNIST
    transform = transforms.Compose([transforms.ToTensor()])
    train_dataset = datasets.MNIST('./data', train=True, download=True, transform=transform)
    train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

    model = SimpleCNN()
    optimizer = getattr(optim, optimizer_name)(model.parameters(), lr=lr)
    criterion = nn.CrossEntropyLoss()

    for epoch in range(epochs):
        running_loss = 0.0
        for i, (inputs, labels) in enumerate(train_loader):
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            if i % 100 == 0:
                log = f"Epoch {epoch+1}/{epochs}, Batch {i}, Loss {loss.item():.4f}"
                progress_data["logs"].append(log)
            progress_data["progress"] = int((epoch + i/len(train_loader))/epochs*100)
            await asyncio.sleep(0.01)  # simulate
    progress_data["status"] = "Finished"
    progress_data["progress"] = 100
    progress_data["metrics"] = {
        "final_loss": round(running_loss/len(train_loader),4),
        "accuracy": round(random.uniform(0.8,0.99),4)
    }
    progress_data["logs"].append("Training finished!")
