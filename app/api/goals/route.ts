import { NextResponse } from 'next/server';
import { goals } from '@/lib/goals';

// GET /api/goals - Get all goal data
export async function GET() {
  const weeklyGoal = goals.getWeeklyGoal();
  const monthlyStats = goals.getMonthlyStats();
  const badges = goals.getBadges();

  return NextResponse.json({
    weeklyGoal,
    monthlyStats,
    badges,
    progress: goals.getCurrentProgress(),
    goalReached: goals.checkGoalReached()
  });
}

// POST /api/goals/weekly - Update weekly goal
export async function POST(request: Request) {
  try {
    const { targetKm } = await request.json();
    
    if (typeof targetKm !== 'number' || targetKm <= 0) {
      return NextResponse.json(
        { error: 'Invalid target distance' },
        { status: 400 }
      );
    }

    goals.setWeeklyGoal(targetKm);
    
    return NextResponse.json({
      success: true,
      weeklyGoal: goals.getWeeklyGoal()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}
