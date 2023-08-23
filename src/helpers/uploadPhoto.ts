import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { FIELD_NAME } from '../global';

const MAX_LIMIT_FILE_SIZE = 1048576; // 1 MB

const storage = multer.diskStorage({
  filename(req, file, callback) {
    const uniqueSuffix = Math.floor(Math.random() * 123456789);
    callback(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
  destination(req, file, callback) {
    let dir: string;

    switch (file.fieldname) {
      case FIELD_NAME.USER_PROFILE_PICTURE:
        dir = path.join(
          __dirname,
          `../../assets/${FIELD_NAME.USER_PROFILE_PICTURE}`,
        );
        break;
      case FIELD_NAME.FORUM_PROFILE_PICTURE:
        dir = path.join(__dirname, `../../assets/forumProfilePicture`);
        break;
      case FIELD_NAME.FORUM_BANNER:
        dir = path.join(__dirname, `../../assets/forumBanner`);
        break;
      default:
        dir = path.join(__dirname, '../../assets/thread');
        break;
    }

    callback(null, dir);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, callback) => {
  const validFormat = ['.jpg', '.png', '.jpeg'];
  const { mimetype } = file;
  const fileFormat = path.extname(file.originalname.toLowerCase());

  if (validFormat.includes(fileFormat) && mimetype.includes('image')) {
    return callback(null, true);
  }

  return callback(new Error('invalid file format'), false);
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_LIMIT_FILE_SIZE },
});
