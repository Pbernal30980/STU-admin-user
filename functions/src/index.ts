import {setGlobalOptions} from "firebase-functions";
import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

// 1. Inicializar el Admin SDK
admin.initializeApp();

// 2. Control de costos (Máximo 10 instancias concurrentes)
setGlobalOptions({maxInstances: 10});

/**
 * Calcula la distancia usando la fórmula de Haversine.
 * @param {number} lat1 Latitud inicial del bus.
 * @param {number} lon1 Longitud inicial del bus.
 * @param {number} lat2 Latitud de la parada destino.
 * @param {number} lon2 Longitud de la parada destino.
 * @return {number} Distancia resultante en kilómetros.
 */
function calcularDistanciaHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const r = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return r * c;
}

export const calcularETAOnUpdate = onDocumentUpdated(
  "ubicaciones_activas/{bus_id}",
  async (event) => {
    if (!event.data) return null;

    const dataAnterior = event.data.before.data();
    const dataNueva = event.data.after.data();

    // BLOQUEO DE LOOP INFINITO
    if (
      dataAnterior.latitud === dataNueva.latitud &&
      dataAnterior.longitud === dataNueva.longitud
    ) {
      return null;
    }

    try {
      const latBus = dataNueva.latitud;
      const lonBus = dataNueva.longitud;

      // Parada estática para pruebas (Calima El Darién)
      const latParada = 3.9332;
      const lonParada = -76.4951;

      const distanciaKm = calcularDistanciaHaversine(
        latBus,
        lonBus,
        latParada,
        lonParada
      );

      const velocidadPromedioKmh = 20;
      const tiempoEnHoras = distanciaKm / velocidadPromedioKmh;
      const tiempoEnMinutos = Math.round(tiempoEnHoras * 60);

      console.log(
        `[Bus ${event.params.bus_id}] ` +
        `Distancia: ${distanciaKm.toFixed(2)}km ` +
        `| ETA: ${tiempoEnMinutos} min`
      );

      return event.data.after.ref.update({
        eta_proxima_parada: tiempoEnMinutos,
        distancia_metros: Math.round(distanciaKm * 1000),
        ultima_actualizacion_eta: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("Error crítico calculando el ETA:", error);
      return null;
    }
  }
);
