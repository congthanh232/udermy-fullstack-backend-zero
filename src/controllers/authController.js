const CRUDService = require("../services/CRUDService");
const getLoginPage = (req, res) => {
  return res.render("login.ejs");
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  let user = await CRUDService.getUserByEmailWithPrivileges(email);

  if (!user) {
    return res.render("login.ejs", { message: "User not found" });
  }

  if (user.password !== password) {
    return res.render("login.ejs", { message: "Wrong password" });
  }

  req.session.user = user;

  return res.redirect("/");
};

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

module.exports = {
  getLoginPage,
  handleLogin,
  logout,
};
