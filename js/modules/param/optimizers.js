export const AVAILABLE_OPTIMIZERS = {
    SGD: {
        label: "SGD",
        params: [
            { name: "lr", label: "Learning Rate", type: "number", default: 0.01 },
            { name: "momentum", label: "Momentum", type: "number", default: 0.9 },
            { name: "weight_decay", label: "Weight Decay", type: "number", default: 0 }
        ]
    },
    Adam: {
        label: "Adam",
        params: [
            { name: "lr", label: "Learning Rate", type: "number", default: 0.001 },
            { name: "betas", label: "Betas", type: "text", default: "(0.9, 0.999)" },
            { name: "weight_decay", label: "Weight Decay", type: "number", default: 0 }
        ]
    },
    AdamW: {
        label: "AdamW",
        params: [
            { name: "lr", label: "Learning Rate", type: "number", default: 0.001 },
            { name: "betas", label: "Betas", type: "text", default: "(0.9, 0.999)" },
            { name: "weight_decay", label: "Weight Decay", type: "number", default: 0.01 }
        ]
    },
    RMSprop: {
        label: "RMSprop",
        params: [
            { name: "lr", label: "Learning Rate", type: "number", default: 0.01 },
            { name: "momentum", label: "Momentum", type: "number", default: 0 },
            { name: "alpha", label: "Alpha", type: "number", default: 0.99 },
            { name: "weight_decay", label: "Weight Decay", type: "number", default: 0 }
        ]
    }
};
