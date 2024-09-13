// Prosta implementacja loggera dla przeglądarki
const logger = {
  info: (message, meta = {}) => {
    console.log(`INFO: ${message}`, meta);
  },
  error: (message, error) => {
    console.error(`ERROR: ${message}`, error);
  },
  warn: (message, meta = {}) => {
    console.warn(`WARN: ${message}`, meta);
  },
  debug: (message, meta = {}) => {
    console.debug(`DEBUG: ${message}`, meta);
  },
};

export const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

export const logError = (message, error) => {
  logger.error(message, { error: error.message, stack: error.stack });
};

export const logWarning = (message, meta = {}) => {
  logger.warn(message, meta);
};

export const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};