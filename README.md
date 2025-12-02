# NBA Stats Database

Setup:

1. Create database
```
createdb nba_stats
psql -U postgres -d nba_stats -f database/init_database.sql
```

2. Update .env.local with your postgres credentials

3. Run the app
```
npm install
npm run dev
```
