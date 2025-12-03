import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, position, height, weight } = await request.json();

    const result = await query(
      'SELECT * FROM add_new_player($1, $2, $3, $4, $5, $6, $7)',
      [firstName, lastName, position, height, weight, '2000-01-01', 2024]
    );

    const playerResult = result.rows[0];

    return NextResponse.json({
      success: playerResult.success,
      message: playerResult.message,
      playerId: playerResult.player_id,
    });
  } catch (error) {
    console.error('Add player error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add player' },
      { status: 500 }
    );
  }
}
