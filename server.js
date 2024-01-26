
const app=require('./app');
const PORT_DEFAULT = 8000;

/**
 * Normalize a port into a number, string, or false.
 * @param {any} val - Port value
 * @returns {number|string|boolean} - Normalized port
 */
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
};

const PORT = normalizePort(process.env.PORT || PORT_DEFAULT);
/**
 * Server listening on specified port.
 * @name ServerListening
 * @function
 * @memberof module:RandomIdeasAPI
 * @inner
 * @param {number|string} port - Port number
 */

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));