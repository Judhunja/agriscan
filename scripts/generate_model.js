const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');

async function generateModel() {
  console.log('Generating TF.js Dummy Model...');

  // Create a simple Sequential model that mimics what an image classifier would output.
  // Input: 224x224 RGB image (standard for MobileNet etc.).
  // Output: 4 classes (healthy, maize streak, coffee rust, maize gray spot).
  const model = tf.sequential();

  // We add a single dense layer that connects the flattened input to 4 output neurons
  // with a softmax activation. This guarantees a probability distribution of 4 classes.
  model.add(tf.layers.flatten({ inputShape: [224, 224, 3] }));
  model.add(tf.layers.dense({ units: 4, activation: 'softmax' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  // Ensure output directory exists
  const modelDir = path.join(__dirname, '..', 'public', 'model');
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }

  // Save the model (this will generate model.json and .bin shards)
  const savePath = `file://${modelDir}`;
  await model.save(savePath);

  console.log(`✅ Model successfully generated and saved to: ${modelDir}`);
}

generateModel().catch(console.error);
