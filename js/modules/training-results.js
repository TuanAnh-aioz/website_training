// Training results module with Carousel
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

        // Carousel properties
        this.carouselSelector = '.inference-result-carousel';
        this.carouselTrack = null;
        this.carouselItems = [];
        this.carouselIndex = 0;
        this.visibleItems = 2;
        this.prevBtn = null;
        this.nextBtn = null;

        // Modal Carousel properties
        this.modal = document.getElementById('carouselModal');
        this.modalTrack = null;
        this.modalItems = [];
        this.modalIndex = 0;
        this.modalPrevBtn = null;
        this.modalNextBtn = null;
        this.modalCloseBtn = null;

        this.initializeControls();
        this.initializeCarousel();
        this.initializeModal();
    }

    initializeControls() {
        if(this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadModel());
        }
        if(this.downloadChartBtn) {
            this.downloadChartBtn.addEventListener('click', () => this.downloadChart());
        }
    }

    // --- Carousel setup ---
    initializeCarousel() {
        this.carousel = document.querySelector(this.carouselSelector);
        if (!this.carousel) return;

        this.carouselTrack = this.carousel.querySelector('.carousel-track');
        this.prevBtn = this.carousel.querySelector('.prev');
        this.nextBtn = this.carousel.querySelector('.next');

        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.movePrev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.moveNext());
        window.addEventListener('resize', () => this.updateItemWidth());

        const header = this.carousel.closest('.result-card')?.querySelector('.result-header');
        if (header) {
            const showBtn = document.createElement('button');
            showBtn.className = 'icon-button';
            showBtn.title = 'Show Carousel';
            showBtn.style.marginLeft = '8px';

            showBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" 
                        fill="currentColor"/>
                </svg>
            `;

            header.appendChild(showBtn);

            showBtn.addEventListener('click', () => {
                if (this.modal) {
                    this.modal.style.display = 'flex';
                    this.updateModalCarousel(this.carouselItems.map(item => ({
                        output: item.querySelector('img').src,
                        label: item.querySelector('div').textContent
                    })));

                    this.modalDots = this.modal.querySelector('.carousel-dots');
                    this.updateModalDots();
                }
            });
        }

    }

    updateItemWidth() {
        if (this.carouselItems.length === 0) return;

        const style = getComputedStyle(this.carouselItems[0]);
        this.itemWidth = this.carouselItems[0].getBoundingClientRect().width + parseInt(style.marginRight);

        const containerWidth = this.carousel.getBoundingClientRect().width;
        this.visibleItems = Math.floor(containerWidth / this.itemWidth);

        this.updateTrack();
    }

    movePrev() {
        if (this.carouselIndex > 0) this.carouselIndex--;
        this.updateTrack();
    }

    moveNext() {
        if (this.carouselIndex < this.carouselItems.length - this.visibleItems) this.carouselIndex++;
        this.updateTrack();
    }

    updateTrack() {
        if (!this.carouselTrack) return;
        const x = -this.itemWidth * this.carouselIndex;
        this.carouselTrack.style.transform = `translateX(${x}px)`;
        this.updateButtons();
    }

    updateButtons() {
        if (!this.prevBtn || !this.nextBtn) return;
        this.prevBtn.style.display = this.carouselIndex === 0 ? 'none' : 'block';
        this.nextBtn.style.display = this.carouselIndex >= this.carouselItems.length - this.visibleItems ? 'none' : 'block';
    }

    // --- Update Carousel with inference data ---
    updateInferenceCarousel(examples) {
        if (!this.carouselTrack) return;

        this.carouselTrack.innerHTML = '';
        this.carouselItems = examples.map(ex => {
            const box = document.createElement('div');
            box.className = 'inference-box';

            const img = document.createElement('img');
            img.src = ex.output;
            img.alt = ex.label;

            const label = document.createElement('div');
            label.textContent = ex.label;
            label.className = 'label';

            box.appendChild(img);
            box.appendChild(label);
            this.carouselTrack.appendChild(box);
            return box;
        });

        this.carouselIndex = 0;
        this.updateItemWidth();
        this.updateTrack();
    }

    // --- Modal Carousel setup ---
    initializeModal() {
        if (!this.modal) return;
        this.modalTrack = this.modal.querySelector('.carousel-track');
        this.modalPrevBtn = this.modal.querySelector('.prev');
        this.modalNextBtn = this.modal.querySelector('.next');
        this.modalCloseBtn = this.modal.querySelector('.modal-close');

        this.modalPrevBtn?.addEventListener('click', () => {
            if (this.modalItems.length === 0) return;

            this.modalIndex--;
            if (this.modalIndex < 0) this.modalIndex = this.modalItems.length - 1;

            this.updateModalTrack();
            this.updateModalDots();
        });

        this.modalNextBtn?.addEventListener('click', () => {
            if (this.modalItems.length === 0) return;

            this.modalIndex++;
            if (this.modalIndex >= this.modalItems.length) this.modalIndex = 0;

            this.updateModalTrack();
            this.updateModalDots();
        });
        this.modalCloseBtn?.addEventListener('click', () => {
            this.modal.style.display = 'none';
        });
    }

    updateModalCarousel(items) {
        if (!this.modalTrack) return;

        this.modalTrack.innerHTML = '';
        this.modalItems = items.map(ex => {
            const box = document.createElement('div');
            box.className = 'inference-box';

            const img = document.createElement('img');
            img.src = ex.output;
            img.alt = ex.label;

            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = ex.label;

            box.appendChild(img);
            box.appendChild(label);
            this.modalTrack.appendChild(box);
            return box;
        });

        this.modalIndex = 0;
        this.updateModalItemWidth();
        this.updateModalTrack();
    }

    updateModalItemWidth() {
        if (this.modalItems.length === 0) return;
        const style = getComputedStyle(this.modalItems[0]);
        this.modalItemWidth = this.modalItems[0].getBoundingClientRect().width + parseInt(style.marginRight);
    }

    updateModalTrack() {
        const x = -this.modalItemWidth * this.modalIndex;
        this.modalTrack.style.transform = `translateX(${x}px)`;
    }

    updateModalDots() {
        if(!this.modalDots) return;

        this.modalDots.innerHTML = '';
        this.modalItems.forEach((item, idx) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if(idx === this.modalIndex) dot.classList.add('active');

            dot.addEventListener('click', () => {
                this.modalIndex = idx;
                this.updateModalTrack();
            });

            this.modalDots.appendChild(dot);
        });
    }

    // --- Cập nhật vị trí ảnh + active dot ---
    updateModalTrack() {
        const x = -this.modalItemWidth * this.modalIndex;
        this.modalTrack.style.transform = `translateX(${x}px)`;

        // Update dots
        if(this.modalDots) {
            const dots = this.modalDots.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                if(idx === this.modalIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
    }


    // --- rest of original TrainingResults class ---
    updateEpoch(epoch) {
        const el = document.getElementById('trainingTitleEpoch');
        if (el) el.textContent = String(epoch);
    }

    downloadChart() {
        const svg = document.getElementById('lossSvg');
        if (!svg) return;
        const canvas = document.createElement('canvas');
        const w = svg.clientWidth || 200;
        const h = svg.clientHeight || 80;
        canvas.width = w * 2;
        canvas.height = h * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            ctx.globalCompositeOperation = 'source-over';
            URL.revokeObjectURL(url);
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
            const w = 180;
            const h = 90;
            const n = Math.max(this.lossHistory.length, 1);
            const maxVal = Math.max(1, Math.max(...this.lossHistory.concat(this.valLossHistory), 1));
            const gridLines = svg.querySelector('.grid-lines');
            gridLines.innerHTML = '';
            const ySteps = 5;
            for(let i = 0; i <= ySteps; i++) {
                const y = 110 - (h * i / ySteps);
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", "40");
                line.setAttribute("y1", y.toString());
                line.setAttribute("x2", "220");
                line.setAttribute("y2", y.toString());
                gridLines.appendChild(line);
                if (i > 0) {
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", "32");
                    text.setAttribute("y", (y + 4).toString());
                    text.setAttribute("text-anchor", "end");
                    text.setAttribute("class", "axis-label");
                    text.setAttribute("fill", "#ffffff");
                    text.textContent = ((maxVal * i/ySteps).toFixed(2));
                    gridLines.appendChild(text);
                }
            }
            const xSteps = Math.min(n, 8);
            for(let i = 0; i <= xSteps; i++) {
                const x = 40 + (w * i / xSteps);
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x.toString());
                line.setAttribute("y1", "20");
                line.setAttribute("x2", x.toString());
                line.setAttribute("y2", "110");
                gridLines.appendChild(line);
                if (i > 0) {
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", x.toString());
                    text.setAttribute("y", "125");
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("class", "axis-label");
                    text.setAttribute("fill", "#ffffff");
                    text.textContent = Math.round((i * (n-1)/xSteps)).toString();
                    gridLines.appendChild(text);
                }
            }
            const pointsLoss = this.lossHistory.map((v,i) => {
                const x = (n===1) ? 0 : (i/(n-1))*w;
                const y = 110 - ((v/maxVal)*h + 20);
                return `${x.toFixed(2)},${y.toFixed(2)}`;
            }).join(' ');
            const pointsVal = this.valLossHistory.map((v,i) => {
                const x = (n===1) ? 0 : (i/(n-1))*w;
                const y = 110 - ((v/maxVal)*h + 20);
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
            name: this.tagModel.textContent,
            task: this.tagTask.textContent,
            epochs: epochInput ? (isNaN(parseInt(epochInput.value,10)) ? 5 : parseInt(epochInput.value,10)) : 5,
            accuracy: document.getElementById('acc').textContent,
            params: this.tagParams.textContent
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
        if(this.tagModel) this.tagModel.textContent = '';
        if(this.tagParams) this.tagParams.textContent = '';
        if(this.tagTime) this.tagTime.textContent = '';
        if(this.tagTask) this.tagTask.textContent = '';
        // reset carousel
        if(this.carouselTrack) this.carouselTrack.innerHTML = '';
        this.carouselItems = [];
        this.carouselIndex = 0;
    }

    formatModelName(name) {
        if (!name) return "";
        return name.split('_').map(word =>
            word.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, c => c.toUpperCase())
        ).join(' ');
    }

    updateInfo(options, time) {
        if(this.tagModel) this.tagModel.textContent = this.formatModelName(options.model);
        if(this.tagParams) this.tagParams.textContent = String(options.params);
        if(this.tagTime) this.tagTime.textContent = String(time);
        if(this.tagTask) this.tagTask.textContent = this.formatModelName(options.task);
    }
}
