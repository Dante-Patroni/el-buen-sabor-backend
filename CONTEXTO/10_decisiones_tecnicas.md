# 10 - Decisiones Tecnicas (ADR ligero)

Ultima actualizacion: 2026-02-27

Usar este formato por decision:

## [YYYY-MM-DD] Titulo corto de la decision
### Contexto
- 

### Decision
- 

### Motivo
- 

### Impacto
- 

### Alternativas descartadas
- 

---

## [2026-02-27] Manejo centralizado de errores HTTP
### Contexto
- Habia manejos de error distintos entre controllers y middlewares.

### Decision
- Unificar con mapper central (`errorMapper`) y codigos de dominio.

### Motivo
- Homogeneidad de respuestas y menor riesgo de regresion.

### Impacto
- Contrato de error consistente en toda la API.

### Alternativas descartadas
- Mantener mapeos locales por controller.

---

## [2026-02-27] Upload con codigos de dominio
### Contexto
- Errores de `multer` no siempre quedaban en el contrato JSON esperado.

### Decision
- Agregar middleware de errores de upload y codigos:
  - `TIPO_ARCHIVO_INVALIDO`
  - `ARCHIVO_DEMASIADO_GRANDE`

### Motivo
- Uniformidad de errores en local y CI.

### Impacto
- Tests E2E mas confiables.

### Alternativas descartadas
- Mensajes de texto libres sin mapper central.

