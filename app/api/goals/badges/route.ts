import { NextResponse } from 'next/server';
import { goals } from '@/lib/goals';

// GET /api/goals/badges - Check for new badges
export async function GET() {
  const newlyUnlocked = goals.checkAndUnlockBadges();
  const badges = goals.getBadges();

  return NextResponse.json({
    newlyUnlocked,
    badges
  });
}
