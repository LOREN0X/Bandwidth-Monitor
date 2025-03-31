let maxConnections = localStorage.getItem("maxConnections") || 8;
const fileUrl = "https://proof.ovh.net/files/10Mb.dat";
let controllers = [];

async function measureDownloadSpeed(url, connections) {
    controllers.forEach(controller => controller.abort());
    controllers = [];
    
    const downloadPromises = [];
    for (let i = 0; i < connections; i++) {
        const controller = new AbortController();
        controllers.push(controller);
        downloadPromises.push(downloadSingleFile(url, controller.signal));
    }

    try {
        const speeds = await Promise.all(downloadPromises);
        const totalSpeed = speeds.reduce((sum, speed) => sum + speed, 0);

        const speedText = totalSpeed >= 1000 
            ? `${(totalSpeed / 1000).toFixed(2)} Gbps` 
            : `${totalSpeed.toFixed(2)} Mbps`;
        
        document.getElementById("downloadSpeedDisplay").textContent = `${speedText}`;
        updateGauges(totalSpeed, uploadSpeed);
    } catch (error) {
        console.error("Error measuring download speed:", error);
        document.getElementById("downloadSpeedDisplay").textContent = "Error";
    }
}

async function downloadSingleFile(url, signal) {
    const startTime = performance.now();
    try {
        const response = await fetch(`${url}?nocache=${Math.random()}`, { cache: "no-store", signal });
        if (!response.ok) throw new Error("Download failed");

        const reader = response.body.getReader();
        let downloadedBytes = 0;
        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            if (value) downloadedBytes += value.length;
            done = readerDone;
        }

        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const speedMbps = (downloadedBytes * 8) / (duration * 1024 * 1024);
        
        return speedMbps;
    } catch (error) {
        console.error("Download failed:", error);
        return 0;
    }
}

function startDownloadLoop() {
    setInterval(() => {
        maxConnections = localStorage.getItem("maxConnections") || 8;
        measureDownloadSpeed(fileUrl, maxConnections);
    }, 1000);
}

startDownloadLoop();
