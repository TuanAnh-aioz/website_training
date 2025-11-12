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
        this.platformsData = {};  
        this.selectedPlatforms = [];
        this.elements = {}; 
        this.initElements();
    }

    initElements() {
        const selectors = {
            taskType: 'taskType',
            modelSelect: 'modelSelect',
            threshold: 'threshold',
            schedulerSelect: 'schedulerSelect',
            lossSelect: 'lossSelect',
            datasetSelect: 'datasetSelect',
            valRatio: 'valRatio',
            numberWroker: 'numberWroker',
            learningRate: 'learningRate',
            batchSize: 'batchSize',
            epochs: 'epochs',
            pretrained: 'pretrained',
            transformSelect: 'transformSelect',
            transformContainer: 'transformContainer',
            addTransformBtn: 'addTransform',
            trainBtn: 'trainMode',
            valBtn: 'valMode',
            optimizerSelect: 'optimizerSelect',
            addOptimizerBtn: 'addOptimizer',
            optimizerContainer: 'optimizerContainer',
            schedulerSelect: 'schedulerSelect',
            addSchedulerBtn: 'addScheduler',
            schedulerContainer: 'schedulerContainer',
            platformSelect: 'platformSelect',
            platformContainer: 'platformContainer',
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

            this.fetchPlatforms();

            this.renderAll();
        }, 100);
    }

    async fetchPlatforms() {
        try {
            const res = await fetch('http://your-api-endpoint/platforms', {
                headers: { 'accept': 'application/json', 'api-token': this.apiToken }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            // const data = {
            //     linux: [
            //         { 
            //             node_id: "ABC", 
            //             system: { 
            //                 os: "linux", 
            //                 cpu_cores: 8, 
            //                 system_ram: 67355385856, 
            //                 architecture: "x86_64", 
            //                 gpu_devices: [
            //                     { id: 0, name: "NVIDIA GeForce GTX 1080 Ti", total: 11811160064 },
            //                 ],
            //             }
            //         }
            //     ],
            //     windows: [
            //         { 
            //             node_id: "DEF", 
            //             system: { 
            //                 os: "windows", 
            //                 cpu_cores: 2, 
            //                 system_ram: 33234206720, 
            //                 architecture: "AMD64", 
            //                 gpu_devices: [
            //                     { id: 0, name: "NVIDIA GeForce GTX 3080 Ti", total: 24811160064 },
            //                 ],
            //             }
            //         }
            //     ]
            // };
            
            this.platformsData = data; 
            this.populatePlatformDropdown(data);
        } catch (err) {
            console.error("Error fetching platforms:", err);
            const select = this.elements.platformSelect;
            if (select) select.innerHTML = '<option value="" disabled>Error loading platforms</option>';
        }
    }

    populatePlatformDropdown() {
        const select = this.elements.platformSelect;
        if (!select) return;

        Object.entries(this.platformsData).forEach(([os, nodes]) => {
            nodes.forEach(n => {
                const option = document.createElement('option');
                option.value = `${os}_${n.node_id}`;
                option.textContent = `${os.toUpperCase()}`;
                select.appendChild(option);
            });
        });

        select.addEventListener('change', () => {
            this.addSelectedPlatform(select.value);
            select.value = '';
        });
    }

    addSelectedPlatform(platformKey) {
        if (!platformKey) return;

        if (this.selectedPlatforms.some(p => p.key === platformKey)) return; // tránh trùng

        const [os, node_id] = platformKey.split("_");
        const platformInfo = this.platformsData[os]?.find(p => p.node_id === node_id);
        if (!platformInfo) return;

        this.selectedPlatforms.push({ key: platformKey, info: platformInfo });
        this.renderPlatforms();
    }

    renderPlatforms() {
        const container = this.elements.platformContainer || document.getElementById('platformContainer');
        if (!container) return;
        container.innerHTML = '';

        if (!this.selectedPlatforms || this.selectedPlatforms.length === 0) {
                const p = document.createElement('p');
                p.style.color = '#9ca3af';
                p.style.fontSize = '12px';
                p.style.textAlign = 'center';
                p.textContent = 'No platform selected.';
                container.appendChild(p);
            this.elements.platformPreview && (this.elements.platformPreview.textContent = '');
            return;
        }

        this.selectedPlatforms.forEach(({ key, info }) => {
            const item = document.createElement('div');
            item.className = 'platform-item';

            // build header
            const header = document.createElement('div');
            header.className = 'platform-header';

            const title = document.createElement('div');
            title.className = 'platform-title';
            title.innerHTML = `<span class="os">${info.system.os}</span>`;

            const btns = document.createElement('div');
            btns.className = 'platform-buttons';
            const btnSettings = document.createElement('button');
            btnSettings.className = 'btn-settings';
            btnSettings.type = 'button';
            btnSettings.dataset.key = key;
            btnSettings.title = 'View info';
            btnSettings.textContent = '⚙';

            const btnRemove = document.createElement('button');
            btnRemove.className = 'btn-remove';
            btnRemove.type = 'button';
            btnRemove.dataset.key = key;
            btnRemove.title = 'Remove';
            btnRemove.textContent = '✖';

            btns.appendChild(btnSettings);
            btns.appendChild(btnRemove);

            header.appendChild(title);
            header.appendChild(btns);
            item.appendChild(header);

            // details panel (hidden by default)
            const details = document.createElement('div');
            details.className = 'platform-details';
            details.id = `platform-details-${key}`;

            // populate details: split into small items
            const cpuRow = document.createElement('div');
            cpuRow.className = 'platform-info-row';
            cpuRow.innerHTML = `<span>CPU cores:</span><span>${info.system.cpu_cores}</span>`;

            const ramRow = document.createElement('div');
            ramRow.className = 'platform-info-row';
            ramRow.innerHTML = `<span>RAM:</span><span>${(info.system.system_ram / 1e9).toFixed(1)} GB</span>`;

            const archRow = document.createElement('div');
            archRow.className = 'platform-info-row';
            archRow.innerHTML = `<span>Arch:</span><span>${info.system.architecture}</span>`;

            const gpuRow = document.createElement('div');
            gpuRow.className = 'platform-info-row';
            gpuRow.innerHTML = `<span>GPU(s):</span>`;
            const gpuList = document.createElement('div');
            gpuList.className = 'platform-gpu';
            gpuList.innerHTML = info.system.gpu_devices && info.system.gpu_devices.length
            ? info.system.gpu_devices.map(g => `${g.name}`).join('<br>')
            : 'None';

            gpuRow.appendChild(gpuList);

            details.appendChild(cpuRow);
            details.appendChild(ramRow);
            details.appendChild(archRow);
            details.appendChild(gpuRow);
            item.appendChild(details);
            container.appendChild(item);

            // events
            btnSettings.addEventListener('click', () => {
                details.classList.toggle('show');
            });

            btnRemove.addEventListener('click', (e) => {
                const k = e.currentTarget.dataset.key;
                this.selectedPlatforms = this.selectedPlatforms.filter(p => p.key !== k);
                this.renderPlatforms();
            });
        });
        
        // update preview JSON (optional)
        if (this.elements.platformPreview) {
            this.elements.platformPreview.textContent = JSON.stringify(this.selectedPlatforms.map(p => ({ platform: p.info.system.os, node_id: p.info.node_id })), null, 2);
        }
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

        // placeholder
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Select a model...";
        placeholder.disabled = true;
        placeholder.selected = true;
        this.elements.modelSelect.appendChild(placeholder);

        const models = AVAILABLE_MODELS[t];
        Object.entries(models).forEach(([key, cfg]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = cfg.label;
            this.elements.modelSelect.appendChild(option);
        });

        const thresholdGroup = document.getElementById('threshold-group');
        if (t === 'detection') {
            thresholdGroup.style.display = 'block';
        } else {
            thresholdGroup.style.display = 'none';
        }
    }

    setMode(mode) {
        this.currentMode = mode;
        this.expandedId = null;
        this.elements.trainBtn.classList.toggle("active", mode === "train");
        this.elements.valBtn.classList.toggle("active", mode === "val");
        this.populateTransforms();
        this.renderTransforms();
    }

    populateTransforms() {
        this.elements.transformSelect.innerHTML = '<option value="">Select a transform...</option>';
        const currentTransforms = this.getCurrentTransforms();
        const addedTransforms = currentTransforms.map(t => t.name);

        Object.keys(AVAILABLE_TRANSFORMS).forEach(t => {
            if (!addedTransforms.includes(t)) {
                const option = document.createElement("option");
                option.value = t;
                option.textContent = AVAILABLE_TRANSFORMS[t].label;
                this.elements.transformSelect.appendChild(option);
            }
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

        this.populateTransforms();
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

    }

    getCurrentOptions() {
        console.log("this options:", this)
        const result = {
            model: this.elements.modelSelect?.value,
            task: this.elements.taskType?.value,
            dataset: this.elements.datasetSelect?.value,
            valRatio: Number(this.elements.valRatio?.value),
            transforms: this.transformsData,
            threshold: Number(this.elements.threshold?.value),
            numberWroker: Number(this.elements.numberWroker?.value),
            optimizer: this.optimizers,
            scheduler: this.schedulers,
            loss: this.elements.lossSelect?.value,
            epochs: Number(this.elements.epochs?.value),
            batchSize: Number(this.elements.batchSize?.value),
            learningRate: Number(this.elements.learningRate?.value),
            pretrained: this.elements.pretrained?.checked,
            params: '21.1M',
            platform: this.selectedPlatforms
        };
        return result
    }

    buildTrainingConfig(options) {
        // ⚙️ Build model section
        const model = {
            name: options.model,
            pretrained: !!options.pretrained,
        };

        // ⚙️ Build dataset section
        const dataset = {
            name: options.dataset,
            batch_size: Number(options.batchSize) || 4,
            num_workers: options.numberWroker,
            val_ratio: options.valRatio,
            transforms: options.transforms
        };

        // ⚙️ Build optimizer
        let optimizer = null;
        if (options.optimizer && options.optimizer.length > 0) {
            const opt = options.optimizer[0];
            const { lr, ...otherParams } = opt.params || {};
            optimizer = {
                type: opt.name,
                lr: opt.params.lr,
                params: otherParams,
            };
        }

        // ⚙️ Build scheduler
        let scheduler = null;
        if (options.scheduler && options.scheduler.length > 0) {
            const sch = options.scheduler[0];
            scheduler = {
                type: sch.name,
                params: sch.params || {},
            };
        }

        // ⚙️ Build loss
        const loss = {
            type: options.loss || "CrossEntropyLoss",
            params: {
                label_smoothing: 0.1,
            },
        };

        const platformObj = {};
        options.platform.forEach(item => {
            const os = item.info.system.os;
            const nodeId = item.info.node_id;
            platformObj[os] = nodeId;
        });

        // ⚙️ Compose final JSON
        const config = {
            task: options.task || "classification",
            model,
            dataset,
            epochs: Number(options.epochs) || 10,
            optimizer,
            scheduler,
            loss,
            log_interval: 20,
            threshold: options.threshold || 0,
            platform: platformObj
        };

        return config;
    }


}
