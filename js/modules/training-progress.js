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
        // Normalize accuracy: strip any '%' characters and whitespace, then append one '%'
        try {
            let accStr = (acc === null || acc === undefined) ? '' : String(acc);
            accStr = accStr.replace(/%/g, '').trim();
            if (accStr === '') {
                this.accEl.textContent = '-';
            } else {
                this.accEl.textContent = accStr + '%';
            }
        } catch (e) {
            // fallback
            this.accEl.textContent = String(acc);
        }
        this.valLossEl.textContent = valLoss;
        
        const pct = Math.round((epoch/this.totalEpochs)*100);
        this.progressBar.style.width = pct + '%';
    }

    // Reset progress state. If updateUI is true (default) update the displayed metrics.
    reset(updateUI = true) {
        this.epoch = 0;
        this.running = false;
        if (updateUI) this.updateProgress(0, '-', '-', '-');
    }

    format(n, digits=3) {
        return Number(n).toFixed(digits);
    }
}