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

        this.initializeControls();
        
        // Initial setup
        this.logs.log('UI ready');
    }

    initializeControls() {
        if(this.startBtn) {
            this.startBtn.addEventListener('click', () => this.submitTask());
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
            const data = {
                success: true,
                data: "task_id: 1b2fc81a-c914-469c-8891-cb278cefe32e"
            }
            if (data.success && data.data) {
                // API trả: "task_id: uuid"
                this.taskId = data.data.split(':')[1].trim();
                this.logs.log(`Task submitted successfully. Task ID: ${this.taskId}`);
                this.logOffset = 0;

                // bắt đầu poll log
                this.pollLogs();
            } else {
                throw new Error(data.message || 'Unknown API error');
            }

        } catch (err) {
            this.logs.log(`Error submitting task: ${err.message}`);
        } finally {
            this.startBtn.disabled = false;
        }
    }

    async pollLogs() {
        if (!this.taskId) return;

        const poll = async () => {
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

                            this.logs.log(text, color); 
                        });

                        const container = document.getElementById('logContainer');
                        if (container) container.scrollTop = container.scrollHeight;
                    }

                    this.logOffset = next_offset || this.logOffset;

                    if (status === 'processing') {
                        setTimeout(poll, 1000); 
                    } else {
                        this.logs.log(`Task finished with status: ${status}`, 'yellow');
                    }
                } else {
                    throw new Error(data.message || 'Unknown API error');
                }
            } catch (err) {
                this.logs.log(`Error fetching logs: ${err.message}`, 'red');
                setTimeout(poll, 2000); 
            }
        };

        poll();
    }

    clearUI() {
        this.results.reset();
        this.logs.clearLogs();
    }
}

// Initialize app after components are loaded
window.initApp = () => {
    new App();
};