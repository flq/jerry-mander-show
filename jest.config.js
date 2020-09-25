module.exports = {
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  testRegex: "/tests/.*\\.(test|spec)\\.tsx?$",
  setupFilesAfterEnv: ["<rootDir>/tests/test-setup.js"],
  moduleDirectories: [
    "node_modules",
    "."
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
};
