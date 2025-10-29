# 🚀 Guía Rápida de Deployment SIN DOMINIO

## ✅ Archivos ya configurados:

- ✅ `.env` creado en la raíz (backend)
- ✅ `client/.env` creado (frontend)
- ✅ Seguridad de cookies configurada
- ✅ CORS dinámico configurado
- ✅ Variables de entorno listas

---

## 📋 PASO 1: Configurar MongoDB Atlas (5 minutos)

### 1.1 Crear cuenta y cluster

1. Ve a: https://cloud.mongodb.com/
2. Click "Try Free" → Regístrate con Google/Email
3. Crea un cluster:
   - Cloud: **AWS**
   - Region: **N. Virginia (us-east-1)** (la más cercana y gratis)
   - Cluster Tier: **M0 Sandbox (FREE)**
   - Cluster Name: `TaskManager`
   - Click "Create"

### 1.2 Configurar acceso

1. **Database Access** (menú izquierdo):

   - Click "Add New Database User"
   - Username: `taskuser`
   - Password: Click "Autogenerate Secure Password" → **CÓPIALO**
   - Database User Privileges: **Read and write to any database**
   - Click "Add User"

2. **Network Access** (menú izquierdo):
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (`0.0.0.0/0`)
   - Click "Confirm"

### 1.3 Obtener Connection String

1. Click "Database" (menú izquierdo)
2. Click "Connect" en tu cluster
3. Click "Drivers"
4. Copia el connection string:
   ```
   mongodb+srv://taskuser:<password>@taskmanager.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANTE:** Reemplaza `<password>` con la contraseña que copiaste antes

### 1.4 Actualizar .env local

Abre `.env` en la raíz del proyecto y actualiza:

```env
MONGODB_URI=mongodb+srv://taskuser:TU_PASSWORD_AQUI@taskmanager.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
```

---

## 📦 PASO 2: Preparar código para GitHub

### 2.1 Verificar .gitignore

Ya está configurado para NO subir `.env` ✅

### 2.2 Crear repositorio en GitHub

1. Ve a: https://github.com/new
2. Repository name: `task-manager-mean`
3. Visibility: **Public** (o Private si prefieres)
4. **NO marques** "Add README" ni ".gitignore"
5. Click "Create repository"

### 2.3 Subir código

Abre PowerShell en la carpeta del proyecto:

```powershell
cd C:\Users\pablo\OneDrive\Escritorio\UPN\mean-crud-auth

# Inicializar git
git init

# Agregar archivos
git add .

# Commit
git commit -m "Initial commit with security fixes"

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/task-manager-mean.git

# Subir
git branch -M main
git push -u origin main
```

---

## 🌐 PASO 3: Desplegar Backend en Railway (GRATIS)

### 3.1 Crear cuenta

1. Ve a: https://railway.app/
2. Click "Login" → **Login with GitHub**
3. Autoriza Railway

### 3.2 Crear proyecto

1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Si es tu primera vez, click "Configure GitHub App" → Selecciona tu repositorio
4. Selecciona el repositorio `task-manager-mean`

### 3.3 Configurar proyecto

1. Railway detecta Node.js automáticamente ✅
2. Click en el proyecto recién creado
3. Click "Variables" (pestaña)
4. Click "Raw Editor" (arriba a la derecha)
5. Pega esto (REEMPLAZA con tus valores):

```env
MONGODB_URI=mongodb+srv://taskuser:TU_PASSWORD@taskmanager.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
TOKEN_SECRET=8mK9nP2qR5tU7vW0xY3zA6bC9dE2fG5hJ8kL1mN4oP7qR0sT3uV6wX9yZ2aB5cD8
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://TU-APP.vercel.app
```

6. Click "Update Variables"

### 3.4 Configurar Root Directory (IMPORTANTE)

1. Click "Settings" (pestaña)
2. En "Root Directory" deja vacío (el backend está en la raíz)
3. En "Start Command" pon: `node src/index.js`
4. Click fuera para guardar

### 3.5 Obtener URL del backend

1. Click "Settings" (pestaña)
2. Scroll hasta "Domains"
3. Click "Generate Domain"
4. **COPIA la URL**, se verá así: `https://task-manager-mean-production.up.railway.app`

---

## 💻 PASO 4: Desplegar Frontend en Vercel (GRATIS)

### 4.1 Actualizar .env del cliente

Edita `client/.env`:

```env
VITE_API_URL=https://task-manager-mean-production.up.railway.app/api
```

### 4.2 Commit y push

```powershell
git add client/.env
git commit -m "Update backend URL for production"
git push
```

### 4.3 Crear cuenta en Vercel

1. Ve a: https://vercel.com/
2. Click "Sign Up" → **Continue with GitHub**
3. Autoriza Vercel

### 4.4 Importar proyecto

1. Click "Add New..." → "Project"
2. Click "Import" en tu repositorio `task-manager-mean`
3. Configurar:
   - **Framework Preset:** Vite
   - **Root Directory:** Click "Edit" → Selecciona `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click "Environment Variables":
   - Key: `VITE_API_URL`
   - Value: `https://task-manager-mean-production.up.railway.app/api`
5. Click "Deploy"

### 4.5 Obtener URL del frontend

Espera 1-2 minutos. Vercel te dará una URL:

```
https://task-manager-mean.vercel.app
```

---

## 🔄 PASO 5: Actualizar CORS en Railway

### 5.1 Actualizar FRONTEND_URL

1. Ve a Railway → Tu proyecto
2. Click "Variables"
3. Edita `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://task-manager-mean.vercel.app
   ```
4. Railway redesplegará automáticamente (espera 1 minuto)

---

## ✅ PASO 6: Probar la aplicación

### 6.1 Abrir frontend

1. Ve a tu URL de Vercel: `https://task-manager-mean.vercel.app`
2. Click "Register"
3. Crea una cuenta:
   - Username: `test`
   - Email: `test@test.com`
   - Password: `123456`

### 6.2 Verificar funcionalidad

1. Deberías ser redirigido a `/tasks`
2. Click "Add Task"
3. Crea una tarea de prueba
4. Verifica que aparezca en la lista
5. Prueba editar y eliminar

---

## 🎉 ¡LISTO! Tus URLs finales:

- **Frontend:** https://tu-app.vercel.app
- **Backend API:** https://tu-app.railway.app/api
- **Database:** MongoDB Atlas

---

## 🐛 Solución de Problemas

### Error: "CORS policy"

**Solución:**

1. Ve a Railway → Variables
2. Verifica que `FRONTEND_URL` sea EXACTAMENTE la URL de Vercel (sin `/` al final)
3. Espera 1 minuto para que redesplegue

### Error: "Cannot connect to database"

**Solución:**

1. Ve a MongoDB Atlas → Network Access
2. Verifica que `0.0.0.0/0` esté permitido
3. Ve a Railway → Deployments → Logs
4. Busca errores de conexión

### Error: "Unauthorized" al crear tareas

**Solución:**

1. Abre DevTools (F12) → Application → Cookies
2. Verifica que existe cookie `token`
3. Si no existe, cierra sesión y vuelve a iniciar

### Frontend muestra página en blanco

**Solución:**

1. Abre DevTools (F12) → Console
2. Busca errores
3. Verifica que `VITE_API_URL` en Vercel apunte al backend correcto

---

## 📊 Monitoreo

### Ver logs del backend (Railway)

1. Railway → Tu proyecto
2. Click "Deployments" (pestaña)
3. Click en el deployment activo
4. Verás logs en tiempo real

### Ver logs del frontend (Vercel)

1. Vercel → Tu proyecto
2. Click "Deployments"
3. Click en el deployment activo
4. Click "Functions" → Ver logs

---

## 🔒 Seguridad - Checklist Final

- [x] `.env` no se subió a GitHub
- [x] TOKEN_SECRET único y seguro
- [x] Cookies con httpOnly, secure, sameSite
- [x] CORS configurado con URL específica
- [x] MongoDB con usuario/contraseña
- [x] HTTPS en frontend y backend (automático)
- [x] Variables de entorno en Railway/Vercel

---

## 💰 Costos

- **Railway:** FREE (500 horas/mes - suficiente)
- **Vercel:** FREE (100GB bandwidth/mes)
- **MongoDB Atlas:** FREE (512MB storage)
- **Total:** $0/mes 🎉

---

## 📞 Soporte

- Railway: https://help.railway.app/
- Vercel: https://vercel.com/support
- MongoDB: https://www.mongodb.com/docs/atlas/

---

## 🔄 Actualizar la aplicación

Cuando hagas cambios:

```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

Railway y Vercel redesplegarán automáticamente.
