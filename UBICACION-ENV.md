# 📍 UBICACIÓN DE ARCHIVOS .env

## ✅ YA CREADOS AUTOMÁTICAMENTE:

### 1. Backend .env

**Ubicación:**

```
C:\Users\pablo\OneDrive\Escritorio\UPN\mean-crud-auth\.env
```

**Para editarlo:**

```powershell
notepad C:\Users\pablo\OneDrive\Escritorio\UPN\mean-crud-auth\.env
```

**Contenido actual:**

```env
MONGODB_URI=mongodb://localhost/merndb
TOKEN_SECRET=8mK9nP2qR5tU7vW0xY3zA6bC9dE2fG5hJ8kL1mN4oP7qR0sT3uV6wX9yZ2aB5cD8
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

### 2. Frontend .env

**Ubicación:**

```
C:\Users\pablo\OneDrive\Escritorio\UPN\mean-crud-auth\client\.env
```

**Para editarlo:**

```powershell
notepad C:\Users\pablo\OneDrive\Escritorio\UPN\mean-crud-auth\client\.env
```

**Contenido actual:**

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🔐 TOKEN_SECRET - ¿Qué hacer?

### Opción 1: Usar el que ya está (RÁPIDO)

El TOKEN_SECRET que ya puse es seguro para pruebas:

```
8mK9nP2qR5tU7vW0xY3zA6bC9dE2fG5hJ8kL1mN4oP7qR0sT3uV6wX9yZ2aB5cD8
```

✅ **Ya está en `.env`** - No necesitas hacer nada más.

### Opción 2: Generar uno nuevo (RECOMENDADO para producción)

**Paso A: Ir a generador online**

1. Abre: https://randomkeygen.com/
2. Busca la sección "Fort Knox Passwords"
3. Click en el candado 🔒 para copiar una contraseña

**Paso B: Pegar en .env**

1. Abre el archivo:

   ```powershell
   notepad C:\Users\pablo\OneDrive\Escritorio\UPN\mean-crud-auth\.env
   ```

2. Busca la línea:

   ```env
   TOKEN_SECRET=8mK9nP2qR5tU7vW0xY3zA6bC9dE2fG5hJ8kL1mN4oP7qR0sT3uV6wX9yZ2aB5cD8
   ```

3. Reemplaza todo después del `=` con tu nueva contraseña:

   ```env
   TOKEN_SECRET=tu_nueva_contraseña_de_fort_knox_aqui
   ```

4. Guarda (Ctrl + S) y cierra

---

## 🗂️ Estructura de archivos:

```
mean-crud-auth/
├── .env                    ← Backend (EXISTE ✅)
├── .env.example            ← Template backend (EXISTE ✅)
├── .gitignore              ← Protege .env (EXISTE ✅)
├── package.json
├── src/
│   ├── index.js
│   ├── config.js           ← Lee .env (CONFIGURADO ✅)
│   └── ...
└── client/
    ├── .env                ← Frontend (EXISTE ✅)
    ├── .env.example        ← Template frontend (EXISTE ✅)
    ├── .gitignore          ← Protege .env (EXISTE ✅)
    ├── package.json
    └── src/
        └── api/
            └── axios.js    ← Usa VITE_API_URL (CONFIGURADO ✅)
```

---

## ✅ RESUMEN - Todo listo:

1. ✅ `.env` creado en la raíz (backend)
2. ✅ `client/.env` creado (frontend)
3. ✅ TOKEN_SECRET seguro ya incluido
4. ✅ Ambos protegidos en `.gitignore`
5. ✅ Código configurado para leerlos

**NO necesitas hacer nada más con los archivos .env para desarrollo local.**

---

## 🚀 Para producción (Railway/Vercel):

Cuando despliegues, copiarás estos valores a las variables de entorno de:

- **Railway** (backend)
- **Vercel** (frontend)

Pero NO subirás los archivos `.env` a GitHub (ya están protegidos).
