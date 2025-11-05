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
      { name: "mean", type: "text", default: "0.485,0.456,0.406" },
      { name: "std", type: "text", default: "0.229,0.224,0.225" },
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
};

export class TrainingOptions {
    constructor() {
        this.transforms = [];
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
            // this.transformSelect = document.getElementById('transformSelect');
            
            this.transformSelect = document.getElementById("transformSelect");
            this.transformContainer = document.getElementById("transformContainer");
            this.addTransformBtn = document.getElementById("addTransform");
            this.preview = document.getElementById("transformPreview");

            if (this.taskType && this.modelSelect) {
                clearInterval(initInterval);
                this.taskType.addEventListener('change', () => {
                    this.populateModels();
                });
                this.populateModels();
            }

            // if (this.transformSelect) {
            //     clearInterval(initInterval);
            //     this.taskType.addEventListener('change', () => {
            //         this.populateTransforms();
            //     });
            //     this.populateTransforms();
            // }

            if (this.transformSelect && this.addTransformBtn) {
                clearInterval(initInterval);
                this.populateTransforms();
                this.addTransformBtn.addEventListener("click", () =>
                this.addTransform()
                );
                this.renderTransforms();
            }

        }, 100);
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
        cfg.params.forEach((p) => (params[p.name] = p.default));

        this.transforms.push({
        id: Date.now(),
        name: value,
        enabled: true,
        params,
        });

        this.transformSelect.value = "";
        this.renderTransforms();
    }

    removeTransform(id) {
        this.transforms = this.transforms.filter(t => t.id !== id);
        this.renderTransforms();
    }

    toggleTransform(id) {
        const t = this.transforms.find(t => t.id === id);
        if (t) t.enabled = !t.enabled;
        this.renderTransforms();
    }
    
    updateParam(id, paramName, value) {
        const t = this.transforms.find((t) => t.id === id);
        if (t) {
        t.params[paramName] = value;
        this.renderTransforms(false); // không reset UI hoàn toàn
        }
    }

    renderTransforms(refresh = true) {
        if (refresh) this.transformContainer.innerHTML = "";

        if (this.transforms.length === 0) {
        this.transformContainer.innerHTML =
            '<p style="color:#9ca3af;font-size:12px;text-align:center;">No transforms added.</p>';
        this.preview.textContent = "";
        return;
        }

        this.transforms.forEach((t) => {
        const cfg = AVAILABLE_TRANSFORMS[t.name];
        const div = document.createElement("div");
        div.className = "transform-item";

        div.innerHTML = `
            <div class="transform-header">
            <input type="checkbox" ${t.enabled ? "checked" : ""}>
            <span>${cfg.label}</span>
            <button>&times;</button>
            </div>
        `;

        // Param inputs
        cfg.params.forEach((p) => {
            const g = document.createElement("div");
            g.className = "param-group";

            g.innerHTML = `<label>${p.name}</label>`;

            if (p.type === "select") {
            const s = document.createElement("select");
            p.options.forEach((opt) => {
                const o = document.createElement("option");
                o.value = opt;
                o.textContent = opt;
                if (t.params[p.name] === opt) o.selected = true;
                s.appendChild(o);
            });
            s.addEventListener("change", (e) =>
                this.updateParam(t.id, p.name, e.target.value)
            );
            g.appendChild(s);
            } else {
            const i = document.createElement("input");
            i.type = p.type === "number" ? "number" : "text";
            i.value = t.params[p.name];
            i.addEventListener("input", (e) =>
                this.updateParam(
                t.id,
                p.name,
                p.type === "number" ? parseFloat(e.target.value) : e.target.value
                )
            );
            g.appendChild(i);
            }
            div.appendChild(g);
        });

        div.querySelector("input[type=checkbox]").addEventListener("change", () =>
            this.toggleTransform(t.id)
        );
        div.querySelector("button").addEventListener("click", () =>
            this.removeTransform(t.id)
        );

        this.transformContainer.appendChild(div);
        });

        this.preview.textContent = JSON.stringify(this.transforms, null, 2);
    }

    populateTransforms() {
        this.transformSelect.innerHTML =
        '<option value="">Select a transform...</option>';
        Object.entries(AVAILABLE_TRANSFORMS).forEach(([key, cfg]) => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = cfg.label;
        this.transformSelect.appendChild(opt);
        });
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