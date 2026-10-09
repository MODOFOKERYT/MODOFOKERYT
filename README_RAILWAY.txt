MODOFOKERYT ESTORE — PANEL CON INICIO DE SESIÓN PARA RAILWAY

IMPORTANTE
- No contiene una contraseña real dentro del ZIP ni del código.
- El servidor exige que configures 3 variables en Railway antes de iniciar.
- Este acceso protege la ruta /panel-control y sus archivos con una sesión del servidor.
- La tienda es una plantilla estática; este ZIP no añade base de datos, pagos, pedidos ni almacenamiento persistente para los datos del panel.

VARIABLES EN RAILWAY (Service > Variables)
1. ADMIN_EMAIL = el correo que usarás para iniciar sesión (por ejemplo, admin@tudominio.com)
2. ADMIN_PASSWORD = una contraseña larga, única y que no uses en otros sitios
3. SESSION_SECRET = una cadena aleatoria secreta de al menos 32 caracteres. Genera una nueva y guárdala en privado.

DESPLIEGUE
1. Sube el contenido EXTRAÍDO de este ZIP al repositorio que Railway tiene conectado. Deben quedar package.json y server.js en la raíz del servicio, y la carpeta public/ junto a ellos.
2. En Railway abre el servicio MODOFOKERYT > Variables y agrega las 3 variables anteriores. No subas contraseñas ni SESSION_SECRET a GitHub.
3. Railway instalará las dependencias con npm install y arrancará con npm start. Si no se instala automáticamente, configura Build Command: npm install y Start Command: npm start.
4. Espera a que el deployment termine correctamente.
5. Abre https://TU-DOMINIO.up.railway.app/panel-control/

NOTAS DE SEGURIDAD
- El panel de ejemplo usa localStorage para parte de su interfaz. No es un sistema de gestión de pedidos con base de datos.
- La sesión predeterminada en memoria puede cerrarse al reiniciar/redeployar y no es adecuada para escalar múltiples réplicas.
- No compartas variables ni capturas que muestren secretos.
