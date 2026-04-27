import multer from "multer";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const ALLOWED_FORMATS = ["jpg", "png", "jpeg", "webp"];

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "rooms", allowed_formats: ALLOWED_FORMATS },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    Readable.from(buffer).pipe(stream);
  });

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    ALLOWED_FORMATS.includes(ext) ? cb(null, true) : cb(new Error("Invalid file format"));
  },
});

const upload = {
  array: (fieldName, maxCount) => async (req, res, next) => {
    memoryUpload.array(fieldName, maxCount)(req, res, async (err) => {
      if (err) return next(err);
      if (!req.files || req.files.length === 0) return next();
      try {
        const results = await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)));
        req.files = results.map((r) => ({ path: r.secure_url, filename: r.public_id }));
        next();
      } catch (error) {
        next(error);
      }
    });
  },
};

export default upload;
