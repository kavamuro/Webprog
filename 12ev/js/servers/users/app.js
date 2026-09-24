import express from "express";
import usersRoutes from "./routes/user.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});
