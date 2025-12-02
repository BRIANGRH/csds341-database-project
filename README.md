# NBA Stats Database

<img width="2370" height="1346" alt="Screenshot 2025-12-02 at 5 11 16 PM" src="https://github.com/user-attachments/assets/9e10c7f3-9c4d-4c14-9621-30adbc7bf4ea" />

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
