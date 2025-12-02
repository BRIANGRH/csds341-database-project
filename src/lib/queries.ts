import { query } from './db';
import {
  Team,
  Player,
  Game,
  PlayerGameStats,
  PlayerSeasonStats,
  TeamSeasonStats,
  PlayerTransaction,
  PlayerWithTeam,
  GameWithTeams,
  TeamWithStats,
  PlayerWithSeasonStats,
  StatsLeader,
  TeamStanding,
} from './types';

export async function getAllTeams(): Promise<Team[]> {
  const result = await query<Team>('SELECT * FROM Teams ORDER BY teamname');
  return result.rows;
}

export async function getTeamById(teamId: number): Promise<Team | null> {
  const result = await query<Team>('SELECT * FROM Teams WHERE teamid = $1', [teamId]);
  return result.rows[0] || null;
}

export async function getTeamsWithStats(season: string): Promise<TeamWithStats[]> {
  const sql = `
    SELECT
      t.*,
      tss.wins,
      tss.losses,
      CASE WHEN (tss.wins + tss.losses) > 0
        THEN ROUND(tss.wins::numeric / (tss.wins + tss.losses), 3)
        ELSE 0
      END as winpercentage,
      tss.pointspergame
    FROM Teams t
    LEFT JOIN TeamSeasonStats tss ON t.teamid = tss.teamid AND tss.season = $1
    ORDER BY winpercentage DESC, t.teamname
  `;
  const result = await query<TeamWithStats>(sql, [season]);
  return result.rows;
}

export async function getTeamStandings(season: string, conference?: 'East' | 'West'): Promise<TeamStanding[]> {
  let sql = `
    SELECT
      t.teamid,
      t.teamname,
      t.city,
      COALESCE(tss.wins, 0) as wins,
      COALESCE(tss.losses, 0) as losses,
      CASE WHEN (COALESCE(tss.wins, 0) + COALESCE(tss.losses, 0)) > 0
        THEN ROUND(COALESCE(tss.wins, 0)::numeric / (COALESCE(tss.wins, 0) + COALESCE(tss.losses, 0)), 3)
        ELSE 0
      END as winpercentage,
      COALESCE(tss.pointspergame, 0) as pointspergame
    FROM Teams t
    LEFT JOIN TeamSeasonStats tss ON t.teamid = tss.teamid AND tss.season = $1
  `;

  const params: any[] = [season];
  if (conference) {
    sql += ' WHERE t.conference = $2';
    params.push(conference);
  }

  sql += ' ORDER BY winpercentage DESC, wins DESC, t.teamname';

  const result = await query<TeamStanding>(sql, params);
  return result.rows;
}

export async function getAllPlayers(): Promise<PlayerWithTeam[]> {
  const sql = `
    SELECT
      p.*,
      t.teamname,
      t.city as teamcity
    FROM Players p
    LEFT JOIN Teams t ON p.currentteamid = t.teamid
    ORDER BY p.lastname, p.firstname
  `;
  const result = await query<PlayerWithTeam>(sql);
  return result.rows;
}

export async function getPlayerById(playerId: number): Promise<PlayerWithTeam | null> {
  const sql = `
    SELECT
      p.*,
      t.teamname,
      t.city as teamcity
    FROM Players p
    LEFT JOIN Teams t ON p.currentteamid = t.teamid
    WHERE p.playerid = $1
  `;
  const result = await query<PlayerWithTeam>(sql, [playerId]);
  return result.rows[0] || null;
}

export async function getPlayersByTeam(teamId: number): Promise<Player[]> {
  const result = await query<Player>(
    'SELECT * FROM Players WHERE currentteamid = $1 ORDER BY position, lastname',
    [teamId]
  );
  return result.rows;
}

export async function getPlayersByPosition(position: string): Promise<PlayerWithTeam[]> {
  const sql = `
    SELECT
      p.*,
      t.teamname,
      t.city as teamcity
    FROM Players p
    LEFT JOIN Teams t ON p.currentteamid = t.teamid
    WHERE p.position = $1
    ORDER BY p.lastname, p.firstname
  `;
  const result = await query<PlayerWithTeam>(sql, [position]);
  return result.rows;
}

export async function searchPlayers(searchTerm: string): Promise<PlayerWithTeam[]> {
  const sql = `
    SELECT
      p.*,
      t.teamname,
      t.city as teamcity
    FROM Players p
    LEFT JOIN Teams t ON p.currentteamid = t.teamid
    WHERE
      LOWER(p.firstname || ' ' || p.lastname) LIKE LOWER($1)
      OR LOWER(p.lastname) LIKE LOWER($1)
    ORDER BY p.lastname, p.firstname
    LIMIT 50
  `;
  const result = await query<PlayerWithTeam>(sql, [`%${searchTerm}%`]);
  return result.rows;
}

export async function getAllGames(): Promise<GameWithTeams[]> {
  const sql = `
    SELECT
      g.*,
      ht.teamname as hometeamname,
      ht.city as hometeamcity,
      at.teamname as awayteamname,
      at.city as awayteamcity
    FROM Games g
    JOIN Teams ht ON g.hometeamid = ht.teamid
    JOIN Teams at ON g.awayteamid = at.teamid
    ORDER BY g.gamedate DESC, g.gameid DESC
    LIMIT 100
  `;
  const result = await query<GameWithTeams>(sql);
  return result.rows;
}

export async function getGameById(gameId: number): Promise<GameWithTeams | null> {
  const sql = `
    SELECT
      g.*,
      ht.teamname as hometeamname,
      ht.city as hometeamcity,
      at.teamname as awayteamname,
      at.city as awayteamcity
    FROM Games g
    JOIN Teams ht ON g.hometeamid = ht.teamid
    JOIN Teams at ON g.awayteamid = at.teamid
    WHERE g.gameid = $1
  `;
  const result = await query<GameWithTeams>(sql, [gameId]);
  return result.rows[0] || null;
}

export async function getGamesBySeason(season: string): Promise<GameWithTeams[]> {
  const sql = `
    SELECT
      g.*,
      ht.teamname as hometeamname,
      ht.city as hometeamcity,
      at.teamname as awayteamname,
      at.city as awayteamcity
    FROM Games g
    JOIN Teams ht ON g.hometeamid = ht.teamid
    JOIN Teams at ON g.awayteamid = at.teamid
    WHERE g.season = $1
    ORDER BY g.gamedate DESC
  `;
  const result = await query<GameWithTeams>(sql, [season]);
  return result.rows;
}

export async function getGamesByTeam(teamId: number, limit: number = 10): Promise<GameWithTeams[]> {
  const sql = `
    SELECT
      g.*,
      ht.teamname as hometeamname,
      ht.city as hometeamcity,
      at.teamname as awayteamname,
      at.city as awayteamcity
    FROM Games g
    JOIN Teams ht ON g.hometeamid = ht.teamid
    JOIN Teams at ON g.awayteamid = at.teamid
    WHERE g.hometeamid = $1 OR g.awayteamid = $1
    ORDER BY g.gamedate DESC
    LIMIT $2
  `;
  const result = await query<GameWithTeams>(sql, [teamId, limit]);
  return result.rows;
}

export async function getPlayerSeasonStats(playerId: number, season: string): Promise<PlayerSeasonStats | null> {
  const result = await query<PlayerSeasonStats>(
    'SELECT * FROM PlayerSeasonStats WHERE playerid = $1 AND season = $2',
    [playerId, season]
  );
  return result.rows[0] || null;
}

export async function getPlayerAllSeasonStats(playerId: number): Promise<PlayerSeasonStats[]> {
  const result = await query<PlayerSeasonStats>(
    'SELECT * FROM PlayerSeasonStats WHERE playerid = $1 ORDER BY season DESC',
    [playerId]
  );
  return result.rows;
}

export async function getPlayerGameStats(playerId: number, limit: number = 10): Promise<PlayerGameStats[]> {
  const result = await query<PlayerGameStats>(
    `SELECT pgs.*
     FROM PlayerGameStats pgs
     JOIN Games g ON pgs.gameid = g.gameid
     WHERE pgs.playerid = $1
     ORDER BY g.gamedate DESC
     LIMIT $2`,
    [playerId, limit]
  );
  return result.rows;
}

export async function getGameBoxScore(gameId: number): Promise<PlayerGameStats[]> {
  const result = await query<PlayerGameStats>(
    'SELECT * FROM PlayerGameStats WHERE gameid = $1 ORDER BY points DESC',
    [gameId]
  );
  return result.rows;
}

export async function getPointsLeaders(season: string, limit: number = 10): Promise<StatsLeader[]> {
  const sql = `
    SELECT
      p.playerid,
      p.firstname,
      p.lastname,
      t.teamname,
      pss.avgpoints as value
    FROM PlayerSeasonStats pss
    JOIN Players p ON pss.playerid = p.playerid
    LEFT JOIN Teams t ON pss.teamid = t.teamid
    WHERE pss.season = $1
    ORDER BY pss.avgpoints DESC
    LIMIT $2
  `;
  const result = await query<StatsLeader>(sql, [season, limit]);
  return result.rows;
}

export async function getReboundsLeaders(season: string, limit: number = 10): Promise<StatsLeader[]> {
  const sql = `
    SELECT
      p.playerid,
      p.firstname,
      p.lastname,
      t.teamname,
      pss.avgrebounds as value
    FROM PlayerSeasonStats pss
    JOIN Players p ON pss.playerid = p.playerid
    LEFT JOIN Teams t ON pss.teamid = t.teamid
    WHERE pss.season = $1
    ORDER BY pss.avgrebounds DESC
    LIMIT $2
  `;
  const result = await query<StatsLeader>(sql, [season, limit]);
  return result.rows;
}

export async function getAssistsLeaders(season: string, limit: number = 10): Promise<StatsLeader[]> {
  const sql = `
    SELECT
      p.playerid,
      p.firstname,
      p.lastname,
      t.teamname,
      pss.avgassists as value
    FROM PlayerSeasonStats pss
    JOIN Players p ON pss.playerid = p.playerid
    LEFT JOIN Teams t ON pss.teamid = t.teamid
    WHERE pss.season = $1
    ORDER BY pss.avgassists DESC
    LIMIT $2
  `;
  const result = await query<StatsLeader>(sql, [season, limit]);
  return result.rows;
}

export async function getPlayerTransactions(playerId: number): Promise<PlayerTransaction[]> {
  const result = await query<PlayerTransaction>(
    'SELECT * FROM PlayerTransactions WHERE playerid = $1 ORDER BY transactiondate DESC',
    [playerId]
  );
  return result.rows;
}

export async function getRecentTransactions(limit: number = 20): Promise<PlayerTransaction[]> {
  const result = await query<PlayerTransaction>(
    'SELECT * FROM PlayerTransactions ORDER BY transactiondate DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}

export async function getDashboardStats() {
  const totalTeams = await query('SELECT COUNT(*) as count FROM Teams');
  const totalPlayers = await query('SELECT COUNT(*) as count FROM Players');
  const totalGames = await query('SELECT COUNT(*) as count FROM Games');
  const recentGames = await getAllGames();

  return {
    totalTeams: totalTeams.rows[0].count,
    totalPlayers: totalPlayers.rows[0].count,
    totalGames: totalGames.rows[0].count,
    recentGames: recentGames.slice(0, 5),
  };
}

export async function getAvailableSeasons(): Promise<string[]> {
  const result = await query<{ season: string }>(
    'SELECT DISTINCT season FROM Games ORDER BY season DESC'
  );
  return result.rows.map(row => row.season);
}

export async function getTeamSeasonStats(teamId: number, season: string): Promise<TeamSeasonStats | null> {
  const result = await query<TeamSeasonStats>(
    'SELECT * FROM TeamSeasonStats WHERE teamid = $1 AND season = $2',
    [teamId, season]
  );
  return result.rows[0] || null;
}
