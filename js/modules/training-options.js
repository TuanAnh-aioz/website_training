// Training options module
const MODELS = {
    classification: [
        'vgg16', 'vgg19', 'resnet18', 'resnet34', 'resnet50', 'resnet101', 'resnet152', 'mobilenet_v2', 'efficientnet_b0'
    ],
    detection: [
        'fasterrcnn_resnet50_fpn', 'retinanet_resnet50_fpn_v2', 'maskrcnn_resnet50_fpn', 'ssd300_vgg16'
    ]
};

const AVAILABLE_TRANSFORMS = {
    resize: {
        label: "Resize",
        params: [
            { name: "width", type: "number", default: 224 },
            { name: "height", type: "number", default: 224 },
            {
                name: "interpolation",
                type: "select",
                default: "bilinear",
                options: ["nearest", "bilinear", "bicubic", "lanczos"],
            },
        ],
    },
    normalize: {
        label: "Normalize",
        params: [
            { name: "mean", type: "text", default: "0.485, 0.456, 0.406" },
            { name: "std", type: "text", default: "0.229, 0.224, 0.225" },
        ],
    },
    horizontal_flip: {
        label: "Horizontal Flip",
        params: [{ name: "probability", type: "number", default: 0.5 }],
    },
    vertical_flip: {
        label: "Vertical Flip",
        params: [{ name: "probability", type: "number", default: 0.5 }],
    },
    rotation: {
        label: "Rotation",
        params: [
            { name: "degrees", type: "number", default: 15 },
            { name: "probability", type: "number", default: 0.5 },
        ],
    },
    color_jitter: {
        label: "Color Jitter",
        params: [
            { name: "brightness", type: "number", default: 0.2 },
            { name: "contrast", type: "number", default: 0.2 },
            { name: "saturation", type: "number", default: 0.2 },
            { name: "hue", type: "number", default: 0.1 },
        ],
    },
    random_crop: {
        label: "Random Crop",
        params: [
            { name: "size", type: "number", default: 224 },
            { name: "padding", type: "number", default: 0 },
        ],
    },
    center_crop: {
        label: "Center Crop",
        params: [
            { name: "size", type: "number", default: 224 },
        ],
    },
    gaussian_blur: {
        label: "Gaussian Blur",
        params: [
            { name: "kernel_size", type: "number", default: 3 },
            { name: "sigma", type: "number", default: 1.0 },
        ],
    },
    grayscale: {
        label: "Grayscale",
        params: [
            { name: "probability", type: "number", default: 0.1 },
        ],
    },
    randomResizedCrop: {
        label: "Random Resized Crop",
        params: [
            { name: "size", type: "number", default: 224 },
            { name: "scale_min", type: "number", default: 0.8 },
            { name: "scale_max", type: "number", default: 1.0 },
            { name: "ratio_min", type: "number", default: 0.75 },
            { name: "ratio_max", type: "number", default: 1.33 },
        ],
    },
    randomHorizontalFlip: {
        label: "Random Horizontal Flip",
        params: [
            { name: "probability", type: "number", default: 0.5 },
        ],
    },
    randomVerticalFlip: {
        label: "Random Vertical Flip",
        params: [
            { name: "probability", type: "number", default: 0.5 },
        ],
    },
    randomRotation: {
        label: "Random Rotation",
        params: [
            { name: "degrees", type: "number", default: 15 },
        ],
    },
    randomAffine: {
        label: "Random Affine",
        params: [
            { name: "degrees", type: "number", default: 15 },
            { name: "translate_x", type: "number", default: 0.1 },
            { name: "translate_y", type: "number", default: 0.1 },
            { name: "scale_min", type: "number", default: 0.9 },
            { name: "scale_max", type: "number", default: 1.1 },
            { name: "shear", type: "number", default: 10 },
        ],
    },
    randomPerspective: {
        label: "Random Perspective",
        params: [
            { name: "distortion_scale", type: "number", default: 0.5 },
            { name: "probability", type: "number", default: 0.5 },
        ],
    },
    gaussianBlur: {
        label: "Gaussian Blur",
        params: [
            { name: "kernel_size", type: "number", default: 3 },
            { name: "sigma", type: "number", default: 1.0 },
        ],
    },
    randomErasing: {
        label: "Random Erasing",
        params: [
            { name: "probability", type: "number", default: 0.5 },
            { name: "scale_min", type: "number", default: 0.02 },
            { name: "scale_max", type: "number", default: 0.33 },
            { name: "ratio_min", type: "number", default: 0.3 },
            { name: "ratio_max", type: "number", default: 3.3 },
        ],
    },
};

export class TrainingOptions {
    constructor() {
        this.trainTransforms = [];
        this.valTransforms = [];
        this.transforms = [];
        this.expandedId = null;
        this.currentMode = "train"; 

        this.initializeElements();
    }

    initializeElements() {
        const initInterval = setInterval(() => {
            this.taskType = document.getElementById('taskType');
            this.modelSelect = document.getElementById('modelSelect');
            this.optimizerSelect = document.getElementById('optimizerSelect');
            this.schedulerSelect = document.getElementById('schedulerSelect');
            this.lossSelect = document.getElementById('lossSelect');
            this.datasetSelect = document.getElementById('datasetSelect');
            this.learningRate = document.getElementById('learningRate');
            this.batchSize = document.getElementById('batchSize');
            this.epochs = document.getElementById('epochs');
            this.pretrained = document.getElementById('pretrained');
            
            this.transformSelect = document.getElementById("transformSelect");
            this.transformContainer = document.getElementById("transformContainer");
            this.addTransformBtn = document.getElementById("addTransform");
            this.preview = document.getElementById("transformPreview");

            this.trainBtn = document.getElementById("trainMode");
            this.valBtn = document.getElementById("valMode");

            if (this.taskType && this.modelSelect) {
                clearInterval(initInterval);
                this.taskType.addEventListener('change', () => {
                    this.populateModels();
                });
                this.populateModels();
            }

            if (this.transformSelect && this.addTransformBtn && this.trainBtn && this.valBtn) {
                clearInterval(initInterval);

                this.trainBtn.addEventListener("click", () => this.setMode("train"));
                this.valBtn.addEventListener("click", () => this.setMode("val"));

                this.addTransformBtn.addEventListener("click", () => this.addTransform());

                this.renderTransforms();
            }

        }, 100);
    }
    
    setMode(mode) {
        this.currentMode = mode;
        this.expandedId = null; 
        this.trainBtn.classList.toggle("active", mode === "train");
        this.valBtn.classList.toggle("active", mode === "val");
        this.populateTransforms(); 
        this.renderTransforms();
    }

    populateTransforms() {
        this.transformSelect.innerHTML = '<option value="">Select a transform...</option>';

        Object.keys(AVAILABLE_TRANSFORMS).forEach(t => {
            const option = document.createElement("option");
            option.value = t;
            option.textContent = AVAILABLE_TRANSFORMS[t].label;
            this.transformSelect.appendChild(option);
        });
    }

    getCurrentTransforms() {
        return this.currentMode === "train" ? this.trainTransforms : this.valTransforms;
    }

    setCurrentTransforms(transforms) {
        if (this.currentMode === "train") this.trainTransforms = transforms;
        else this.valTransforms = transforms;
    }

    populateModels() {
        const t = this.taskType.value || 'classification';
        this.modelSelect.innerHTML = '';
        MODELS[t].forEach(m => {
            const o = document.createElement('option');
            o.value = m;
            o.textContent = m;
            this.modelSelect.appendChild(o);
        });
    }

    addTransform() {
        const value = this.transformSelect.value;
        if (!value) return;

        const cfg = AVAILABLE_TRANSFORMS[value];
        const params = {};
        cfg.params.forEach(p => (params[p.name] = p.default));

        const newTransform = {
            id: Date.now(),
            name: value,
            params
        };

        const current = this.getCurrentTransforms();
        current.push(newTransform);
        this.setCurrentTransforms(current);

        this.transformSelect.value = "";
        this.renderTransforms();
    }

    removeTransform(id) {
        let current = this.getCurrentTransforms();
        current = current.filter(t => t.id !== id);
        this.setCurrentTransforms(current);
        if (this.expandedId === id) this.expandedId = null;
        this.renderTransforms();
    }


    toggleParamPanel(id) {
        this.expandedId = this.expandedId === id ? null : id;
        this.renderTransforms();
    }

    updateParam(id, paramName, value) {
        const current = this.getCurrentTransforms();
        const t = current.find(t => t.id === id);
        if (t) t.params[paramName] = value;
        this.setCurrentTransforms(current);
        this.renderTransforms(false);
    }

    renderTransforms(refresh = true) {
        if (refresh) this.transformContainer.innerHTML = "";

        const transforms = this.getCurrentTransforms();
        if (transforms.length === 0) {
            this.transformContainer.innerHTML = '<p style="color:#9ca3af;font-size:12px;text-align:center;">No transforms added.</p>';
            this.preview.textContent = '';
            return;
        }

        transforms.forEach(t => {
            const cfg = AVAILABLE_TRANSFORMS[t.name];
            const div = document.createElement("div");
            div.className = "transform-item";

            const header = document.createElement("div");
            header.className = "transform-header";
            header.innerHTML = `
                <span>${cfg.label}</span>
                <button class="btn-settings" title="Settings">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14,12.936a7.992,7.992,0,0,0,0-1.872l2.036-1.577a.5.5,0,0,0,.122-.654l-1.928-3.338a.5.5,0,0,0-.607-.222l-2.4.967a8.063,8.063,0,0,0-1.62-.936l-.36-2.553A.5.5,0,0,0,14.9,2H9.1a.5.5,0,0,0-.495.427l-.36,2.553a8.063,8.063,0,0,0-1.62.936l-2.4-.967a.5.5,0,0,0-.607.222L2.19,8.833a.5.5,0,0,0,.122.654L4.348,11.064a7.992,7.992,0,0,0,0,1.872L2.312,14.513a.5.5,0,0,0-.122.654l1.928,3.338a.5.5,0,0,0,.607.222l2.4-.967a8.063,8.063,0,0,0,1.62.936l.36,2.553A.5.5,0,0,0,9.1,22h5.8a.5.5,0,0,0,.495-.427l.36-2.553a8.063,8.063,0,0,0,1.62-.936l2.4.967a.5.5,0,0,0,.607-.222l1.928-3.338a.5.5,0,0,0-.122-.654ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
                </button>
                <button class="btn-delete" title="Remove">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 3v1H4v2h16V4h-5V3H9zm-3 6v12a1 1 0 001 1h10a1 1 0 001-1V9H6z"/></svg>
                </button>
            `;
            header.querySelector(".btn-delete").addEventListener("click", () => this.removeTransform(t.id));
            header.querySelector(".btn-settings").addEventListener("click", () => this.toggleParamPanel(t.id));
            div.appendChild(header);

            if (this.expandedId === t.id) {
                cfg.params.forEach(p => {
                    const g = document.createElement("div");
                    g.className = "param-group";
                    g.innerHTML = `<label>${p.name}</label>`;

                    if (p.type === "select") {
                        const s = document.createElement("select");
                        p.options.forEach(opt => {
                            const o = document.createElement("option");
                            o.value = opt;
                            o.textContent = opt;
                            if (t.params[p.name] === opt) o.selected = true;
                            s.appendChild(o);
                        });
                        s.addEventListener("change", e => this.updateParam(t.id, p.name, e.target.value));
                        g.appendChild(s);
                    } else {
                        const i = document.createElement("input");
                        i.type = p.type === "number" ? "number" : "text";
                        i.value = t.params[p.name];
                        i.addEventListener("input", e =>
                        this.updateParam(t.id, p.name, p.type === "number" ? parseFloat(e.target.value) : e.target.value)
                        );
                        g.appendChild(i);
                    }
                    div.appendChild(g);
                });
            }

            this.transformContainer.appendChild(div);
        });

        // Preview JSON
        this.preview.textContent = JSON.stringify(transforms, null, 2);
    }

    getCurrentOptions() {
        return {
            model: document.getElementById('modelSelect')?.value || 'Unknown',
            task: document.getElementById('taskType')?.value || 'Classification',
            dataset: document.getElementById('datasetSelect')?.value || '',
            optimizer: document.getElementById('optimizerSelect')?.value || '',
            scheduler: document.getElementById('schedulerSelect')?.value || '',
            loss: document.getElementById('lossSelect')?.value || '',
            epochs: Number(document.getElementById('epochs')?.value) || 5,
            batchSize: Number(document.getElementById('batchSize')?.value) || 32,
            learningRate: Number(document.getElementById('learningRate')?.value) || 0.001,
            pretrained: document.getElementById('pretrained')?.checked || false,
            params: '21.1M', // ví dụ cho model VGG16
        };
    }
}