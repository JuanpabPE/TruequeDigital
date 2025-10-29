# Guía de Deployment - Task Manager MEAN Stack

## 📦 Requisitos Previos

- Cuenta en MongoDB Atlas (gratis)
- Cuenta en Railway/Render (gratis) para el backend
- Cuenta en Vercel/Netlify (gratis) para el frontend
- Dominio en Hostinger (opcional)

---

## 🚀 Paso 1: Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Crea una cuenta gratis
3. Crea un nuevo cluster (FREE tier M0)
4. En "Database Access" → Crea un usuario con contraseña
5. En "Network Access" → Permite acceso desde cualquier IP (`0.0.0.0/0`)
6. Copia tu Connection String:
   ```
   mongodb+srv://usuario:<password>@cluster.mongodb.net/taskmanager
   ```

---

## 🔧 Paso 2: Configurar Variables de Entorno

### Backend (.env):

Crea un archivo `.env` en la raíz del proyecto:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/taskmanager

# Token Secret (genera uno con: openssl rand -base64 64)
TOKEN_SECRET=tu_clave_super_segura_de_64_caracteres

# Puerto
PORT=3000

# Frontend URL (cambia después de desplegar frontend)
FRONTEND_URL=https://tu-dominio.com

# Entorno
NODE_ENV=production
```

**⚠️ IMPORTANTE:** Genera un `TOKEN_SECRET` fuerte:

```bash
# En Git Bash o WSL:
openssl rand -base64 64

# O usa un generador online:
https://randomkeygen.com/
```

---

## 🌐 Paso 3: Desplegar Backend en Railway

1. **Sube tu código a GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

2. **Railway:**

   - Ve a [Railway.app](https://railway.app)
   - Click "Start a New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio
   - Railway detecta Node.js automáticamente

3. **Configurar Variables de Entorno en Railway:**

   - En tu proyecto → "Variables"
   - Agrega:
     ```
     MONGODB_URI=mongodb+srv://...
     TOKEN_SECRET=tu_clave_segura
     PORT=3000
     FRONTEND_URL=https://tu-dominio.com
     NODE_ENV=production
     ```

4. **Copia la URL del backend:**
   - Railway te da una URL como: `https://tu-app.railway.app`

---

## 💻 Paso 4: Desplegar Frontend en Vercel

1. **Actualiza la URL del backend en el frontend:**

   Edita `client/src/api/axios.js`:

   ```javascript
   import axios from "axios";

   export default axios.create({
     baseURL:
       import.meta.env.VITE_API_URL || "https://tu-backend.railway.app/api",
     withCredentials: true,
   });
   ```

2. **Crea archivo `.env` en `client/`:**

   ```env
   VITE_API_URL=https://tu-backend.railway.app/api
   ```

3. **Sube a GitHub** (si aún no lo hiciste):

   ```bash
   git add .
   git commit -m "Update backend URL"
   git push
   ```

4. **Deploy en Vercel:**

   - Ve a [Vercel.com](https://vercel.com)
   - "Import Project" → GitHub → Selecciona tu repo
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Environment Variables:**
     ```
     VITE_API_URL=https://tu-backend.railway.app/api
     ```
   - Click "Deploy"

5. **Copia la URL del frontend:**
   - Vercel te da: `https://tu-app.vercel.app`

---

## 🔄 Paso 5: Actualizar CORS en Backend

1. Ve a Railway → Variables
2. Actualiza `FRONTEND_URL` con tu URL de Vercel:
   ```
   FRONTEND_URL=https://tu-app.vercel.app
   ```
3. Railway redesplegará automáticamente

---

## 🌍 Paso 6: Conectar Dominio de Hostinger

### Opción A: Apuntar a Vercel (Frontend)

1. **En Vercel:**

   - Settings → Domains → Add tu dominio: `tudominio.com`
   - Vercel te dará registros DNS

2. **En Hostinger DNS:**
   - Tipo: `A` → Nombre: `@` → Valor: IP de Vercel
   - Tipo: `CNAME` → Nombre: `www` → Valor: `cname.vercel-dns.com`

### Opción B: Subdominios

- Frontend: `tudominio.com` → Vercel
- API: `api.tudominio.com` → Railway

---

## ✅ Verificación Final

1. **Prueba el backend:**

   ```bash
   curl https://tu-backend.railway.app/api/tasks
   # Debe devolver 401 Unauthorized (normal, necesitas login)
   ```

2. **Prueba el frontend:**

   - Abre `https://tu-dominio.com`
   - Regístrate e inicia sesión
   - Crea una tarea

3. **Revisa logs:**
   - Railway → Deployments → View Logs
   - Vercel → Deployments → Function Logs

---

## 🔒 Checklist de Seguridad

- [x] `.env` en `.gitignore`
- [x] `TOKEN_SECRET` seguro y único
- [x] Cookies con `httpOnly`, `secure`, `sameSite`
- [x] CORS configurado con URL específica
- [x] MongoDB Atlas con usuario/contraseña
- [x] Network Access restringido (opcional: solo IPs de Railway)
- [ ] HTTPS activado (automático en Vercel/Railway)
- [ ] Rate limiting (opcional, instala `express-rate-limit`)

---

## 📚 Recursos

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 🐛 Troubleshooting

### Error: CORS

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución:** Verifica que `FRONTEND_URL` en Railway coincida con tu URL de Vercel.

### Error: 401 Unauthorized

**Solución:** Las cookies no se envían. Verifica:

- `withCredentials: true` en axios
- `credentials: true` en CORS backend
- Ambos deben estar en HTTPS

### Error: Cannot connect to MongoDB

**Solución:**

- Verifica `MONGODB_URI` en Railway
- Checa Network Access en Atlas (`0.0.0.0/0`)
- Revisa usuario/contraseña

---

## 🔄 Comandos Útiles

```bash
# Ver logs del backend (Railway CLI)
railway logs

# Build local del frontend
cd client
npm run build

# Preview del build
npm run preview

# Redeploy forzado
railway up --detach
```
