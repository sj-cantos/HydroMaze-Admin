import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import express from 'express';
import Admin from '../model.js';
const router = express.Router();
dotenv.config()
let refreshTokens = [];


router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = { username: username, password: password };
  const admin = await Admin.findOne(user);
  if(admin == null) {
      return res.status(404).send("Cant find user");
  } 
  try{ 

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
    refreshTokens.push(refreshToken);
    console.log(accessToken," ", refreshToken);
    res.json({ accessToken, refreshToken });
    
  } catch (err) { console.log(err); }
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
    console.log("success refresh token ", refreshToken);
  });
});

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204);
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
export default router;