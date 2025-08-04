/**
 * Logger utility for consistent console logging with different log levels and styles.
 *
 * @namespace logger
 */
const logger = {
  /**
   * Logs a debug message to the console.
   * @param {string|object} message - The message or object to log.
   * @param {...any} args - Additional arguments to log.
   */
  debug: (message, ...args) => {
    if (typeof message === "object") {
      console.log("%c[DEBUG]", "color: #666", message, ...args);
    } else {
      console.log("%c[DEBUG]", "color: #666", message, ...args);
    }
  },

  /**
   * Logs an info message to the console.
   * @param {string|object} message - The message or object to log.
   * @param {...any} args - Additional arguments to log.
   */
  info: (message, ...args) => {
    if (typeof message === "object") {
      console.log(
        "%c[INFO]",
        "color: #0066cc; font-weight: bold",
        message,
        ...args
      );
    } else {
      console.log(
        "%c[INFO]",
        "color: #0066cc; font-weight: bold",
        message,
        ...args
      );
    }
  },

  /**
   * Logs a success message to the console.
   * @param {string|object} message - The message or object to log.
   * @param {...any} args - Additional arguments to log.
   */
  success: (message, ...args) => {
    if (typeof message === "object") {
      console.log(
        "%c[SUCCESS]",
        "color: #00cc00; font-weight: bold",
        message,
        ...args
      );
    } else {
      console.log(
        "%c[SUCCESS]",
        "color: #00cc00; font-weight: bold",
        message,
        ...args
      );
    }
  },

  /**
   * Logs a general message to the console.
   * @param {string|object} message - The message or object to log.
   * @param {...any} args - Additional arguments to log.
   */
  log: (message, ...args) => {
    if (typeof message === "object") {
      console.log(
        "%c[LOG]",
        "color: #ffffff; font-weight: bold",
        message,
        ...args
      );
    } else {
      console.log(
        "%c[LOG]",
        "color: #ffffff; font-weight: bold",
        message,
        ...args
      );
    }
  },

  /**
   * Logs a warning message to the console.
   * @param {string|object} message - The message or object to log.
   * @param {...any} args - Additional arguments to log.
   */
  warn: (message, ...args) => {
    if (typeof message === "object") {
      console.log(
        "%c[WARN]",
        "color: #ff8800; font-weight: bold",
        message,
        ...args
      );
    } else {
      console.log(
        "%c[WARN]",
        "color: #ff8800; font-weight: bold",
        message,
        ...args
      );
    }
  },

  /**
   * Logs an error message to the console.
   * @param {string|object} message - The message or object to log.
   * @param {...any} args - Additional arguments to log.
   */
  error: (message, ...args) => {
    if (typeof message === "object") {
      console.log(
        "%c[ERROR]",
        "color: #cc0000; font-weight: bold",
        message,
        ...args
      );
    } else {
      console.log(
        "%c[ERROR]",
        "color: #cc0000; font-weight: bold",
        message,
        ...args
      );
    }
  },
};

export default logger;
