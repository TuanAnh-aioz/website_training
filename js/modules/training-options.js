// Training options module
import { AVAILABLE_TRANSFORMS } from "./param/transforms.js";
import { AVAILABLE_MODELS } from "./param/models.js";

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

    populateModels() {
        const t = this.taskType.value || 'classification'; 
        this.modelSelect.innerHTML = ''; 

        const models = AVAILABLE_MODELS[t];
        Object.entries(models).forEach(([key, cfg]) => {
            const option = document.createElement('option');
            option.value = key;        
            option.textContent = cfg.label; 
            this.modelSelect.appendChild(option);
        });
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