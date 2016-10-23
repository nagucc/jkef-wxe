import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser('jkef.nagu.cc cookie key'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.get('/signedUserIdCookie', (req, res) => {
  const cookie = req.query.userid;
  res.cookie('userId', cookie, { signed: true });
  res.end();
});
export default app;
