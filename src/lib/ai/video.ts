import cv from 'opencv-ts';

export async function analyzeVideoFrame(videoElement: HTMLVideoElement) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    ctx.drawImage(videoElement, 0, 0);
    const src = cv.imread(canvas);
    
    // Convert to grayscale for better analysis
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    
    // Detect edges
    const edges = new cv.Mat();
    cv.Canny(gray, edges, 50, 150);
    
    // Find contours
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    const analysis = {
      numberOfObjects: contours.size(),
      edges: edges.size(),
      timestamp: new Date().toISOString()
    };
    
    // Clean up
    src.delete();
    gray.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing video frame:', error);
    return null;
  }
}