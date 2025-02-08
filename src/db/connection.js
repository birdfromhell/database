const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'absensi_sekola',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '141414',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
