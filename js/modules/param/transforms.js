export const AVAILABLE_TRANSFORMS = {
  resize: {
    label: "Resize",
    params: [
      { name: "Width", type: "number", default: 224 },
      { name: "Height", type: "number", default: 224 },
      {
        name: "Interpolation",
        type: "select",
        default: "bilinear",
        options: ["nearest", "bilinear", "bicubic", "lanczos"],
      },
    ],
  },
  normalize: {
    label: "Normalize",
    params: [
      { name: "Mean", type: "text", default: "0.485, 0.456, 0.406" },
      { name: "Std", type: "text", default: "0.229, 0.224, 0.225" },
    ],
  },
  horizontal_flip: {
    label: "Horizontal Flip",
    params: [{ name: "Probability", type: "number", default: 0.5 }],
  },
  vertical_flip: {
    label: "Vertical Flip",
    params: [{ name: "Probability", type: "number", default: 0.5 }],
  },
  rotation: {
    label: "Rotation",
    params: [
      { name: "Degrees", type: "number", default: 15 },
      { name: "Probability", type: "number", default: 0.5 },
    ],
  },
  color_jitter: {
    label: "Color Jitter",
    params: [
      { name: "Brightness", type: "number", default: 0.2 },
      { name: "Contrast", type: "number", default: 0.2 },
      { name: "Saturation", type: "number", default: 0.2 },
      { name: "Hue", type: "number", default: 0.1 },
    ],
  },
  random_crop: {
    label: "Random Crop",
    params: [
      { name: "Size", type: "number", default: 224 },
      { name: "Padding", type: "number", default: 0 },
    ],
  },
  center_crop: {
    label: "Center Crop",
    params: [{ name: "Size", type: "number", default: 224 }],
  },
  gaussian_blur: {
    label: "Gaussian Blur",
    params: [
      { name: "Kernel_size", type: "number", default: 3 },
      { name: "Sigma", type: "number", default: 1.0 },
    ],
  },
  grayscale: {
    label: "Grayscale",
    params: [{ name: "Probability", type: "number", default: 0.1 }],
  },
  randomResizedCrop: {
    label: "Random Resized Crop",
    params: [
      { name: "Size", type: "number", default: 224 },
      { name: "Scale_min", type: "number", default: 0.8 },
      { name: "Scale_max", type: "number", default: 1.0 },
      { name: "Ratio_min", type: "number", default: 0.75 },
      { name: "Ratio_max", type: "number", default: 1.33 },
    ],
  },
  randomHorizontalFlip: {
    label: "Random Horizontal Flip",
    params: [{ name: "Probability", type: "number", default: 0.5 }],
  },
  randomVerticalFlip: {
    label: "Random Vertical Flip",
    params: [{ name: "Probability", type: "number", default: 0.5 }],
  },
  randomRotation: {
    label: "Random Rotation",
    params: [{ name: "Degrees", type: "number", default: 15 }],
  },
  randomAffine: {
    label: "Random Affine",
    params: [
      { name: "Degrees", type: "number", default: 15 },
      { name: "Translate_x", type: "number", default: 0.1 },
      { name: "Translate_y", type: "number", default: 0.1 },
      { name: "Scale_min", type: "number", default: 0.9 },
      { name: "Scale_max", type: "number", default: 1.1 },
      { name: "Shear", type: "number", default: 10 },
    ],
  },
  randomPerspective: {
    label: "Random Perspective",
    params: [
      { name: "Distortion_scale", type: "number", default: 0.5 },
      { name: "Probability", type: "number", default: 0.5 },
    ],
  },
  gaussianBlur: {
    label: "Gaussian Blur",
    params: [
      { name: "Kernel_size", type: "number", default: 3 },
      { name: "Sigma", type: "number", default: 1.0 },
    ],
  },
  randomErasing: {
    label: "Random Erasing",
    params: [
      { name: "Probability", type: "number", default: 0.5 },
      { name: "Scale_min", type: "number", default: 0.02 },
      { name: "Scale_max", type: "number", default: 0.33 },
      { name: "Ratio_min", type: "number", default: 0.3 },
      { name: "Ratio_max", type: "number", default: 3.3 },
    ],
  },
};
