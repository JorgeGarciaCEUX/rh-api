import { Application } from "express";

// v1
import authRoutes from "../routes/v1/auth.routes";
import usersRoutes from "../routes/v1/users.routes";
import nominasRoutes from "../routes/v1/nominas.routes";

export const crearRoutes = (app: Application): Application => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", usersRoutes);
  app.use("/api/v1/nominas", nominasRoutes);
  return app;
};
