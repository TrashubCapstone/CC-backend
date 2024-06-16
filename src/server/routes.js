const Joi = require('joi');
const { createSampahHandler, getAllSampahHandler, updateDataHandler, deleteSampahHandler, registerHandler, loginHandler, logoutHandler, validateToken } = require('./handler');

const routes = [
  {
    path: "/sampah",
    method: "POST",
    handler: createSampahHandler,
    options: {
      payload: {
        parse: true,
        output: 'stream',
        allow: 'multipart/form-data',
        maxBytes: 10485760, // Limit file size to 10MB
      },
      pre: [{ method: validateToken }],
      validate: {
        payload: Joi.object({
          nama_sampah: Joi.string().required(),
          jenis_sampah: Joi.string().required(),
          kategori_sampah: Joi.string().required(),
          keterangan_sampah: Joi.string().required(),
          image: Joi.any().optional(),
        })
      }
    }
  },
  {
    path: '/sampah',
    method: 'GET',
    handler: getAllSampahHandler,
    options: {
      pre: [{ method: validateToken }]
    }
  },
  {
    path: "/sampah/{id}",
    method: "PUT",
    handler: updateDataHandler,
    options: {
        payload: {
            parse: true,
            output: 'stream',
            allow: 'multipart/form-data',
            maxBytes: 10485760, // Limit file size to 10MB
        },
        pre: [{ method: validateToken }],
        validate: {
            payload: Joi.object({
                nama_sampah: Joi.string().optional(),
                jenis_sampah: Joi.string().optional(),
                kategori_sampah: Joi.string().optional(),
                keterangan_sampah: Joi.string().optional(),
                image: Joi.any().optional(), // Allow image field
            })
        }
    }
},
  {
    path: '/sampah/{id}',
    method: 'DELETE',
    handler: deleteSampahHandler,
    options: {
      pre: [{ method: validateToken }]
    }
  },
  {
    method: 'POST',
    path: '/register',
    handler: registerHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/logout',
    handler: logoutHandler,
    options: {
      pre: [{ method: validateToken }]
    }
  }
];

module.exports = routes;
