import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { playerId } = await request.json();

    const result = await query(
      'SELECT * FROM remove_player($1)',
      [playerId]
    );

    const removeResult = result.rows[0];

    return NextResponse.json({
      success: removeResult.success,
      message: removeResult.message,
    });
  } catch (error) {
    console.error('Remove player error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove player' },
      { status: 500 }
    );
  }
}
