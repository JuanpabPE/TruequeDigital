# Sistema de Pagos por QR (Yape/Plin)

## 📱 Información de Pago

**Número de teléfono:** +51 923 094 108

**Métodos aceptados:**

- Yape
- Plin

---

## 📋 Planes de Membresía

### Plan Básico - S/5

- **Intercambios:** 3 por mes
- Matches inteligentes semanales
- Verificación de identidad
- Soporte 24/7 por WhatsApp
- Acceso a eventos presenciales

### Plan Standard - S/15

- **Intercambios:** 12 por mes
- Prioridad en matches
- Destacar 3 publicaciones
- Acceso anticipado a eventos
- Badge de usuario premium

### Plan Premium - S/30

- **Intercambios:** 30 por mes
- Matches ilimitados prioritarios
- Destacar todas las publicaciones
- Soporte prioritario VIP
- Mentoría personalizada mensual

---

## 🔄 Flujo de Pago

### 1. Usuario selecciona un plan

- El usuario elige uno de los tres planes disponibles
- Se muestra el modal de pago con las opciones

### 2. Selección del método de pago

- **Yape** o **Plin**
- Se muestra el código QR generado automáticamente
- También se muestra el número de teléfono para transferencia manual

### 3. Realización del pago

- El usuario escanea el QR con su app
- O transfiere manualmente al número +51 923 094 108
- Monto exacto según el plan seleccionado

### 4. Subida del comprobante

- El usuario toma captura del comprobante
- Sube la imagen directamente en la plataforma
- La imagen se almacena en Cloudinary

### 5. Activación automática

- Una vez subido el comprobante, la membresía se activa
- El usuario puede acceder a los beneficios inmediatamente
- Se actualiza el contador de intercambios disponibles

---

## 🛠️ Implementación Técnica

### Backend

#### Modelo de Membresía

```javascript
{
  user: ObjectId,
  plan: "basic" | "standard" | "premium",
  price: Number,
  exchangesAllowed: Number,  // 3, 12 o 30
  exchangesUsed: Number,     // Contador de usos
  startDate: Date,
  endDate: Date,
  status: "pending" | "active" | "expired" | "cancelled",
  paymentMethod: "yape" | "plin",
  paymentProof: String,      // URL de Cloudinary
  autoRenew: Boolean
}
```

#### Endpoints

**POST /api/memberships**

- Crea una nueva membresía en estado "pending"
- Requiere: plan, paymentMethod

**POST /api/memberships/upload-proof**

- Sube el comprobante de pago
- Activa la membresía automáticamente
- Requiere: membershipId, archivo de imagen

**GET /api/memberships/active**

- Obtiene la membresía activa del usuario
- Incluye información de intercambios disponibles

### Frontend

#### Componentes Nuevos

**PaymentQR.jsx**

- Genera código QR dinámico
- Muestra número de teléfono
- Muestra monto a pagar

#### Actualizaciones

**PlansPage.jsx**

- Modal de pago mejorado
- Selección de método (Yape/Plin)
- Display del QR
- Upload de comprobante
- Preview de imagen

**MembershipDashboard.jsx**

- Barra de progreso de intercambios
- Contador de intercambios usados/disponibles
- Estado de membresía (pending/active)

---

## 📊 Control de Intercambios

### Métodos en el Modelo

```javascript
// Verificar si tiene intercambios disponibles
membership.hasExchangesAvailable();

// Usar un intercambio
membership.useExchange();

// Obtener intercambios restantes
exchangesAllowed - exchangesUsed;
```

### Aplicación en Intercambios

Al crear un nuevo intercambio:

1. Verificar que el usuario tenga membresía activa
2. Verificar que tenga intercambios disponibles
3. Decrementar el contador de intercambios
4. Si llega a 0, notificar al usuario

---

## 🎨 UI/UX

### Colores por Método de Pago

- **Yape:** Púrpura (#8B5CF6)
- **Plin:** Azul (#3B82F6)

### Estados Visuales

- **Activa:** Verde
- **Pendiente:** Amarillo
- **Expirada:** Rojo
- **Cancelada:** Gris

---

## 🔒 Seguridad

1. **Autenticación:** Todas las rutas requieren token JWT
2. **Validación:** El archivo debe ser una imagen
3. **Usuario:** Solo puede subir comprobantes de sus propias membresías
4. **Cloudinary:** Imágenes almacenadas de forma segura
5. **Folder específico:** `trueque-digital/payment-proofs`

---

## 📝 Notas para Desarrollo

### Variables de Entorno Necesarias

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Testing

- Usar el endpoint `/api/memberships/auto-approve` para testing
- Activa automáticamente membresías pendientes
- Solo para desarrollo, no usar en producción

---

## 🚀 Próximas Mejoras

1. **Validación manual:** Panel de admin para aprobar pagos
2. **Notificaciones:** Email cuando se active la membresía
3. **Recordatorios:** Avisar cuando quedan pocos intercambios
4. **Renovación automática:** Opción de auto-renovar
5. **Descuentos:** Códigos promocionales
6. **Analytics:** Dashboard de métricas de pagos

---

## 📞 Contacto

Para soporte con el sistema de pagos:

- WhatsApp: +51 923 094 108
- Email: soporte@truequedigital.pe
