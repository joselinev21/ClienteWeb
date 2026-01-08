package com.uv.ProyectoClienteWeb.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "paquete")
@Data
public class Paquete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPaquete;

    private String descripcion;
    private Double peso;
    private Double alto;
    private Double ancho;
    private Double profundidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idEnvio") 
    @JsonBackReference 
    private Envio envio;

    public Paquete() {}
}
