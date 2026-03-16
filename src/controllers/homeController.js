const connection = require("../config/database");
const supabase = require("../config/supabase");
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
  let avatar = req.file ? req.file.filename : null;
  //  if (req.file) {
  //    const fileName = Date.now() + "-" + req.file.originalname;

  //    const { data, error } = await supabase.storage
  //      .from("avatars")
  //      .upload(fileName, req.file.buffer);

  //    if (!error) {
  //      avatarUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
  //    }
  //  }

  await connection.query(
    `INSERT INTO Users (email, name, city, password, role, avatar) 
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [email, name, city, password, role, avatar],
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
