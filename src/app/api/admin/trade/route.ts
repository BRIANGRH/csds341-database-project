import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { playerId, fromTeamId, toTeamId } = await request.json();

    const result = await query(
      'SELECT * FROM trade_player($1, $2, $3)',
      [playerId, fromTeamId, toTeamId]
    );

    const tradeResult = result.rows[0];

    return NextResponse.json({
      success: tradeResult.success,
      message: tradeResult.message,
      transactionId: tradeResult.transaction_id,
    });
  } catch (error) {
    console.error('Trade error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to trade player' },
      { status: 500 }
    );
  }
}
