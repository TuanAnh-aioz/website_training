export const AVAILABLE_SCHEDULERS = {
  StepLR: {
    label: "Step LR",
    params: [
      { name: "step_size", label: "Step Size", type: "number", default: 30 },
      { name: "gamma", label: "Gamma", type: "number", default: 0.1 },
    ],
  },
  MultiStepLR: {
    label: "MultiStep LR",
    params: [
      {
        name: "milestones",
        label: "Milestones",
        type: "text",
        default: "[16, 22]",
      },
      { name: "gamma", label: "Gamma", type: "number", default: 0.1 },
    ],
  },
  ExponentialLR: {
    label: "Exponential LR",
    params: [{ name: "gamma", label: "Gamma", type: "number", default: 0.1 }],
  },
  CosineAnnealingLR: {
    label: "Cosine Annealing LR",
    params: [
      { name: "T_max", label: "T_max", type: "number", default: 100 },
      { name: "eta_min", label: "Eta Min", type: "number", default: 1e-6 },
    ],
  },
  CosineAnnealingWarmRestarts: {
    label: "Cosine Annealing Warm Restarts",
    params: [
      { name: "T_0", label: "T_0", type: "number", default: 10 },
      { name: "T_mult", label: "T_mult", type: "number", default: 2 },
    ],
  },
  ReduceLROnPlateau: {
    label: "Reduce LR On Plateau",
    params: [
      { name: "factor", label: "Factor", type: "number", default: 0.1 },
      { name: "patience", label: "Patience", type: "number", default: 5 },
      { name: "min_lr", label: "Min LR", type: "number", default: 1e-6 },
    ],
  },
  OneCycleLR: {
    label: "One Cycle LR",
    params: [
      { name: "max_lr", label: "Max LR", type: "number", default: 0.001 },
      { name: "div_factor", label: "Div Factor", type: "number", default: 10 },
      { name: "epochs", label: "Epochs", type: "number", default: 10 },
      {
        name: "steps_per_epoch",
        label: "Steps per Epoch",
        type: "number",
        default: 100,
      },
    ],
  },
  CosineScheduler: {
    label: "Cosine Scheduler",
    params: [
      { name: "T_max", label: "T_max", type: "number", default: 100 },
      { name: "eta_min", label: "Eta Min", type: "number", default: 1e-6 },
    ],
  },
};
