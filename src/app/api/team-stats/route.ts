import { NextRequest, NextResponse } from 'next/server';
import { getTeamSeasonStats } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const teamId = searchParams.get('teamId');
  const season = searchParams.get('season');

  if (!teamId || !season) {
    return NextResponse.json({ error: 'Missing teamId or season' }, { status: 400 });
  }

  try {
    const stats = await getTeamSeasonStats(parseInt(teamId), season);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching team stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
