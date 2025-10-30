# 📝 Instrucciones de Migración de Membresías

## ⚠️ IMPORTANTE - Ejecutar una sola vez

Este script actualiza las membresías existentes que no tienen los campos `exchangesAllowed` y `exchangesUsed`.

## 🚀 Cómo ejecutar el script

### Opción 1: Desde la raíz del proyecto (Local)

```bash
node scripts/migrar-membresias.js
```

### Opción 2: En producción (Railway)

1. Ve a Railway Dashboard
2. Selecciona tu servicio backend
3. Ve a la pestaña "Terminal" o "Shell"
4. Ejecuta:

```bash
node scripts/migrar-membresias.js
```

## 📊 Qué hace el script

El script:

1. ✅ Busca todas las membresías sin `exchangesAllowed`
2. ✅ Asigna intercambios según el plan:
   - **Básico:** 3 intercambios
   - **Standard:** 12 intercambios
   - **Premium:** 30 intercambios
3. ✅ Resetea `exchangesUsed` a 0 (da el beneficio completo)
4. ✅ Muestra un resumen de la migración

## 📝 Ejemplo de salida

```
🔄 Conectando a MongoDB...
✅ Conectado a MongoDB
📊 Encontradas 5 membresías para actualizar
✅ Actualizada membresía 507f1f77bcf86cd799439011 - Plan: basic - Intercambios: 3
✅ Actualizada membresía 507f1f77bcf86cd799439012 - Plan: standard - Intercambios: 12
✅ Actualizada membresía 507f1f77bcf86cd799439013 - Plan: premium - Intercambios: 30

📈 Resumen de la migración:
   ✅ Actualizadas: 3
   ❌ Errores: 0
   📊 Total procesadas: 3
```

## ⚠️ Notas

- **Solo ejecutar una vez:** El script es idempotente pero no es necesario ejecutarlo múltiples veces
- **Backup recomendado:** Hacer backup de la base de datos antes de ejecutar (opcional)
- **Sin riesgo:** El script solo actualiza membresías que no tienen los campos, no afecta las existentes

## 🔧 Verificación

Después de ejecutar, puedes verificar en MongoDB que las membresías tengan:

```javascript
{
  exchangesAllowed: 3 | 12 | 30,
  exchangesUsed: 0
}
```

## ❓ Solución de problemas

### Error de conexión a MongoDB

```
Error: connect ECONNREFUSED
```

**Solución:** Verifica que la variable `MONGODB_URI` esté configurada correctamente en `.env`

### No encuentra membresías

```
✨ No hay membresías para actualizar
```

**Esto es normal si:**

- Ya ejecutaste el script antes
- No hay membresías antiguas sin los campos
- Las membresías ya fueron creadas con el nuevo sistema

---

**Fecha de creación:** 29 de Octubre, 2025
**Estado:** Lista para ejecutar
