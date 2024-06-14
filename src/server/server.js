const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const InputError = require('../exceptions/InputError');
const ClientError = require('../exceptions/ClientError');
const UnauthorizedError = require('../exceptions/UnauthorizedError');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof ClientError || response instanceof InputError) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    } else if (response instanceof UnauthorizedError) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    } else if (response.isBoom) {
      return h.response({
        status: 'error',
        message: 'Internal Server Error',
      }).code(500);
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
