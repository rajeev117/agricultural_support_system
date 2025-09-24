const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // This fixes the CORS issue
app.use(bodyParser.json());

app.post('/api/coordinates', async (req, res) => {
    const { latitude, longitude, N, P, K, ph } = req.body;

    try {
        const response = await axios.post('http://localhost:8000/predict-crop', {
            lat: latitude,
            lon: longitude,
            N,
            P,
            K,
            ph
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error calling Python backend:', error.message);
        res.status(500).json({ error: 'Failed to contact Python backend' });
    }
});

app.listen(port, () => {
    console.log(`Node server running at http://localhost:${port}`);
});
