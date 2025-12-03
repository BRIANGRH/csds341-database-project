import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { playerId, toTeamId, transactionType } = await request.json();

    const result = await query(
      'SELECT * FROM sign_player($1, $2, $3)',
      [playerId, toTeamId, transactionType]
    );

    const signResult = result.rows[0];

    return NextResponse.json({
      success: signResult.success,
      message: signResult.message,
      transactionId: signResult.transaction_id,
    });
  } catch (error) {
    console.error('Sign player error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to sign player' },
      { status: 500 }
    );
  }
}
