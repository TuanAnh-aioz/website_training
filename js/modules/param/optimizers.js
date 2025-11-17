export const AVAILABLE_OPTIMIZERS = {
  SGD: {
    label: "SGD",
    params: [
      { name: "lr", label: "Learning Rate", type: "number", default: 0.005 },
      { name: "momentum", label: "Momentum", type: "number", default: 0.9 },
      {
        name: "weight_decay",
        label: "Weight Decay",
        type: "number",
        default: 5e-4,
      },
      { name: "nesterov", label: "Nesterov", type: "bool", default: true },
    ],
  },
  Adam: {
    label: "Adam",
    params: [
      { name: "lr", label: "Learning Rate", type: "number", default: 0.001 },
      { name: "betas", label: "Betas", type: "text", default: "[0.9, 0.999]" },
      {
        name: "weight_decay",
        label: "Weight Decay",
        type: "number",
        default: 5e-4,
      },
      { name: "eps", label: "Eps", type: "number", default: 1e-8 },
    ],
  },
  AdamW: {
    label: "AdamW",
    params: [
      { name: "lr", label: "Learning Rate", type: "number", default: 0.001 },
      { name: "betas", label: "Betas", type: "text", default: "[0.9, 0.999]" },
      { name: "eps", label: "Eps", type: "number", default: 1e-8 },
      {
        name: "weight_decay",
        label: "Weight Decay",
        type: "number",
        default: 5e-4,
      },
    ],
  },
  RMSprop: {
    label: "RMSprop",
    params: [
      { name: "lr", label: "Learning Rate", type: "number", default: 0.01 },
      { name: "momentum", label: "Momentum", type: "number", default: 0 },
      { name: "alpha", label: "Alpha", type: "number", default: 0.99 },
      {
        name: "weight_decay",
        label: "Weight Decay",
        type: "number",
        default: 5e-4,
      },
      { name: "eps", label: "Eps", type: "number", default: 1e-8 },
    ],
  },
  Adamax: {
    label: "Adamax",
    params: [
      { name: "lr", label: "Learning Rate", type: "number", default: 0.01 },
      { name: "betas", label: "Betas", type: "text", default: "[0.9, 0.999]" },
      { name: "eps", label: "Eps", type: "number", default: 1e-8 },
      {
        name: "weight_decay",
        label: "Weight Decay",
        type: "number",
        default: 5e-4,
      },
    ],
  },
};
