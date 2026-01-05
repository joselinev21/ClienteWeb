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
    private Integer idHistorialEnvio;

    @Column(nullable = false)
    private String comentario;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fechaHora", insertable = false, updatable = false, 
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Date fechaHora;

    // Relación con el Envío
    @ManyToOne
    @JoinColumn(name = "idEnvio")
    private Envio envio;

    // Relación con el catálogo de Estatus
    @ManyToOne
    @JoinColumn(name = "idEstatusEnvio")
    private EstatusEnvio estatusEnvio;

    // Relación con el Colaborador (quien hizo el cambio)
    @ManyToOne
    @JoinColumn(name = "idColaborador")
    private Colaborador colaborador;

    public HistorialEnvio() {}
}
