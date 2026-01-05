const URL_API = "http://localhost:8080/APIRestPaqueteria/api/";

async function buscarEnvio() {
    const inputGuia = document.getElementById('inputGuia');
    const guia = inputGuia.value.trim();
    
    if (!guia) {
        alert("Por favor, ingresa un número de guía válido.");
        return;
    }

    try {
        const respEnvio = await fetch(`${URL_API}envio/obtener-por-guia/${guia}`);
        
        if (respEnvio.status === 404) {
            alert("No se encontró ningún envío con ese número de guía.");
            return;
        }

        const envio = await respEnvio.json();

        document.getElementById('seccion-resultado').style.display = 'block';
        document.getElementById('resGuia').innerText = envio.noGuia;
        const nombreCompleto = `${envio.nombreReceptor} ${envio.apellidoPaternoReceptor} ${envio.apellidoMaternoReceptor || ''}`;
        document.getElementById('resNombre').innerText = nombreCompleto;

        const badgeEstatus = document.getElementById('resEstatusText');
        badgeEstatus.innerText = envio.status;
        console.log("Datos del envío recibidos:", envio); 
        actualizarColorBadge(badgeEstatus, envio.status);

        const direccionCompleta = `${envio.calleDestino} #${envio.numeroDestino}, CP: ${envio.codigoPostal}, ${envio.ciudad}, ${envio.estado}`;
        console.log("Dirección de entrega:", direccionCompleta);

        const listaPac = document.getElementById('listaPaquetes');
        listaPac.innerHTML = "";

        if(envio.paquetes && envio.paquetes.length > 0) {
            envio.paquetes.forEach(p => {
                const item = document.createElement('li');
                item.className = "list-group-item d-flex justify-content-between align-items-center";
                item.innerHTML = `
                    <span> ${p.descripcion}</span>
                    <span class="badge bg-secondary rounded-pill">${p.peso} kg</span>
                `;
                listaPac.appendChild(item);
            });
        } else {
            listaPac.innerHTML = '<li class="list-group-item text-muted">Sin paquetes registrados</li>';
        }

        const respHist = await fetch(`${URL_API}historialEnvio/consultar/${guia}`);
        const historial = await respHist.json();
        
        const tablaBody = document.getElementById('tablaHistorial');
        tablaBody.innerHTML = "";

        historial.forEach(mov => {
            const fechaFormateada = new Date(mov.fechaHora).toLocaleString('es-MX', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            const fila = `
                <tr>
                    <td class="small">${fechaFormateada}</td>
                    <td>
                        <span class="badge ${obtenerClaseEstatus(mov.estatusEnvio.estatusEnvio)}">
                            ${mov.estatusEnvio.estatusEnvio}
                        </span>
                    </td>
                    <td class="timeline-comment">${mov.comentario}</td>
                </tr>
            `;
            tablaBody.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Hubo un error al conectar con el servidor. Verifica que Spring Boot esté corriendo.");
    }
}

function obtenerClaseEstatus(estatus) {
    if (!estatus || typeof estatus !== 'string') {
        return "bg-secondary"; 
    }

    const e = estatus.toUpperCase();
    if (e.includes("ENTREGADO")) return "bg-success";
    if (e.includes("TRANSITO") || e.includes("RUTA") || e.includes("PENDIENTE")) return "bg-primary";
    if (e.includes("CANCELADO") || e.includes("ERROR")) return "bg-danger";
    
    return "bg-info text-dark";
}

function actualizarColorBadge(elemento, estatus) {
    const textoEstatus = estatus || "DESCONOCIDO";
    elemento.innerText = textoEstatus;
    elemento.className = "badge " + obtenerClaseEstatus(textoEstatus);
}

