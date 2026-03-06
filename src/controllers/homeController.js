const connection = require("../config/database");
const {
  getAllUsers,
  updateUserById,
  getUserById,
  deleteUserById,
} = require("../services/CRUDService");
let user = [];
const getHomepage = async (req, res) => {
  let results = await getAllUsers();
  return res.render("home.ejs", { listUsers: results });
};

const getABC = (req, res) => {
  res.send("Check abc");
};

const getHoiDanIT = (req, res) => {
  res.render("sample.ejs");
};

const postCreateUser = async (req, res) => {
  let email = req.body.email;
  let name = req.body.myname;
  let city = req.body.city;

  // let{email, name, city} = req.body;
  //   connection.query(
  //     `INSERT INTO Users  (email, name, city)
  // VALUES (?, ?, ?)`,
  //     [email, name, city],
  //     function (err, results) {
  //       console.log(results);

  //       res.send("Create user succeed !");
  //     },
  //   );

  let [results, fields] = await connection.query(
    `INSERT INTO Users  (email, name, city) VALUES (?, ?, ?)`,
    [email, name, city],
  );

  res.send("Create user succeed !");

  // connection. query(
  // 'select * from Users u',
  // function (err, results, fields) {
  // console.log("»>>results= ", results);
  // }
  // );

  // const [results, fields] = await connection.query("select * from Users u");
};

const getCreatePage = (req, res) => {
  res.render("create.ejs");
};

const getUpdatePage = async (req, res) => {
  const userId = req.params.id;
  let user = await getUserById(userId);

  res.render("update.ejs", { userEdit: user }); //x<-y
};

const postUpdateUser = async (req, res) => {
  let email = req.body.email;
  let name = req.body.myname;
  let city = req.body.city;
  let userId = req.body.userId;

  await updateUserById(email, city, name, userId);

  // res.send("Updated user succeed !");
  res.redirect("/");
};

const postDeleteUser = async (req, res) => {
  let userId = req.params.id;
  let user = await getUserById(userId);
  res.render("delete.ejs", { userEdit: user });
};

const postHandleRemoveUser = async (req, res) => {
  const id = req.body.userId;
  await deleteUserById(id);
  res.redirect("/");
};
module.exports = {
  getHomepage,
  getABC,
  getHoiDanIT,
  postCreateUser,
  getCreatePage,
  getUpdatePage,
  postUpdateUser,
  postDeleteUser,
  postHandleRemoveUser,
};
