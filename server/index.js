import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import multer from "multer";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postsRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js"

// CONFIGURATION

//  kode ini digunakan untuk mendapatkan informasi tentang lokasi file yang sedang dieksekusi di dalam program
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
// Tujuan utama Helmet adalah meningkatkan keamanan aplikasi web dengan menerapkan berbagai langkah perlindungan terhadap serangan yang umum terjadi di web.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// mengaktifkan middleware Morgan dalam aplikasi Express.js dan konfigurasi log dengan format "common" akan diterapkan untuk mencatat aktivitas server.
app.use(morgan("common"));
// untuk mengurai data permintaan dari format tertentu, seperti JSON atau URL-encoded, dan menghasilkan objek JavaScript yang dapat digunakan dalam penanganan permintaan.
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// mengontrol dan mengatur kebijakan CORS di server, sehingga memungkinkan akses lintas domain yang aman dan terkendali ke API atau sumber daya
app.use(cors());
// untuk mengatur dan menyediakan akses ke file statis, seperti gambar, CSS, JavaScript, dan file lainnya, yang berada dalam direktori public/assets.
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// FILE STORAGE

// destinasi file image yang diupload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

})

const upload = multer({ storage });

// AUTHENTICATION
// ROUTES WITH FILE

// make route register using app.post
// upload.single("picture") kita akan upload foto secara local ke dalam ./public/assets di line 36

app.post("/auth/register", upload.single("picture"), register);
app.post("/post", verifyToken, upload.single("picture"), createPost);


// ROUTES

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("posts", postsRoutes)

// MONGOOSE SETUP

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // ADD DATA ONE TIME
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} did not connect`));