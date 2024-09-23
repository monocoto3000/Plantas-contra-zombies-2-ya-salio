class Sunflower extends Plant {
    constructor(x, y, row, col) {
        super(x, y, 100, 'yellow', 5);
        this.sunGenerationRate = 3000; 
        this.row = row; 
        this.col = col;
        this.worker = new Worker('./workers/sunWorker.js'); 
        this.startGeneratingSun();
    }

    startGeneratingSun() {
        this.worker.postMessage({ sunGenerationRate: this.sunGenerationRate });
        this.worker.onmessage = (e) => {
            sunPoints += e.data;  
            updateSunPointsDisplay();  
        };
    }

    terminateWorker() {
        this.worker.terminate(); 
    }
}
