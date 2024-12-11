module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // verbose: true,
  setUpFilesAfterEnv: ['dotenv/config'],
};
