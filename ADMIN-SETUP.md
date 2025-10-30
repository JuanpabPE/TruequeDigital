# 🔐 Configuración de Administrador

## ✅ Script de Migración Ejecutado

```bash
✅ Actualizadas: 4 membresías
❌ Errores: 0
📊 Total procesadas: 4
```

Todas las membresías existentes ahora tienen sus límites de intercambios configurados correctamente.

---

## 👤 Hacer Admin a un Usuario

### Método 1: Usando el Script (RECOMENDADO)

```bash
node scripts/make-admin.js correo@ejemplo.com
```

**Ejemplo:**

```bash
node scripts/make-admin.js pablo@upn.edu.pe
```

### Método 2: Manualmente en MongoDB

1. Conectarte a tu base de datos MongoDB
2. Ejecutar este comando:

```javascript
db.users.updateOne(
  { email: "tu-email@ejemplo.com" },
  { $set: { isAdmin: true } }
);
```

---

## 🛡️ Seguridad Implementada

### Middleware `isAdmin`

Se creó el middleware en: `src/middlewares/isAdmin.js`

```javascript
export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      message: "Acceso denegado. Se requieren privilegios de administrador.",
    });
  }
  next();
};
```

### Rutas Protegidas

Las siguientes rutas ahora **solo** son accesibles por administradores:

- `GET /api/admin/memberships/pending` - Ver pagos pendientes
- `POST /api/admin/memberships/:id/approve` - Aprobar pago
- `POST /api/admin/memberships/:id/reject` - Rechazar pago

### Flujo de Autorización

```
Usuario → Login → Token JWT → authRequired ✓ → isAdmin ✓ → Ruta Admin
                                           ✗              ✗
                                    401 Unauthorized  403 Forbidden
```

---

## 📝 Pasos para Configurar tu Primer Admin

1. **Registra un usuario normal** (o usa uno existente)

2. **Conviértelo en admin:**

   ```bash
   node scripts/make-admin.js tu-email@ejemplo.com
   ```

3. **Verifica que funcionó:**

   ```bash
   # Deberías ver:
   ✅ Usuario [nombre] (email) ahora es ADMINISTRADOR
   ```

4. **Inicia sesión con ese usuario**

5. **Accede al panel de admin:**
   ```
   https://tu-dominio.com/admin/memberships
   ```

---

## 🧪 Probar en Producción

### En Railway:

1. Abrir Railway Dashboard
2. Ir a tu proyecto → Pestaña "Deploy"
3. Scroll hasta "Railway CLI" o usar el web terminal
4. Ejecutar:
   ```bash
   node scripts/make-admin.js tu-email@ejemplo.com
   ```

### En Local:

```bash
# Asegúrate de tener la MONGODB_URI correcta en .env
node scripts/make-admin.js tu-email@ejemplo.com
```

---

## ⚠️ Importante

- **Solo usuarios con `isAdmin: true`** pueden acceder a `/admin/memberships`
- El primer usuario debe ser convertido en admin **manualmente** usando el script
- Los usuarios admin pueden crear más admins desde la base de datos (si implementas esa funcionalidad)
- **No compartas credenciales de admin**

---

## 🔍 Verificar Permisos

### Comprobar si un usuario es admin:

```bash
# Método 1: Usando mongosh
mongosh "tu-connection-string"
db.users.findOne({ email: "email@ejemplo.com" }, { isAdmin: 1, username: 1, email: 1 })

# Método 2: Usando el script (creará un error si no existe)
node scripts/make-admin.js email@ejemplo.com
# Si ya es admin, mostrará: "El usuario ya es administrador"
```

---

## 📋 Checklist Post-Implementación

- [x] ✅ Migración ejecutada (4 membresías actualizadas)
- [x] ✅ Campo `isAdmin` agregado al modelo User
- [x] ✅ Middleware `isAdmin` creado
- [x] ✅ Rutas de admin protegidas
- [ ] **Hacer admin a tu usuario principal**
- [ ] **Probar acceso al panel de admin**
- [ ] **Hacer commit y push**
- [ ] **Ejecutar make-admin en producción (Railway)**

---

## 🚀 Próximo Paso

**Convierte tu usuario en administrador:**

```bash
node scripts/make-admin.js TU-EMAIL-AQUI
```

Luego prueba accediendo a `http://localhost:5173/admin/memberships` (o tu dominio en producción).
