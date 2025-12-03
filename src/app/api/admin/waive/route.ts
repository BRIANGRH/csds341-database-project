import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { playerId } = await request.json();

    const result = await query(
      'SELECT * FROM waive_player($1)',
      [playerId]
    );

    const waiveResult = result.rows[0];

    return NextResponse.json({
      success: waiveResult.success,
      message: waiveResult.message,
      transactionId: waiveResult.transaction_id,
    });
  } catch (error) {
    console.error('Waive player error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to waive player' },
      { status: 500 }
    );
  }
}
