# danielaadaluz.com

Portafolio de **Daniela Adaluz Gómez Navarrete**, artista visual (Ciudad de México).

Sitio estático de una sola página: HTML + Tailwind CSS (compilado) + JavaScript
vanilla. Sin frameworks ni proceso de build en el servidor — lo que está en el
repo es exactamente lo que se sirve.

## Estructura

```
index.html              La página completa (todas las secciones)
assets/css/main.css     Tailwind compilado (no editar a mano)
assets/js/main.js       Interacciones: scroll-reveal, lightbox, menús, submenú de proyectos
assets/img/             Imágenes optimizadas (-sm ~800px para galerías, -lg ~1600px para el visor)
assets/fonts/           Roboto Mono y Work Sans autoalojadas (woff2)
src/main.css            Fuente de Tailwind (colores, tipografías, estilos propios)
deploy/                 Configuración de nginx lista para usar
```

## Deploy en un VPS con nginx

```bash
# 1. Clonar el sitio en el servidor
sudo git clone https://github.com/jesarx/DanielaAdaluz.git /var/www/danielaadaluz.com

# 2. Instalar la configuración de nginx
sudo cp /var/www/danielaadaluz.com/deploy/danielaadaluz.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/danielaadaluz.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 3. HTTPS con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d danielaadaluz.com -d www.danielaadaluz.com
```

Para actualizar el sitio después de un cambio: `cd /var/www/danielaadaluz.com && sudo git pull`.

## Desarrollo

Solo hace falta Node si se toca el CSS:

```bash
npm install
npx @tailwindcss/cli -i src/main.css -o assets/css/main.css --minify --watch
```

Para ver el sitio en local: `python3 -m http.server 8000` y abrir http://localhost:8000.

- Los **textos** se editan directamente en `index.html`.
- Los **colores y fuentes** viven en el bloque `@theme` de `src/main.css`
  (paleta: crema `#faf8f1`, tinta `#27305c`, oliva `#a2a03f`, salvia `#6f8b6e`, dorado `#e3c25c`).
- Las **imágenes** siguen la convención `nombre-sm.jpg` (galería) y `nombre-lg.jpg`
  (visor); cada `<a class="gitem">` de `index.html` apunta a ambas. Para añadir una
  imagen nueva basta con crear las dos versiones y copiar el patrón de un elemento existente.
