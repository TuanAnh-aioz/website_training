export class TrainingResults {
  constructor() {
    this.downloadBtn = document.getElementById("downloadBtn");
    this.downloadChartBtn = document.getElementById("downloadChartBtn");
    this.tagTask = document.getElementById("tagTask");
    this.tagModel = document.getElementById("tagModel");
    this.tagParams = document.getElementById("tagParams");

    this.lossHistory = [];

    this.carouselSelector = ".inference-result-carousel";
    this.carouselTrack = null;
    this.carouselItems = [];
    this.carouselIndex = 0;
    this.visibleItems = 2;
    this.prevBtn = null;
    this.nextBtn = null;

    this.modal = document.getElementById("carouselModal");
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
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.downloadModel());
    }
    if (this.downloadChartBtn) {
      this.downloadChartBtn.addEventListener("click", () =>
        this.downloadChart()
      );
    }
  }

  initializeCarousel() {
    this.carousel = document.querySelector(this.carouselSelector);
    if (!this.carousel) return;

    this.carouselTrack = this.carousel.querySelector(".carousel-track");
    this.prevBtn = this.carousel.querySelector(".prev");
    this.nextBtn = this.carousel.querySelector(".next");

    if (this.prevBtn)
      this.prevBtn.addEventListener("click", () => this.movePrev());
    if (this.nextBtn)
      this.nextBtn.addEventListener("click", () => this.moveNext());
    window.addEventListener("resize", () => this.updateItemWidth());

    const header = this.carousel
      .closest(".result-card-infer")
      ?.querySelector(".infer-header");
    if (header) {
      const showBtn = document.createElement("button");
      showBtn.className = "icon-button";
      showBtn.title = "Show Carousel";
      showBtn.style.marginLeft = "8px";

      showBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" 
                        fill="currentColor"/>
                </svg>
            `;

      header.appendChild(showBtn);

      showBtn.addEventListener("click", () => {
        if (this.modal) {
          this.modal.style.display = "flex";
          this.updateModalCarousel(
            this.carouselItems.map((item) => ({
              output: item.querySelector("img").src,
              label: item.querySelector("div").textContent,
            }))
          );

          this.modalDots = this.modal.querySelector(".carousel-dots");
          this.updateModalDots();
        }
      });
    }
  }

  updateItemWidth() {
    if (this.carouselItems.length === 0) return;

    const style = getComputedStyle(this.carouselItems[0]);
    this.itemWidth =
      this.carouselItems[0].getBoundingClientRect().width +
      parseInt(style.marginRight);

    const containerWidth = this.carousel.getBoundingClientRect().width;
    this.visibleItems = Math.floor(containerWidth / this.itemWidth);

    this.updateTrack();
  }

  movePrev() {
    if (this.carouselIndex > 0) this.carouselIndex--;
    this.updateTrack();
  }

  moveNext() {
    if (this.carouselIndex < this.carouselItems.length - this.visibleItems)
      this.carouselIndex++;
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
    this.prevBtn.style.display = this.carouselIndex === 0 ? "none" : "block";
    this.nextBtn.style.display =
      this.carouselIndex >= this.carouselItems.length - this.visibleItems
        ? "none"
        : "block";
  }

  updateInferenceCarousel(examples) {
    if (!this.carouselTrack) return;

    this.carouselTrack.innerHTML = "";
    this.carouselItems = examples.map((ex) => {
      const box = document.createElement("div");
      box.className = "inference-box";

      const img = document.createElement("img");
      img.src = ex.output;
      img.alt = ex.label;

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = ex.label;

      box.appendChild(img);
      box.appendChild(label);
      this.carouselTrack.appendChild(box);
      return box;
    });

    this.carouselIndex = 0;
    this.updateItemWidth();
    this.updateTrack();
  }

  initializeModal() {
    if (!this.modal) return;
    this.modalTrack = this.modal.querySelector(".carousel-track");
    this.modalPrevBtn = this.modal.querySelector(".prev");
    this.modalNextBtn = this.modal.querySelector(".next");
    this.modalCloseBtn = this.modal.querySelector(".modal-close");

    this.modalPrevBtn?.addEventListener("click", () => {
      if (this.modalItems.length === 0) return;

      this.modalIndex--;
      if (this.modalIndex < 0) this.modalIndex = this.modalItems.length - 1;

      this.updateModalTrack();
      this.updateModalDots();
    });

    this.modalNextBtn?.addEventListener("click", () => {
      if (this.modalItems.length === 0) return;

      this.modalIndex++;
      if (this.modalIndex >= this.modalItems.length) this.modalIndex = 0;

      this.updateModalTrack();
      this.updateModalDots();
    });
    this.modalCloseBtn?.addEventListener("click", () => {
      this.modal.style.display = "none";
    });
  }

  updateModalCarousel(items) {
    if (!this.modalTrack) return;

    this.modalTrack.innerHTML = "";
    this.modalItems = items.map((ex) => {
      const box = document.createElement("div");
      box.className = "inference-box";

      const img = document.createElement("img");
      img.src = ex.output;
      img.alt = ex.label;

      const label = document.createElement("div");
      label.className = "label";
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
    this.modalItemWidth =
      this.modalItems[0].getBoundingClientRect().width +
      parseInt(style.marginRight);
  }

  updateModalDots() {
    if (!this.modalDots) return;

    this.modalDots.innerHTML = "";
    this.modalItems.forEach((item, idx) => {
      const dot = document.createElement("div");
      dot.className = "carousel-dot";
      if (idx === this.modalIndex) dot.classList.add("active");

      dot.addEventListener("click", () => {
        this.modalIndex = idx;
        this.updateModalTrack();
      });

      this.modalDots.appendChild(dot);
    });
  }

  updateModalTrack() {
    const centerX = this.modalTrack.offsetWidth / 2;

    this.modalItems.forEach((item, idx) => {
      const offset = idx - this.modalIndex;
      const scale = Math.max(0.5, 1 - Math.abs(offset) * 0.2);
      const translateX = offset * (this.modalItemWidth / 2);

      item.style.transform = `translateX(${translateX}px) scale(${scale})`;
      item.style.zIndex = 10 - Math.abs(offset);
      item.style.opacity = scale;
    });

    // Update dots
    if (this.modalDots) {
      const dots = this.modalDots.querySelectorAll(".carousel-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === this.modalIndex);
      });
    }
  }

  updateSystemStats(meta_data) {
    const ramFill = document.querySelector(".meta-fill.ram");
    const gpuFill = document.querySelector(".meta-fill.gpu");
    const ramInfo = document.getElementById("ram-info");
    const gpuInfo = document.getElementById("gpu-info");
    const processingTime = document.getElementById("processing-time");

    if (!meta_data || (Array.isArray(meta_data) && meta_data.length === 0)) {
      ramFill.style.width = "0%";
      gpuFill.style.width = "0%";

      ramInfo.textContent = `0.00 / 0.00 GB`;
      gpuInfo.textContent = `0.00 / 0.00 GB`;
      processingTime.textContent = `0.00 s`;

      return;
    }

    const sys = meta_data.resource?.system_ram || { usage: 0, total: 1 };
    const gpu = meta_data.resource?.gpu_memory || { usage: 0, total: 1 };

    const ramUsageGB = (sys.usage / 1e9).toFixed(2);
    const ramTotalGB = (sys.total / 1e9).toFixed(2);
    const gpuUsageGB = (gpu.usage / 1e9).toFixed(2);
    const gpuTotalGB = (gpu.total / 1e9).toFixed(2);

    const ramPercent = (sys.usage / sys.total) * 100;
    const gpuPercent = (gpu.usage / gpu.total) * 100;

    ramFill.style.width = `${ramPercent}%`;
    gpuFill.style.width = `${gpuPercent}%`;

    ramInfo.textContent = `${ramUsageGB} / ${ramTotalGB} GB`;
    gpuInfo.textContent = `${gpuUsageGB} / ${gpuTotalGB} GB`;

    const ptime = meta_data.processing_time || 0;
    processingTime.textContent = `${
      ptime.toFixed ? ptime.toFixed(2) : "0.00"
    } s`;
  }

  updateEpoch(epoch) {
    const el = document.getElementById("trainingTitleEpoch");
    if (el) el.textContent = String(epoch);
  }

  downloadChart() {
    const svg = document.getElementById("lossSvg");
    if (!svg) return;
    const canvas = document.createElement("canvas");
    const w = svg.clientWidth || 200;
    const h = svg.clientHeight || 80;
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "model_loss_chart.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = url;
  }

  updateLossHistory(loss) {
    this.lossHistory.push(Number(loss));
    this.updateLossChart();
  }

  updateLossChart() {
    const svg = document.getElementById("lossSvg");
    if (!svg) return;

    svg.innerHTML = ""; // reset

    if (this.lossHistory.length === 0) {
      const path = svg.querySelector("path");
      if (path) path.remove();
      return;
    }

    const w = svg.clientWidth || 400;
    const h = svg.clientHeight || 150;

    const padding = {
      left: 45,
      right: 15,
      top: 20,
      bottom: 30,
    };

    const innerW = w - padding.left - padding.right;
    const innerH = h - padding.top - padding.bottom;

    if (this.lossHistory.length === 0) return;

    const data = this.lossHistory;
    const n = data.length;

    const minLoss = Math.min(...data);
    const maxLoss = Math.max(...data);
    const range = maxLoss - minLoss || 1;

    // -------------------------------
    // CREATE LAYERS
    // -------------------------------
    const gridLayer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    const axisLayer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    const lineLayer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    const fillLayer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    svg.appendChild(gridLayer);
    svg.appendChild(fillLayer);
    svg.appendChild(lineLayer);
    svg.appendChild(axisLayer);

    // -------------------------------
    // GRID + AXIS
    // -------------------------------
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding.top + (innerH * i) / ySteps;

      // grid line
      const line = document.createElementNS(svg.namespaceURI, "line");
      line.setAttribute("x1", padding.left);
      line.setAttribute("x2", w - padding.right);
      line.setAttribute("y1", y);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "rgba(255,255,255,0.08)");
      gridLayer.appendChild(line);

      // label
      const label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute("x", padding.left - 8);
      label.setAttribute("y", y + 4);
      label.setAttribute("text-anchor", "end");
      label.setAttribute("fill", "#aaa");
      label.setAttribute("font-size", "10");
      const value = maxLoss - (range * i) / ySteps;
      label.textContent = value.toFixed(3);
      axisLayer.appendChild(label);
    }

    // X axis line
    const xAxis = document.createElementNS(svg.namespaceURI, "line");
    xAxis.setAttribute("x1", padding.left);
    xAxis.setAttribute("x2", w - padding.right);
    xAxis.setAttribute("y1", h - padding.bottom);
    xAxis.setAttribute("y2", h - padding.bottom);
    xAxis.setAttribute("stroke", "rgba(255,255,255,0.25)");
    axisLayer.appendChild(xAxis);

    // -------------------------------
    // COMPUTE SMOOTH POINTS
    // -------------------------------
    const pts = data.map((v, i) => {
      const x = padding.left + (i / (n - 1)) * innerW;
      const y = padding.top + ((maxLoss - v) / range) * innerH;
      return [x, y];
    });

    // Spline curve builder
    const buildCurve = (pts) => {
      let d = "";
      for (let i = 0; i < pts.length; i++) {
        const [x, y] = pts[i];
        if (i === 0) {
          d += `M${x},${y}`;
        } else {
          const [x0, y0] = pts[i - 1];
          const cx = (x0 + x) / 2;
          d += ` C${cx},${y0} ${cx},${y} ${x},${y}`;
        }
      }
      return d;
    };

    const pathD = buildCurve(pts);

    // -------------------------------
    // GRADIENT FILL
    // -------------------------------
    const defs = document.createElementNS(svg.namespaceURI, "defs");

    const grad = document.createElementNS(svg.namespaceURI, "linearGradient");
    grad.setAttribute("id", "lossFill");
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "0");
    grad.setAttribute("x2", "0");
    grad.setAttribute("y2", "1");

    const stop1 = document.createElementNS(svg.namespaceURI, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#38bdf8");
    stop1.setAttribute("stop-opacity", "0.45");

    const stop2 = document.createElementNS(svg.namespaceURI, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#38bdf8");
    stop2.setAttribute("stop-opacity", "0");

    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);

    svg.prepend(defs);

    // Fill area under curve
    const fillPath = document.createElementNS(svg.namespaceURI, "path");
    fillPath.setAttribute(
      "d",
      `${pathD} L${pts[n - 1][0]},${h - padding.bottom} 
         L${pts[0][0]},${h - padding.bottom} Z`
    );
    fillPath.setAttribute("fill", "url(#lossFill)");
    fillLayer.appendChild(fillPath);

    // -------------------------------
    // LOSS LINE
    // -------------------------------
    const line = document.createElementNS(svg.namespaceURI, "path");
    line.setAttribute("d", pathD);
    line.setAttribute("stroke", "#38bdf8");
    line.setAttribute("stroke-width", "2.2");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    lineLayer.appendChild(line);
  }

  downloadModel() {
    const epochInput = document.getElementById("epochs");
    const model = {
      name: this.tagModel.textContent,
      task: this.tagTask.textContent,
      epochs: epochInput
        ? isNaN(parseInt(epochInput.value, 10))
          ? 5
          : parseInt(epochInput.value, 10)
        : 5,
      accuracy: document.getElementById("acc").textContent,
      params: this.tagParams.textContent,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(model, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "model.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  reset() {
    this.lossHistory = [];
    this.updateLossChart();
    if (this.tagModel) this.tagModel.textContent = "";
    if (this.tagParams) this.tagParams.textContent = "";
    if (this.tagTask) this.tagTask.textContent = "";

    if (this.carouselTrack) this.carouselTrack.innerHTML = "";
    this.carouselItems = [];
    this.carouselIndex = 0;
    this.updateSystemStats([]);
  }

  formatModelName(name) {
    if (!name) return "";
    return name
      .split("_")
      .map((word) =>
        word
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/^\w/, (c) => c.toUpperCase())
      )
      .join(" ");
  }

  updateInfo(options) {
    if (this.tagModel)
      this.tagModel.textContent = this.formatModelName(options.model);
    if (this.tagParams) this.tagParams.textContent = String(options.params);
    if (this.tagTask)
      this.tagTask.textContent = this.formatModelName(options.task);
  }
}
