module.exports = {
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
  