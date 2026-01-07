package com.uv.ProyectoClienteWeb.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "historialenvio")
@Data
public class HistorialEnvio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idHistorialEnvio")
    private Integer idHistorialEnvio;

    @Column(nullable = false)
    private String comentario;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fechaHora") 
    private Date fechaHora;

    @ManyToOne
    @JoinColumn(name = "idEnvio")
    private Envio envio;

    @ManyToOne
    @JoinColumn(name = "idEstatusEnvio")
    private EstatusEnvio estatusEnvio;

    @ManyToOne
    @JoinColumn(name = "idColaborador")
    private Colaborador colaborador;

    public HistorialEnvio() {}
}