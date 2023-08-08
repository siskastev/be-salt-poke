import { createLogger, transports, format } from 'winston';
import * as moment from 'moment';

export const logger = createLogger({
  transports: [
    new transports.Console(), // Show logs in the console
    new transports.File({ filename: 'logs/app.log' }) // Save logs to the file 'app.log' in the 'logs' folder
  ],
  format: format.combine(
    format.timestamp(), // Use the default timestamp format provided by Winston
    format.metadata(),
    format.printf(({ level, message, metadata, timestamp }) => {
      const payloadString = metadata && Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : '';
      return `[${moment(timestamp).utc().format('YYYY-MM-DD HH:mm:ss')} [UTC]] [${level.toUpperCase()}]: ${message} ${payloadString}`;
    })
  )
});
