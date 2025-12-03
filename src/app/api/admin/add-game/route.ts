import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { homeTeamId, awayTeamId, homeScore, awayScore, gameDate, season, gameType } = await request.json();

    const result = await query(
      `INSERT INTO Games (HomeTeamID, AwayTeamID, HomeScore, AwayScore, GameDate, Season, GameType)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING GameID`,
      [homeTeamId, awayTeamId, homeScore, awayScore, gameDate, season, gameType]
    );

    const gameId = result.rows[0].gameid;

    return NextResponse.json({
      success: true,
      message: `Game added successfully (ID: ${gameId})`,
      gameId,
    });
  } catch (error) {
    console.error('Add game error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add game' },
      { status: 500 }
    );
  }
}
