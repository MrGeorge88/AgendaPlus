// Este archivo proporciona una implementación alternativa de toast
// en caso de que la importación de sonner falle

import { toast as customToast } from '../components/ui/toaster';

let toast: any = customToast;

// Intentar importar sonner
try {
  // Importación dinámica de sonner
  import('sonner').then((sonnerModule) => {
    // Si sonner se carga correctamente, usarlo
    toast = sonnerModule.toast;
  }).catch((error) => {
    console.error('Error al importar sonner, usando implementación personalizada:', error);
    // Seguir usando la implementación personalizada
    toast = customToast;
  });
} catch (error) {
  console.error('Error al importar sonner, usando implementación personalizada:', error);
  // Seguir usando la implementación personalizada
  toast = customToast;
}

export { toast };
