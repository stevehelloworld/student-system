import { app } from './app';
import { AppDataSource } from './config/database';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('資料庫連線成功');
    
    app.listen(PORT, () => {
      console.log(`伺服器執行於 port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('資料庫連線失敗:', error);
    process.exit(1);
  }); 