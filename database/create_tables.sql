-- NBA Statistics Database
-- Table Creation Script

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS PlayerTransactions CASCADE;
DROP TABLE IF EXISTS PlayerGameStats CASCADE;
DROP TABLE IF EXISTS PlayerSeasonStats CASCADE;
DROP TABLE IF EXISTS TeamGameStats CASCADE;
DROP TABLE IF EXISTS TeamSeasonStats CASCADE;
DROP TABLE IF EXISTS Games CASCADE;
DROP TABLE IF EXISTS Players CASCADE;
DROP TABLE IF EXISTS Teams CASCADE;

-- 1. Teams table
CREATE TABLE Teams (
    TeamID SERIAL PRIMARY KEY,
    TeamName VARCHAR(100) NOT NULL UNIQUE,
    City VARCHAR(100) NOT NULL,
    Conference VARCHAR(10) CHECK (Conference IN ('East', 'West')),
    Division VARCHAR(20),
    FoundedYear INT CHECK (FoundedYear > 1900)
);

-- 2. Players table
CREATE TABLE Players (
    PlayerID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Position VARCHAR(5) CHECK (Position IN ('PG', 'SG', 'SF', 'PF', 'C')),
    Height INT CHECK (Height > 0), -- height in inches
    Weight INT CHECK (Weight > 0), -- weight in pounds
    DateOfBirth DATE,
    DraftYear INT,
    CurrentTeamID INT,
    FOREIGN KEY (CurrentTeamID) REFERENCES Teams(TeamID) ON DELETE SET NULL
);

-- 3. Games table
CREATE TABLE Games (
    GameID SERIAL PRIMARY KEY,
    GameDate DATE NOT NULL,
    HomeTeamID INT NOT NULL,
    AwayTeamID INT NOT NULL,
    HomeScore INT CHECK (HomeScore >= 0),
    AwayScore INT CHECK (AwayScore >= 0),
    Season VARCHAR(10) NOT NULL, -- e.g., '2024-25'
    GameType VARCHAR(10) CHECK (GameType IN ('Regular', 'Playoff')),
    FOREIGN KEY (HomeTeamID) REFERENCES Teams(TeamID),
    FOREIGN KEY (AwayTeamID) REFERENCES Teams(TeamID),
    CHECK (HomeTeamID != AwayTeamID)
);

-- 4. PlayerGameStats table
CREATE TABLE PlayerGameStats (
    StatID SERIAL PRIMARY KEY,
    PlayerID INT NOT NULL,
    GameID INT NOT NULL,
    TeamID INT NOT NULL,
    MinutesPlayed INT CHECK (MinutesPlayed >= 0 AND MinutesPlayed <= 48),
    Points INT CHECK (Points >= 0),
    Rebounds INT CHECK (Rebounds >= 0),
    Assists INT CHECK (Assists >= 0),
    Steals INT CHECK (Steals >= 0),
    Blocks INT CHECK (Blocks >= 0),
    Turnovers INT CHECK (Turnovers >= 0),
    FieldGoalsMade INT CHECK (FieldGoalsMade >= 0),
    FieldGoalsAttempted INT CHECK (FieldGoalsAttempted >= 0),
    ThreePointersMade INT CHECK (ThreePointersMade >= 0),
    ThreePointersAttempted INT CHECK (ThreePointersAttempted >= 0),
    FreeThrowsMade INT CHECK (FreeThrowsMade >= 0),
    FreeThrowsAttempted INT CHECK (FreeThrowsAttempted >= 0),
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID),
    UNIQUE (PlayerID, GameID),
    CHECK (FieldGoalsMade <= FieldGoalsAttempted),
    CHECK (ThreePointersMade <= ThreePointersAttempted),
    CHECK (FreeThrowsMade <= FreeThrowsAttempted)
);

-- 5. PlayerSeasonStats table
CREATE TABLE PlayerSeasonStats (
    PlayerID INT NOT NULL,
    Season VARCHAR(10) NOT NULL,
    TeamID INT NOT NULL,
    GamesPlayed INT CHECK (GamesPlayed >= 0),
    AvgPoints DECIMAL(5,2) CHECK (AvgPoints >= 0),
    AvgRebounds DECIMAL(5,2) CHECK (AvgRebounds >= 0),
    AvgAssists DECIMAL(5,2) CHECK (AvgAssists >= 0),
    AvgSteals DECIMAL(5,2) CHECK (AvgSteals >= 0),
    AvgBlocks DECIMAL(5,2) CHECK (AvgBlocks >= 0),
    FieldGoalPercentage DECIMAL(5,3) CHECK (FieldGoalPercentage >= 0 AND FieldGoalPercentage <= 1),
    ThreePointPercentage DECIMAL(5,3) CHECK (ThreePointPercentage >= 0 AND ThreePointPercentage <= 1),
    FreeThrowPercentage DECIMAL(5,3) CHECK (FreeThrowPercentage >= 0 AND FreeThrowPercentage <= 1),
    PRIMARY KEY (PlayerID, Season),
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID)
);

-- 6. TeamGameStats table
CREATE TABLE TeamGameStats (
    TeamID INT NOT NULL,
    GameID INT NOT NULL,
    Points INT CHECK (Points >= 0),
    Rebounds INT CHECK (Rebounds >= 0),
    Assists INT CHECK (Assists >= 0),
    FieldGoalPercentage DECIMAL(5,3) CHECK (FieldGoalPercentage >= 0 AND FieldGoalPercentage <= 1),
    ThreePointPercentage DECIMAL(5,3) CHECK (ThreePointPercentage >= 0 AND ThreePointPercentage <= 1),
    Turnovers INT CHECK (Turnovers >= 0),
    PRIMARY KEY (TeamID, GameID),
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID) ON DELETE CASCADE,
    FOREIGN KEY (GameID) REFERENCES Games(GameID) ON DELETE CASCADE
);

-- 7. TeamSeasonStats table
CREATE TABLE TeamSeasonStats (
    TeamID INT NOT NULL,
    Season VARCHAR(10) NOT NULL,
    Wins INT CHECK (Wins >= 0),
    Losses INT CHECK (Losses >= 0),
    PointsPerGame DECIMAL(5,2) CHECK (PointsPerGame >= 0),
    ReboundsPerGame DECIMAL(5,2) CHECK (ReboundsPerGame >= 0),
    AssistsPerGame DECIMAL(5,2) CHECK (AssistsPerGame >= 0),
    PRIMARY KEY (TeamID, Season),
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID) ON DELETE CASCADE
);

-- 8. PlayerTransactions table
CREATE TABLE PlayerTransactions (
    TransactionID SERIAL PRIMARY KEY,
    PlayerID INT NOT NULL,
    FromTeamID INT, -- NULL for draft picks or free agents
    ToTeamID INT NOT NULL,
    TransactionType VARCHAR(20) CHECK (TransactionType IN ('Trade', 'Signing', 'Waiver', 'Draft')),
    TransactionDate DATE NOT NULL,
    ContractValue DECIMAL(12,2),
    Notes TEXT,
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID) ON DELETE CASCADE,
    FOREIGN KEY (FromTeamID) REFERENCES Teams(TeamID),
    FOREIGN KEY (ToTeamID) REFERENCES Teams(TeamID)
);

-- Create indexes for better query performance
CREATE INDEX idx_players_team ON Players(CurrentTeamID);
CREATE INDEX idx_games_date ON Games(GameDate);
CREATE INDEX idx_games_season ON Games(Season);
CREATE INDEX idx_player_game_stats_player ON PlayerGameStats(PlayerID);
CREATE INDEX idx_player_game_stats_game ON PlayerGameStats(GameID);
CREATE INDEX idx_transactions_player ON PlayerTransactions(PlayerID);
CREATE INDEX idx_transactions_date ON PlayerTransactions(TransactionDate);

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;