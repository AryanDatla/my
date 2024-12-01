// script.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('download-button');
const clearButton = document.getElementById('clear-button');
ctx.fillStyle="black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle="white";
// Set up the canvas for drawing
ctx.lineWidth = 10;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// Add event listeners for drawing
let drawing = false;
let lastX, lastY;
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});
canvas.addEventListener('mousemove', (e) => {
  if (drawing) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
  }
});
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// //Add event listener for download button
// downloadButton.addEventListener('click', () => {
//   const dataURL = canvas.toDataURL('image/png');
//   const link = document.createElement('a');
//   link.href = dataURL;
//   link.download = 'drawing.png';
//   link.click();
// });
// add event listner for download button to download 28x28 img
downloadButton.addEventListener('click', () => {
  const canvas = document.getElementById('canvas');
  const link = document.createElement('a');
  
  // Create a temporary canvas to resize the image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 28;
  tempCanvas.height = 28;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Draw the original canvas onto the temporary canvas, resized to 28x28
  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 28, 28);
  
  // Generate the image data from the temporary canvas
  link.href = tempCanvas.toDataURL('image/png',1.0);
  link.download = 'canvas_image.png';
  link.click();
});


// Add event listener for clear button
clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Function to get the pixel data of the drawing
function getPixelData() {
  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  return pixelData;
}

// Function to resize the pixel data to 28x28 pixels
function resizePixelData(pixelData) {
  const resizedPixelData = new Uint8Array(28 * 28 * 4);
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      const index = (i * 28 * 4) + (j * 4);
      const pixelIndex = (Math.floor(i * (canvas.height / 28)) * canvas.width * 4) + (Math.floor(j * (canvas.width / 28)) * 4);
      resizedPixelData[index] = pixelData[pixelIndex];
      resizedPixelData[index + 1] = pixelData[pixelIndex + 1];
      resizedPixelData[index + 2] = pixelData[pixelIndex + 2];
      resizedPixelData[index + 3] = pixelData[pixelIndex + 3];
    }
  }
  return resizedPixelData;
}

// Example usage:
const pixelData = getPixelData();
const resizedPixelData = resizePixelData(pixelData);
console.log(resizedPixelData);