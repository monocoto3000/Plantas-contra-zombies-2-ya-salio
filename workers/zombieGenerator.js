self.onmessage = function(e) {
    const { frameCount, gridRows, canvasWidth, cellHeight } = e.data;
    
    let zombie = null;
  
    if (frameCount % 200 === 0) {
      const row = Math.floor(Math.random() * gridRows);
      const y = row * cellHeight;
      zombie = {
        type: 'ClassicZombie',
        x: canvasWidth,
        y: y,
        row: row
      };
    } else if (frameCount % 300 === 0) {
      const row = Math.floor(Math.random() * gridRows);
      const y = row * cellHeight;
      zombie = {
        type: 'BucketZombie',
        x: canvasWidth,
        y: y,
        row: row
      };
    }
  
    if (zombie) {
      self.postMessage(zombie);
    } else {
      self.postMessage(null);
    }
  };