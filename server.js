const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const header = require('./header');
const Post = require('./models/post');
require('dotenv').config();
dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((e) => {
    console.log(e.reason);
  });

const reqListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  const { url, method } = req;
  // 新增貼文
  if (url === '/post' && method === 'POST') {
    req.on('end', async () => {
      try {
        const { userName, userPhoto, imageUrl, content } = JSON.parse(body);
        const post = await Post.create({ userName, userPhoto, imageUrl, content });
        res.writeHead(200, header);
        res.write(
          JSON.stringify({
            status: 'success',
            data: post,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(400, header);
        res.write(
          JSON.stringify({
            status: 'error',
            message: error,
          })
        );
        res.end();
      }
    });
  }
  //取得全部貼文
  else if (url === '/post' && method === 'GET') {
    const posts = await Post.find();
    res.writeHead(200, header);
    res.write(
      JSON.stringify({
        status: 'success',
        data: posts,
      })
    );
    res.end();
  }
  // 取得最新貼文 & 關鍵字
  else if (url.startsWith('/post/') && method === 'GET') {
    const type = req.url.split('=').pop().split("?").shift()
    const keyText = new RegExp(decodeURI(req.url.split('?').pop()))
    let posts = ''
    if( type == 'new'){
      posts = await Post.find({'content': keyText }).sort({'createdAt': -1});
    } else if(type == 'keyword'){
      posts = await Post.find({'content': keyText});
    } 
    res.writeHead(200, header);
    res.write(
      JSON.stringify({
        status: 'success',
        data: posts,
      })
    );
    res.end();
  }
  // 預檢請求
  else if (method === 'OPTIONS') {
    res.writeHead(200, header);
    res.end();
  } else {
    res.writeHead(404, header);
    res.write(
      JSON.stringify({
        status: 'error',
        message: '找不到路徑',
      })
    );
    res.end();
  }
};

const server = http.createServer(reqListener);
server.listen(process.env.PORT || 3005);
