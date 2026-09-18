import express from "express";
import "dotenv/config";
import koneksi from "./src/database/conn.js";
import expressLayouts from "express-ejs-layouts";
import router from "./src/routes/routes.js";
import cookieParser from "cookie-parser";
import { notFoundController } from "./src/controller/userController.js";
import activeLinkMiddleware from "./src/middleware/activeLinkMiddleware.js";

const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(expressLayouts);
app.set('layout', 'main/main');

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/vendor/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use(express.urlencoded({ extended: true }));
app.use(activeLinkMiddleware);
app.use('/', router);
app.use(notFoundController);
koneksi();

app.listen(process.env.PORT, () => {
    console.log(`server berjalan di http://${process.env.HOST}:${process.env.PORT}`)
})

