document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector(".logs-table tbody");

    try {
        // ⚡ Llamada a tu API
        const response = await fetch("http://localhost:3000/proyectos/");
        const result = await response.json();
        console.log("Archivos recibidos:", result);

        if (!result.data || result.data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td class="no-data" colspan="2">No data disponible</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = "";

        // ✅ Ahora cada item es un string (nombre del archivo)
        result.data.forEach(fileName => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${fileName || "-"}</td>
                <td>
                    <button class="btn-preview" data-file="${fileName}">Previsualizar</button>
                    <button class="btn-download" data-file="${fileName}">Descargar</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Eventos de los botones
        document.querySelectorAll(".btn-preview").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const file = e.target.dataset.file;
                console.log("Preview:", file);
                try {
                    const res = await fetch(`http://localhost:3000/proyectos/preview/${file}`);
                    const data = await res.json();

                    alert("+ Previsualización:\n\n" + data.preview.join("\n"));
                } catch (err) {
                    alert("X Error al previsualizar el archivo");
                    console.error(err);
                }
            });
        });

        document.querySelectorAll(".btn-download").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const file = e.target.dataset.file;
                console.log("Download:", file);
                window.location.href = `http://localhost:3000/proyectos/download/${file}`;
            });
        });

    } catch (error) {
        console.error("Error cargando logs:", error);
        tableBody.innerHTML = `
            <tr>
                <td class="no-data" colspan="2">Error cargando datos</td>
            </tr>
        `;
    }
});
