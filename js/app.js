// Main application
import { TrainingOptions } from './modules/training-options.js';
import { TrainingProgress } from './modules/training-progress.js';
import { TrainingLogs } from './modules/training-logs.js';
import { TrainingResults } from './modules/training-results.js';

class App {
    constructor() {
        this.options = new TrainingOptions();
        this.progress = new TrainingProgress();
        this.logs = new TrainingLogs();
        this.results = new TrainingResults();
        
        this.startBtn = document.getElementById('startBtn');
        this.initializeControls();
        
        // Initial setup
        this.logs.log('UI ready');
        this.results.updateLossChart();
    }

    initializeControls() {
        if(this.startBtn) {
            this.startBtn.addEventListener('click', () => this.toggleTraining());
        }

        // Link model selection to tags update
        const modelSelect = document.getElementById('modelSelect');
        const taskType = document.getElementById('taskType');
        if(modelSelect) {
            modelSelect.addEventListener('change', () => {
                this.results.updateModelTags(taskType.value, modelSelect.value);
            });
        }
        if(taskType) {
            taskType.addEventListener('change', () => {
                setTimeout(() => {
                    this.results.updateModelTags(taskType.value, modelSelect.value);
                }, 0);
            });
        }
    }

    toggleTraining() {
        if(this.progress.running) {
            this.stopTraining();
        } else {
            this.startTraining();
        }
    }

    startTraining() {
        // Reset everything
        this.logs.clearLogs();
        this.progress.reset();
        this.results.reset();
        
        this.progress.running = true;
        this.startBtn.textContent = 'Stop Training';
        this.logs.log('Training started');

        // Log initial configuration
        const options = this.options.getCurrentOptions();
        this.logs.log(`Dataset=${options.dataset} Model=${options.model} Optimizer=${options.optimizer} Scheduler=${options.scheduler} Loss=${options.loss}`);
        
        this.step();
    }

    stopTraining() {
        this.progress.running = false;
        this.startBtn.textContent = 'Start Training';
        this.logs.log('Training stopped by user');
    }

    step() {
        if(!this.progress.running) return;

        this.progress.epoch++;
        
        const loss = Math.max(0.2, 2 * Math.exp(-this.progress.epoch/15) + Math.random()*0.2).toFixed(3);
        const acc = Math.min(99.9, 30 + this.progress.epoch*1.2 + Math.random()*3).toFixed(2);
        const valLoss = Math.max(0.2, loss - (Math.random()*0.2)).toFixed(3);

        this.progress.updateProgress(this.progress.epoch, loss, acc + '%', valLoss);
    this.logs.log(`Epoch ${this.progress.epoch}/${this.progress.totalEpochs} — Loss: ${loss} — Accuracy: ${acc}%`);
        
    this.results.updateLossHistory(loss, valLoss);
    // update epoch shown in the Model Loss card
    if(typeof this.results.updateEpoch === 'function') this.results.updateEpoch(this.progress.epoch);

        if(this.progress.epoch < this.progress.totalEpochs) {
            setTimeout(() => this.step(), 600 + Math.random()*600);
        } else {
            this.progress.running = false;
            this.startBtn.textContent = 'Start Training';
            this.logs.log('Training completed.');
        }
    }
}

// Initialize app after components are loaded
window.initApp = () => {
    new App();
};