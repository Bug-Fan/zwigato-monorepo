import { diskStorage } from 'multer';

export const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
};

export const menuItemStorage = {
  storage: diskStorage({
    destination: './uploads/menuItems',
    filename: (req, file, cb) => {
      cb(null, `MenuItem-${Date.now()}-${file.originalname}`);
    },
  }),
};
