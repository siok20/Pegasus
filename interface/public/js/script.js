const labels = ["0s", "1s", "2s", "3s", "4s", "5s"];
const generateRandomData = () => labels.map(() => Math.random() * 10);

const createChart = (canvasId, label, color) => {
    const ctx = document.getElementById(canvasId).getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: generateRandomData(),
                borderColor: color,
                backgroundColor: "transparent", 
                fill: true,
                tension: 0.4 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Tiempo (s)" } },
                y: { title: { display: true, text: label } }
            },
            plugins: {
                title: {
                    display: true,
                    text: label + " vs tiempo", 
                    font: { size: 18, weight: "bold" },
                    padding: 10
                }
            }
        }
    });
};

createChart("co2Chart", "CO2 (ppm)", "#ff5733");
createChart("pressureChart", "Presión (Pa)", "#3366ff");
createChart("altitudeChart", "Altitud (m)", "#33cc33");
createChart("temperatureChart", "Temperatura (°C)", "#ffcc00");
createChart("speedChart", "Velocidad (m/s)", "#9900cc");
createChart("accelerationChart", "Aceleración (m/s²)", "#ff6600");

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

    setTimeout(() => {
        seconds = 0;
        minutes = 0;
        updateTimerDisplay();
    }, 5000);
}

initMissionBtn.addEventListener("click", startTimer);
endMissionBtn.addEventListener("click", stopAndResetTimer);