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
            this.learningRate = document.getElementById('learningRate');
            this.batchSize = document.getElementById('batchSize');
            this.epochs = document.getElementById('epochs');
            this.pretrained = document.getElementById('pretrained');
            
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