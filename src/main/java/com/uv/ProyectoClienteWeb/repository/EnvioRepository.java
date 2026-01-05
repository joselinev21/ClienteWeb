package com.uv.ProyectoClienteWeb.repository;

import com.uv.ProyectoClienteWeb.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnvioRepository extends JpaRepository<Envio, Integer> {
    Envio findByNoGuia(String noGuia);
}
