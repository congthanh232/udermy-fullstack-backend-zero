const getLoginPage = (req, res) => {
  return res.render("login.ejs");
};

const handleLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "123") {
    req.session.user = email;

    return res.redirect("/");
  }

  return res.redirect("/login");
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
