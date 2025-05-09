/**
 * Formatea una fecha en formato legible
 * @param date Fecha a formatear
 * @returns Fecha formateada en formato DD/MM/YYYY
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formatea una fecha y hora en formato legible
 * @param date Fecha a formatear
 * @returns Fecha y hora formateada en formato DD/MM/YYYY HH:MM
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Convierte una fecha ISO a un objeto Date
 * @param isoDate Fecha en formato ISO
 * @returns Objeto Date
 */
export function parseISODate(isoDate: string): Date {
  return new Date(isoDate);
}

/**
 * Obtiene la fecha actual en formato ISO
 * @returns Fecha actual en formato ISO
 */
export function getCurrentISODate(): string {
  return new Date().toISOString();
}

/**
 * Compara dos fechas para saber si son el mismo día
 * @param date1 Primera fecha
 * @param date2 Segunda fecha
 * @returns true si son el mismo día, false en caso contrario
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Añade días a una fecha
 * @param date Fecha base
 * @param days Número de días a añadir
 * @returns Nueva fecha con los días añadidos
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
