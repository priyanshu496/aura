import express from "express";
import morgan from "morgan";
import dbconnect from "./db/db.js";
import userRouter from "./routes/user.routes.js";
dbconnect();


 const App = express();
App.use(morgan("dev"));
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use('/user', userRouter)


App.get("/", (req, res) => {
  console.log("get req");
  res.send("Hello from app");
});



export default App;