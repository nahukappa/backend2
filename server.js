require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const sessionRoutes = require("./routes/sessions");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

//rutas
app.use("/api/sessions", sessionRoutes);

//conectar a MongoDB y levantar el servidor
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000, () => console.log("Servidor corriendo en el puerto 3000")))
    .catch((err) => console.error(err));
