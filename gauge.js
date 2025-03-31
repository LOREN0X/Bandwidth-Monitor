function setGaugeValue(gauge, value) {
    const fillClass = gauge.classList.contains("gauge-d") ? ".gauge_fill-d" : ".gauge_fill-u";
    const gaugeFill = gauge.querySelector(fillClass);

    if (value <= 0) {
        gaugeFill.style.transform = `rotate(0turn)`;
    } else if (value > 0 && value <= 1000) {
        gaugeFill.style.transform = `rotate(${value / 2000}turn)`;
    } else {
        gaugeFill.style.transform = `rotate(0.5turn)`;
    }
}

function updateGauges(downloadSpeed, uploadSpeed) {
    const gaugeElementD = document.querySelector(".gauge-d");
    const gaugeElementU = document.querySelector(".gauge-u");

    setGaugeValue(gaugeElementD, downloadSpeed);
    setGaugeValue(gaugeElementU, uploadSpeed);
}

