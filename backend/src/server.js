import express from "express";
import dotnev from "dotenv";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import errorHandler from "./middleware/errorMiddleware.js";

dotnev.config();
const app = express();

const PORT = process.env.PORT || 5001;

//midddlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/event", eventRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use(express.static(path.join(__dirname, "../frontend/dist")));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
