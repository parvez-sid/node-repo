require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const status = require('express-status-monitor')

// import custom modules
const { connectMongoDb } = require('./config/db.connect');
const { checkForAuthenticationCookie } = require('./middlewares/auth');
const { MONGO_URI } = process.env;
connectMongoDb(MONGO_URI);

const PORT = process.env.PORT || 5678;

app.use(status());

// setting view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

// using bootstrap & static files
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// parse form data
app.use(express.urlencoded({ extended : false }));

// parse cookies
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// importing routes
const userRouter = require("./routes/user.routes");
const blogRouter = require("./routes/blog.routes");
const indexRouter = require("./routes/index.routes");

app.use('/users', userRouter);
app.use('/blogs', blogRouter);
app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});