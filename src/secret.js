require('dotenv').config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL = process.env.MONGODB_ATLAS_URL ||'mongodb://localhost:27017/ecommerceMernDB';
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/default.png';
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || '#SaDia#IslamSetU@iu2017';
const jwtAccessKey=process.env.JWT_ACCESS_KEY || 'Logging_Access_Is_Here';
const jwtRefreshKey=process.env.JWT_REFRESH_KE ||'Logging_Refresh_Is_Here';
const jwtRestPasswordKey=process.env.JWT_REST_PASSWORD_KEY || 'Rest_Password_Is_Here';
const smtpUserName = process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';
const clientURL = process.env.CLIENT_URL || '';


module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
    jwtActivationKey,
    jwtRestPasswordKey,
    jwtAccessKey,
    jwtRefreshKey,
    smtpUserName,
    smtpPassword,
    clientURL,
 
};
