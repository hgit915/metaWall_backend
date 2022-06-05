# NodeJs_backend
## DEMO
- [MetaWall](https://tartartuna.github.io/metaWall-front-end/)
- [前端 github](https://github.com/TartarTuna/metaWall-front-end)
- [Swagger文件](https://metawall-06.herokuapp.com/api-doc)

---
### 專案架構
- [express](https://www.npmjs.com/package/express) - nodeJs 框架
- [heroku](https://www.heroku.com/) - 部屬工具
- [MongoDB](https://www.mongodb.com/) - 資料庫
- [AWS S3](https://aws.amazon.com/tw/free/) - 儲存圖片空間
- [swagger](https://www.npmjs.com/package/swagger-autogen#installation) - 撰寫 API 文件

### 專案設定


安裝 modules

```sh
yarn install
```

本機啟動 server
```sh
yarn start:dev
```

重產 swagger-output.json
```sh
yarn swagger
```

### Coding Style (必要)

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
 
 
 ### Postman API
 > 將 postman 資料夾下的檔案匯入 postman ，即可測試 remote / local API 
 
token 會過期，需自行更新 postman token變數。


### AWS - S3
> 圖片儲存的雲空間

---
### heroku 佈署

- 機器：metawall-06
  
設置環境變數
```
將 .env.example 變數設定至 heroku > setting > Config Vars 
```

查詢佈署 log 紀錄

```sh
heroku logs -n 150 
// 150 顯示的筆數
```

佈署到 heroku

```sh
git push heroku main
```

**注意事項**
> yarn.lock & package-lock.json 同時存在會佈署失敗，請刪除 package-lock.json。

