import multer from 'multer';

const imageStorage = multer.memoryStorage();
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image'))
    {
        cb(null, true);
    } else
    {
        cb(new Error('only images allowed'), false);
    }
};

const upload = multer({ storage: imageStorage, fileFilter: imageFilter });

export default upload;