const connection = require("../config/database");
const {
  getAllUsers,
  updateUserById,
  getUserById,
  deleteUserById,
} = require("../services/CRUDService");
let user = [];
const getHomepage = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  let user = req.session.user;

  // nếu là admin
  if (user.role === "admin") {
    let results = await getAllUsers();

    return res.render("home.ejs", {
      listUsers: results,
      user: user,
    });
  }

  // nếu là user thường
  return res.render("profile.ejs", {
    user: user,
  });
};

const getABC = (req, res) => {
  res.send("Check abc");
};

const getHoiDanIT = (req, res) => {
  res.render("sample.ejs");
};

const postCreateUser = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  let email = req.body.email;
  let name = req.body.myname;
  let city = req.body.city;
  let password = req.body.password;
  let role = req.body.role;

  await connection.query(
    `INSERT INTO Users (email, name, city, password, role) 
     VALUES ($1, $2, $3, $4, $5)`,
    [email, name, city, password, role],
  );

  res.redirect("/");
};

const getCreatePage = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  res.render("create.ejs");
};

const getUpdatePage = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
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
