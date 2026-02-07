import "dotenv/config";
import express from "express";
import cors from "cors";
import storyRoutes from "./routes/story";
import imageRoutes from "./routes/image";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/story", storyRoutes);
app.use("/api/image", imageRoutes);

app.listen(PORT, () => {
  console.log(`DreamWeaver server running on http://localhost:${PORT}`);
});

export default app;
