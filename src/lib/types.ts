export interface Team {
  teamid: number;
  teamname: string;
  city: string;
  conference: 'East' | 'West';
  division: string;
  foundedyear: number;
}

export interface Player {
  playerid: number;
  firstname: string;
  lastname: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  height: number;
  weight: number;
  dateofbirth: Date;
  draftyear: number;
  currentteamid: number | null;
}

export interface Game {
  gameid: number;
  gamedate: Date;
  hometeamid: number;
  awayteamid: number;
  homescore: number;
  awayscore: number;
  season: string;
  gametype: 'Regular' | 'Playoff';
}

export interface PlayerGameStats {
  statid: number;
  playerid: number;
  gameid: number;
  teamid: number;
  minutesplayed: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldgoalsmade: number;
  fieldgoalsattempted: number;
  threepointersmade: number;
  threepointersattempted: number;
  freethrowsmade: number;
  freethrowsattempted: number;
}

export interface PlayerSeasonStats {
  playerid: number;
  season: string;
  teamid: number;
  gamesplayed: number;
  avgpoints: number;
  avgrebounds: number;
  avgassists: number;
  avgsteals: number;
  avgblocks: number;
  fieldgoalpercentage: number;
  threepointpercentage: number;
  freethrowpercentage: number;
}

export interface TeamGameStats {
  teamid: number;
  gameid: number;
  points: number;
  rebounds: number;
  assists: number;
  fieldgoalpercentage: number;
  threepointpercentage: number;
  turnovers: number;
}

export interface TeamSeasonStats {
  teamid: number;
  season: string;
  wins: number;
  losses: number;
  pointspergame: number;
  reboundspergame: number;
  assistspergame: number;
}

export interface PlayerTransaction {
  transactionid: number;
  playerid: number;
  fromteamid: number | null;
  toteamid: number;
  transactiontype: 'Trade' | 'Signing' | 'Waiver' | 'Draft';
  transactiondate: Date;
  contractvalue: number | null;
  notes: string | null;
}

export interface PlayerWithTeam extends Player {
  teamname?: string;
  teamcity?: string;
}

export interface GameWithTeams extends Game {
  hometeamname?: string;
  awayteamname?: string;
  hometeamcity?: string;
  awayteamcity?: string;
}

export interface PlayerGameStatsWithDetails extends PlayerGameStats {
  playerfirstname?: string;
  playerlastname?: string;
  teamname?: string;
}

export interface TeamWithStats extends Team {
  wins?: number;
  losses?: number;
  winpercentage?: number;
  pointspergame?: number;
}

export interface PlayerWithSeasonStats extends Player {
  gamesplayed?: number;
  avgpoints?: number;
  avgrebounds?: number;
  avgassists?: number;
}

export interface StatsLeader {
  playerid: number;
  firstname: string;
  lastname: string;
  teamname: string;
  value: number;
}

export interface TeamStanding {
  teamid: number;
  teamname: string;
  city: string;
  wins: number;
  losses: number;
  winpercentage: number;
  pointspergame: number;
}
