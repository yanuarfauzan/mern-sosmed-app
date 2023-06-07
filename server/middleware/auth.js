import jwt from "jsonwebtoken";


export const verifyToken = async (req, res, next) => {
    try {
        // memanggil authorization header di frontend
        let token = req.header("Authorization");

        if(!token) {
            return res.status(403).send("Acces Denied")
        }

        // token akan dimulai dengan Baerer
        if(token.starsWith("Baearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}