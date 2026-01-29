import { NextRequest } from 'next/server';
import { fetchTeams } from '@/lib/grid-api';

export async function GET(request: NextRequest) {
  try {
    // Fetch all teams from GRID API without filtering
    const teams = await fetchTeams();
    
    console.log('Fetched teams count:', teams.length); // Debug log
    console.log('First few teams:', teams.slice(0, 5)); // Debug log
    
    return Response.json({
      success: true,
      teams: teams,
      count: teams.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return Response.json(
      { 
        error: 'Failed to fetch teams from GRID API',
        success: false 
      },
      { status: 500 }
    );
  }
}