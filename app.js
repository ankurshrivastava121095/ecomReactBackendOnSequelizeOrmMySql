const express = require('express');
const app = express();
const dotenv = require('dotenv');
const sequelize = require('./db/sequelizeDB');
const fileUpload = require('express-fileupload');
const path = require('path');
const API = require('./routes/api');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config({
    path: '.env'
});

app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

app.use(express.static(path.join(__dirname, 'uploads')));

// const UserModel = require('./models_mysql/User');

sequelize.sync({ force: false })
    .then(() => {
        console.log('Sequelize models synced with the database');
    })
    .catch(err => {
        console.error('Error syncing Sequelize models:', err);
    });

app.use('/api/oriol-ecom/', API);

app.listen(process.env.DB_PORT, () => {
    console.log(`Server is running at localhost: ${process.env.DB_PORT}`);
});