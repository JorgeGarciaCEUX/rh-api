import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import "./config/firebase"; // Solo importa y ejecuta la inicialización
import { crearRoutes } from "./config/routes";

const { MODE, PORT } = process.env;

const app = express();

const morganLogFormat = MODE === "production" ? "combined" : "dev";
app.use(morgan(morganLogFormat));

if (MODE === "production") {
  app.enable("trust proxy");
}

app.set("port", PORT);
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static(path.join(process.cwd(), "public")));

crearRoutes(app);

export default app;
