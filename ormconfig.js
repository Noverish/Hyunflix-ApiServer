module.exports = {
   "type": "mysql",
   "host": process.env.DATABASE_HOST || 'localhost',
   "port": 3306,
   "username": "root",
   "password": process.env.DATABASE_PASSWORD || 'password',
   "database": process.env.DATABASE_DATABASE || "hyunsub2",
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ]
}
