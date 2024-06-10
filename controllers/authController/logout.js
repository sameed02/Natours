function logout(req, res, next) {
  // approach 1, send dummy cookies
  /* res.cookie("jwt", "user logged out", {
    expires: new Date(Date.now() + 10 * 1000),
    http: true,
    path: "/",
  }); */

  // approach 2, delete cookie
  res.clearCookie("jwt", {
    domain: "localhost",
    path: "/",
    httpOnly: true,
  });

  res
    .status(200)
    .send({ status: "success", message: "user has been logged out" });
}

module.exports = { logout };
