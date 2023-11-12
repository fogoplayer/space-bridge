import { define } from "space-bridge";
// import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.2.0/dist/tf.min.js";
// import "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/+esm";

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

export const runModel = define("runModel", async (originalTensor) => {
  if (!(originalTensor instanceof tf.Tensor)) {
    const { shape, dtype, dataId, id } = originalTensor;
    debugger;
    const newTensor = tf.Tensor(shape, dtype, dataId, id);
    originalTensor = Object.assign((newTensor, originalTensor));
  }

  function loss(image) {
    let targetOneHot = tf.oneHot([targetClass], 1000);
    let logits = model.infer(image);
    return tf.losses.softmaxCrossEntropy(targetOneHot, logits);
  }

  const calculateGradient = tf.grad(loss);

  return await tf.tidy(() => {
    const gradient = calculateGradient(originalTensor);

    const perturbation = gradient.sign().mul(epsilon);
    let adversarial = tf.sub(originalTensor, perturbation);

    adversarial = adversarial.clipByValue(0, 255);

    return adversarial;
  });
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
  const originalTensor = tf.browser.fromPixels(originalElement);
  // const adversarialTensor = await runModel.runRemotely(originalTensor); // -------------
  const adversarialTensor = await runModel.runRemote(originalTensor);

  const adversarialTensorNormalized = adversarialTensor.div(255);
  tf.browser.toPixels(adversarialTensorNormalized, adversarialElement);

  const adversarialPredictions = await model.classify(adversarialTensor);

  adversarialTextElement.innerHTML = formatPrediction(
    adversarialPredictions[0]
  );

  originalTensor.dispose();
  adversarialTensor.dispose();
  adversarialTensorNormalized.dispose();

  const leakingMemory = tf.memory().numBytes - initialMemoryUsage;
  console.log("Memory leakage: " + leakingMemory + " bytes");
}
