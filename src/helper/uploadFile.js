const multer = require('multer');
const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require('../config');


const storage = multer.memoryStorage();

const fileFilter=(req,file,cb) =>{
  if (!file.mimetype.startsWith("image/")){
    return cb(new Error('Only image files are allowed'),false);
   }
   if(file.size > MAX_FILE_SIZE){
    return cb(new Error('File size exits the maximum limit '),false);
   }
   if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
    return cb(new Error('This extention not allowed'),false);
   }
   cb(null,true)
};

const upload = multer({ storage: storage,
    fileFilter:fileFilter
 });
module.exports = upload;
















