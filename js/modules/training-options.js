import { AVAILABLE_TRANSFORMS } from "./param/transforms.js";
import { AVAILABLE_MODELS } from "./param/models.js";
import { AVAILABLE_OPTIMIZERS } from "./param/optimizers.js";
import { AVAILABLE_SCHEDULERS } from "./param/schedulers.js";

export class TrainingOptions {
    constructor() {
        this.currentMode = "train";
        this.expandedId = null;
        this.transformsData = { train: [], val: [] };
        this.optimizers = [];
        this.schedulers = [];
        this.elements = {}; 
        this.initElements();
    }

    initElements() {
        const selectors = {
            taskType: 'taskType',
            modelSelect: 'modelSelect',
            schedulerSelect: 'schedulerSelect',
            lossSelect: 'lossSelect',
            datasetSelect: 'datasetSelect',
            learningRate: 'learningRate',
            batchSize: 'batchSize',
            epochs: 'epochs',
            pretrained: 'pretrained',
            transformSelect: 'transformSelect',
            transformContainer: 'transformContainer',
            addTransformBtn: 'addTransform',
            transformPreview: 'transformPreview',
            trainBtn: 'trainMode',
            valBtn: 'valMode',
            optimizerSelect: 'optimizerSelect',
            addOptimizerBtn: 'addOptimizer',
            optimizerContainer: 'optimizerContainer',
            schedulerSelect: 'schedulerSelect',
            addSchedulerBtn: 'addScheduler',
            schedulerContainer: 'schedulerContainer'
        };

        const initInterval = setInterval(() => {
            let allFound = true;
            Object.entries(selectors).forEach(([key, id]) => {
                const el = document.getElementById(id);
                if (!el) allFound = false;
                this.elements[key] = el;
            });

            if (!allFound) return;

            clearInterval(initInterval);

            // Event listeners
            this.elements.taskType.addEventListener('change', () => this.populateModels());
            this.elements.trainBtn.addEventListener('click', () => this.setMode("train"));
            this.elements.valBtn.addEventListener('click', () => this.setMode("val"));
            this.elements.addTransformBtn.addEventListener('click', () => this.addTransform());
            this.populateModels();
            this.populateTransforms();
            this.populateDropdown(this.elements.optimizerSelect, AVAILABLE_OPTIMIZERS);
            this.populateDropdown(this.elements.schedulerSelect, AVAILABLE_SCHEDULERS);

            this.elements.addOptimizerBtn.addEventListener('click', () => this.addSingleItem('optimizer'));
            this.elements.addSchedulerBtn.addEventListener('click', () => this.addSingleItem('scheduler'));

            this.renderAll();
        }, 100);
    }

    populateDropdown(selectEl, data) {
        Object.keys(data).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data[key].label;
            selectEl.appendChild(opt);
        });
    }

    addSingleItem(type) {
        const key = type === 'optimizer' ? 'optimizerSelect' : 'schedulerSelect';
        const containerKey = type === 'optimizer' ? 'optimizerContainer' : 'schedulerContainer';
        const available = type === 'optimizer' ? AVAILABLE_OPTIMIZERS : AVAILABLE_SCHEDULERS;
        const list = type === 'optimizer' ? this.optimizers : this.schedulers;

        const name = this.elements[key].value;
        if (!name) return;

        const newItem = {
            id: Date.now().toString(),
            name,
            params: {}
        };
        available[name].params.forEach(p => newItem.params[p.name] = p.default);

        // Chỉ giữ 1 item
        if (type === 'optimizer') this.optimizers = [newItem];
        else this.schedulers = [newItem];

        this.renderItems(containerKey, list, available);
    }

    renderItems(containerKey, items, available) {
        const container = this.elements[containerKey];
        container.innerHTML = '';

        if (items.length === 0) {
            const p = document.createElement('p');
            p.className = `no-${containerKey.replace('Container','')}`;
            p.textContent = `No ${containerKey.replace('Container','')} added.`;
            container.appendChild(p);
            return;
        }

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = `${containerKey.replace('Container','')}-item`;

            const header = document.createElement('div');
            header.className = `${containerKey.replace('Container','')}-header`;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = available[item.name].label;

            const btnContainer = document.createElement('div');
            btnContainer.className = `${containerKey.replace('Container','')}-buttons`;

            const btnSettings = document.createElement('button');
            btnSettings.className = 'btn-settings';
            btnSettings.textContent = '⚙';
            btnSettings.title = 'Settings';

            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete';
            btnDelete.textContent = '✖';
            btnDelete.title = 'Remove';
            btnDelete.addEventListener('click', () => {
                if (containerKey === 'optimizerContainer') this.optimizers = [];
                else this.schedulers = [];
                this.renderItems(containerKey, containerKey === 'optimizerContainer' ? this.optimizers : this.schedulers, available);
            });

            btnContainer.appendChild(btnSettings);
            btnContainer.appendChild(btnDelete);
            header.appendChild(nameSpan);
            header.appendChild(btnContainer);

            div.appendChild(header);

            const paramsPanel = document.createElement('div');
            paramsPanel.className = 'params-panel';
            available[item.name].params.forEach(p => {
                const g = document.createElement('div');
                g.className = 'param-group';
                g.innerHTML = `<label>${p.label}</label>`;
                const input = document.createElement('input');
                input.type = p.type;
                input.value = item.params[p.name];
                input.addEventListener('input', e => {
                    item.params[p.name] = p.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                });
                g.appendChild(input);
                paramsPanel.appendChild(g);
            });
            div.appendChild(paramsPanel);

            btnSettings.addEventListener('click', () => {
                paramsPanel.style.display = paramsPanel.style.display === 'none' ? 'block' : 'none';
            });

            container.appendChild(div);
        });
    }

    renderAll() {
        this.renderItems('optimizerContainer', this.optimizers, AVAILABLE_OPTIMIZERS);
        this.renderItems('schedulerContainer', this.schedulers, AVAILABLE_SCHEDULERS);
        this.renderTransforms();
    }

    populateModels() {
        const t = this.elements.taskType.value || 'classification';
        this.elements.modelSelect.innerHTML = '';
        const models = AVAILABLE_MODELS[t];
        Object.entries(models).forEach(([key, cfg]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = cfg.label;
            this.elements.modelSelect.appendChild(option);
        });
    }

    setMode(mode) {
        this.currentMode = mode;
        this.expandedId = null;
        this.elements.trainBtn.classList.toggle("active", mode === "train");
        this.elements.valBtn.classList.toggle("active", mode === "val");
        this.renderTransforms();
    }

    populateTransforms() {
        this.elements.transformSelect.innerHTML = '<option value="">Select a transform...</option>';
        Object.keys(AVAILABLE_TRANSFORMS).forEach(t => {
            const option = document.createElement("option");
            option.value = t;
            option.textContent = AVAILABLE_TRANSFORMS[t].label;
            this.elements.transformSelect.appendChild(option);
        });
    }

    getCurrentTransforms() {
        return this.currentMode === 'train' ? this.transformsData.train : this.transformsData.val;
    }

    setCurrentTransforms(transforms) {
        if (this.currentMode === 'train') this.transformsData.train = transforms;
        else this.transformsData.val = transforms;
    }

    addTransform() {
        const val = this.elements.transformSelect.value;
        if (!val) return;

        const cfg = AVAILABLE_TRANSFORMS[val];
        const newTransform = { id: Date.now(), name: val, params: {} };
        cfg.params.forEach(p => newTransform.params[p.name] = p.default);

        const current = this.getCurrentTransforms();
        current.push(newTransform);
        this.setCurrentTransforms(current);

        this.elements.transformSelect.value = '';
        this.renderTransforms();
    }

    removeTransform(id) {
        let current = this.getCurrentTransforms().filter(t => t.id !== id);
        this.setCurrentTransforms(current);
        if (this.expandedId === id) this.expandedId = null;
        this.renderTransforms();
    }

    toggleParamPanel(id) {
        this.expandedId = this.expandedId === id ? null : id;
        this.renderTransforms();
    }

    updateParam(id, name, value) {
        const current = this.getCurrentTransforms();
        const t = current.find(t => t.id === id);
        if (t) t.params[name] = value;
        this.setCurrentTransforms(current);
        this.renderTransforms(false);
    }

    renderTransforms(refresh = true) {
        if (refresh) this.elements.transformContainer.innerHTML = '';
        const transforms = this.getCurrentTransforms();
        if (!transforms.length) {
            this.elements.transformContainer.innerHTML = '<p style="color:#9ca3af;font-size:12px;text-align:center;">No transforms added.</p>';
            this.elements.transformPreview.textContent = '';
            return;
        }

        transforms.forEach(t => {
            const cfg = AVAILABLE_TRANSFORMS[t.name];
            const div = document.createElement('div');
            div.className = 'transform-item';

            const header = document.createElement('div');
            header.className = 'transform-header';
            header.innerHTML = `
                <span>${cfg.label}</span>
                <div class="transform-buttons">
                    <button class="btn-settings" title="Settings">⚙</button>
                    <button class="btn-delete" title="Remove">✖</button>
                </div>
            `;
            header.querySelector('.btn-delete').addEventListener('click', () => this.removeTransform(t.id));
            header.querySelector('.btn-settings').addEventListener('click', () => this.toggleParamPanel(t.id));
            div.appendChild(header);

            if (this.expandedId === t.id) {
                cfg.params.forEach(p => {
                    const g = document.createElement('div');
                    g.className = 'param-group';
                    g.innerHTML = `<label>${p.name}</label>`;

                    if (p.type === 'select') {
                        const s = document.createElement('select');
                        p.options.forEach(opt => {
                            const o = document.createElement('option');
                            o.value = opt;
                            o.textContent = opt;
                            if (t.params[p.name] === opt) o.selected = true;
                            s.appendChild(o);
                        });
                        s.addEventListener('change', e => this.updateParam(t.id, p.name, e.target.value));
                        g.appendChild(s);
                    } else {
                        const i = document.createElement('input');
                        i.type = p.type === 'number' ? 'number' : 'text';
                        i.value = t.params[p.name];
                        i.addEventListener('input', e => this.updateParam(t.id, p.name, p.type === 'number' ? parseFloat(e.target.value) : e.target.value));
                        g.appendChild(i);
                    }
                    div.appendChild(g);
                });
            }
            this.elements.transformContainer.appendChild(div);
        });

        this.elements.transformPreview.textContent = JSON.stringify(transforms, null, 2);
    }

    getCurrentOptions() {
        return {
            model: this.elements.modelSelect?.value || 'Unknown',
            task: this.elements.taskType?.value || 'Classification',
            dataset: this.elements.datasetSelect?.value || '',
            optimizer: this.optimizers[0]?.name || '',
            scheduler: this.schedulers[0]?.name || '',
            loss: this.elements.lossSelect?.value || '',
            epochs: Number(this.elements.epochs?.value) || 5,
            batchSize: Number(this.elements.batchSize?.value) || 32,
            learningRate: Number(this.elements.learningRate?.value) || 0.001,
            pretrained: this.elements.pretrained?.checked || false,
            params: '21.1M'
        };
    }
}
