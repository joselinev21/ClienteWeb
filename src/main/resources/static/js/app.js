const URL_API = "http://localhost:8085/APIRestPaqueteria/api/";

const DOM = {
    inputGuia: document.getElementById('inputGuia'),
    btnBuscar: document.getElementById('btnBuscar'),
    btnText: document.getElementById('btnText'),
    btnSpinner: document.getElementById('btnSpinner'),
    seccionResultado: document.getElementById('seccion-resultado'),
    tablaHistorial: document.getElementById('tablaHistorial'),
    listaPaquetes: document.getElementById('listaPaquetes'),
    barraProgreso: document.getElementById('barra-progreso'),
    contenedorMensaje: document.getElementById('contenedor-mensaje'),
    textoMensaje: document.getElementById('texto-mensaje'),
    resGuia: document.getElementById('resGuia'),
    resNombre: document.getElementById('resNombre'),
    resEstatusText: document.getElementById('resEstatusText')
};

const ENDPOINTS = {
    ENVIO_POR_GUIA: (guia) => `${URL_API}envio/obtener-por-guia/${guia}`,
    HISTORIAL: (guia) => `${URL_API}historialEnvio/consultar/${guia}`
};

const fetchConfig = {
    method: "GET",
    headers: { "Accept": "application/json" }
};

async function buscarEnvio() {
    const guia = DOM.inputGuia.value.trim();
    
    limpiarInterfaz();
    
    if (!guia) {
        mostrarMensaje("Por favor, ingresa un número de guía válido.", "warning");
        return;
    }

    DOM.btnBuscar.disabled = true;
    DOM.btnBuscar.setAttribute("aria-busy", "true");
    DOM.btnText.textContent = "Buscando...";
    DOM.btnSpinner.style.display = 'inline-block';

    try {
        const respEnvio = await fetch(ENDPOINTS.ENVIO_POR_GUIA(guia), fetchConfig);
        
        if (!respEnvio.ok) {
            const msg = respEnvio.status === 404 ? "La guía no existe." : "Error en el servidor.";
            mostrarMensaje(msg, "danger");
            return;
        }

        const envio = await respEnvio.json();
        renderizarDatosEnvio(envio);

        const respHist = await fetch(ENDPOINTS.HISTORIAL(guia), fetchConfig);
        if (respHist.ok) {
            const historial = await respHist.json();
            renderizarHistorial(historial);
        }

    } catch (error) {
        console.error("Error en flujo de datos:", error);
        mostrarMensaje("Sin conexión con el servidor.", "danger");
    } finally {
        DOM.btnBuscar.disabled = false;
        DOM.btnBuscar.removeAttribute("aria-busy");
        DOM.btnText.textContent = "Buscar";
        DOM.btnSpinner.style.display = 'none';
    }
}

function renderizarHistorial(historial) {
    if (Array.isArray(historial) && historial.length > 0) {
        let filas = ""; 
        historial.forEach(mov => {
            const fecha = new Date(mov.fechaHora).toLocaleString('es-MX', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
          
            const estatusStr = mov.estatusEnvio?.estatusEnvio || "Actualización";
            const comentario = (mov.comentario || "Sin observaciones")
                .replace(/</g, "&lt;").replace(/>/g, "&gt;");

            filas += `
                <tr class="animate-fade-in">
                    <td class="small text-muted">${fecha}</td>
                    <td><span class="badge ${obtenerClaseEstatus(estatusStr)}">${estatusStr.toUpperCase()}</span></td>
                    <td class="timeline-comment">${comentario}</td>
                </tr>`;
        });
        DOM.tablaHistorial.innerHTML = filas;
    } else {
        DOM.tablaHistorial.innerHTML = '<tr><td colspan="3" class="text-center p-4 text-muted">Sin movimientos registrados.</td></tr>';
    }
}

function renderizarDatosEnvio(envio) {
    DOM.seccionResultado.style.display = 'block';
    DOM.resGuia.textContent = envio.noGuia;
    DOM.resNombre.textContent = `${envio.nombreReceptor || ''} ${envio.apellidoPaternoReceptor || ''}`.trim();
    
    actualizarColorBadge(DOM.resEstatusText, envio.status);
    actualizarBarraProgreso(envio.status);

    DOM.listaPaquetes.innerHTML = "";
    (envio.paquetes || []).forEach(p => {
        const item = document.createElement('li');
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        
        const descSpan = document.createElement('span');
        descSpan.textContent = p.descripcion || "Paquete";
        
        const pesoBadge = document.createElement('span');
        pesoBadge.className = "badge bg-secondary";
        pesoBadge.textContent = `${p.peso} kg`;
        
        item.appendChild(descSpan);
        item.appendChild(pesoBadge);
        DOM.listaPaquetes.appendChild(item);
    });
}

function normalizarEstatus(estatus) {
    return String(estatus || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function obtenerClaseEstatus(estatus) {
    const e = normalizarEstatus(estatus);
    if (e.includes("ENTREGADO")) return "bg-success";
    if (e.includes("TRANSITO") || e.includes("RUTA")) return "bg-primary";
    if (e.includes("CANCELADO")) return "bg-danger";
    return "bg-info text-dark";
}

function actualizarBarraProgreso(estatus) {
    const barra = DOM.barraProgreso;
    const e = normalizarEstatus(estatus);
    
    barra.className = "progress-bar progress-bar-striped progress-bar-animated";

    if (e.includes("RECIBIDO") || e.includes("PENDIENTE")) {
        barra.style.width = "20%";
        barra.classList.add("bg-info");
    } 
    else if (e.includes("RUTA") || e.includes("TRANSITO")) {
        barra.style.width = "60%";
        barra.classList.add("bg-primary");
    } 
    else if (e.includes("ENTREGADO")) {
        barra.style.width = "100%";
        barra.classList.add("bg-success");
        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    } 
    else if (e.includes("CANCELADO") || e.includes("PROBLEMA") || e.includes("DETENIDO") || e.includes("ERROR")) {
        barra.style.width = "100%";
        barra.classList.add("bg-danger");
    } 

    else {
        barra.style.width = "40%";
        barra.classList.add("bg-secondary");
    }
}

function limpiarInterfaz() {

    DOM.seccionResultado.style.display = 'none';
    DOM.contenedorMensaje.style.display = 'none';
    
    DOM.tablaHistorial.innerHTML = "";
    DOM.listaPaquetes.innerHTML = "";
    DOM.resGuia.textContent = "";
    DOM.resNombre.textContent = "";
    DOM.resEstatusText.textContent = "";

    DOM.barraProgreso.style.width = "0%";
    DOM.barraProgreso.className = "progress-bar";
}

function mostrarMensaje(texto, tipo) {
    DOM.textoMensaje.className = `alert alert-${tipo} shadow-sm text-center`;
    DOM.textoMensaje.textContent = texto;
    DOM.contenedorMensaje.style.display = 'block';
}

function actualizarColorBadge(elemento, estatus) {
    const txt = String(estatus || "").toUpperCase();
    elemento.textContent = txt;
    elemento.className = "badge " + obtenerClaseEstatus(txt);
}