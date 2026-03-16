require("dotenv").config();
const express = require("express"); // comon js
const session = require("express-session");

const configViewEngine = require("./config/viewEngine");
const webRoutes = require("./routes/web");

const app = express(); // app express
const port = process.env.PORT || 8081; //port
// const hostname = process.env.HOST_NAME;

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data


// config session 
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.static("src/public"));

// config template engine
configViewEngine(app);

// khai báo route
app.use(webRoutes);

// app.listen(port, hostname, () => {
//   console.log(`Example app listening on port ${port}`);
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
