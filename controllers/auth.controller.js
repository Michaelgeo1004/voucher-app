const credentials = { username: "admin", password: "muh" };

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === credentials.username && password === credentials.password) {
    req.session.isAuthenticated = true;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid user Credentials");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
