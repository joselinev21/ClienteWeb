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

    @Column(name = "idCliente")
    private Integer idCliente;

    @Column(name = "idSucursal")
    private Integer idSucursal;

    @Column(name = "idConductor")
    private Integer idConductor;

    @Column(name = "idColoniaDestino")
    private Integer idColoniaDestino;
    
    @Transient 
    private Integer codigoPostal;

    @Transient
    private String ciudad;

    @Transient
    private String estado;

    @Transient
    private String telefono;

    @Transient
    private String correo;

    @Transient
    private String nombreSucursal;

    @Transient
    private String status;
}