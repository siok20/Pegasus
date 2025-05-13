let socket;

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
                    label:  label.charAt(0).toLowerCase() + "x",
                    data: [],
                    borderColor: color,
                    backgroundColor: "transparent",
                    fill: false,
                    tension: 0.4
                },
                {
                    label:  label.charAt(0).toLowerCase() + "y",
                    data: [],
                    borderColor: "#00ff00",  // Cambia este color a tu preferencia
                    backgroundColor: "transparent",
                    fill: false,
                    tension: 0.4
                },
                {
                    label:  label.charAt(0).toLowerCase() + "z",
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

    if (socket.connected) {
        socket.disconnect();
        console.log("Socket desconectado.");
        document.getElementById('status-yellow').style.backgroundColor = '#fcffb3';
        document.getElementById('status-red').style.backgroundColor = 'red';
        document.getElementById('status-green').style.backgroundColor = '#bbffb3';
    }

    setTimeout(() => {
        seconds = 0;
        minutes = 0;
        updateTimerDisplay();
    }, 5000);

}

// Función principal al iniciar misión
chartsTime = document.querySelectorAll(".time-chart")
chartsAltitude = document.querySelectorAll(".altitude-chart")


function status_yellow(){
    document.getElementById('status-yellow').style.backgroundColor = 'yellow';
    document.getElementById('status-red').style.backgroundColor = '#e57575';
    document.getElementById('status-green').style.backgroundColor = '#bbffb3';
}

function status_green(){
    document.getElementById('status-yellow').style.backgroundColor = '#fcffb3';
    document.getElementById('status-red').style.backgroundColor = '#e57575';
    document.getElementById('status-green').style.backgroundColor = 'green';
}

function status_red(){
    document.getElementById('status-yellow').style.backgroundColor = '#fcffb3';
    document.getElementById('status-red').style.backgroundColor = 'red';
    document.getElementById('status-green').style.backgroundColor = '#bbffb3';
}

let startTime;

function activate() {

    startTime = Date.now();

    btn1.disabled = false;
    btn2.disabled = false;

    socket = io('http://localhost:3000', {
        reconnectionAttempts: 5,
        timeout: 2000
    });

    status_yellow()

    socket.on('connect', () => {
        console.log('Conectado con ID:', socket.id);
        socket.emit('mensaje', { texto: '¡Hola servidor!' });
        status_green()
        startTimer();
    });

    socket.on('connect_error', () => {
        console.log('Error al conectar');
        status_red()
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

    let vx = 0, vy = 0, vz = 0;
    let lastTime = 0;

    socket.on('300', (data)=>{
        console.log(data)
        
        const {ax, ay, az, gy, time} = data

        /*const currentTime = Date.now();  // Tiempo actual
        const elapsedTime = currentTime - startTime;  // Tiempo transcurrido en milisegundos
        const seconds = Math.floor(elapsedTime / 1000);  // Segundos
        const milliseconds = elapsedTime % 1000;  // Milisegundos

        const formattedTime = `${seconds}.${milliseconds.toString().padStart(3, '0')}`;*/

        

        const accelChart = charts["accelerationChart"];
        accelChart.data.labels.push(time);
        accelChart.data.datasets[0].data.push(ax); // Magnitud de la aceleración
        accelChart.data.datasets[1].data.push(ay); // Magnitud de la aceleración
        accelChart.data.datasets[2].data.push(az); // Magnitud de la aceleración
        accelChart.update();

        document.getElementById("ax-box").innerText = `x : ${ax}  m/s²`
        document.getElementById("ay-box").innerText = `y : ${ay}  m/s²`
        document.getElementById("az-box").innerText = `z : ${az}  m/s²`

        /*if (lastTime === 0) {
            lastTime = tiempo*1000;  // Inicializa el tiempo si es la primera vez
            return;
        }

        const deltaTime = tiempo - lastTime;  // No necesitamos convertir a segundos, time.time() ya lo da en segundos
*/
        // Calcula la velocidad en cada eje usando la aceleración
        /*vx += ax * deltaTime;
        vy += ay * deltaTime;
        //vz += az * deltaTime;

        lastTime = tiempo*1000;

        const velChart = charts["speedChart"];
        velChart.data.labels.push(formattedTime);
        velChart.data.datasets[0].data.push(vx); 
        velChart.data.datasets[1].data.push(vy); 
        velChart.data.datasets[2].data.push(vz); 
        velChart.update();

        document.getElementById("vx-box").innerText = `x : ${vx}  m/s`
        document.getElementById("vy-box").innerText = `y : ${vy}  m/s`
        document.getElementById("vz-box").innerText = `z : ${vz}  m/s`*/

        document.getElementById("latency-value").innerText = `${time} ms`
        //document.getElementById("angulo-value").innerText = `${Math.sqrt(gx*gx + gy*gy + gz*gz)}`

    })

    socket.on('400', (data)=>{
        console.log(data)

        const {vx, vy, vz, CO2, time} = data

        const velChart = charts["speedChart"];
        velChart.data.labels.push(time);
        velChart.data.datasets[0].data.push(vx); 
        velChart.data.datasets[1].data.push(vy); 
        velChart.data.datasets[2].data.push(vz); 
        velChart.update();

        document.getElementById("vx-box").innerText = `x : ${vx}  m/s`
        document.getElementById("vy-box").innerText = `y : ${vy}  m/s`
        document.getElementById("vz-box").innerText = `z : ${vz}  m/s`

        const co2Chart = charts["co2Chart"];
        co2Chart.data.labels.push(time);
        co2Chart.data.datasets[0].data.push(CO2);
        co2Chart.update();
    
    })

    socket.on('100', (data)=>{
        console.log(data)
        
        const {temperatura, presion, altitude, CO2 , time} = data

        /*const currentTime = Date.now();  // Tiempo actual
        const elapsedTime = currentTime - startTime;  // Tiempo transcurrido en milisegundos
        const seconds = Math.floor(elapsedTime / 1000);  // Segundos
        const milliseconds = elapsedTime % 1000;  // Milisegundos

        const formattedTime = `${seconds}.${milliseconds.toString().padStart(3, '0')}`;


        //let time = currentTime - tiempo *1000
        time = parseFloat(time.toFixed(2));*/

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
        altitChart.data.datasets[0].data.push(altitude);
        altitChart.update();

        const co2Chart = charts["co2Chart"];
        co2Chart.data.labels.push(time);
        co2Chart.data.datasets[0].data.push(CO2);
        co2Chart.update();

        document.getElementById("co2-value").innerText = `${CO2} `

        document.getElementById("latency-value").innerText = `${time} ms`
        document.getElementById("altitude-box").innerText = `Altitud: ${altitude}`

    })
    distancia = 1
    socket.on('200', (data)=>{
        console.log(data)
        
        const {longitud, latitud, gx, gz, time} = data

        const currentTime = Date.now();

        //let time = currentTime - tiempo *1000
        //time = parseFloat(time.toFixed(2));

        //document.getElementById("distance-value").innerText = `${distancia*2.7*seconds+60*minutes}`
        document.getElementById("latitude-box").innerText = `Latitud: ${latitud}`
        document.getElementById("latency-value").innerText = `${time} ms`
        document.getElementById("longitude-box").innerText = `Latitud: ${longitud}`
    })

    // Empezar a añadir datos
    //addDataEverySecond();
}


initMissionBtn.addEventListener("click", activate);
endMissionBtn.addEventListener("click", stopAndResetTimer);

// Inicializar gráficos vacíos
initializeChart("co2Chart", "CO2 (ppm)", "#ff5733");
initializeChart("pressureChart", "Presión (Pa)", "#3366ff");
initializeChart3("accelerationChart", "Aceleración (m/s²)", "#ff6600");
initializeChart("temperatureChart", "Temperatura (°C)", "#ffcc00");
initializeChart3("speedChart", "Velocidad (m/s)", "#9900cc");
initializeChart("altitudeChart", "Altitud (m)", "#33cc33");

initializeChart("co2ChartH", "CO2 (ppm)", "#ff5733", true);
initializeChart("pressureChartH", "Presión (Pa)", "#3366ff", true);
initializeChart("temperatureChartH", "Temperatura (°C)", "#ffcc00", true);
initializeChart3("speedChartH", "Velocidad (m/s)", "#9900cc", true);
initializeChart3("accelerationChartH", "Aceleración (m/s²)", "#ff6600", true);
