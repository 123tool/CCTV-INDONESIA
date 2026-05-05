require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Datastore = require('nedb');
const path = require('path');
const app = express();

const db = new Datastore({ filename: 'history.db', autoload: true });

app.use(express.static('public'));
app.use(express.json());

// Proxy Image agar IP Bos tetap anonim
app.get('/api/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            timeout: 3000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        response.data.pipe(res);
    } catch (e) {
        res.status(500).send('Offline');
    }
});

// Scanner Engine
app.get('/api/scan', async (req, res) => {
    const { city, device } = req.query;
    const apiKey = process.env.SHODAN_API_KEY;
    
    let query = `country:ID has_screenshot:true`;
    if (city) query += ` city:"${city}"`;
    if (device) query += ` ${device}`;

    try {
        const response = await axios.get(`https://api.shodan.io/shodan/host/search`, {
            params: { key: apiKey, query: query }
        });
        
        // Simpan ke database lokal
        db.insert({ query, count: response.data.matches.length, date: new Date().toISOString() });
        
        res.json({
            matches: response.data.matches,
            mapsKey: process.env.GOOGLE_MAPS_API_KEY // Kirim key ke frontend
        });
    } catch (error) {
        res.status(500).json({ error: 'Shodan API Error' });
    }
});

app.listen(process.env.PORT, () => console.log(`[PRO] Dashboard Active on Port ${process.env.PORT}`));
