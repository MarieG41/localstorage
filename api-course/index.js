const express = require('express');
const apicache = require('apicache');
apicache.options({ bebug: true });

const app = express();
const cache = apicache.middleware;

app.use(express.static('public', {
    maxAge: '1d', 
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'public, max-age=86400');
    }
}));

app.get('/data', cache('10 minutes'), (req, res) => {
    setTimeout(() => {
        res.json({ message: 'This is cached for 10 minutes', timestamp: Date.now() });
    }, 2000);
});

app.get('/no-cache', (req, res) => {
    res.json({ message: 'This response is not cached', timestamp: Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})