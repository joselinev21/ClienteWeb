package com.uv.ProyectoClienteWeb.repository;

import com.uv.ProyectoClienteWeb.model.HistorialEnvio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialEnvioRepository extends JpaRepository<HistorialEnvio, Integer> {

    List<HistorialEnvio> findByEnvioNoGuiaOrderByFechaHoraDesc(String noGuia);
}
