async function runSpeedTest() {
    try {
        const downloadSpeed = await measureDownloadSpeed();
        document.getElementById("downloadSpeed").innerText = `Download Speed: ${downloadSpeed} Mbps`;
    } catch {
        document.getElementById("downloadSpeed").innerText = "Download Speed: Error";
    }

    try {
        const uploadSpeed = await measureUploadSpeed();
        document.getElementById("uploadSpeed").innerText = `Upload Speed: ${uploadSpeed} Mbps`;
    } catch {
        document.getElementById("uploadSpeed").innerText = "Upload Speed: Error";
    }
}



runSpeedTest();
setInterval(runSpeedTest, 1000);


async function measureDownloadSpeed() {
    const fileUrl = "https://proof.ovh.net/files/10Mb.dat";
    const startTime = performance.now();

    try {
        const response = await fetch(fileUrl, {
            method: "GET",
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);

        const contentLength = response.headers.get('Content-Length');
        const totalBytes = parseInt(contentLength, 10);
        
        if (!totalBytes) {
            throw new Error("Failed to retrieve valid file size");
        }

        await response.blob(); 

        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;

        const speedMbps = ((totalBytes * 8) / (duration * 1e6)).toFixed(2);
        return speedMbps;

    } catch (error) {
        console.error("Download failed:", error);
        throw new Error("Download failed");
    }
}

async function measureUploadSpeed() {
    const testData = new Uint8Array(10 * 1024 * 1024);
    const fileSize = testData.length * 8;
    const startTime = performance.now();

    try {
        const response = await fetch("https://speed.cloudflare.com/__up", {
            method: "POST",
            body: testData,
            headers: { "Content-Type": "application/octet-stream" }
        });

        if (!response.ok) throw new Error("Upload failed");

    } catch {
        throw new Error("Upload failed");
    }

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    return (fileSize / (duration * 1e6)).toFixed(2);
}
