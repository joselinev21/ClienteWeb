package com.uv.ProyectoClienteWeb.model;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

@Data
public class HistorialEnvioId implements Serializable {
    private Integer envio;
    private Date fechaHoraCambio;
}
