const appConfig = require('./app.json');

const devDomain = process.env.REPLIT_DEV_DOMAIN;

if (devDomain) {
  const previewOrigin = `https://${devDomain}:5000`;
  appConfig.expo.extra = {
    ...appConfig.expo.extra,
    router: {
      ...appConfig.expo.extra?.router,
      origin: previewOrigin,
      headOrigin: previewOrigin,
    },
  };
}

module.exports = appConfig;