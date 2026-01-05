package com.uv.ProyectoClienteWeb.controller;

import com.uv.ProyectoClienteWeb.model.Envio;
import com.uv.ProyectoClienteWeb.model.HistorialEnvio;
import com.uv.ProyectoClienteWeb.repository.EnvioRepository;
import com.uv.ProyectoClienteWeb.repository.HistorialEnvioRepository; // <-- 1. IMPORTANTE AGREGAR
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/envio")
@CrossOrigin(origins = "*")
public class EnvioController {

    @Autowired
    private EnvioRepository envioRepository;

    // 2. ACTUALIZACIÓN: Debes inyectar este repositorio para poder consultar el historial
    @Autowired
    private HistorialEnvioRepository historialRepository;

    @GetMapping("/obtener-por-guia/{noGuia}")
    public ResponseEntity<?> obtenerPorGuia(@PathVariable String noGuia) {
        Envio envio = envioRepository.findByNoGuia(noGuia);
        
        if (envio != null) {
            List<HistorialEnvio> historial = historialRepository.findByEnvioNoGuiaOrderByFechaHoraDesc(noGuia);
            
            if (!historial.isEmpty()) {
                envio.setStatus(historial.get(0).getEstatusEnvio().getEstatusEnvio());
            } else {
                envio.setStatus("PENDIENTE");
            }
            
            return ResponseEntity.ok(envio);
        }
        return ResponseEntity.status(404).body("Guía no encontrada");
    }
}