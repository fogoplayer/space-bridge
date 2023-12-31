import { define } from "space-bridge";
// import * as ClassTransformer from "./class-transformer.js";
// import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.2.0/dist/tf.min.js";
// import "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/+esm";

const isServer =
  typeof process !== "undefined" || typeof window === "undefined";

let mobilenet;
let tf;
if (typeof window !== "undefined") {
  mobilenet = window.mobilenet;
  tf = window.tf;
}
if (!mobilenet) {
  console.log("Using relative imports");
  mobilenet = await import("@tensorflow-models/mobilenet");
  tf = await import("@tensorflow/tfjs-node");
}

const targetClass = 883; // class ID for vase
const epsilon = 5.0; // strength of the perturbation

let model = null;
function formatPrediction(prediction) {
  const roundedProbability =
    Math.round(prediction["probability"] * 100.0) / 100.0;
  return prediction["className"] + " (" + roundedProbability + ")";
}

export const runModel = define("runModel", async (data, width, height) => {
  let originalTensor;
  if (isServer) {
    data = Buffer.from(data, "base64");
    originalTensor = tf.node.decodeImage(data, 3);
  } else {
    // data = getImageElementFromBase64(data, width, height);
    data = document.querySelector("#original-image");
    originalTensor = tf.browser.fromPixels(data);
  }

  if (model === null) model = await mobilenet.load();

  function loss(image) {
    let targetOneHot = tf.oneHot([targetClass], 1000);
    let logits = model.infer(image);
    return tf.losses.softmaxCrossEntropy(targetOneHot, logits);
  }

  const calculateGradient = tf.grad(loss);

  const adversarialTensor = await tf.tidy(() => {
    const gradient = calculateGradient(originalTensor);

    const perturbation = gradient.sign().mul(epsilon);
    let adversarial = tf.sub(originalTensor, perturbation);

    adversarial = adversarial.clipByValue(0, 255);

    return adversarial;
  });

  const adversarialTensorNormalized = adversarialTensor.div(255);
  let adversarialImageData;
  if (isServer) {
    const imageData = await tf.node.encodePng(adversarialTensor);
    adversarialImageData = Buffer.from(imageData).toString("base64");
    adversarialImageData = adversarialImageData.replace(
      /^data:image\/(png);base64,/,
      ""
    );
  } else {
    const adversarialElement = document.createElement("canvas");
    await tf.browser.toPixels(adversarialTensorNormalized, adversarialElement);
    adversarialImageData = adversarialElement.toDataURL("image/png");
    adversarialImageData = adversarialImageData.replace(
      /^data:image\/(png);base64,/,
      ""
    );
  }

  const adversarialPredictions = await model.classify(adversarialTensor);

  originalTensor.dispose();
  adversarialTensor.dispose();
  adversarialTensorNormalized.dispose();

  return [adversarialImageData, adversarialPredictions[0]];
});

export async function runAttack() {
  const originalElement = document.getElementById("original-image");
  const originalTextElement = document.getElementById("original-text");
  const adversarialElement = document.getElementById("adversarial-image");
  const adversarialTextElement = document.getElementById("adversarial-text");

  const initialMemoryUsage = tf.memory().numBytes;

  if (model === null) model = await mobilenet.load();

  const originalPredictions = await model.classify(originalElement);
  originalTextElement.innerHTML = formatPrediction(originalPredictions[0]);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = originalElement.width;
  canvas.height = originalElement.height;
  context.drawImage(originalElement, 0, 0);
  let imageData = context.getImageData(
    0,
    0,
    originalElement.width,
    originalElement.height
  );

  let { width, height, data } = imageData;
  const base64Data = getBase64ImageFromElement(originalElement);
  /////////////////////////////////////////////////////////////////////////////
  const [adversarialImageData, prediction] = await runModel.runLocal(
    base64Data,
    width,
    height
  );
  /////////////////////////////////////////////////////////////////////////////
  const adversarialImage = getImageElementFromBase64(
    adversarialImageData,
    width,
    height
  );
  adversarialElement.replaceWith(adversarialImage);
  adversarialTextElement.innerHTML = formatPrediction(prediction);

  const leakingMemory = tf.memory().numBytes - initialMemoryUsage;
  console.log("Memory leakage: " + leakingMemory + " bytes");
}

function getBase64ImageFromElement(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");

  dataURL = dataURL.replace(/^data:image\/(png);base64,/, "");
  return dataURL;
}

function getImageElementFromBase64(base64String, width, height) {
  var image = new Image();
  image.src = "data:image/png;base64," + base64String;
  image.width = width;
  image.height = height;
  return image;
}
