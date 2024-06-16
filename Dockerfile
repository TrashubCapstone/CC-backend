FROM node:20
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
ENV PORT=3000
ENV JWT_SECRET=T6e58d028e1c41b933L01922caS3dd8285aa61a0155def9bf3b2a15dcceHc846e9a798514946c362c83f52e7f8721Ul0325b04dd4adf4ee8cd5c61bf1e0a0b252e25
ENV GCLOUD_STORAGE_BUCKET=my_trashub_bucket
EXPOSE 3000
CMD ["npm", "start"]