import multer from "multer";

// memoryStorage: the file stays in RAM (req.file.buffer) and goes straight to ImageKit.
// Nothing is saved on your server disk.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

export { upload };