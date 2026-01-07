const URL_API = "http://localhost:8085/APIRestPaqueteria/api/";

async function buscarEnvio() {
    const inputGuia = document.getElementById('inputGuia');
    const guia = inputGuia.value.trim();
    const seccionResultado = document.getElementById('seccion-resultado');
    const tablaBody = document.getElementById('tablaHistorial');
    const listaPac = document.getElementById('listaPaquetes');
    
    // OCULTAR MENSAJES PREVIOS
    document.getElementById('contenedor-mensaje').style.display = 'none';

    // 1. Validación de entrada vacía
    if (!guia) {
        mostrarMensaje("Por favor, ingresa un número de guía.", "warning");
        return;
    }

    // 2. Limpieza visual previa antes de buscar
    seccionResultado.style.display = 'none';
    tablaBody.innerHTML = "";
    listaPac.innerHTML = "";

    try {
        // --- PETICIÓN DEL ENVÍO ---
        const respEnvio = await fetch(`${URL_API}envio/obtener-por-guia/${guia}`);
        
        if (respEnvio.status === 404) {
            mostrarMensaje("La guía ingresada no existe en nuestro sistema.", "danger");
            return;
        }

        const envio = await respEnvio.json();

        // Llenado de datos con validación de nulos (Null-safe)
        document.getElementById('resGuia').innerText = envio.noGuia || 'N/A';
        
        const nombreCompleto = `${envio.nombreReceptor || ''} ${envio.apellidoPaternoReceptor || ''} ${envio.apellidoMaternoReceptor || ''}`.trim();
        document.getElementById('resNombre').innerText = nombreCompleto || "Destinatario no registrado";

        const badgeEstatus = document.getElementById('resEstatusText');
        const estatusActual = envio.status || "Pendiente";
        actualizarColorBadge(badgeEstatus, estatusActual);

        // Mostrar sección de resultados
        seccionResultado.style.display = 'block';

        // --- MANEJO DE PAQUETES ---
        if (envio.paquetes && envio.paquetes.length > 0) {
            envio.paquetes.forEach(p => {
                const item = document.createElement('li');
                item.className = "list-group-item d-flex justify-content-between align-items-center animate-fade-in";
                item.innerHTML = `
                    <span><strong>Descripción:</strong> ${p.descripcion || 'Sin descripción'}</span>
                    <span class="badge bg-secondary rounded-pill">${p.peso || 0} kg</span>
                `;
                listaPac.appendChild(item);
            });
        } else {
            listaPac.innerHTML = '<li class="list-group-item text-muted text-center italic">No hay paquetes individuales registrados</li>';
        }

        // --- PETICIÓN DEL HISTORIAL ---
        const respHist = await fetch(`${URL_API}historialEnvio/consultar/${guia}`);
        
        if (respHist.ok) {
            const historial = await respHist.json();
            
            if (Array.isArray(historial) && historial.length > 0) {
                historial.forEach(mov => {
                    const fecha = mov.fechaHora ? new Date(mov.fechaHora) : new Date();
                    const fechaFormateada = fecha.toLocaleString('es-MX', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    });

                    const estatusMov = (mov.estatusEnvio && mov.estatusEnvio.estatusEnvio) ? mov.estatusEnvio.estatusEnvio : "Actualización";

                    const fila = `
                        <tr class="animate-fade-in">
                            <td class="small text-muted">${fechaFormateada}</td>
                            <td>
                                <span class="badge ${obtenerClaseEstatus(estatusMov)}">
                                    ${estatusMov.toUpperCase()}
                                </span>
                            </td>
                            <td class="timeline-comment">${mov.comentario || 'Sin observaciones'}</td>
                        </tr>
                    `;
                    tablaBody.innerHTML += fila;
                });
            } else {
                tablaBody.innerHTML = '<tr><td colspan="3" class="text-center p-4 text-muted">No se han registrado movimientos para este envío.</td></tr>';
            }
        }

    } catch (error) {
        console.error("Error técnico:", error);
        mostrarMensaje("Error de conexión: El servidor no responde. Inténtalo más tarde.", "danger");
    }
}

// Helper para colores de estatus
function obtenerClaseEstatus(estatus) {
    const e = String(estatus || "").toUpperCase();
    if (e.includes("ENTREGADO")) return "bg-success";
    if (e.includes("TRANSITO") || e.includes("RUTA")) return "bg-primary";
    if (e.includes("PENDIENTE") || e.includes("RECIBIDO")) return "bg-info text-dark";
    if (e.includes("CANCELADO") || e.includes("DETENIDO")) return "bg-danger";
    return "bg-secondary";
}

function actualizarColorBadge(elemento, estatus) {
    elemento.innerText = estatus.toUpperCase();
    elemento.className = "badge status-badge " + obtenerClaseEstatus(estatus);
}

function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById('contenedor-mensaje');
    const alerta = document.getElementById('texto-mensaje');
    
    // Configuramos el color de Bootstrap (danger, warning, info, etc.)
    alerta.className = `alert alert-${tipo} shadow-sm text-center animate-fade-in`;
    alerta.innerText = texto;
    
    // Mostramos el contenedor
    contenedor.style.display = 'block';

    // (Opcional) Hacer que el mensaje desaparezca solo después de 5 segundos
    setTimeout(() => {
        contenedor.style.display = 'none';
    }, 5000);
}