module.exports = (opts: any) => require('pino-pretty')({
    ...opts,
    customPrettifiers: {
        time: (timestamp: any) => timestamp
    }
});
