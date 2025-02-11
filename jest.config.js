module.exports = {
    preset: "ts-jest",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|svg|css|scss)$": "identity-obj-proxy",
    },
  };
  