const logger = {
  debug: (message, ...args) => {
    if (typeof message === "object") {
      console.log("%c[DEBUG]", "color: #666", message, ...args);
    } else {
      console.log("%c[DEBUG]", "color: #666", message, ...args);
    }
  },

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
