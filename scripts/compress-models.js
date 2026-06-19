const fs = require('fs/promises');
const path = require('path');
const gltfPipeline = require('gltf-pipeline');
const processGlb = gltfPipeline.processGlb;

const modelsDir = path.join(__dirname, '../public/models');

async function compressModels() {
  try {
    const files = await fs.readdir(modelsDir);
    const glbFiles = files.filter(f => f.endsWith('.glb') && !f.endsWith('_draco.glb'));

    for (const file of glbFiles) {
      const inputPath = path.join(modelsDir, file);
      const ext = path.extname(file);
      const basename = path.basename(file, ext);
      const outputPath = path.join(modelsDir, `${basename}_draco${ext}`);

      console.log(`Compressing ${file}...`);
      const gltf = await fs.readFile(inputPath);
      
      try {
        const results = await processGlb(gltf, {
          dracoOptions: {
            compressionLevel: 7,
          }
        });
        
        await fs.writeFile(outputPath, results.glb);
        
        const oldSize = (await fs.stat(inputPath)).size;
        const newSize = (await fs.stat(outputPath)).size;
        console.log(`-> Saved ${basename}_draco${ext} | Reduced by ${Math.round((1 - newSize/oldSize)*100)}% (${(newSize/1024).toFixed(1)} KB)`);
      } catch (err) {
        console.log(`-> Failed to compress ${file}: ${err.message}`);
      }
    }
    console.log('All models compressed successfully!');
  } catch (err) {
    console.error('Error compressing models:', err);
  }
}

compressModels();
