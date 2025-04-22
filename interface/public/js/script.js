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

function initializeChart3(canvasId, label, color, isAltitude = false) {
    const ctx = document.getElementById(canvasId).getContext("2d");

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: label + " - Línea 1",
                    data: [],
                    borderColor: color,
                    backgroundColor: "transparent",
                    fill: false,
                    tension: 0.4
                },
                {
                    label: label + " - Línea 2",
                    data: [],
                    borderColor: "#00ff00",  // Cambia este color a tu preferencia
                    backgroundColor: "transparent",
                    fill: false,
                    tension: 0.4
                },
                {
                    label: label + " - Línea 3",
                    data: [],
                    borderColor: "#0000ff",  // Cambia este color a tu preferencia
                    backgroundColor: "transparent",
                    fill: false,
                    tension: 0.4
                }
            ]
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

    isAltitude ? chartsH[canvasId] = chart : charts[canvasId] = chart;
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
    initializeChart3("accelerationChart", "Aceleración (m/s²)", "#ff6600");
    initializeChart("temperatureChart", "Temperatura (°C)", "#ffcc00");
    initializeChart3("speedChart", "Velocidad (m/s)", "#9900cc");
    initializeChart("altitudeChart", "Altitud (m)", "#33cc33");

    /*initializeChart("co2ChartH", "CO2 (ppm)", "#ff5733", true);
    initializeChart("pressureChartH", "Presión (Pa)", "#3366ff", true);
    initializeChart("temperatureChartH", "Temperatura (°C)", "#ffcc00", true);
    initializeChart3("speedChartH", "Velocidad (m/s)", "#9900cc", true);
    initializeChart3("accelerationChartH", "Aceleración (m/s²)", "#ff6600", true);*/

    btn1.disabled = false;
    btn2.disabled = false;

    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Conectado con ID:', socket.id);
        socket.emit('mensaje', { texto: '¡Hola servidor!' });
    });

    socket.on('respuesta', (data) => {
        console.log('Respuesta del servidor:', data);
    });

    socket.on('temperatura', (data) => {
        const {temperature, tiempo} = data

        chart = charts["temperatureChart"]

        chart.data.labels.push(tiempo);
        chart.data.datasets[0].data.push(temperature);
        chart.update();
    });

    socket.on('MPU', (data)=>{
        console.log(data)
        
        const {ax, ay, az, gx, gy, gz, tiempo} = data

        const currentTime = Date.now();

        let time = currentTime - tiempo *1000
        time = parseFloat(time.toFixed(2));

        const accelChart = charts["accelerationChart"];
        accelChart.data.labels.push(time);
        accelChart.data.datasets[0].data.push(ax); // Magnitud de la aceleración
        accelChart.data.datasets[1].data.push(ay); // Magnitud de la aceleración
        accelChart.data.datasets[2].data.push(az); // Magnitud de la aceleración
        accelChart.update();

        document.getElementById("ax-box").innerText = `x : ${ax}  m/s²`
        document.getElementById("ay-box").innerText = `y : ${ay}  m/s²`
        document.getElementById("az-box").innerText = `z : ${az}  m/s²`

        /*const velChart = charts["speedChart"];
        velChart.data.labels.push(time);
        velChart.data.datasets[0].data.push(ax); // Magnitud de la aceleración
        velChart.data.datasets[1].data.push(ay); // Magnitud de la aceleración
        velChart.data.datasets[2].data.push(az); // Magnitud de la aceleración
        velChart.update();

        document.getElementById("vx-box").innerText = `x : ${vx}  m/s`
        document.getElementById("vy-box").innerText = `y : ${vy}  m/s`
        document.getElementById("vz-box").innerText = `z : ${vz}  m/s`*/

        document.getElementById("angulo-value").innerText = `${Math.sqrt(gx*gx + gy*gy + gz*gz)}`

    })

    socket.on('BNO', (data)=>{
        console.log(data)
        
        const {presion,temperatura, altitud, tiempo} = data

        const currentTime = Date.now();

        let time = currentTime - tiempo *1000
        time = parseFloat(time.toFixed(2));

        const pressChart = charts["pressureChart"];
        pressChart.data.labels.push(time);
        pressChart.data.datasets[0].data.push(presion);
        pressChart.update();
        document.getElementById("pressure-value").innerText = `${presion}`


        const tempChart = charts["temperatureChart"];
        tempChart.data.labels.push(time);
        tempChart.data.datasets[0].data.push(temperatura);
        tempChart.update();
        document.getElementById("temperature-value").innerText = `${temperatura}`


        const altitChart = charts["altitudeChart"];
        altitChart.data.labels.push(time);
        altitChart.data.datasets[0].data.push(altitud);
        altitChart.update();

        document.getElementById("altitude-box").innerText = `Altitud: ${altitud}`

    })

    socket.on('GPS', (data)=>{
        console.log(data)
        
        const {latitude, longitude, tiempo} = data

        document.getElementById("latitude-box").innerText = `Latitud: ${latitude}`
        document.getElementById("longitude-box").innerText = `Latitud: ${longitude}`
    })

    // Empezar a añadir datos
    //addDataEverySecond();
}


initMissionBtn.addEventListener("click", activate);
endMissionBtn.addEventListener("click", stopAndResetTimer);


