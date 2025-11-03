// Training progress module
export class TrainingProgress {
    constructor() {
        this.epochEl = document.getElementById('epoch');
        this.lossEl = document.getElementById('loss');
        this.accEl = document.getElementById('acc');
        this.valLossEl = document.getElementById('valLoss');
        this.progressBar = document.querySelector('#globalProgress > div');
        
        this.epoch = 0;
        this.totalEpochs = 50;
        this.running = false;
    }

    updateProgress(epoch, loss, acc, valLoss) {
        this.epochEl.textContent = `${epoch}/${this.totalEpochs}`;
        this.lossEl.textContent = loss;
        this.accEl.textContent = acc + '%';
        this.valLossEl.textContent = valLoss;
        
        const pct = Math.round((epoch/this.totalEpochs)*100);
        this.progressBar.style.width = pct + '%';
    }

    reset() {
        this.epoch = 0;
        this.running = false;
        this.updateProgress(0, '-', '-', '-');
    }

    format(n, digits=3) {
        return Number(n).toFixed(digits);
    }
}