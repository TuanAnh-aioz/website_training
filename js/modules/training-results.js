// Training results module
export class TrainingResults {
    constructor() {
        this.downloadBtn = document.getElementById('downloadBtn');
        this.tagTask = document.getElementById('tagTask');
        this.tagModel = document.getElementById('tagModel');
        this.tagParams = document.getElementById('tagParams');
        this.tagTime = document.getElementById('tagTime');
        
        this.lossHistory = [];
        this.valLossHistory = [];
        
        this.initializeControls();
    }

    initializeControls() {
        if(this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadModel());
        }
    }

    updateModelTags(taskType, modelName) {
        if(this.tagTask) this.tagTask.textContent = `Task: ${taskType.charAt(0).toUpperCase() + taskType.slice(1)}`;
        if(this.tagModel) this.tagModel.textContent = `Model: ${modelName}`;
        if(this.tagParams) this.tagParams.textContent = `Parameters: 2.4M`;
        if(this.tagTime) this.tagTime.textContent = `Training Time: ~100s`;
    }

    updateEpoch(epoch) {
        const el = document.getElementById('trainingTitleEpoch');
        // the HTML contains the word "Epoch" and the span should only contain the number
        if (el) el.textContent = String(epoch);
        // remove legacy small element update (no longer used)
    }

    updateLossChart() {
        try {
            const svg = document.getElementById('lossSvg');
            const lossLine = document.getElementById('lossLine');
            const valLine = document.getElementById('valLine');
            if(!svg || !lossLine || !valLine) return;

            const w = 200;
            const h = 80;
            const n = Math.max(this.lossHistory.length, 1);
            
            const maxVal = Math.max(1, Math.max(...this.lossHistory.concat(this.valLossHistory), 1));
            
            const pointsLoss = this.lossHistory.map((v,i) => {
                const x = (n===1) ? 0 : (i/(n-1))*w;
                const y = h - (v/maxVal)*h;
                return `${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(' ');
            
            const pointsVal = this.valLossHistory.map((v,i) => {
                const x = (n===1) ? 0 : (i/(n-1))*w;
                const y = h - (v/maxVal)*h;
                return `${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(' ');
            
            lossLine.setAttribute('points', pointsLoss);
            valLine.setAttribute('points', pointsVal);
        } catch(e) {
            console.warn('updateLossChart', e);
        }
    }

    downloadModel() {
        const model = {
            name: 'vgg16-demo',
            task: 'classification',
            epochs: 50,
            accuracy: document.getElementById('acc').textContent,
            params: '2.4M'
        };
        
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(model, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = 'model.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    updateLossHistory(loss, valLoss) {
        this.lossHistory.push(Number(loss));
        this.valLossHistory.push(Number(valLoss));
        this.updateLossChart();
    }

    reset() {
        this.lossHistory = [];
        this.valLossHistory = [];
        this.updateLossChart();
    }
}