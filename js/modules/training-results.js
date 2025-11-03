// Training results module
export class TrainingResults {
    constructor() {
        this.downloadBtn = document.getElementById('downloadBtn');
        this.downloadChartBtn = document.getElementById('downloadChartBtn');
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
        if(this.downloadChartBtn) {
            this.downloadChartBtn.addEventListener('click', () => this.downloadChart());
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

    downloadChart() {
        const svg = document.getElementById('lossSvg');
        if (!svg) return;

        // Create a canvas with the same dimensions as the SVG
        const canvas = document.createElement('canvas');
        const w = svg.clientWidth || 200;
        const h = svg.clientHeight || 80;
        canvas.width = w * 2; // Double size for better quality
        canvas.height = h * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2); // Scale up for better quality

        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);

        // Create image from SVG and draw to canvas
        const img = new Image();
        img.onload = () => {
            // Draw dark background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, w, h);
            
            // Draw the SVG
            ctx.drawImage(img, 0, 0, w, h);
            
            // Ensure text is visible by setting composite operation
            ctx.globalCompositeOperation = 'source-over';
            URL.revokeObjectURL(url);

            // Convert to PNG and download
            const pngUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = 'model_loss_chart.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        img.src = url;
    }

    updateLossChart() {
        try {
            const svg = document.getElementById('lossSvg');
            const lossLine = document.getElementById('lossLine');
            const valLine = document.getElementById('valLine');
            if(!svg || !lossLine || !valLine) return;

            // Chart dimensions
            const w = 180; // Width of plotting area
            const h = 90; // Height of plotting area
            const n = Math.max(this.lossHistory.length, 1);
            
            const maxVal = Math.max(1, Math.max(...this.lossHistory.concat(this.valLossHistory), 1));
            
            // Update grid lines
            const gridLines = svg.querySelector('.grid-lines');
            gridLines.innerHTML = '';
            
            // Add horizontal grid lines
            const ySteps = 5;
            for(let i = 0; i <= ySteps; i++) {
                const y = 110 - (h * i / ySteps);
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", "40");
                line.setAttribute("y1", y.toString());
                line.setAttribute("x2", "220");
                line.setAttribute("y2", y.toString());
                gridLines.appendChild(line);
                
                // Add y-axis labels
                if (i > 0) { // Skip 0 as it's on the x-axis
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", "32");
                    text.setAttribute("y", (y + 4).toString());
                    text.setAttribute("text-anchor", "end");
                    text.setAttribute("class", "axis-label");
                    text.setAttribute("fill", "#ffffff"); // Ensure visible in download
                    text.textContent = ((maxVal * i/ySteps).toFixed(2));
                    gridLines.appendChild(text);
                }
            }
            
            // Add vertical grid lines
            const xSteps = Math.min(n, 8);
            for(let i = 0; i <= xSteps; i++) {
                const x = 40 + (w * i / xSteps);
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x.toString());
                line.setAttribute("y1", "20");
                line.setAttribute("x2", x.toString());
                line.setAttribute("y2", "110");
                gridLines.appendChild(line);
                
                // Add x-axis labels
                if (i > 0) { // Skip 0 as it's on the y-axis
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", x.toString());
                    text.setAttribute("y", "125");
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("class", "axis-label");
                    text.setAttribute("fill", "#ffffff"); // Ensure visible in download
                    text.textContent = Math.round((i * (n-1)/xSteps)).toString();
                    gridLines.appendChild(text);
                }
            }
            
            // Generate points for lines with adjusted coordinates
            const pointsLoss = this.lossHistory.map((v,i) => {
                const x = (n===1) ? 0 : (i/(n-1))*w;
                const y = 110 - ((v/maxVal)*h + 20); // Adjust for new coordinate system
                return `${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(' ');
            
            const pointsVal = this.valLossHistory.map((v,i) => {
                const x = (n===1) ? 0 : (i/(n-1))*w;
                const y = 110 - ((v/maxVal)*h + 20); // Adjust for new coordinate system
                return `${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(' ');
            
            lossLine.setAttribute('points', pointsLoss);
            valLine.setAttribute('points', pointsVal);
        } catch(e) {
            console.warn('updateLossChart', e);
        }
    }

    downloadModel() {
        const epochInput = document.getElementById('epochs');
        const model = {
            name: 'vgg16-demo',
            task: 'classification',
            epochs: epochInput ? (isNaN(parseInt(epochInput.value,10)) ? 50 : parseInt(epochInput.value,10)) : 50,
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