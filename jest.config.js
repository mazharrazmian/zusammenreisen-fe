module.exports = {
     // Setup environment variables
    setupFiles: ['<rootDir>/jest.setup.js'],
    preset: "ts-jest",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
      "^.+\\.js?$": "ts-jest",
    },
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|svg|css|scss)$": "jest-transform-stub",
    },
    "testEnvironment": "jsdom"

  };
  