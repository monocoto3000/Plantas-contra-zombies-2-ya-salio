self.addEventListener('message', (e) => {
    const sunGenerationRate = e.data.sunGenerationRate;
    
    function generateSun() {
        setInterval(() => {
            postMessage(25);  
        }, sunGenerationRate);
    }

    generateSun();
});
