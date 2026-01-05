package com.uv.ProyectoClienteWeb.repository;

import com.uv.ProyectoClienteWeb.model.Paquete;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaqueteRepository extends JpaRepository<Paquete, Integer> {

    List<Paquete> findByEnvioIdEnvio(Integer idEnvio);
}
