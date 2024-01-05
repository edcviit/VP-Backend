const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const app = express();
const limiter = rateLimit({
  windowMs:  60 * 1000, // 1 minute
  limit: 10, // Limit each IP to 100 requests per minute.
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Vishwapreneur'24 Backend");
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`App listening on port http://localhost:3001`);
});
