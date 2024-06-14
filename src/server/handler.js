const getData = require('../services/getData');
const createData = require('../services/createData');
const updateData = require('../services/updateData');
const deleteData = require('../services/deleteData');
const { nanoid } = require('nanoid');
const ClientError = require('../exceptions/ClientError');
const UnauthorizedError = require('../exceptions/UnauthorizedError');
// const Joi = require('joi');
const { registerUser, loginUser, logoutUser, verifyToken } = require('../auth/auth');

async function getAllSampahHandler(request, h) {
  try {
    const result = await getData();
    return h.response(result).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(400);
  }
}

async function createSampahHandler(request, h) {
  const { nama_sampah, jenis_sampah, kategori_sampah, keterangan_sampah } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const data = { id, nama_sampah, jenis_sampah, kategori_sampah, keterangan_sampah, createdAt };
  await createData(id, data);
  return h.response({ status: 'success', data }).code(201);
}

async function updateDataHandler(request, h) {
  try {
    const result = await updateData(request.params.id, request.payload);
    return h.response(result).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(400);
  }
}

async function deleteSampahHandler(request, h) {
  const { id } = request.params;
  await deleteData(id);
  return h.response({ status: 'success', message: 'Data deleted successfully' }).code(200);
}

async function registerHandler(request, h) {
  try {
    const result = await registerUser(request.payload);
    return h.response(result).code(201);
  } catch (error) {
    return h.response({ error: error.message }).code(400);
  }
}

async function loginHandler(request, h) {
  try {
    const result = await loginUser(request.payload);
    return h.response(result).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(400);
  }
}

async function logoutHandler(request, h) {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const result = await logoutUser(token);
    return h.response(result).code(200);
  } catch (error) {
    return h.response({ error: error.message }).code(400);
  }
}

const validateToken = async (request, h) => {
  const authorization = request.headers.authorization;
  if (!authorization) {
    throw new UnauthorizedError();
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError();
  }

  const token = parts[1];
  try {
    await verifyToken(token);
    return h.continue;
  } catch (error) {
    throw new UnauthorizedError();
  }
};

const validatePayload = (schema) => {
  return async (request, h) => {
      const { error } = schema.validate(request.payload);
      if (error) {
          throw new InputError(error.details[0].message);
      }
      return h.continue;
  };
};

module.exports = { getAllSampahHandler, createSampahHandler, updateDataHandler, deleteSampahHandler, registerHandler, loginHandler, logoutHandler, validateToken, validatePayload };




// getSampahByIdHandler,


// async function postPredictHandler(request, h) {
//     const { image } = request.payload;
//     const { model } = request.server.app;

//     const { label, suggestion } = await predictClassification(model, image);

//     const id = crypto.randomUUID();
//     const createdAt = new Date().toISOString();

//     const data = {
//         id: id,
//         result: label,
//         suggestion: suggestion,
//         createdAt: createdAt,
//     };

//     await storeData(id, data);

//     const response = h.response({
//         status: "success",
//         message: "Model is predicted successfully",
//         data,
//     });
//     response.code(201);
//     return response;
// }

// async function getAllSampahHandler(request, h) {
//     const data = await getData("\(default\)");

//     const response = h.response({
//         status: "success",
//         data,
//     });
//     response.code(200)
//     return response;
// }

// async function getSampahByIdHandler(request, h) {
//     const { id } = request.params;
//     const data = await getData(id);
//     const response = h.response({
//         status: "success",
//         data,
//     });
//     response.code(200)
//     return response;
// }
