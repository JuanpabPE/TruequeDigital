# 🐛 Issues Pendientes y Soluciones

## ✅ Completado:
- [x] Color de texto en inputs cambiado a negro (`text-gray-900`)
- [x] Placeholders en gris claro (`placeholder-gray-400`)
- [x] Modal de solicitar intercambio
- [x] Campo de chat
- [x] Formulario de coordinar encuentro

---

## 🔴 Issue 1: Error CORS/502 en mensajes de chat

### Problema:
```
POST https://truequedigital-production.up.railway.app/api/matches/{id}/messages
502 (Bad Gateway)
CORS policy: No 'Access-Control-Allow-Origin' header
```

### Causa probable:
Railway tiene un problema temporal O el middleware `requireActiveMembership` está rechazando la petición.

### Solución recomendada:

1. **Verificar que ambos usuarios tengan membresía activa:**
   ```bash
   node scripts/verificar-membresia.js
   ```

2. **Ver logs de Railway:**
   - Ve a: https://railway.app → Tu proyecto
   - Click "Deployments" → Deployment activo
   - Busca errores en los logs cuando envías un mensaje

3. **Si el problema persiste**, agregar logs al controlador:
   ```javascript
   // src/controllers/matches.controller.js - línea del sendMessage
   export const sendMessage = async (req, res) => {
     try {
       console.log("📨 Sending message - Match ID:", req.params.id);
       console.log("👤 User ID:", req.user.id);
       console.log("💬 Message:", req.body.message);
       
       // ... resto del código
     } catch (error) {
       console.error("❌ Error in sendMessage:", error);
       res.status(500).json({ message: error.message });
     }
   };
   ```

---

## 🔴 Issue 2: No actualización en tiempo real

### Problema:
- Usuario 101 acepta match
- Usuario 102 todavía ve "Pendiente" hasta recargar
- Al recargar, pide iniciar sesión nuevamente

### Causa:
El sistema actual NO usa WebSockets ni polling, por lo que no hay actualizaciones automáticas.

### Soluciones posibles:

### Opción A: Polling simple (más fácil)

Agregar un intervalo que actualice los datos cada X segundos:

```javascript
// En MatchesPage.jsx o MatchDetailPage.jsx
useEffect(() => {
  // Actualizar cada 10 segundos
  const interval = setInterval(() => {
    if (!document.hidden) { // Solo si la pestaña está visible
      loadMatches(); // O la función correspondiente
    }
  }, 10000);

  return () => clearInterval(interval);
}, []);
```

### Opción B: WebSockets con Socket.IO (más complejo pero mejor)

Requiere:
1. Instalar Socket.IO en backend y frontend
2. Configurar servidor Socket.IO
3. Emitir eventos cuando cambien datos
4. Escuchar eventos en el frontend

**Recomendación:** Empezar con Opción A (polling) por simplicidad.

---

## 🔴 Issue 3: Redirige a login al recargar

### Problema:
Al recargar la página, el usuario pierde la sesión y tiene que iniciar sesión nuevamente.

### Causa:
El token en localStorage se está perdiendo O el componente ProtectedRoute no espera a verificar el token.

### Solución:

Verificar que `AuthContext.jsx` tenga el efecto de verificación:

```javascript
useEffect(() => {
  async function checkLogin() {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const res = await verifyTokenRequest();
      if (!res.data) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      } else {
        setIsAuthenticated(true);
        setUser(res.data);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }
  checkLogin();
}, []);
```

Y en `ProtectedRoute.jsx` verificar que espere:

```javascript
if (loading) return <div>Cargando...</div>;
if (!isAuthenticated) return <Navigate to="/login" replace />;
return <>{children}</>;
```

---

## 📋 Pasos para resolver TODO:

### Paso 1: Color de texto (✅ YA DESPLEGADO)
Espera 2-3 minutos → Recarga la app → Los textos deberían verse en negro.

### Paso 2: Error de mensajes
1. Verifica membresías de ambos usuarios
2. Revisa logs de Railway
3. Intenta enviar mensaje nuevamente después de 3 minutos

### Paso 3: Actualización en tiempo real
1. Implementa polling simple primero
2. Si funciona bien, considera WebSockets después

### Paso 4: Sesión persistente
1. Verifica que localStorage mantenga el token
2. Revisa que AuthContext haga verify al cargar
3. Asegúrate de que ProtectedRoute espere loading

---

## 🚀 Próximos pasos recomendados:

1. **Ahora (después de 3 min):**
   - Recarga la app
   - Verifica que los textos se vean en negro
   - Intenta enviar mensaje de nuevo

2. **Si mensaje sigue fallando:**
   - Revisa logs de Railway
   - Ejecuta script verificar-membresia

3. **Para tiempo real:**
   - Implementa polling simple primero
   - Prueba que funcione
   - Si te gusta, agregamos WebSockets después

¿Por cuál quieres empezar?
