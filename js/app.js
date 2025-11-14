// Main application
import { TrainingOptions } from "./modules/training-options.js";
import { TrainingProgress } from "./modules/training-progress.js";
import { TrainingLogs } from "./modules/training-logs.js";
import { TrainingResults } from "./modules/training-results.js";
import {
  createTrainingTask,
  getTrainingTaskLogs,
  getTrainingTaskResult,
} from "./api.js";

class App {
  constructor() {
    this.options = new TrainingOptions();
    this.progress = new TrainingProgress();
    this.logs = new TrainingLogs();
    this.results = new TrainingResults();

    this.startBtn = document.getElementById("startBtn");
    this.taskId = null;
    this.logOffset = 0;
    this.polling = false;

    this.initializeControls();
    this.logs.log("Welcome AIOZ AI Training");
  }

  initializeControls() {
    if (this.startBtn) {
      this.startBtn.addEventListener("click", () => this.toggleTraining());
    }

  }

  localPathToURL(localPath) {
    const filename = localPath.split("/").pop();
    return `http://localhost:3000/images/${filename}`;
  }

  async toggleTraining() {
    if (this.startBtn.textContent === "Start Training") {
      this.startBtn.textContent = "Stop Training";
      await this.submitTask();
      this.results.reset();
      this.progress.reset();
    } else {
      this.stopTraining();
    }
  }

  stopTraining() {
    this.polling = false;
    this.startBtn.textContent = "Start Training";
    this.taskId = null;
    this.logs.log("Training stopped by user");
  }

  async submitTask() {
    this.clearUI();
    this.logs.clearLogs();
    this.results.reset();

    const options = this.options.getCurrentOptions();
    const config = this.options.buildTrainingConfig(options);
    this.results.updateInfo(options);

    this.taskType = options.task;
    this.startBtn.disabled = true;
    this.logs.log("Submitting training task to server...");
    this.progress.totalEpochs = config.epochs;
    try {
      const data_api = await createTrainingTask(config);
      // this.logs.log(`Task config: ${JSON.stringify(config)}`);

      if (data_api.success && data_api.data) {
        const taskKey = Object.keys(data_api.data)[0];
        this.taskId = data_api.data[taskKey];
        this.logs.log(`Task submitted successfully. Task ID: ${this.taskId}`);
        this.logOffset = 2;
        this.polling = true;

        this.pollLogs();
      } else {
        throw new Error(data_api.message || "Unknown API error");
      }
    } catch (err) {
      this.logs.log(`Error submitting task: ${err.message}`);
      this.startBtn.textContent = "Start Training";
    } finally {
      this.startBtn.disabled = false;
    }
  }

  async pollLogs() {
    if (!this.taskId || !this.polling) return;

    const poll = async () => {
      if (!this.polling) return;
      try {
        const data_api = await getTrainingTaskLogs(this.taskId, this.logOffset);

        if (data_api.success && data_api.data) {
          const { logs, next_offset, total_lines, status } = data_api.data;
          if (Array.isArray(logs)) {
            logs.forEach((line) => {
              const text = line.trim();
              if (!text) return;

              const epochRegex = /Epoch\s+(\d+)/i;
              const trainLossRegex = /Train\s+Loss\s*=\s*([\d.]+)/i;
              const accuracyRegex = /Validate\s+Accuracy\s*=\s*([\d.]+)/i;

              const epochMatch = text.match(epochRegex);
              const lossMatch = text.match(trainLossRegex);
              const accMatch = text.match(accuracyRegex);

              if (epochMatch || lossMatch || accMatch) {
                const epoch = epochMatch ? parseInt(epochMatch[1]) : null;
                const trainLoss = lossMatch ? parseFloat(lossMatch[1]) : null;
                const accuracy = accMatch
                  ? (parseFloat(accMatch[1]) * 100).toFixed(2)
                  : null;

                this.progress.updateProgress(epoch, trainLoss, accuracy);
                this.results.updateLossHistory(trainLoss);
              }
              this.logs.log(text);
            });

            const container = document.getElementById("logContainer");
            if (container) container.scrollTop = container.scrollHeight;
          }

          this.logOffset = next_offset;
          const hasLogs = (() => {
            if (Array.isArray(logs)) return logs.length > 0;
            if (typeof logs === "string") return logs.trim() !== "";
            return false;
          })();
          const reachedEnd = next_offset === total_lines;

          if (status === "pending") {
            setTimeout(poll, 1000);
          } else if (status === "success" && !hasLogs && reachedEnd) {
            // this.logs.log(`Task finished with status: ${status}`);
            this.startBtn.textContent = "Start Training";
            this.polling = false;

            this.fetchTaskResult();
          } else {
            setTimeout(poll, 1000);
          }
        } else {
          throw new Error(data_api.message || "Unknown API error");
        }
      } catch (err) {
        this.logs.log(`Error fetching logs: ${err.message}`);
        if (this.polling) setTimeout(poll, 2000);
      }
    };

    poll();
  }

  async fetchTaskResult() {
    if (!this.taskId) return;

    try {
      const data_api = await getTrainingTaskResult(this.taskId);
      if (data_api.success && data_api.data) {
        const resultInfo = data_api.data.result;
        const metaData = resultInfo.meta_data;
        const examples = resultInfo.result;

        if (metaData && typeof metaData === "object") {
          this.results.updateSystemStats(metaData);
        }
        if (examples) {
          const examples_data = examples.examples;
          const examplesWithURL = examples_data.map((ex) => ({
            ...ex,
            output: this.localPathToURL(ex.output, 3000),
          }));
          
          this.results.updateInferenceCarousel(examplesWithURL);
        }
        
      } else {
        throw new Error(data_api.message || "Unknown API error");
      }
    } catch (err) {
      this.logs.log(`Error fetching task result: ${err.message}`);
    }
  }

  clearUI() {
    this.results.reset();
    this.logs.clearLogs();
  }
}

window.initApp = () => {
  new App();
};
