const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD || SESSION_SECRET.length < 32) {
  console.error('Missing required Railway variables: ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET (32+ characters).');
  process.exit(1);
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(session({
  name: 'modofokeryt.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: 'auto', sameSite: 'lax', maxAge: 2 * 60 * 60 * 1000 }
}));

const publicDir = path.join(__dirname, 'public');
const panelDir = path.join(publicDir, 'panel-control');

app.get('/login', (req, res) => res.redirect('/panel-control/'));
app.get('/panel-control', (req, res) => res.redirect('/panel-control/'));
app.get('/panel-control/', (req, res) => {
  if (req.session.authenticated) return res.sendFile(path.join(panelDir, 'index.html'));
  res.status(200).type('html').send(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Acceso | MODOFOKERYT Estore</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#090909;color:#fff;font-family:Arial,sans-serif;padding:20px}.card{width:min(100%,410px);background:#171717;border:1px solid #3b2020;border-radius:18px;padding:28px;box-shadow:0 18px 60px #0008}.brand{color:#ff4545;font-weight:900;letter-spacing:1px;font-size:23px}p{color:#aaa}label{display:block;margin:18px 0 7px}input{width:100%;padding:13px;border-radius:9px;border:1px solid #444;background:#0b0b0b;color:white;font-size:16px}button{width:100%;margin-top:22px;padding:14px;border:0;border-radius:9px;background:#d92727;color:#fff;font-size:16px;font-weight:bold}button:active{opacity:.8}.error{color:#ff7474}</style></head><body><main class="card"><div class="brand">MODOFOKERYT ESTORE</div><h1>Panel de control</h1><p>Inicia sesión con tu correo y contraseña de administrador.</p>${req.query.error ? '<p class="error">Correo o contraseña incorrectos.</p>' : ''}<form method="post" action="/panel-control/login"><label for="email">Correo electrónico</label><input id="email" name="email" type="email" autocomplete="username" required><label for="password">Contraseña</label><input id="password" name="password" type="password" autocomplete="current-password" required><button type="submit">Entrar al panel</button></form></main></body></html>`);
});

app.post('/panel-control/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return res.redirect('/panel-control/?error=1');
  req.session.regenerate(err => {
    if (err) return res.status(500).send('No se pudo iniciar sesión. Intenta de nuevo.');
    req.session.authenticated = true;
    req.session.adminEmail = ADMIN_EMAIL;
    res.redirect('/panel-control/');
  });
});

app.post('/panel-control/logout', (req, res) => req.session.destroy(() => res.redirect('/panel-control/')));
app.use('/panel-control', (req, res, next) => {
  if (!req.session.authenticated) return res.redirect('/panel-control/');
  next();
}, express.static(panelDir, { index: false, dotfiles: 'deny' }));

app.use(express.static(publicDir, { index: 'index.html', dotfiles: 'deny', setHeaders(res) { res.setHeader('X-Content-Type-Options', 'nosniff'); } }));
app.use((req, res) => res.status(404).send('Página no encontrada.'));
app.listen(PORT, '0.0.0.0', () => console.log(`MODOFOKERYT Estore running on port ${PORT}`));
