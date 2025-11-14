export const AVAILABLE_TRANSFORMS = {
  resize: {
    label: "Resize",
    params: [
      { name: "width", type: "number", default: 224 },
      { name: "height", type: "number", default: 224 },
      {
        name: "interpolation",
        type: "select",
        default: "bilinear",
        options: ["nearest", "bilinear", "bicubic", "lanczos"],
      },
    ],
  },
  normalize: {
    label: "Normalize",
    params: [
      { name: "mean", type: "text", default: "0.485, 0.456, 0.406" },
      { name: "std", type: "text", default: "0.229, 0.224, 0.225" },
    ],
  },
  horizontal_flip: {
    label: "Horizontal Flip",
    params: [{ name: "probability", type: "number", default: 0.5 }],
  },
  vertical_flip: {
    label: "Vertical Flip",
    params: [{ name: "probability", type: "number", default: 0.5 }],
  },
  rotation: {
    label: "Rotation",
    params: [
      { name: "degrees", type: "number", default: 15 },
      { name: "probability", type: "number", default: 0.5 },
    ],
  },
  color_jitter: {
    label: "Color Jitter",
    params: [
      { name: "brightness", type: "number", default: 0.2 },
      { name: "contrast", type: "number", default: 0.2 },
      { name: "saturation", type: "number", default: 0.2 },
      { name: "hue", type: "number", default: 0.1 },
    ],
  },
  random_crop: {
    label: "Random Crop",
    params: [
      { name: "size", type: "number", default: 224 },
      { name: "padding", type: "number", default: 0 },
    ],
  },
  center_crop: {
    label: "Center Crop",
    params: [{ name: "size", type: "number", default: 224 }],
  },
  gaussian_blur: {
    label: "Gaussian Blur",
    params: [
      { name: "kernel_size", type: "number", default: 3 },
      { name: "sigma", type: "number", default: 1.0 },
    ],
  },
  grayscale: {
    label: "Grayscale",
    params: [{ name: "probability", type: "number", default: 0.1 }],
  },
  randomResizedCrop: {
    label: "Random Resized Crop",
    params: [
      { name: "size", type: "number", default: 224 },
      { name: "scale_min", type: "number", default: 0.8 },
      { name: "scale_max", type: "number", default: 1.0 },
      { name: "ratio_min", type: "number", default: 0.75 },
      { name: "ratio_max", type: "number", default: 1.33 },
    ],
  },
  randomHorizontalFlip: {
    label: "Random Horizontal Flip",
    params: [{ name: "probability", type: "number", default: 0.5 }],
  },
  randomVerticalFlip: {
    label: "Random Vertical Flip",
    params: [{ name: "probability", type: "number", default: 0.5 }],
  },
  randomRotation: {
    label: "Random Rotation",
    params: [{ name: "degrees", type: "number", default: 15 }],
  },
  randomAffine: {
    label: "Random Affine",
    params: [
      { name: "degrees", type: "number", default: 15 },
      { name: "translate_x", type: "number", default: 0.1 },
      { name: "translate_y", type: "number", default: 0.1 },
      { name: "scale_min", type: "number", default: 0.9 },
      { name: "scale_max", type: "number", default: 1.1 },
      { name: "shear", type: "number", default: 10 },
    ],
  },
  randomPerspective: {
    label: "Random Perspective",
    params: [
      { name: "distortion_scale", type: "number", default: 0.5 },
      { name: "probability", type: "number", default: 0.5 },
    ],
  },
  gaussianBlur: {
    label: "Gaussian Blur",
    params: [
      { name: "kernel_size", type: "number", default: 3 },
      { name: "sigma", type: "number", default: 1.0 },
    ],
  },
  randomErasing: {
    label: "Random Erasing",
    params: [
      { name: "probability", type: "number", default: 0.5 },
      { name: "scale_min", type: "number", default: 0.02 },
      { name: "scale_max", type: "number", default: 0.33 },
      { name: "ratio_min", type: "number", default: 0.3 },
      { name: "ratio_max", type: "number", default: 3.3 },
    ],
  },
};
