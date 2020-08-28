const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// place-routes.js'i import ediyoruz.
// placeRoutes bir MiddleWare'dir.
const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  // "*" can be set as localhost too.
  // with "*" it allows any domain to send requests.
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Also need to specify which headers these requests sent by
  // the browser may have.
  // This controls which headers incoming requests may have so
  // that they are handled.
  // Can be set as "*" too but we want to be more specific.
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // Basically controls which HTTP methods may be used on the front end
  // or maybe attached to incoming requests.
  // Setting the types of incoming words we handled there.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// placesRoutes register ediliyor.
// Böylece MiddleWare olarak eklenmiş oluyor.
app.use('/api/places', placesRoutes); // => /api/places/...
app.use('/api/users', userRoutes);

// Handling errors for unsupported routes.
app.use((res, req, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error; // it is synchronic.. so no problem. However in asynchronic states NEXT should be used!
});

// Önündeki her hangi bir MiddleWare hata dönerse (Request'in hata alması durumunda) çalışır.
app.use((error, req, res, next) => {
  // Response gönderilmişse yani true ise;
  if (res.headerSent) {
    return next(error);
  }
  // error.code undefined değilse; status olarak "error.code" veya 500 hatası döner
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// connect() returns a 'promise' as the connecting to the server is an async task.
mongoose
// Database name: mern
  .connect('mongodb+srv://<username>:<password>@cluster0-dvoi9.mongodb.net/<dbname>?retryWrites=true&w=majority')
  .then(() => {
    // if connection is succesful, start backend server.
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });



