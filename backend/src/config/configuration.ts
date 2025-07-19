export default () => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
});
