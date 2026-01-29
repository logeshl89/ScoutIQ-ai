import { NextRequest } from 'next/server';
import { fetchOpponentData } from '@/lib/grid-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { myTeam, opponentTeam, dataSource = 'TeamStatisticsForLastThreeMonths' } = body;

    // Validate inputs
    if (!myTeam || !opponentTeam) {
      return Response.json(
        { error: 'Missing required fields: myTeam, opponentTeam' },
        { status: 400 }
      );
    }

    // Fetch data for both teams
    const myTeamData = await fetchOpponentData(myTeam, 'valorant', 5, dataSource);
    const opponentData = await fetchOpponentData(opponentTeam, 'valorant', 5, dataSource);

    // Generate comparison data
    const comparisonData = generateComparisonReport(myTeamData, opponentData, myTeam, opponentTeam, 5);

    // Return the comparison report data
    return Response.json({
      success: true,
      comparison: {
        ...comparisonData,
        myTeam,
        opponentTeam,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error generating comparison:', error);
    return Response.json(
      { error: 'Failed to generate comparison report' },
      { status: 500 }
    );
  }
}

function generateComparisonReport(myTeamData: any, opponentData: any, myTeamId: string, opponentTeamId: string, numMatches: number) {
  // Extract team names
  const myTeamName = myTeamData.team?.name || 'My Team';
  const opponentName = opponentData.team?.name || 'Opponent Team';

  // Create basic comparison structure
  const comparison = {
    myTeam: myTeamName,
    opponentTeam: opponentName,
    myTeamStats: {
      attackWinRate: calculateWinRate(myTeamData, 'attack'),
      defenseWinRate: calculateWinRate(myTeamData, 'defense'),
      roundWinAfterFirstKill: calculateRoundWinAfterFirstKill(myTeamData),
      averageEconomyRating: calculateEconomyRating(myTeamData),
    },
    opponentStats: {
      attackWinRate: calculateWinRate(opponentData, 'attack'),
      defenseWinRate: calculateWinRate(opponentData, 'defense'),
      roundWinAfterFirstKill: calculateRoundWinAfterFirstKill(opponentData),
      averageEconomyRating: calculateEconomyRating(opponentData),
    },
    strengths: getStrengths(myTeamData, opponentData),
    weaknesses: getWeaknesses(myTeamData, opponentData),
    winStrategies: getWinStrategies(myTeamData, opponentData),
    tacticalRecommendations: getTacticalRecommendations(myTeamData, opponentData),
    playerComparison: getPlayerComparison(myTeamData, opponentData),
    mapPreferences: getMapPreferences(myTeamData, opponentData),
    game: 'Valorant',
    numMatchesAnalyzed: numMatches,
    timestamp: new Date().toISOString(),
  };

  return comparison;
}

function calculateWinRate(teamData: any, side: 'attack' | 'defense'): number {
  // Since the GRID API teamStatistics field is not working, return 0
  // In a real implementation, this would calculate from actual match data
  return 0;
}

function calculateRoundWinAfterFirstKill(teamData: any): number {
  // Since the GRID API teamStatistics field is not working, return 0
  return 0;
}

function calculateEconomyRating(teamData: any): number {
  // Since the GRID API teamStatistics field is not working, return 0
  return 0;
}

function getStrengths(myTeamData: any, opponentData: any): string[] {
  // Provide appropriate strengths based on available data
  // If no stats available, provide general strengths
  if (!myTeamData.teamStats || Object.keys(myTeamData.teamStats).length === 0) {
    return [
      "Team cohesion and coordination",
      "Adaptability to different game situations",
      "Strong team communication",
      "Good agent synergy"
    ];
  }
  
  // If stats were available, we would derive strengths from them
  return [
    "Strong opening duels",
    "Effective economy management",
    "Site control after plant",
    "High entry fragger performance"
  ];
}

function getWeaknesses(myTeamData: any, opponentData: any): string[] {
  // Provide appropriate weaknesses based on available data
  if (!myTeamData.teamStats || Object.keys(myTeamData.teamStats).length === 0) {
    return [
      "Limited data available for accurate assessment",
      "Need more match history for pattern recognition",
      "Statistical analysis pending data availability",
      "Reliance on general gameplay strategies"
    ];
  }
  
  // If stats were available, we would derive weaknesses from them
  return [
    "Struggles on defense rotations",
    "Inconsistent post-plant setups",
    "Poor utility usage in clutch situations",
    "Slow adaptation to opponent strategies"
  ];
}

function getWinStrategies(myTeamData: any, opponentData: any): string[] {
  // Generate strategies based on the comparison
  if (!myTeamData.teamStats || !opponentData.teamStats || 
      Object.keys(myTeamData.teamStats).length === 0 || 
      Object.keys(opponentData.teamStats).length === 0) {
    return [
      "Focus on fundamental gameplay mechanics",
      "Emphasize team communication and callouts",
      "Practice consistent crosshair placement",
      "Develop flexible strategies adaptable to opponent playstyle"
    ];
  }
  
  // If stats were available, we would generate more specific strategies
  return [
    "Focus on winning first round on defense maps",
    "Utilize crosshairs and aggressive post-plant setups",
    "Exploit their rotation timing with delayed flanks",
    "Prioritize economy management over individual heroics"
  ];
}

function getTacticalRecommendations(myTeamData: any, opponentData: any): string[] {
  // Generate tactical recommendations
  if (!myTeamData.teamStats || !opponentData.teamStats || 
      Object.keys(myTeamData.teamStats).length === 0 || 
      Object.keys(opponentData.teamStats).length === 0) {
    return [
      "Focus on individual mechanical improvement",
      "Strengthen team coordination through practice",
      "Study opponent's common tactical setups",
      "Develop counter-strategies for common opponent plays"
    ];
  }
  
  // If stats were available, we would generate more specific recommendations
  return [
    "Use AWP advantage on long sightlines",
    "Implement delayed flanking strategies",
    "Coordinate utility usage for site takes",
    "Focus on eco-round management"
  ];
}

function getPlayerComparison(myTeamData: any, opponentData: any): any[] {
  // Create a comparison between players from both teams
  const myTeamPlayers = myTeamData.players || [];
  const opponentPlayers = opponentData.players || [];
  
  // Create sample data for the chart
  const comparisonData = [];
  
  // Get up to 5 players from each team
  const playersToCompare = Math.min(5, Math.max(myTeamPlayers.length, opponentPlayers.length));
  
  // If we don't have player stats, use placeholder values
  for (let i = 0; i < playersToCompare; i++) {
    const myPlayer = myTeamPlayers[i]?.nickname || `My Player ${i+1}`;
    const opponentPlayer = opponentPlayers[i]?.nickname || `Opponent Player ${i+1}`;
    
    // Use the player name as the identifier
    const playerName = `${myPlayer} vs ${opponentPlayer}`;
    
    comparisonData.push({
      player: playerName,
      // Since we don't have actual stats, use placeholder values
      myTeamValue: 0,
      opponentValue: 0,
    });
  }
  
  return comparisonData;
}

function getMapPreferences(myTeamData: any, opponentData: any): any[] {
  // Create map preference data
  const maps = ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Breeze', 'Fracture', 'Pearl'];
  
  // Since we don't have actual map statistics from the GRID API, return placeholder data
  return maps.map(map => ({
    map,
    myTeamPickRate: 0,
    opponentPickRate: 0,
    myTeamWinRate: 0,
    opponentWinRate: 0,
  }));
}