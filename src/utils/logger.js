import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(process.cwd(), 'debug.log') }),
  ],
});

export const logApiRequest = (messages, config) => {
  logger.info('API Request', { messages, config });
};

export const logApiResponse = (response) => {
  logger.info('API Response', { response });
};

export const logApiError = (error) => {
  logger.error('API Error', { error: error.message, stack: error.stack });
};