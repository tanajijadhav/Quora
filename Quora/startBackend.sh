cd backend/
pm2 stop server.js
pm2 flush
pm2 start server.js
cd ../
cd kafka-analytics/
pm2 stop analytics.js
pm2 start analytics.js
pm2 logs