function linspace(start, stop, num) {
    const step = (stop - start) / (num - 1);
    const result = [];
    for (let i = 0; i < num; i++) {
        result.push(start + i * step);
    }
    return result;
}

const labels = linspace(0, 30, 31);
const Hlabels = linspace(-400, 400, 801);

// Objeto para guardar las instancias de los charts
const charts = {};
const chartsH = {};

// Función para inicializar gráficos vacíos
function initializeChart(canvasId, label, color, isAltitude = false) {
    const ctx = document.getElementById(canvasId).getContext("2d");

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: "transparent",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    title: { display: true, text: isAltitude ? "Altura (m)" : "Tiempo (s)" },
                    min: isAltitude ? -400 : undefined,
                    max: isAltitude ? 400 : undefined
                },
                y: {
                    title: { display: true, text: label }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: label + (isAltitude ? " vs Altura" : " vs Tiempo"),
                    font: { size: 18, weight: "bold" },
                    padding: 10
                }
            }
        }
    });

    isAltitude? chartsH[canvasId] = chart:charts[canvasId] = chart;
}

let dataInterval;
// Actualiza datos cada segundo
function addDataEverySecond() {
    dataInterval = setInterval(() => {
        const currentTime = charts["co2Chart"].data.labels.length;

        for (const [id, chart] of Object.entries(charts)) {
            chart.data.labels.push(currentTime);

            const newValue = Math.random() * 10;
            chart.data.datasets[0].data.push(newValue);

            chart.update();
        }

        for (const [id, chart] of Object.entries(chartsH)) {
            chart.data.labels.push(currentTime-400);

            const newValue = Math.random() * 10;
            chart.data.datasets[0].data.push(newValue);

            chart.update();
        }

    }, 1000);
}

// Función para cambiar color de botones
function changeColorOnClick(clickedBtn, otherBtn) {
    clickedBtn.style.backgroundColor = '#4CAF50';
    otherBtn.style.backgroundColor = '#abcbac';
}

// Función para manejar clic de botones
function handleButtonClick(event) {
    
    if (event.target.id === "info-btn-1") {
        changeColorOnClick(btn1, btn2);
        chartsAltitude.forEach(chart => {
            chart.style.display = 'none';  
        });
        chartsTime.forEach(chart => {
            chart.style.display = 'block';  
        });
    } else if (event.target.id === "info-btn-2") {
        changeColorOnClick(btn2, btn1);
        chartsAltitude.forEach(chart => {
            chart.style.display = 'block';  
        });
        chartsTime.forEach(chart => {
            chart.style.display = 'none';  
        });
    }
}

// Botones
const btn1 = document.getElementById('info-btn-1');
const btn2 = document.getElementById('info-btn-2');

btn1.addEventListener('click', handleButtonClick);
btn2.addEventListener('click', handleButtonClick);

btn1.disabled = true;
btn2.disabled = true;

// Temporizador
let timerInterval;
let seconds = 0;
let minutes = 0;
const timerElement = document.getElementById("timer");
const initMissionBtn = document.getElementById("init-mision");
const endMissionBtn = document.getElementById("end-mission-btn");

function updateTimerDisplay() {
    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(seconds).padStart(2, "0");
    timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
            updateTimerDisplay();
        }, 1000);
    }
}

function stopAndResetTimer() {
    clearInterval(timerInterval);

    timerInterval = null;

    clearInterval(dataInterval);

    setTimeout(() => {
        seconds = 0;
        minutes = 0;
        updateTimerDisplay();
    }, 5000);
}

// Función principal al iniciar misión
chartsTime = document.querySelectorAll(".time-chart")
chartsAltitude = document.querySelectorAll(".altitude-chart")

/*chartsAltitude.forEach(chart => {
    chart.style.display = 'none';  
});*/

function activate() {
    startTimer();

    // Inicializar gráficos vacíos
    initializeChart("co2Chart", "CO2 (ppm)", "#ff5733");
    initializeChart("pressureChart", "Presión (Pa)", "#3366ff");
    initializeChart("temperatureChart", "Temperatura (°C)", "#ffcc00");
    initializeChart("speedChart", "Velocidad (m/s)", "#9900cc");
    initializeChart("accelerationChart", "Aceleración (m/s²)", "#ff6600");
    initializeChart("altitudeChart", "Altitud (m)", "#33cc33");

    initializeChart("co2ChartH", "CO2 (ppm)", "#ff5733", true);
    initializeChart("pressureChartH", "Presión (Pa)", "#3366ff", true);
    initializeChart("temperatureChartH", "Temperatura (°C)", "#ffcc00", true);
    initializeChart("speedChartH", "Velocidad (m/s)", "#9900cc", true);
    initializeChart("accelerationChartH", "Aceleración (m/s²)", "#ff6600", true);

    btn1.disabled = false;
    btn2.disabled = false;

    // Empezar a añadir datos
    addDataEverySecond();
}

initMissionBtn.addEventListener("click", activate);
endMissionBtn.addEventListener("click", stopAndResetTimer);
