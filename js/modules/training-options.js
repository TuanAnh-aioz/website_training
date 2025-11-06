// Training options module
import { AVAILABLE_TRANSFORMS } from "./param/transforms.js";
import { AVAILABLE_MODELS } from "./param/models.js";
import { AVAILABLE_OPTIMIZERS } from "./param/optimizers.js";

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

            this.optimizerSelect = document.getElementById('optimizerSelect');
            this.addOptimizerBtn = document.getElementById('addOptimizer');
            this.optimizerContainer = document.getElementById('optimizerContainer');
            this.optimizers = [];
            
            Object.keys(AVAILABLE_OPTIMIZERS).forEach(key => {
                const opt = AVAILABLE_OPTIMIZERS[key];
                const option = document.createElement('option');
                option.value = key;
                option.textContent = opt.label;
                this.optimizerSelect.appendChild(option);
            });

            // Add button
            this.addOptimizerBtn.addEventListener('click', () => {
                const optName = this.optimizerSelect.value;
                if (!optName) return;

                const newId = Date.now().toString();
                const params = {};
                AVAILABLE_OPTIMIZERS[optName].params.forEach(p => params[p.name] = p.default);

                this.optimizers = [  
                    {
                        id: newId,
                        name: optName,
                        params
                    }
                ];

                this.renderOptimizers();
            });
            this.renderOptimizers();

        }, 100);
    }

    renderOptimizers() {
        this.optimizerContainer.innerHTML = '';

        if (this.optimizers.length === 0) {
            const p = document.createElement('p');
            p.className = 'no-optimizer';
            p.textContent = 'No optimizers added.';
            this.optimizerContainer.appendChild(p);
            return;
        }

        this.optimizers.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'optimizer-item';

            // Header
            const header = document.createElement('div');
            header.className = 'optimizer-header';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = AVAILABLE_OPTIMIZERS[opt.name].label;

            const btnContainer = document.createElement('div');
            btnContainer.className = 'optimizer-buttons';

            const btnSettings = document.createElement('button');
            btnSettings.className = 'btn-settings';
            btnSettings.textContent = '⚙';
            btnSettings.title = 'Settings';
            btnSettings.addEventListener('click', () => {
                paramsPanel.style.display = paramsPanel.style.display === 'none' ? 'block' : 'none';
            });

            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete';
            btnDelete.textContent = '✖';
            btnDelete.title = 'Remove';
            btnDelete.addEventListener('click', () => {
                this.optimizers = this.optimizers.filter(o => o.id !== opt.id);
                this.renderOptimizers();
            });

            btnContainer.appendChild(btnSettings);
            btnContainer.appendChild(btnDelete);

            header.appendChild(nameSpan);
            header.appendChild(btnContainer);

            div.appendChild(header);

            // Params panel
            const paramsPanel = document.createElement('div');
            paramsPanel.className = 'params-panel';
            AVAILABLE_OPTIMIZERS[opt.name].params.forEach(p => {
                const g = document.createElement('div');
                g.className = 'param-group';
                g.innerHTML = `<label>${p.label}</label>`;
                const input = document.createElement('input');
                input.type = p.type;
                input.value = opt.params[p.name];
                input.addEventListener('input', e => {
                    opt.params[p.name] = p.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                });
                g.appendChild(input);
                paramsPanel.appendChild(g);
            });

            div.appendChild(paramsPanel);
            this.optimizerContainer.appendChild(div);
        });
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
                <div class="transform-buttons">
                    <button class="btn-settings" title="Settings">⚙</button>
                    <button class="btn-delete" title="Remove">✖</button>
                </div>
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
            params: '21.1M',
        };
    }
}