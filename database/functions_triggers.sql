CREATE OR REPLACE FUNCTION update_player_season_stats()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM PlayerSeasonStats
    WHERE PlayerID = NEW.PlayerID
    AND Season = (SELECT Season FROM Games WHERE GameID = NEW.GameID);

    INSERT INTO PlayerSeasonStats (
        PlayerID, Season, TeamID, GamesPlayed,
        AvgPoints, AvgRebounds, AvgAssists, AvgSteals, AvgBlocks,
        FieldGoalPercentage, ThreePointPercentage, FreeThrowPercentage
    )
    SELECT
        pgs.PlayerID,
        g.Season,
        pgs.TeamID,
        COUNT(*) as GamesPlayed,
        ROUND(AVG(pgs.Points), 2) as AvgPoints,
        ROUND(AVG(pgs.Rebounds), 2) as AvgRebounds,
        ROUND(AVG(pgs.Assists), 2) as AvgAssists,
        ROUND(AVG(pgs.Steals), 2) as AvgSteals,
        ROUND(AVG(pgs.Blocks), 2) as AvgBlocks,
        CASE
            WHEN SUM(pgs.FieldGoalsAttempted) > 0
            THEN ROUND(SUM(pgs.FieldGoalsMade)::DECIMAL / SUM(pgs.FieldGoalsAttempted), 3)
            ELSE 0
        END as FieldGoalPercentage,
        CASE
            WHEN SUM(pgs.ThreePointersAttempted) > 0
            THEN ROUND(SUM(pgs.ThreePointersMade)::DECIMAL / SUM(pgs.ThreePointersAttempted), 3)
            ELSE 0
        END as ThreePointPercentage,
        CASE
            WHEN SUM(pgs.FreeThrowsAttempted) > 0
            THEN ROUND(SUM(pgs.FreeThrowsMade)::DECIMAL / SUM(pgs.FreeThrowsAttempted), 3)
            ELSE 0
        END as FreeThrowPercentage
    FROM PlayerGameStats pgs
    JOIN Games g ON pgs.GameID = g.GameID
    WHERE pgs.PlayerID = NEW.PlayerID
    AND g.Season = (SELECT Season FROM Games WHERE GameID = NEW.GameID)
    GROUP BY pgs.PlayerID, g.Season, pgs.TeamID;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_player_season_stats
AFTER INSERT OR UPDATE ON PlayerGameStats
FOR EACH ROW
EXECUTE FUNCTION update_player_season_stats();

CREATE OR REPLACE FUNCTION update_team_season_stats()
RETURNS TRIGGER AS $$
DECLARE
    game_season VARCHAR(10);
    home_team INT;
    away_team INT;
    home_score INT;
    away_score INT;
BEGIN
    SELECT Season, HomeTeamID, AwayTeamID, HomeScore, AwayScore
    INTO game_season, home_team, away_team, home_score, away_score
    FROM Games WHERE GameID = NEW.GameID;

    DELETE FROM TeamSeasonStats WHERE TeamID = home_team AND Season = game_season;

    INSERT INTO TeamSeasonStats (TeamID, Season, Wins, Losses, PointsPerGame, ReboundsPerGame, AssistsPerGame)
    SELECT
        home_team,
        game_season,
        SUM(CASE WHEN (g.HomeTeamID = home_team AND g.HomeScore > g.AwayScore)
                   OR (g.AwayTeamID = home_team AND g.AwayScore > g.HomeScore)
                THEN 1 ELSE 0 END) as Wins,
        SUM(CASE WHEN (g.HomeTeamID = home_team AND g.HomeScore < g.AwayScore)
                   OR (g.AwayTeamID = home_team AND g.AwayScore < g.HomeScore)
                THEN 1 ELSE 0 END) as Losses,
        ROUND(AVG(tgs.Points), 2) as PointsPerGame,
        ROUND(AVG(tgs.Rebounds), 2) as ReboundsPerGame,
        ROUND(AVG(tgs.Assists), 2) as AssistsPerGame
    FROM TeamGameStats tgs
    JOIN Games g ON tgs.GameID = g.GameID
    WHERE tgs.TeamID = home_team AND g.Season = game_season
    GROUP BY tgs.TeamID;

    DELETE FROM TeamSeasonStats WHERE TeamID = away_team AND Season = game_season;

    INSERT INTO TeamSeasonStats (TeamID, Season, Wins, Losses, PointsPerGame, ReboundsPerGame, AssistsPerGame)
    SELECT
        away_team,
        game_season,
        SUM(CASE WHEN (g.HomeTeamID = away_team AND g.HomeScore > g.AwayScore)
                   OR (g.AwayTeamID = away_team AND g.AwayScore > g.HomeScore)
                THEN 1 ELSE 0 END) as Wins,
        SUM(CASE WHEN (g.HomeTeamID = away_team AND g.HomeScore < g.AwayScore)
                   OR (g.AwayTeamID = away_team AND g.AwayScore < g.HomeScore)
                THEN 1 ELSE 0 END) as Losses,
        ROUND(AVG(tgs.Points), 2) as PointsPerGame,
        ROUND(AVG(tgs.Rebounds), 2) as ReboundsPerGame,
        ROUND(AVG(tgs.Assists), 2) as AssistsPerGame
    FROM TeamGameStats tgs
    JOIN Games g ON tgs.GameID = g.GameID
    WHERE tgs.TeamID = away_team AND g.Season = game_season
    GROUP BY tgs.TeamID;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_season_stats
AFTER INSERT OR UPDATE ON TeamGameStats
FOR EACH ROW
EXECUTE FUNCTION update_team_season_stats();

CREATE OR REPLACE FUNCTION trade_player(
    p_player_id INT,
    p_from_team_id INT,
    p_to_team_id INT,
    p_contract_value DECIMAL(12,2) DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    transaction_id INT,
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_transaction_id INT;
    v_current_team INT;
BEGIN
    SELECT CurrentTeamID INTO v_current_team
    FROM Players WHERE PlayerID = p_player_id;

    IF v_current_team IS NULL THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'Player not found';
        RETURN;
    END IF;

    IF v_current_team != p_from_team_id THEN
        RETURN QUERY SELECT NULL::INT, FALSE,
            'Player is not on the specified team. Current team: ' || v_current_team::TEXT;
        RETURN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Teams WHERE TeamID = p_from_team_id) THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'From team does not exist';
        RETURN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Teams WHERE TeamID = p_to_team_id) THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'To team does not exist';
        RETURN;
    END IF;

    INSERT INTO PlayerTransactions (
        PlayerID, FromTeamID, ToTeamID, TransactionType,
        TransactionDate, ContractValue, Notes
    )
    VALUES (
        p_player_id, p_from_team_id, p_to_team_id, 'Trade',
        CURRENT_DATE, p_contract_value, p_notes
    )
    RETURNING TransactionID INTO v_transaction_id;

    UPDATE Players
    SET CurrentTeamID = p_to_team_id
    WHERE PlayerID = p_player_id;

    RETURN QUERY SELECT v_transaction_id, TRUE, 'Trade completed successfully';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sign_player(
    p_player_id INT,
    p_to_team_id INT,
    p_transaction_type VARCHAR(20),
    p_contract_value DECIMAL(12,2) DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    transaction_id INT,
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_transaction_id INT;
    v_current_team INT;
BEGIN
    SELECT CurrentTeamID INTO v_current_team
    FROM Players WHERE PlayerID = p_player_id;

    IF v_current_team IS NULL THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'Player not found';
        RETURN;
    END IF;

    IF p_transaction_type NOT IN ('Signing', 'Draft') THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'Invalid transaction type. Use Signing or Draft';
        RETURN;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Teams WHERE TeamID = p_to_team_id) THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'Team does not exist';
        RETURN;
    END IF;

    INSERT INTO PlayerTransactions (
        PlayerID, FromTeamID, ToTeamID, TransactionType,
        TransactionDate, ContractValue, Notes
    )
    VALUES (
        p_player_id, v_current_team, p_to_team_id, p_transaction_type,
        CURRENT_DATE, p_contract_value, p_notes
    )
    RETURNING TransactionID INTO v_transaction_id;

    UPDATE Players
    SET CurrentTeamID = p_to_team_id
    WHERE PlayerID = p_player_id;

    RETURN QUERY SELECT v_transaction_id, TRUE,
        p_transaction_type || ' completed successfully';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION waive_player(
    p_player_id INT,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    transaction_id INT,
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_transaction_id INT;
    v_current_team INT;
BEGIN
    SELECT CurrentTeamID INTO v_current_team
    FROM Players WHERE PlayerID = p_player_id;

    IF v_current_team IS NULL THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'Player not found';
        RETURN;
    END IF;

    IF v_current_team IS NULL THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'Player is already a free agent';
        RETURN;
    END IF;

    INSERT INTO PlayerTransactions (
        PlayerID, FromTeamID, ToTeamID, TransactionType,
        TransactionDate, ContractValue, Notes
    )
    VALUES (
        p_player_id, v_current_team, v_current_team, 'Waiver',
        CURRENT_DATE, NULL, p_notes
    )
    RETURNING TransactionID INTO v_transaction_id;

    UPDATE Players
    SET CurrentTeamID = NULL
    WHERE PlayerID = p_player_id;

    RETURN QUERY SELECT v_transaction_id, TRUE, 'Player waived successfully';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_new_player(
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    p_position VARCHAR(5),
    p_height INT,
    p_weight INT,
    p_date_of_birth DATE,
    p_draft_year INT,
    p_team_id INT DEFAULT NULL
)
RETURNS TABLE(
    player_id INT,
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_player_id INT;
BEGIN
    IF p_position NOT IN ('PG', 'SG', 'SF', 'PF', 'C') THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'Invalid position. Must be PG, SG, SF, PF, or C';
        RETURN;
    END IF;

    IF p_team_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Teams WHERE TeamID = p_team_id) THEN
        RETURN QUERY SELECT NULL::INT, FALSE, 'Team does not exist';
        RETURN;
    END IF;

    INSERT INTO Players (
        FirstName, LastName, Position, Height, Weight,
        DateOfBirth, DraftYear, CurrentTeamID
    )
    VALUES (
        p_first_name, p_last_name, p_position, p_height, p_weight,
        p_date_of_birth, p_draft_year, p_team_id
    )
    RETURNING PlayerID INTO v_player_id;

    RETURN QUERY SELECT v_player_id, TRUE, 'Player added successfully';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_player(
    p_player_id INT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Players WHERE PlayerID = p_player_id) THEN
        RETURN QUERY SELECT FALSE, 'Player not found';
        RETURN;
    END IF;

    DELETE FROM Players WHERE PlayerID = p_player_id;

    RETURN QUERY SELECT TRUE, 'Player removed successfully';
END;
$$ LANGUAGE plpgsql;
