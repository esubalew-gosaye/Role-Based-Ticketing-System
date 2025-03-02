import jwt from "jsonwebtoken";

export default (req, res, next) => {
    try {
        const token = req.headers.client !== "not-browser" 
            ? req.headers.authorization 
            : req.cookies["Authorization"];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized user." });
        }

        const bearerToken = token.split(" ")[1];
        const jwtVerified = jwt.verify(bearerToken, process.env.JWT_SECRET);

        if (!jwtVerified) {
            return res.status(403).json({ success: false, message: "Invalid bearer token." });
        }

        req.user = jwtVerified;
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(403).json({ success: false, message: err.message });
    }
};
