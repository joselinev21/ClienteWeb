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

    // Relación con el Envío
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idEnvio") // Nombre de la llave foránea en tu tabla MySQL
    @JsonBackReference // Evita bucles infinitos al convertir a JSON
    private Envio envio;

    public Paquete() {}
}
