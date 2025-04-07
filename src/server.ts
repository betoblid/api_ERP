
import express from "express";
import cors from "cors";
import route from "./routes/route";
const app = express();

app.use(express.json());
app.use(route);
app.use(cors());

app.listen(3011, () => {
  console.log('Server is running on http://localhost:3000');
}  );