const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const proxy = require('express-http-proxy')

//handle CORS router

const outRouter = require('./routes/out')
const app = express();
var logger = require('morgan');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 //
app.use('/api/out', outRouter)

// const sessionStore = new redisStore({
//   client: redisClient
// })
// //将session添加到body
// app.use(session({
//   secret: '',
//   cookie: {
//     path: '/',
//     httpOnly: true,
//     maxAge: 10 * 24 * 60 * 60 * 1000
//   },
//   store: sessionStore,
//   resave: true,
//   saveUninitialized: true
// }))

// app.use('/', (req, res, next) => {
//   console.log(`${req.method}-${req.url}-${req.ip}-${req.ips}`)
//   next()
// })

// app.use('/api/imgupdate', imgUpdateRouter);
// app.use('/api/user', userRouter);
// app.use('/api/blog', blogRouter);
// app.use('/api/comment', commentRouter)


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));

// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   console.error(err.message)
//   console.error(err)
//   // render the error page
//   res.status(err.status || 500);
// });

module.exports = app;
