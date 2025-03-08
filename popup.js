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

// Run speed test immediately and then repeat every second
runSpeedTest();
setInterval(runSpeedTest, 1000);

async function measureDownloadSpeed() {
    const fileUrl = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-10mb-file.zip"; 
    const fileSize = 10 * 1024 * 1024 * 8;
    const corsProxy = "https://api.allorigins.win/get?url="; 

    const startTime = performance.now();
    try {
        const response = await fetch(corsProxy + encodeURIComponent(fileUrl), {
            method: "GET",
            headers: {
                "pragma": "no-cache",
                "cache-control": "no-cache"
            }
        }); 
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
        const blob = await response.blob();
    } catch (error) {
        console.error("Download failed:", error);
        throw new Error("Download failed");
    }
    const endTime = performance.now();

    const duration = (endTime - startTime) / 1000; 
    const speedMbps = (fileSize / (duration * 1e6)).toFixed(2);
    return speedMbps;
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
