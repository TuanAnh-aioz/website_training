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

        // Live-sync epochs input so the progress display shows the configured total immediately
        const epochsInput = document.getElementById('epochs');
        if (epochsInput) {
            const syncEpochs = () => {
                const v = parseInt(epochsInput.value, 10);
                if (!Number.isNaN(v) && v > 0) {
                    this.progress.totalEpochs = v;
                    // read current displayed metrics
                    const loss = this.progress.lossEl ? this.progress.lossEl.textContent : '-';
                    let acc = this.progress.accEl ? this.progress.accEl.textContent : '-';
                    if (typeof acc === 'string' && acc.endsWith('%')) acc = acc.slice(0, -1);
                    const valLoss = this.progress.valLossEl ? this.progress.valLossEl.textContent : '-';
                    // update UI to show current epoch/totalEpochs
                    this.progress.updateProgress(this.progress.epoch, loss, acc, valLoss);
                }
            };
            epochsInput.addEventListener('input', syncEpochs);
            // also run once to sync initial value
            setTimeout(syncEpochs, 0);
        }
    }

    toggleTraining() {
        this.clearModelInfo();
        if(this.progress.running) {
            this.stopTraining();
        } else {
            this.startTraining();
        }
    }

    startTraining() {
        // Reset everything
        this.logs.clearLogs();
        // Read options and apply configured epochs
        const options = this.options.getCurrentOptions();
        if (options && options.epochs) {
            const e = Number(options.epochs);
            if (!Number.isNaN(e) && e > 0) this.progress.totalEpochs = e;
        }

        // reset internal state but avoid briefly showing 0/<epochs> in the UI
        this.progress.reset(false);
        this.results.reset();
        
        this.progress.running = true;
        this.startBtn.textContent = 'Stop Training';
        this.logs.log('Training started');

        // Log initial configuration
        this.logs.log(`Dataset=${options.dataset} Model=${options.model} Optimizer=${options.optimizer} Scheduler=${options.scheduler} Loss=${options.loss} Epochs=${this.progress.totalEpochs}`);
        this.step();
    }

    stopTraining() {
        this.progress.running = false;
        this.startBtn.textContent = 'Start Training';
        this.logs.log('Training stopped by user');
    }

    clearModelInfo() {
        this.results.reset()
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

            // get config in TrainingOptions
            const options = this.options.getCurrentOptions();
            console.log("options:", options)
            const config = this.options.buildTrainingConfig(options)
            console.log("config:", config)
            
            // update model info
            const time = `~${this.progress.totalEpochs * 2}s`
            this.results.updateInfo(options, time);
        }
    }
}

// Initialize app after components are loaded
window.initApp = () => {
    new App();
};