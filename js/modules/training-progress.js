// Training progress module
export class TrainingProgress {
  constructor() {
    this.epochEl = document.getElementById("epoch");
    this.lossEl = document.getElementById("loss");
    this.accEl = document.getElementById("acc");
    this.valLossEl = document.getElementById("valLoss");
    this.progressBar = document.querySelector("#globalProgress > div");

    this.epoch = 0;
    this.totalEpochs = 0;
    this.running = false;
  }

  updateProgress(epoch, loss, acc) {
    this.epochEl.textContent = `${epoch}/${this.totalEpochs}`;
    this.lossEl.textContent = loss;
    try {
      let accStr = acc === null || acc === undefined ? "" : String(acc);
      accStr = accStr.replace(/%/g, "").trim();
      if (accStr === "") {
        this.accEl.textContent = "-";
      } else {
        this.accEl.textContent = accStr + "%";
      }
    } catch (e) {
      this.accEl.textContent = String(acc);
    }

    const pct = Math.round((epoch / this.totalEpochs) * 100);
    this.progressBar.style.width = pct + "%";
  }

  reset(updateUI = true) {
    this.epoch = 0;
    this.running = false;
    if (updateUI) this.updateProgress(0, "-", "-", "-");
  }

  format(n, digits = 3) {
    return Number(n).toFixed(digits);
  }
}
