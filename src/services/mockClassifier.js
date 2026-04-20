const API_URL = import.meta.env.VITE_CLASSIFIER_API_URL || "http://localhost:8000/classify";
const DEFAULT_PI_MODEL_PATH = "/home/intira/garbage-bin/garbage_mobilenetv2_fp16v3.tflite";
const ENV_MODEL_PATH = import.meta.env.VITE_CLASSIFIER_MODEL_PATH || "";

function resolveModelPath(options = {}) {
  if (options.modelPath) {
    return options.modelPath;
  }

  if (ENV_MODEL_PATH) {
    return ENV_MODEL_PATH;
  }

  // On Raspberry Pi kiosk, prefer the provided local model path by default.
  if (window?.electronAPI?.isElectron && window?.electronAPI?.platform === "linux") {
    return DEFAULT_PI_MODEL_PATH;
  }

  return "";
}

function normalizeType(value) {
  const mapped = String(value || "").toLowerCase().trim();
  if (["recyclable", "recycle", "plastic", "paper", "metal", "glass"].includes(mapped)) {
    return "recyclable";
  }
  if (["hazardous", "hazmat", "battery", "chemical"].includes(mapped)) {
    return "hazardous";
  }
  if (["organic", "food", "wet", "compost"].includes(mapped)) {
    return "organic";
  }
  if (["general", "residual", "other", "mixed"].includes(mapped)) {
    return "general";
  }
  return "unknown";
}

function mapLabel(type) {
  if (type === "recyclable") {
    return "รีไซเคิล";
  }
  if (type === "hazardous") {
    return "อันตราย";
  }
  if (type === "organic") {
    return "ขยะสด";
  }
  if (type === "general") {
    return "ขยะทั่วไป";
  }
  return "ไม่แน่ใจ";
}

export async function classifyWaste(imageBlob, options = {}) {
  const timeoutMs = options.timeoutMs ?? 8000;
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (!imageBlob) {
      throw new Error("NO_IMAGE_FRAME");
    }

    const formData = new FormData();
    formData.append("image", imageBlob, "capture.jpg");

    const modelPath = resolveModelPath(options);
    if (modelPath) {
      formData.append("model_path", modelPath);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`MODEL_HTTP_${response.status}`);
    }

    const payload = await response.json();
    const type = normalizeType(payload.type || payload.class || payload.label);

    return {
      type,
      confidence: Number(payload.confidence ?? payload.score ?? 0),
      foodResidue: Boolean(payload.foodResidue ?? payload.food_residue),
      timeout: false,
      labelText: mapLabel(type),
    };
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        type: "unknown",
        confidence: 0,
        foodResidue: false,
        timeout: true,
        labelText: "ไม่แน่ใจ",
      };
    }
    throw error;
  } finally {
    clearTimeout(timerId);
  }
}
