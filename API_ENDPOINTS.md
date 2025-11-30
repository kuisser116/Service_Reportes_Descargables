# Documentación de API - Servicio de Validación y Reportes

Base URL (Producción): `https://[TU-URL-RENDER]`
Base URL (Local): `http://localhost:4000`

## 1. Validación de Boletos (Módulo 5.1 y 5.2)

### Validar Boleto
Permite validar el acceso de un asistente escaneando su código QR (folio).

- **Método:** `POST`
- **Endpoint:** `/api/validar`
- **Body (JSON):**
  ```json
  {
    "folio": "BOL-123"
  }
  ```
- **Respuestas:**
  - `200 OK`: Acceso permitido.
    ```json
    {
      "mensaje": "Acceso permitido",
      "boleto": { ... }
    }
    ```
  - `400 Bad Request`: El boleto ya fue usado antes (Duplicidad).
    ```json
    {
      "mensaje": "Boleto ya registrado en el acceso",
      "fechaValidacion": "2023-11-30T..."
    }
    ```
  - `404 Not Found`: El folio no existe o es inválido.

---

## 2. Estadísticas en Tiempo Real (Módulo 5.3)

### Obtener Estadísticas
Devuelve datos numéricos para alimentar gráficas en el frontend.

- **Método:** `GET`
- **Endpoint:** `/api/estadisticas/:eventoId`
- **Parámetros:**
  - `eventoId`: El ID del evento en MongoDB (ej. `6568f...`).
- **Respuesta:**
  ```json
  {
    "evento": "Concierto de Prueba",
    "capacidadTotal": 100,
    "asistentesIngresados": 45,
    "capacidadRestante": 55,
    "porcentajeAsistencia": "45.00%"
  }
  ```

---

## 3. Reportes Descargables (Módulo 5.4)

### Descargar PDF
Genera y descarga un archivo PDF con el reporte de asistencia.

- **Método:** `GET`
- **Endpoint:** `/api/reporte/:eventoId/pdf`
- **Respuesta:** Archivo binario (`application/pdf`).

### Descargar Excel
Genera y descarga un archivo Excel (.xlsx) con el reporte de asistencia.

- **Método:** `GET`
- **Endpoint:** `/api/reporte/:eventoId/excel`
- **Respuesta:** Archivo binario (`application/vnd.openxmlformats...`).
