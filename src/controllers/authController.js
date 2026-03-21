const CRUDService = require("../services/CRUDService");
const bcrypt = require("bcrypt");
const getLoginPage = (req, res) => {
  return res.render("login.ejs");
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  let user = await CRUDService.getUserByEmailWithPrivileges(email);

  if (!user) {
    return res.render("login.ejs", { message: "User not found" });
  }

  //So sánh mật khẩu người dùng gõ (password) với mật khẩu mã hóa trong DB (user.password)
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
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
