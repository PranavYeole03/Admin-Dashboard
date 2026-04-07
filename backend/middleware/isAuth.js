// import jwt from "jsonwebtoken";

// const isAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "token not found" });
//     }
//     const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decodeToken) {
//       return res.status(401).json({ message: "token not verify" });
//     }
//     req.userId = decodeToken.userId;
//     next();
//   } catch (error) {
//     return res.status(500).json({ message: "isAuth error" });
//   }
// };

// export default isAuth;


import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {

    let token = req.cookies.token;

    if (!token && req.headers.authorization) {

      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }

    }

    if (!token) {
      return res.status(401).json({
        message: "Token not found"
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken) {
      return res.status(401).json({ message: "token not verify" });
    }

    req.userId = decodeToken.userId;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Authentication failed"
    });

  }
};

export default isAuth;