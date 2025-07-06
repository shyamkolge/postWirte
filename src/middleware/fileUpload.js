import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/temp"), // Folder location
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, buff) => {
      if (err) throw err;
      const fn = buff.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({ storage, limits: { fileSize: 1000000 } });

export default upload;
