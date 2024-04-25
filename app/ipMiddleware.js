
const useragent = require('express-useragent');

const getClientIp = (req) => {
    const forwardedHeader = req.headers['x-forwarded-for'];

    if (forwardedHeader) {
        const ipList = forwardedHeader.split(',');
        return ipList[0].trim();
    } else {
        const remoteAddress = req.connection.remoteAddress;
        return remoteAddress;
    }
};

const ipMiddleware = (req, res, next) => {
    req.clientIp = getClientIp(req);
    next();
};

module.exports = [useragent.express(),ipMiddleware];
