package com.uv.ProyectoClienteWeb.controller;
import com.uv.ProyectoClienteWeb.model.HistorialEnvio;
import com.uv.ProyectoClienteWeb.repository.HistorialEnvioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/historialEnvio")
@CrossOrigin(origins = "*")
public class HistorialEnvioController {

    @Autowired
    private HistorialEnvioRepository historialRepository;

    @GetMapping("/consultar/{noGuia}")
    public List<HistorialEnvio> consultarHistorial(@PathVariable String noGuia) {
        return historialRepository.findByEnvioNoGuiaOrderByFechaHoraDesc(noGuia);
    }
    
}
