package com.uv.ProyectoClienteWeb.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "envio")
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEnvio")
    private Integer idEnvio;

    @Column(name = "noGuia")
    private String noGuia;

    @Column(name = "nombreReceptor")
    private String nombreReceptor;

    @Column(name = "apellidoPaternoReceptor")
    private String apellidoPaternoReceptor;

    @Column(name = "apellidoMaternoReceptor")
    private String apellidoMaternoReceptor;

    @Column(name = "calleDestino")
    private String calleDestino;

    @Column(name = "numeroDestino")
    private String numeroDestino;

    // Relación para que NO salga vacío el historial o estatus
    @Transient
    private String status;

    // Relación para que se vean los paquetes en la lista
    @OneToMany(mappedBy = "envio")
    private java.util.List<Paquete> paquetes;
}