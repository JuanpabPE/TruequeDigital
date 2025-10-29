# 📸 Configurar Cloudinary para Subida de Imágenes

Cloudinary es un servicio GRATUITO para almacenar y gestionar imágenes en la nube.

## 🚀 Paso 1: Crear cuenta gratuita

1. Ve a: **https://cloudinary.com/users/register/free**
2. Regístrate con tu email o Google
3. Verifica tu email

## 📋 Paso 2: Obtener credenciales

1. Una vez dentro, ve al **Dashboard**
2. Verás algo así:

```
Cloud Name: tu-cloud-name
API Key: 123456789012345
API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz
```

3. **COPIA** estas 3 credenciales

## ⚙️ Paso 3: Configurar en LOCAL (.env)

Abre el archivo `.env` en la raíz del proyecto y actualiza:

```env
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

## ☁️ Paso 4: Configurar en RAILWAY (Producción)

1. Ve a **Railway** → Tu proyecto
2. Click **"Variables"**
3. Agrega estas 3 variables:

```
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

4. Railway redesplegará automáticamente (espera 1-2 minutos)

## ✅ Paso 5: Probar

1. Reinicia tu servidor local:

   ```bash
   npm run dev
   ```

2. Ve a **Crear Trueque**
3. Selecciona imágenes desde tu computadora
4. Deberías ver el preview
5. Al publicar, las imágenes se subirán a Cloudinary

## 📊 Límites del Plan Gratuito

- ✅ **25 créditos/mes** (aprox. 25,000 transformaciones)
- ✅ **25GB almacenamiento**
- ✅ **25GB bandwidth/mes**
- ✅ **HTTPS automático**
- ✅ **Optimización automática de imágenes**

**Es MÁS que suficiente para tu aplicación** 🎉

## 🔧 Troubleshooting

### Error: "Invalid credentials"

- Verifica que copiaste bien las 3 credenciales
- Asegúrate de NO tener espacios extras

### Error: "Upload failed"

- Verifica que la imagen sea menor a 5MB
- Solo se permiten: JPG, PNG, GIF, WEBP

### Las imágenes no se ven

- Abre DevTools (F12) → Console
- Busca errores
- Verifica que las credenciales estén en Railway

## 📞 Soporte

- Docs: https://cloudinary.com/documentation
- Dashboard: https://console.cloudinary.com/
