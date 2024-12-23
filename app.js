const express = require("express");
const connectDb = require("./config/db");
const AuthRouter = require("./routes/AuthRoutes");

const app = express();

connectDb();

app.use(express.json());

app.use("/api/auth", AuthRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
