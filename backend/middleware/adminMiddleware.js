// middleware/adminMiddleware.js

export const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expecting: Authorization: Bearer hardcoded-admin-token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // Match with hardcoded token used in adminLogin
  if (token === "hardcoded-admin-token") {
    // Bypass DB check; pretend user is admin
    req.user = { email: "admin@example.com", isAdmin: true };
    return next();
  } else {
    return res.status(403).json({ message: "Invalid admin token" });
  }
};
