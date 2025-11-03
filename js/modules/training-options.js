// Training options module
const MODELS = {
    classification: [
        'vgg16', 'vgg19', 'resnet18', 'resnet34', 'resnet50', 'resnet101', 'resnet152', 'mobilenet_v2', 'efficientnet_b0'
    ],
    detection: [
        'fasterrcnn_resnet50_fpn', 'retinanet_resnet50_fpn_v2', 'maskrcnn_resnet50_fpn', 'ssd300_vgg16'
    ]
};

export class TrainingOptions {
    constructor() {
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
            
            if (this.taskType && this.modelSelect) {
                clearInterval(initInterval);
                this.taskType.addEventListener('change', () => this.populateModels());
                this.populateModels();
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

    getCurrentOptions() {
        return {
            task: this.taskType.value,
            model: this.modelSelect.value,
            optimizer: this.optimizerSelect.value,
            scheduler: this.schedulerSelect.value,
            loss: this.lossSelect.value,
            dataset: this.datasetSelect ? this.datasetSelect.options[this.datasetSelect.selectedIndex].text : 'N/A'
        };
    }
}