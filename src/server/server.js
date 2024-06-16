const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const InputError = require('../exceptions/InputError');
const ClientError = require('../exceptions/ClientError');
const UnauthorizedError = require('../exceptions/UnauthorizedError');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3030,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
      payload: {
        maxBytes: 10485760, // 10 MB limit
        multipart: true,
        output: 'stream',
        parse: true,
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
      console.error('Boom Error:', response.output.payload); // Enhanced error logging
      console.error(response); // Log the error
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
  console.error('Unhandled Rejection:', err); // Enhanced error logging
  process.exit(1);
});

init();
