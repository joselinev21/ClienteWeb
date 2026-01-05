package com.uv.ProyectoClienteWeb.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "colaborador")
@Data
public class Colaborador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idColaborador;

    private String nombre;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String numeroPersonal;

    public Colaborador() {}
    
}
