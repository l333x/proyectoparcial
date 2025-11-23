let chartTendencia = null;
let chartDona = null;
let chartBarras = null;
let datosGlobales = null;

document.addEventListener('DOMContentLoaded', function() {
    fetch('datos.json')
        .then(response => response.json())
        .then(data => {
            datosGlobales = data;
            cargarDashboard('semana'); // Carga inicial
        })
        .catch(error => console.error('Error cargando datos:', error));
});

// --- Renderizado Principal ---
function cargarDashboard(periodo) {
    if (!datosGlobales) return;

    // KPIs
    const kpis = datosGlobales.kpis[periodo];
    document.getElementById('kpi-ventas').innerText = kpis.ventas;
    document.getElementById('kpi-ingresos').innerText = kpis.ingresos;
    document.getElementById('kpi-usuarios').innerText = kpis.usuarios;
    document.getElementById('kpi-conversion').innerText = kpis.conversion;

    // Gráficas
    renderizarGraficaTendencia(periodo);
    
    if (!chartDona) renderizarGraficaDona();
    
    // Inicializar gráfica de barras con "General"
    if (!chartBarras) {
        const datosIniciales = datosGlobales.graficas.inventario_por_categoria['General'];
        renderizarGraficaBarras(datosIniciales.labels, datosIniciales.data);
    }

    llenarTabla(datosGlobales.transacciones);
}

function cambiarFiltro(periodo, textoBtn) {
    document.getElementById('texto-filtro').innerText = textoBtn;
    document.getElementById('label-grafica-1').innerText = textoBtn;
    
    document.body.style.cursor = 'wait';
    setTimeout(() => {
        cargarDashboard(periodo);
        document.body.style.cursor = 'default';
        mostrarToast(`Datos actualizados: ${textoBtn}`);
    }, 300);
}

// --- Nueva Función: Filtrar Productos por Categoría ---
function filtrarProductos(categoria, boton) {
    if (!datosGlobales) return;

    // 1. Actualizar estado visual de los botones
    // Quitamos 'active' de todos y se lo ponemos al clickeado
    const botones = boton.parentElement.querySelectorAll('.btn');
    botones.forEach(b => b.classList.remove('active'));
    boton.classList.add('active');

    // 2. Obtener datos de la categoría seleccionada
    const datosCategoria = datosGlobales.graficas.inventario_por_categoria[categoria];

    if (datosCategoria) {
        // 3. Actualizar la gráfica (Destruir y crear para ajustar tamaño si cambia cantidad de barras)
        renderizarGraficaBarras(datosCategoria.labels, datosCategoria.data);
        mostrarToast(`Mostrando: ${categoria}`);
    }
}


// --- Gráficas Chart.js ---
function renderizarGraficaTendencia(periodo) {
    const ctx = document.getElementById('chartTendencia').getContext('2d');
    const datos = datosGlobales.graficas.ventas[periodo];

    if (chartTendencia) {
        chartTendencia.destroy();
    }

    chartTendencia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.labels,
            datasets: [{
                label: 'Ventas ($)',
                data: datos.data,
                borderColor: '#0d6efd',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(13, 110, 253, 0.2)');
                    gradient.addColorStop(1, 'rgba(13, 110, 253, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } }
        }
    });
}

function renderizarGraficaDona() {
    const ctx = document.getElementById('chartDona').getContext('2d');
    const datos = datosGlobales.graficas.categorias;

    chartDona = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: datos.labels,
            datasets: [{
                data: datos.data,
                backgroundColor: datos.colores,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } }
        }
    });
}

// Modificada para aceptar datos dinámicos
function renderizarGraficaBarras(labels, data) {
    const ctx = document.getElementById('chartBarras').getContext('2d');

    if (chartBarras) {
        chartBarras.destroy();
    }

    chartBarras = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock / Ventas',
                data: data,
                backgroundColor: '#198754',
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y', // Barras horizontales
            responsive: true,
            maintainAspectRatio: false, // Permitir que crezca si hay muchos datos
            plugins: { legend: { display: false } },
            scales: { x: { grid: { display: false } } }
        }
    });
}

// --- Tabla y Utilidades ---
function llenarTabla(transacciones) {
    const tbody = document.querySelector('#tabla-transacciones tbody');
    tbody.innerHTML = ''; 

    transacciones.forEach(t => {
        let badge = t.estado === 'Completado' ? 'bg-success' : 
                    t.estado === 'Pendiente' ? 'bg-warning text-dark' : 
                    t.estado === 'Cancelado' ? 'bg-danger' : 
                    t.estado === 'Reembolsado' ? 'bg-info' : 'bg-secondary';

        tbody.innerHTML += `
            <tr>
                <td><small class="text-muted">${t.id}</small></td>
                <td class="fw-medium">${t.usuario}</td>
                <td><span class="badge bg-light text-dark border">${t.categoria || 'General'}</span></td>
                <td>${t.fecha}</td>
                <td>${t.monto}</td>
                <td><span class="badge ${badge}">${t.estado}</span></td>
            </tr>
        `;
    });
}

function filtrarTabla() {
    const busqueda = document.getElementById('filtroTabla').value.toLowerCase();
    const filas = document.querySelectorAll('#tabla-transacciones tbody tr');

    filas.forEach(fila => {
        const usuario = fila.children[1].innerText.toLowerCase();
        if (usuario.includes(busqueda)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function exportarDatos() {
    if (!datosGlobales) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Usuario,Fecha,Monto,Estado,Categoria\n"; 

    datosGlobales.transacciones.forEach(t => {
        csvContent += `${t.id},${t.usuario},${t.fecha},${t.monto},${t.estado},${t.categoria}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_techvision.csv");
    document.body.appendChild(link);
    
    link.click(); 
    document.body.removeChild(link); 

    mostrarToast("Archivo CSV descargado correctamente");
}

function mostrarToast(mensaje) {
    const toastEl = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastMessage');
    toastBody.innerText = mensaje;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

function compartirDashboard() {
    navigator.clipboard.writeText(window.location.href);
    mostrarToast("Enlace copiado al portapapeles");
}