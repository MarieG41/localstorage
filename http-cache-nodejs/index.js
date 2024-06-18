const express = require('express');
const app = express();

app.use(express.static('public', {
    maxAge: '1d', 
    etag: true
}));

app.get('/data', (req, res) => {
    res.set('Cache-Control', 'public, max-age=3600');
    res.json({message: 'Hello'})
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})