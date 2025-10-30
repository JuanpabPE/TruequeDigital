# 🚀 Guía Rápida - Sistema de Pagos QR

## ⚡ Inicio Rápido

### 1. Verificar Variables de Entorno

Asegúrate de que tu archivo `.env` en la raíz tenga:

```env
# Cloudinary (para guardar comprobantes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# MongoDB
MONGODB_URI=tu_conexion_mongodb

# JWT
TOKEN_SECRET=tu_secret
```

### 2. Iniciar Backend

```bash
# En la raíz del proyecto
npm install
npm run dev
```

El servidor debe estar corriendo en `http://localhost:4000`

### 3. Iniciar Frontend

```bash
cd client
npm install
npm run dev
```

El cliente debe estar corriendo en `http://localhost:5173`

---

## 🧪 Probar el Sistema de Pagos

### Paso 1: Crear Cuenta

1. Ve a `http://localhost:5173/register`
2. Crea una cuenta nueva
3. Inicia sesión

### Paso 2: Ver Planes

1. Click en "Planes" o ve a `/plans`
2. Verás los 3 planes:
   - **Básico:** S/5 - 3 intercambios
   - **Standard:** S/15 - 12 intercambios
   - **Premium:** S/30 - 30 intercambios

### Paso 3: Seleccionar Plan

1. Click en "Seleccionar plan" en cualquier plan
2. Se abre el modal de pago
3. Verás:
   - Opciones Yape/Plin
   - Código QR generado
   - Número +51 923 094 108
   - Monto a pagar

### Paso 4: Subir Comprobante

1. Click en la zona de upload
2. Selecciona cualquier imagen (para testing)
3. Verás preview de la imagen
4. Click en "Activar membresía"

### Paso 5: Verificar Activación

1. Deberías ver mensaje de éxito
2. Redirige a `/dashboard`
3. Verás tu membresía activa
4. Verás barra con intercambios disponibles

---

## 📱 Número de Pago

**Número oficial:** +51 923 094 108

Este número aparece en:

- Modal de pago
- Código QR
- Instrucciones de pago

---

## 🎯 Nuevas Características

### Para Usuarios:

✅ Pago por Yape/Plin con QR
✅ Upload de comprobante directo
✅ Activación inmediata
✅ Contador de intercambios
✅ Barra de progreso visual

### Para Administradores:

✅ Comprobantes guardados en Cloudinary
✅ Control de intercambios por plan
✅ Estados de membresía (pending/active)
✅ Historial de pagos

---

## 🔧 Solución de Problemas

### Error al subir comprobante

- ✅ Verificar que Cloudinary esté configurado
- ✅ Verificar que el archivo sea una imagen
- ✅ Revisar consola del navegador

### QR no se muestra

- ✅ Verificar conexión a internet
- ✅ Revisar consola del navegador
- ✅ El QR usa un servicio externo (qrserver.com)

### Membresía no se activa

- ✅ Verificar que se subió el comprobante
- ✅ Revisar logs del servidor
- ✅ Verificar que el endpoint esté funcionando

---

## 📊 Endpoints API

```
GET    /api/plans                        - Ver planes disponibles
POST   /api/memberships                  - Crear membresía
POST   /api/memberships/upload-proof     - Subir comprobante
GET    /api/memberships/active           - Ver membresía activa
GET    /api/memberships/history          - Historial
POST   /api/memberships/cancel           - Cancelar membresía
```

---

## 🎨 Componentes Nuevos

### `PaymentQR.jsx`

Genera y muestra el código QR de pago

**Props:**

- `paymentMethod`: "yape" | "plin"
- `phoneNumber`: string
- `amount`: number

**Uso:**

```jsx
<PaymentQR paymentMethod="yape" phoneNumber="+51 923 094 108" amount={5} />
```

---

## 💾 Modelo de Datos

### Membresía

```javascript
{
  user: ObjectId,
  plan: "basic" | "standard" | "premium",
  price: 5 | 15 | 30,
  exchangesAllowed: 3 | 12 | 30,
  exchangesUsed: 0,
  startDate: Date,
  endDate: Date,
  status: "pending" | "active" | "expired" | "cancelled",
  paymentMethod: "yape" | "plin",
  paymentProof: "https://cloudinary.com/...",
  autoRenew: false
}
```

---

## ✨ Tips

1. **Para testing rápido:** Usa cualquier imagen como comprobante
2. **Auto-aprobar:** Hay un endpoint de desarrollo para aprobar automáticamente
3. **Ver intercambios:** El dashboard muestra claramente cuántos quedan
4. **Expiración:** Las membresías duran 30 días desde activación

---

## 📞 Contacto y Soporte

- **Número de pago:** +51 923 094 108
- **Métodos:** Yape, Plin

---

## 🚀 Deploy

Antes de hacer deploy:

1. ✅ Configurar variables de entorno en producción
2. ✅ Verificar Cloudinary
3. ✅ Actualizar URLs del frontend
4. ✅ Probar flujo completo de pago
5. ✅ Verificar que el número +51 923 094 108 sea el correcto

---

## 📝 Documentación Completa

- `SISTEMA-PAGOS-QR.md` - Documentación técnica completa
- `RESUMEN-CAMBIOS.md` - Lista detallada de cambios
- Este archivo - Guía rápida

---

¡Todo listo! 🎉
