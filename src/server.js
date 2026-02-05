const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const helmet = require('helmet');

const app = express();
const PORT = 9090;

app.use(
     helmet({
          contentSecurityPolicy: {
               directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
                    scriptSrc: ["'self'"]
               }
          }
     })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

const renderPageAsync = async (res, page, data) => {
     try {
          const pageContent = await fs.readFile(path.join(__dirname, `../views/pages/${page}.ejs`), 'utf8');
          res.render('layout', { ...data, body: pageContent });
     } catch (err) {
          res.status(500).render('layout', { title: 'Error', currentPage: '', body: '<p>Page not found</p>' });
     }
};

app.get('/', async (_, res) => {
     renderPageAsync(res, 'home', { title: 'Home', currentPage: 'home' });
});

app.get('/home', (_, res) => {
     res.redirect('/');
});

app.get('/projects', async (_, res) => {
     renderPageAsync(res, 'projects', { title: 'Projects', currentPage: 'projects' });
});

app.get('/projects/unbound', async (_, res) => {
     renderPageAsync(res, 'unbound', { title: 'unbound Browser', currentPage: 'projects' });
});

app.get('/projects/uncensored', async (_, res) => {
     renderPageAsync(res, 'uncensored', { title: 'uncensored Proxy', currentPage: 'projects' });
});

app.get('/about', async (_, res) => {
     renderPageAsync(res, 'about', { title: 'About', currentPage: 'about' });
});

app.get('/contact', async (_, res) => {
     renderPageAsync(res, 'contact', { title: 'Contact', currentPage: 'contact' });
});

app.use(async (_, res) => {
     renderPageAsync(res, '404', { title: '404', currentPage: '' });
});

app.listen(PORT, () => {
     console.log(`unbound labs landing page is running on http://localhost:${PORT}`);
});
