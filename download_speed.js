let maxConnections = localStorage.getItem("maxConnections") || 8;
const fileUrl = "https://proof.ovh.net/files/10Mb.dat";
let controllers = [];

function isUsingWiFi() {
    return navigator.connection && navigator.connection.type !== 'ethernet';
}

function adjustMaxConnections() {
    if (isUsingWiFi()) {
        maxConnections = Math.min(2, maxConnections);
    } else {
        maxConnections = localStorage.getItem("maxConnections") || 8;
    }
}

async function measureDownloadSpeed(url, connections) {
    controllers.forEach(controller => controller.abort());
    controllers = [];

    let speeds = [];
    for (let i = 0; i < connections; i++) {
        const controller = new AbortController();
        controllers.push(controller);
        speeds.push(await downloadSingleFile(url, controller.signal));
        await new Promise(res => setTimeout(res, 200));
    }

    const totalSpeed = speeds.reduce((sum, speed) => sum + speed, 0);
    const speedText = totalSpeed >= 1000 
        ? `${(totalSpeed / 1000).toFixed(2)} Gbps` 
        : `${totalSpeed.toFixed(2)} Mbps`;

    document.getElementById("downloadSpeedDisplay").textContent = `${speedText}`;
    updateGauges(totalSpeed, uploadSpeed);
}

async function downloadSingleFile(url, signal, retries = 3) {
    let attempt = 0;
    while (attempt < retries) {
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
            return (downloadedBytes * 8) / (duration * 1024 * 1024);
        } catch (error) {
            console.warn(`Download attempt ${attempt + 1} failed:`, error);
            attempt++;
        }
    }
    return 0;
}

function startDownloadLoop() {
    setInterval(() => {
        adjustMaxConnections();
        measureDownloadSpeed(fileUrl, maxConnections);
    }, 1000);
}

startDownloadLoop();
