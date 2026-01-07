package com.uv.ProyectoClienteWeb.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "estatusenvio")
@Data
public class EstatusEnvio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEstatusEnvio;

    @Column(name = "estatus") 
    private String estatusEnvio; 
}