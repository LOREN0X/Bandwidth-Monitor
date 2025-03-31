let uploadSpeed = 0;

function measureUploadSpeed(url) {
    const dataSize = 10 * 1024 * 1024;
    const data = new Blob([new Uint8Array(dataSize)]); 
    const startTime = Date.now();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000; 
            uploadSpeed = (dataSize * 8) / (duration * 1024 * 1024);

            let displaySpeed, unit;
            if (uploadSpeed >= 1000) {
                displaySpeed = (uploadSpeed / 1000).toFixed(2);
                unit = "Gbps";
            } else {
                displaySpeed = uploadSpeed.toFixed(2);
                unit = "Mbps";
            }

            document.getElementById('uploadSpeedDisplay').textContent = `${displaySpeed} ${unit}`;
            updateGauges(totalSpeed, uploadSpeed);
        } else {
            console.error('Failed to upload the file. Status: ' + xhr.status);
            document.getElementById('uploadSpeedDisplay').textContent = "Error";
        }
    };

    xhr.onerror = function () {
        console.error('An error occurred during the upload.');
        document.getElementById('uploadSpeedDisplay').textContent = "Error";
    };

    try {
        xhr.send(data);
    } catch (error) {
        console.error('Upload request failed:', error);
        document.getElementById('uploadSpeedDisplay').textContent = "Error";
    }
}

setInterval(function () {
    measureUploadSpeed('https://speed.cloudflare.com/__up'); 
}, 1000);
