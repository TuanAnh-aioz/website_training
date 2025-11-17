export const AVAILABLE_MODELS = {
  classification: {
    alexnet: {
      label: "AlexNet",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/alexnet-owt-7be5be79.pth",
    },
    resnet18: {
      label: "ResNet18",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/resnet18-f37072fd.pth",
    },
    resnet34: {
      label: "ResNet34",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/resnet34-b627a593.pth",
    },
    resnet50: {
      label: "ResNet50",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/resnet50-0676ba61.pth",
    },
    resnet101: {
      label: "ResNet101",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/resnet101-63fe2227.pth",
    },
    resnet152: {
      label: "ResNet152",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/resnet152-394f9c45.pth",
    },
    resnext50_32x4d: {
      label: "ResNeXt50",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/resnext50_32x4d-7cdf4587.pth",
    },
    resnext101_32x8d: {
      label: "ResNeXt101",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/resnext101_32x8d-8ba56ff5.pth",
    },
    wide_resnet50_2: {
      label: "WideResNet50",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/wide_resnet50_2-95faca4d.pth",
    },
    wide_resnet101_2: {
      label: "WideResNet101",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/wide_resnet101_2-32ee1156.pth",
    },
    vgg11: {
      label: "VGG11",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/vgg11-8a719046.pth",
    },
    vgg13: {
      label: "VGG13",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/vgg13-19584684.pth",
    },
    vgg16: {
      label: "VGG16",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/vgg16-397923af.pth",
    },
    vgg19: {
      label: "VGG19",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/vgg19-dcbb9e9d.pth",
    },
    squeezenet1_0: {
      label: "SqueezeNet",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/squeezenet1_0-b66bff10.pth",
    },
    inception_v3: { label: "InceptionV3", weight: "" },
    densenet121: {
      label: "DenseNet121",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/densenet121-a639ec97.pth",
    },
    densenet161: {
      label: "DenseNet161",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/densenet169-b2777c0a.pth",
    },
    densenet169: {
      label: "DenseNet169",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/densenet169-b2777c0a.pth",
    },
    densenet201: {
      label: "DenseNet201",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/densenet169-b2777c0a.pth",
    },
    googlenet: {
      label: "GoogLeNet",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/googlenet-1378be20.pth",
    },
    mobilenet_v2: {
      label: "MobileNetV2",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/mobilenet_v2-b0353104.pth",
    },
    mnasnet1_0: {
      label: "MNASNet",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/mnasnet1.0_top1_73.512-f206786ef8.pth",
    },
    shufflenet_v2_x1_0: {
      label: "ShuffleNetV2",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/classification/pretrained/shufflenetv2_x1-5666bf0f80.pth",
    },
  },
  detection: {
    fasterrcnn_resnet50_fpn: {
      label: "Faster RCNN ResNet50 FPN",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/detection/pretrained/fasterrcnn_resnet50_fpn.pth",
    },
    fasterrcnn_resnet50_fpn_v2: {
      label: "Faster RCNN ResNet50 FPN v2",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/detection/pretrained/fasterrcnn_resnet50_fpn_v2.pth",
    },
    fasterrcnn_mobilenet_v3_large_fpn: {
      label: "Faster RCNN MobileNetV3-Large FPN",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/detection/pretrained/fasterrcnn_mobilenet_v3_large_fpn.pth",
    },
    ssd300_vgg16: {
      label: "SSD300 VGG16",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/detection/pretrained/ssd300_vgg16.pth",
    },
    ssdlite320_mobilenet_v3_large: {
      label: "SSDLite320 MobileNetV3-Large",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/detection/pretrained/ssdlite320_mobilenet_v3_large.pth",
    },
    fcos_resnet50_fpn: {
      label: "FCOS ResNet50 FPN",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/detection/pretrained/fcos_resnet50_fpn.pth",
    },
    retinanet_resnet50_fpn: {
      label: "RetinaNet ResNet50 FPN",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/detection/pretrained/retinanet_resnet50_fpn.pth",
    },
    retinanet_resnet50_fpn_v2: {
      label: "RetinaNet ResNet50 FPN v2",
      weight:
        "/home/aioz-ta/Documents/Project/w3ai-infra-node-base/Training/dist/detection/pretrained/retinanet_resnet50_fpn_v2.pth",
    },
  },
};
