// import { fileURLToPath } from 'url';
// import path from 'path';
// import winston from 'winston';
// import fs from 'fs';
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// const __log_dir = path.join(path.resolve(__dirname, '..'), 'logs');

// if(!fs.existsSync(__log_dir)){
//   fs.mkdirSync(path.join(__log_dir))
// }


// const logger = winston.createLogger({
//   level: 'debug',
//   format: winston.format.combine(
//     winston.format.colorize(), 
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     winston.format.printf(({ level, message, timestamp }) => {
//       return `[${timestamp}] ${level} → ${message}`;
//     })),
//   transports: [
//     new winston.transports.Console(),
//     // new winston.transports.File({
//     //   filename: path.join(__log_dir, 'logs.log'),
//     //   format: winston.format.combine(
//     //     winston.format.uncolorize(), 
//     //     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     //     winston.format.printf(({ level, message, timestamp }) => {
//     //       return `[${timestamp}] ${level.toUpperCase()} → ${message}`;
//     //     })
//     //   ),
//     // }),
//   ],
// });

// export default logger;
