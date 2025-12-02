-- NBA Statistics Database
-- Sample Data Insert Script

-- Clear existing data (in reverse order of foreign key dependencies)
DELETE FROM PlayerTransactions;
DELETE FROM TeamSeasonStats;
DELETE FROM TeamGameStats;
DELETE FROM PlayerSeasonStats;
DELETE FROM PlayerGameStats;
DELETE FROM Games;
DELETE FROM Players;
DELETE FROM Teams;

-- Reset sequences (so IDs start from 1 again)
ALTER SEQUENCE teams_teamid_seq RESTART WITH 1;
ALTER SEQUENCE players_playerid_seq RESTART WITH 1;
ALTER SEQUENCE games_gameid_seq RESTART WITH 1;
ALTER SEQUENCE playergamestats_statid_seq RESTART WITH 1;
ALTER SEQUENCE playertransactions_transactionid_seq RESTART WITH 1;

-- Insert Teams
INSERT INTO Teams (TeamName, City, Conference, Division, FoundedYear) VALUES
('Lakers', 'Los Angeles', 'West', 'Pacific', 1947),
('Celtics', 'Boston', 'East', 'Atlantic', 1946),
('Warriors', 'Golden State', 'West', 'Pacific', 1946),
('Heat', 'Miami', 'East', 'Southeast', 1988),
('Bulls', 'Chicago', 'East', 'Central', 1966),
('Mavericks', 'Dallas', 'West', 'Southwest', 1980);

-- Insert Players
INSERT INTO Players (FirstName, LastName, Position, Height, Weight, DateOfBirth, DraftYear, CurrentTeamID) VALUES
-- Lakers
('LeBron', 'James', 'SF', 81, 250, '1984-12-30', 2003, 1),
('Anthony', 'Davis', 'PF', 82, 253, '1993-03-11', 2012, 1),
-- Warriors
('Stephen', 'Curry', 'PG', 75, 185, '1988-03-14', 2009, 3),
('Klay', 'Thompson', 'SG', 78, 220, '1990-02-08', 2011, 3),
-- Celtics
('Jayson', 'Tatum', 'SF', 80, 210, '1998-03-03', 2017, 2),
('Jaylen', 'Brown', 'SG', 78, 223, '1996-10-24', 2016, 2),
-- Heat
('Jimmy', 'Butler', 'SF', 79, 230, '1989-09-14', 2011, 4),
('Bam', 'Adebayo', 'C', 81, 255, '1997-07-18', 2017, 4),
-- Bulls
('DeMar', 'DeRozan', 'SG', 78, 220, '1989-08-07', 2009, 5),
('Zach', 'LaVine', 'SG', 77, 200, '1995-03-10', 2014, 5),
-- Mavericks
('Luka', 'Doncic', 'PG', 79, 230, '1999-02-28', 2018, 6),
('Kyrie', 'Irving', 'PG', 74, 195, '1992-03-23', 2011, 6);

-- Insert Games
INSERT INTO Games (GameDate, HomeTeamID, AwayTeamID, HomeScore, AwayScore, Season, GameType) VALUES
('2024-10-22', 1, 3, 115, 110, '2024-25', 'Regular'),
('2024-10-23', 2, 4, 108, 105, '2024-25', 'Regular'),
('2024-10-24', 3, 1, 122, 118, '2024-25', 'Regular'),
('2024-10-25', 5, 6, 98, 102, '2024-25', 'Regular'),
('2024-10-26', 1, 2, 120, 117, '2024-25', 'Regular');

-- Insert PlayerGameStats (Game 1: Lakers vs Warriors)
INSERT INTO PlayerGameStats (PlayerID, GameID, TeamID, MinutesPlayed, Points, Rebounds, Assists, 
    Steals, Blocks, Turnovers, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, 
    ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted) VALUES
-- Lakers players in Game 1
(1, 1, 1, 38, 28, 8, 7, 2, 1, 3, 10, 20, 2, 6, 6, 8),
(2, 1, 1, 36, 24, 12, 3, 1, 3, 2, 9, 16, 0, 2, 6, 7),
-- Warriors players in Game 1
(3, 1, 3, 37, 32, 5, 8, 2, 0, 4, 11, 22, 6, 13, 4, 4),
(4, 1, 3, 34, 22, 6, 3, 1, 1, 2, 8, 15, 4, 9, 2, 2);

-- Insert PlayerGameStats (Game 2: Celtics vs Heat)
INSERT INTO PlayerGameStats (PlayerID, GameID, TeamID, MinutesPlayed, Points, Rebounds, Assists, 
    Steals, Blocks, Turnovers, FieldGoalsMade, FieldGoalsAttempted, ThreePointersMade, 
    ThreePointersAttempted, FreeThrowsMade, FreeThrowsAttempted) VALUES
-- Celtics players in Game 2
(5, 2, 2, 39, 30, 9, 5, 1, 1, 3, 11, 21, 4, 10, 4, 5),
(6, 2, 2, 37, 26, 7, 4, 2, 0, 2, 10, 18, 3, 8, 3, 4),
-- Heat players in Game 2
(7, 2, 4, 38, 28, 6, 6, 3, 1, 4, 10, 19, 2, 6, 6, 8),
(8, 2, 4, 35, 20, 13, 3, 1, 2, 1, 8, 13, 0, 1, 4, 5);

-- Insert TeamGameStats
INSERT INTO TeamGameStats (TeamID, GameID, Points, Rebounds, Assists, FieldGoalPercentage, 
    ThreePointPercentage, Turnovers) VALUES
(1, 1, 115, 44, 25, 0.475, 0.367, 12),
(3, 1, 110, 38, 28, 0.452, 0.388, 14),
(2, 2, 108, 42, 24, 0.468, 0.355, 11),
(4, 2, 105, 41, 22, 0.462, 0.333, 13);

-- Insert PlayerSeasonStats
INSERT INTO PlayerSeasonStats (PlayerID, Season, TeamID, GamesPlayed, AvgPoints, AvgRebounds, 
    AvgAssists, AvgSteals, AvgBlocks, FieldGoalPercentage, ThreePointPercentage, FreeThrowPercentage) VALUES
(1, '2024-25', 1, 5, 26.5, 7.8, 6.5, 1.5, 0.8, 0.510, 0.385, 0.750),
(2, '2024-25', 1, 5, 24.2, 11.5, 3.2, 1.2, 2.5, 0.565, 0.200, 0.820),
(3, '2024-25', 3, 5, 28.8, 5.2, 7.8, 1.8, 0.3, 0.472, 0.415, 0.910),
(5, '2024-25', 2, 5, 27.5, 8.5, 4.8, 1.2, 0.8, 0.485, 0.380, 0.850),
(7, '2024-25', 4, 5, 25.3, 6.2, 5.5, 2.2, 0.5, 0.495, 0.340, 0.875);

-- Insert TeamSeasonStats
INSERT INTO TeamSeasonStats (TeamID, Season, Wins, Losses, PointsPerGame, ReboundsPerGame, AssistsPerGame) VALUES
(1, '2024-25', 4, 1, 116.2, 43.8, 25.6),
(2, '2024-25', 4, 1, 112.4, 44.2, 24.8),
(3, '2024-25', 3, 2, 114.6, 42.4, 26.2),
(4, '2024-25', 2, 3, 106.8, 40.6, 22.4),
(5, '2024-25', 2, 3, 108.2, 41.2, 23.8),
(6, '2024-25', 3, 2, 110.4, 42.8, 24.2);

-- Insert PlayerTransactions
INSERT INTO PlayerTransactions (PlayerID, FromTeamID, ToTeamID, TransactionType, TransactionDate, ContractValue, Notes) VALUES
(12, NULL, 6, 'Trade', '2023-06-27', 126000000.00, 'Traded from Brooklyn Nets'),
(1, NULL, 1, 'Signing', '2018-07-09', 153312846.00, 'Signed as free agent from Cleveland'),
(3, NULL, 3, 'Draft', '2009-06-25', NULL, 'Drafted 7th overall'),
(11, NULL, 6, 'Draft', '2018-06-21', NULL, 'Drafted 3rd overall');

-- Verify data insertion
SELECT 'Teams' as TableName, COUNT(*) as RowCount FROM Teams
UNION ALL
SELECT 'Players', COUNT(*) FROM Players
UNION ALL
SELECT 'Games', COUNT(*) FROM Games
UNION ALL
SELECT 'PlayerGameStats', COUNT(*) FROM PlayerGameStats
UNION ALL
SELECT 'TeamGameStats', COUNT(*) FROM TeamGameStats
UNION ALL
SELECT 'PlayerSeasonStats', COUNT(*) FROM PlayerSeasonStats
UNION ALL
SELECT 'TeamSeasonStats', COUNT(*) FROM TeamSeasonStats
UNION ALL
SELECT 'PlayerTransactions', COUNT(*) FROM PlayerTransactions;