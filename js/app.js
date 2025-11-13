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
        this.taskId = null; 
        this.logOffset = 0;
        this.apiToken = 'zxzfvsddsa';
        this.polling = false; 

        this.initializeControls();
        this.logs.log('UI ready');

        const examples = [
            { output: './public/images/cat_4004.jpg', label: 'cat' },
            { output: './public/images/cat_4019.jpg', label: 'cat' },
            { output: './public/images/cat_4014.jpg', label: 'cat' },
            { output: './public/images/cat_4019.jpg', label: 'cat' },
            { output: './public/images/cat_4004.jpg', label: 'cat' },
            { output: './public/images/cat_4019.jpg', label: 'cat' },
            { output: './public/images/cat_4014.jpg', label: 'cat' },
            { output: './public/images/cat_4004.jpg', label: 'cat' },
            { output: './public/images/cat_4014.jpg', label: 'cat' },
            { output: './public/images/cat_4004.jpg', label: 'cat' },
            { output: './public/images/cat_4014.jpg', label: 'cat' },
        ];
        this.results.updateInferenceCarousel(examples);
    }

    initializeControls() {
        if(this.startBtn) {
            this.startBtn.addEventListener('click', () => this.toggleTraining());
        }
    }

    async toggleTraining() {
        if(this.startBtn.textContent === 'Start Training') {
            this.startBtn.textContent = 'Stop Training';
            await this.submitTask();
        } else {
            this.stopTraining();
        }
    }

    async submitTask() {
        this.clearUI();
        this.logs.clearLogs();
        this.results.reset();

        const options = this.options.getCurrentOptions();
        const config = this.options.buildTrainingConfig(options);

        this.startBtn.disabled = true;
        this.logs.log('Submitting training task to server...');
        this.progress.totalEpochs = config.epochs
        try {
            const res = await fetch('http://10.0.0.238:8083/training/task/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'api-token': this.apiToken
                },
                body: JSON.stringify(config)
            });

            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data_api = await res.json();
            console.log(data_api);
            this.logs.log(`Task config: ${JSON.stringify(config)}`);
            
            const data = {
                success: true,
                data: "linux: 1b2fc81a-c914-469c-8891-cb278cefe32e"
            };

            if (data.success && data.data) {
                this.taskId = data.data.split(':')[1].trim();
                this.logs.log(`Task submitted successfully. Task ID: ${this.taskId}`);
                this.logOffset = 0;
                this.polling = true;

                this.pollLogs(); 
            } else {
                throw new Error(data.message || 'Unknown API error');
            }
        } catch (err) {
            this.logs.log(`Error submitting task: ${err.message}`, 'red');
            this.startBtn.textContent = 'Start Training';
        } finally {
            this.startBtn.disabled = false;
        }
    }

    stopTraining() {
        this.polling = false;
        this.startBtn.textContent = 'Start Training';
        this.taskId = null;
        this.logs.log('Training stopped by user', 'yellow');
    }

    async pollLogs() {
        if (!this.taskId || !this.polling) return;

        const poll = async () => {
            if (!this.polling) return;
            try {
                const url = `http://10.0.0.238:8083/training/task/${this.taskId}/logs?offset=${this.logOffset}&limit=10`;
                const res = await fetch(url, {
                    headers: {
                        'accept': 'application/json',
                        'api-token': this.apiToken
                    }
                });

                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const data = await res.json();

                if (data.success && data.data) {
                    const { logs, next_offset, status } = data.data;

                    if (Array.isArray(logs)) {
                        logs.forEach(line => {
                            const text = line.trim();
                            if (!text) return;

                            let color = 'white';
                            if (text.includes('WARNING')) color = 'orange';
                            else if (text.includes('ERROR')) color = 'red';
                            else if (text.includes('INFO')) color = '#7fbfff';
                            
                            const epochRegex = /Epoch\s+(\d+)/i;
                            const trainLossRegex = /Train\s+Loss\s*=\s*([\d.]+)/i;
                            const accuracyRegex = /'accuracy'\s*:\s*([\d.]+)/i;
                            
                            const epochMatch = text.match(epochRegex);
                            const lossMatch = text.match(trainLossRegex);
                            const accMatch = text.match(accuracyRegex);

                            if (epochMatch || lossMatch || accMatch) {
                                const epoch = epochMatch ? parseInt(epochMatch[1]) : null;
                                const trainLoss = lossMatch ? parseFloat(lossMatch[1]) : null;
                                const accuracy = accMatch ? (parseFloat(accMatch[1]) * 100).toFixed(2) : null;

                                this.progress.updateProgress(epoch, trainLoss, accuracy)
                            }
                            this.logs.log(text, color); 
                        });

                        const container = document.getElementById('logContainer');
                        if (container) container.scrollTop = container.scrollHeight;
                    }

                    this.logOffset = next_offset || this.logOffset;

                    if (status === 'processing' && this.polling) {
                        setTimeout(poll, 1000); 
                    } else {
                        this.logs.log(`Task finished with status: ${status}`, 'yellow');
                        this.startBtn.textContent = 'Start Training';
                        this.polling = false;
                    }
                } else {
                    throw new Error(data.message || 'Unknown API error');
                }
            } catch (err) {
                this.logs.log(`Error fetching logs: ${err.message}`, 'red');
                if (this.polling) setTimeout(poll, 2000);
            }
        };

        poll();
    }

    clearUI() {
        this.results.reset();
        this.logs.clearLogs();
    }
}


window.initApp = () => {
    new App();
};