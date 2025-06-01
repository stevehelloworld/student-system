"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const PORT = process.env.PORT || 3000;
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('資料庫連線成功');
    app_1.app.listen(PORT, () => {
        console.log(`伺服器執行於 port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('資料庫連線失敗:', error);
    process.exit(1);
});
