const cors = require('cors');

const corsMiddleware = cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
});

module.exports = corsMiddleware;