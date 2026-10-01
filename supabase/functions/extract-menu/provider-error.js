// Return only controlled messages/codes. Never expose provider payloads or keys.
export function providerFailure(status,payload){
 const reasons=(payload?.error?.details||[]).map(d=>d?.reason).filter(r=>typeof r==='string');
 if(reasons.includes('API_KEY_INVALID')||reasons.includes('API_KEY_EXPIRED')||status===401)return {code:'KEY_INVALID',message:'Google rechazó la clave de Gemini. Revisa el valor de GEMINI_API_KEY en Supabase; debe ser una clave de Google AI Studio vigente.'};
 if(status===429)return {code:'QUOTA_EXCEEDED',message:'Google indicó que se agotó la cuota o el límite de solicitudes. Revisa los límites y la facturación del proyecto de esa clave en Google AI Studio.'};
 if(status===403)return {code:'ACCESS_DENIED',message:'Google rechazó el acceso de esta clave. Revisa sus restricciones y que permita usar la API de Gemini desde el servidor de Supabase.'};
 if(status===404)return {code:'MODEL_UNAVAILABLE',message:'El modelo configurado no está disponible para esta clave o API. Revisa GEMINI_MENU_MODEL en Supabase.'};
 if(status===400)return {code:'REQUEST_REJECTED',message:'Google rechazó el formato de la solicitud o del archivo. Prueba con una imagen JPG o PNG y comunica este código al soporte: REQUEST_REJECTED.'};
 if(status>=500)return {code:'PROVIDER_UNAVAILABLE',message:'Gemini no está disponible temporalmente. Intenta extraer los productos nuevamente en unos minutos.'};
 return {code:'PROVIDER_ERROR',message:'Google no pudo completar la extracción. Comunica al soporte el código PROVIDER_ERROR.'};
}

