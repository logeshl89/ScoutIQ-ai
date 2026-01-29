// GRID API Client for fetching esports match data
const GRID_API_KEY = '1FHRik8xJlH05GtcTO5DUdaKizX2sfydWvLLEBQ9';
const GRID_API_URL = 'https://api-op.grid.gg/central-data/graphql'; // Open Access URL

interface GridApiResponse {
  data?: any;
  errors?: Array<{ message: string; locations?: Array<{ line: number; column: number }>; path?: string[] }>;
}

/**
 * Fetch teams from GRID API using the proper teams query
 */
export async function fetchTeams(): Promise<any[]> {
  try {
    console.log('Fetching teams from GRID API...'); // Debug log
    
    const query = `
      query GetTeams {
        teams(first: 50) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `;

    const response = await fetch(GRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GRID_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: {}
      })
    });

    console.log('GRID API response status:', response.status); // Debug log

    if (!response.ok) {
      throw new Error(`GRID API request failed with status ${response.status}`);
    }

    const result: GridApiResponse = await response.json();
    
    console.log('GRID API result keys:', Object.keys(result)); // Debug log
    console.log('GRID API data teams:', result.data?.teams?.edges?.length || 0); // Debug log

    if (result.errors && result.errors.length > 0) {
      console.error('GRID API errors:', result.errors);
      throw new Error(`GRID API error: ${result.errors[0].message}`);
    }

    // Return all teams without filtering
    const allTeams = result.data?.teams?.edges?.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name
    })) || [];

    console.log('Processed teams count:', allTeams.length); // Debug log
    
    return allTeams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    return []; // Return empty array on error
  }
}

/**
 * Fetch opponent match data from GRID API
 * @param opponentTeam - Name of the opponent team
 * @param game - Game to analyze ('valorant' or 'league')
 * @param numMatches - Number of recent matches to fetch
 */
export async function fetchOpponentData(opponentTeam: string, game: string, numMatches: number, dataSource: 'TeamStatisticsForLastThreeMonths' | 'TeamStatisticsForChosenTournaments' | 'PlayerStatisticsForLastThreeMonths' | 'PlayerStatisticsForChosenTournaments' = 'TeamStatisticsForLastThreeMonths', tournamentIds?: string[]): Promise<any> {
  try {
    console.log(`Fetching data for opponent: ${opponentTeam}`);
    
    // First, fetch teams to get the correct team
    const teams = await fetchTeams();
    console.log(`Found ${teams.length} teams total`);
    
    // Find the team by name
    const team = teams.find((t: any) => 
      t.name.toLowerCase().includes(opponentTeam.toLowerCase()) ||
      opponentTeam.toLowerCase().includes(t.name.toLowerCase())
    );

    if (!team) {
      console.warn(`Team ${opponentTeam} not found in GRID API teams`);
      // Return empty data structure instead of mock data
      return {
        team: {
          id: '',
          name: opponentTeam,
          players: { edges: [] },
          stats: {}
        },
        players: {}
      };
    }

    console.log(`Found team: ${team.name} with ID: ${team.id}`);

    // Now fetch team roster (players)
    const teamRoster = await fetchTeamRoster(team.id);
    console.log('Team roster result:', teamRoster.length, teamRoster); // Debug log
    
    // Fetch team statistics with data source
    const teamStats = await fetchTeamStatisticsWithSource(team.id, dataSource, tournamentIds);
    console.log('Team stats result:', Object.keys(teamStats).length, teamStats); // Debug log
    
    // Fetch player statistics for each player in the roster with data source
    const playerStats: Record<string, any> = {};
    for (const player of teamRoster) {
      playerStats[player.id] = await fetchPlayerStatisticsWithSource(player.id, dataSource, tournamentIds);
    }
    console.log('Player stats result:', Object.keys(playerStats).length, playerStats); // Debug log
    
    // Process the data to generate insights
    const processedData = {
      team: {
        ...team,
        players: { edges: teamRoster.map(p => ({ node: p })) },
        stats: teamStats,
      },
      players: playerStats
    };
    
    return processedData;
    
  } catch (error) {
    console.error('Error in fetchOpponentData:', error);
    // Return empty data structure instead of mock data
    return {
      team: {
        id: '',
        name: opponentTeam,
        players: { edges: [] },
        stats: {}
      },
      players: {}
    };
  }
}

/**
 * Fetch team roster (players)
 */
async function fetchTeamRoster(teamId: string): Promise<any[]> {
  try {
    console.log(`Fetching roster for team ID: ${teamId}`);
    
    const query = `
      query GetTeamRoster($teamId: ID!) {
        players(filter: {teamIdFilter: {id: $teamId}}) {
          edges {
            node {
              id
              nickname
              title {
                name
              }
            }
          }
        }
      }
    `;
    
    const response = await fetch(GRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GRID_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { teamId }
      })
    });
    
    if (!response.ok) {
      throw new Error(`GRID API request failed with status ${response.status}`);
    }
    
    const result: GridApiResponse = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      console.error('GRID API errors:', result.errors);
      // Don't throw error, just return empty array
      return [];
    }
    
    const players = result.data?.players?.edges?.map((edge: any) => ({
      id: edge.node.id,
      nickname: edge.node.nickname,
      title: edge.node.title?.name || ''
    })) || [];
    
    console.log(`Found ${players.length} players for team ${teamId}`);
    return players;
  } catch (error) {
    console.error('Error fetching team roster:', error);
    return [];
  }
}

/**
 * Fetch team statistics
 */
async function fetchTeamStatistics(teamId: string): Promise<any> {
  try {
    // Use the exact query from the API documentation
    const query = `
      query TeamStatisticsForLastThreeMonths($teamId: ID!) {
        teamStatistics(teamId: $teamId, filter: { timeWindow: LAST_3_MONTHS }) {
          id
          aggregationSeriesIds
          series {
            count
            kills {
              sum
              avg
            }
          }
          game {
            count
            wins {
              value
              count
              percentage
              streak {
                min
                max
                current
              }
            }
          }
          segment {
            type
            count
            deaths {
              sum
              avg
            }
          }
        }
      }
    `;
    
    const response = await fetch(GRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GRID_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { teamId }
      })
    });
    
    if (!response.ok) {
      throw new Error(`GRID API request failed with status ${response.status}`);
    }
    
    const result: GridApiResponse = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      console.error('GRID API errors:', result.errors);
      return {};
    }
    
    const stats = result.data?.teamStatistics;
    if (stats) {
      return {
        matchCount: stats.series?.count || 0,
        winPercentage: stats.game?.wins?.[0]?.percentage || 0,
        avgKills: stats.series?.kills?.avg || 0,
        avgDeaths: stats.segment?.[0]?.deaths?.avg || 0,
        segmentData: stats.segment || []
      };
    }
    
    return {};
  } catch (error) {
    console.error('Error fetching team statistics:', error);
    return {};
  }
}

/**
 * Fetch player statistics
 */
async function fetchPlayerStatistics(playerId: string): Promise<any> {
  try {
    // Use the exact query from the API documentation
    const query = `
      query PlayerStatisticsForLastThreeMonths($playerId: ID!) {
        playerStatistics(playerId: $playerId, filter: { timeWindow: LAST_3_MONTHS }) {
          id
          aggregationSeriesIds
          series {
            count
            kills {
              sum
              avg
            }
          }
          game {
            count
            wins {
              value
              count
              percentage
              streak {
                min
                max
                current
              }
            }
          }
          segment {
            type
            count
            deaths {
              sum
              avg
            }
          }
        }
      }
    `;
    
    const response = await fetch(GRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GRID_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { playerId }
      })
    });
    
    if (!response.ok) {
      throw new Error(`GRID API request failed with status ${response.status}`);
    }
    
    const result: GridApiResponse = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      console.error('GRID API errors:', result.errors);
      return {};
    }
    
    const stats = result.data?.playerStatistics;
    if (stats) {
      return {
        winPercentage: stats.game?.wins?.[0]?.percentage || 0,
        avgKills: stats.series?.kills?.avg || 0,
        avgDeaths: stats.segment?.[0]?.deaths?.avg || 0
      };
    }
    
    return {};
  } catch (error) {
    console.error('Error fetching player statistics:', error);
    return {};
  }
}


// New functions for different data sources
export async function fetchTeamStatisticsLast3Months(teamId: string): Promise<any> {
  try {
    const query = `
      query TeamStatisticsForLastThreeMonths($teamId: ID!) {
        teamStatistics(teamId: $teamId, filter: { timeWindow: LAST_3_MONTHS }) {
          id
          aggregationSeriesIds
          series {
            count
            kills {
              sum
              min
              max
              avg
            }
          }
          game {
            count
            wins {
              value
              count
              percentage
              streak {
                min
                max
                current
              }
            }
          }
          segment {
            type
            count
            deaths {
              sum
              min
              max
              avg
            }
          }
        }
      }
    `;
    
    const response = await fetch(GRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GRID_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { teamId }
      })
    });
    
    if (!response.ok) {
      throw new Error(`GRID API request failed with status ${response.status}`);
    }
    
    const result: GridApiResponse = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      console.error('GRID API errors:', result.errors);
      return {};
    }
    
    return result.data?.teamStatistics || {};
  } catch (error) {
    console.error('Error fetching team statistics (last 3 months):', error);
    return {};
  }
}

export async function fetchTeamStatisticsChosenTournaments(teamId: string, tournamentIds: string[]): Promise<any> {
  try {
    const query = `
      query TeamStatisticsForChosenTournaments($teamId: ID!, $tournamentIds: [ID!]!) {
        teamStatistics(teamId: $teamId, filter: { tournamentIds: { in: $tournamentIds } }) {
          id
          aggregationSeriesIds
          series {
            count
            kills {
              sum
              min
              max
              avg
            }
          }
          game {
            count
            wins {
              value
              count
              percentage
              streak {
                min
                max
                current
              }
            }
          }
          segment {
            type
            count
            deaths {
              sum
              min
              max
              avg
            }
          }
        }
      }
    `;
    
    const response = await fetch(GRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GRID_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { teamId, tournamentIds }
      })
    });
    
    if (!response.ok) {
      throw new Error(`GRID API request failed with status ${response.status}`);
    }
    
    const result: GridApiResponse = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      console.error('GRID API errors:', result.errors);
      return {};
    }
    
    return result.data?.teamStatistics || {};
  } catch (error) {
    console.error('Error fetching team statistics (chosen tournaments):', error);
    return {};
  }
}

export async function fetchPlayerStatisticsLast3Months(playerId: string): Promise<any> {
  try {
    const query = `
      query PlayerStatisticsForLastThreeMonths($playerId: ID!) {
        playerStatistics(playerId: $playerId, filter: { timeWindow: LAST_3_MONTHS }) {
          id
          aggregationSeriesIds
          series {
            count
            kills {
              sum
              min
              max
              avg
            }
          }
          game {
            count
            wins {
              value
              count
              percentage
              streak {
                min
                max
                current
              }
            }
          }
          segment {
            type
            count
            deaths {
              sum
              min
              max
              avg
            }
          }
        }
      }
    `;
    
    const response = await fetch(GRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GRID_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { playerId }
      })
    });
    
    if (!response.ok) {
      throw new Error(`GRID API request failed with status ${response.status}`);
    }
    
    const result: GridApiResponse = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      console.error('GRID API errors:', result.errors);
      return {};
    }
    
    return result.data?.playerStatistics || {};
  } catch (error) {
    console.error('Error fetching player statistics (last 3 months):', error);
    return {};
  }
}

export async function fetchPlayerStatisticsChosenTournaments(playerId: string, tournamentIds: string[]): Promise<any> {
  try {
    const query = `
      query PlayerStatisticsForChosenTournaments($playerId: ID!, $tournamentIds: [ID!]!) {
        playerStatistics(playerId: $playerId, filter: { tournamentIds: { in: $tournamentIds } }) {
          id
          aggregationSeriesIds
          series {
            count
            kills {
              sum
              min
              max
              avg
            }
          }
          game {
            count
            wins {
              value
              count
              percentage
              streak {
                min
                max
                current
              }
            }
          }
          segment {
            type
            count
            deaths {
              sum
              min
              max
              avg
            }
          }
        }
      }
    `;
    
    const response = await fetch(GRID_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GRID_API_KEY,
      },
      body: JSON.stringify({
        query,
        variables: { playerId, tournamentIds }
      })
    });
    
    if (!response.ok) {
      throw new Error(`GRID API request failed with status ${response.status}`);
    }
    
    const result: GridApiResponse = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      console.error('GRID API errors:', result.errors);
      return {};
    }
    
    return result.data?.playerStatistics || {};
  } catch (error) {
    console.error('Error fetching player statistics (chosen tournaments):', error);
    return {};
  }
}

// Updated main functions to support data source selection
export async function fetchTeamStatisticsWithSource(teamId: string, dataSource: 'TeamStatisticsForLastThreeMonths' | 'TeamStatisticsForChosenTournaments' | 'PlayerStatisticsForLastThreeMonths' | 'PlayerStatisticsForChosenTournaments' = 'TeamStatisticsForLastThreeMonths', tournamentIds?: string[]): Promise<any> {
  // Map the data source options to the appropriate functions
  switch (dataSource) {
    case 'TeamStatisticsForLastThreeMonths':
      return fetchTeamStatisticsLast3Months(teamId);
    case 'TeamStatisticsForChosenTournaments':
      return tournamentIds ? fetchTeamStatisticsChosenTournaments(teamId, tournamentIds) : fetchTeamStatisticsLast3Months(teamId);
    case 'PlayerStatisticsForLastThreeMonths':
      // For player statistics, we'll still fetch team stats but the player data will use player-specific queries
      return fetchTeamStatisticsLast3Months(teamId);
    case 'PlayerStatisticsForChosenTournaments':
      // For player statistics, we'll still fetch team stats but the player data will use player-specific queries
      return tournamentIds ? fetchTeamStatisticsChosenTournaments(teamId, tournamentIds) : fetchTeamStatisticsLast3Months(teamId);
    default:
      return fetchTeamStatisticsLast3Months(teamId);
  }
}

export async function fetchPlayerStatisticsWithSource(playerId: string, dataSource: 'TeamStatisticsForLastThreeMonths' | 'TeamStatisticsForChosenTournaments' | 'PlayerStatisticsForLastThreeMonths' | 'PlayerStatisticsForChosenTournaments' = 'TeamStatisticsForLastThreeMonths', tournamentIds?: string[]): Promise<any> {
  // Map the data source options to the appropriate functions
  switch (dataSource) {
    case 'TeamStatisticsForLastThreeMonths':
    case 'TeamStatisticsForChosenTournaments':
      // For team-based data sources, we'll use player stats for the last 3 months
      return fetchPlayerStatisticsLast3Months(playerId);
    case 'PlayerStatisticsForLastThreeMonths':
      return fetchPlayerStatisticsLast3Months(playerId);
    case 'PlayerStatisticsForChosenTournaments':
      return tournamentIds ? fetchPlayerStatisticsChosenTournaments(playerId, tournamentIds) : fetchPlayerStatisticsLast3Months(playerId);
    default:
      return fetchPlayerStatisticsLast3Months(playerId);
  }
}


/**
 * Generate mock data when GRID API is not available
 * This simulates what real GRID data might look like
 */
function getMockData(opponentTeam: string, game: string, numMatches: number) {
  console.warn(`Using mock data for ${opponentTeam} (${game}) - ${numMatches} matches`);
  
  // Simulate delay to mimic API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        teamStrategy: {
          attackWinRate: Math.floor(Math.random() * 30) + 55,
          defenseWinRate: Math.floor(Math.random() * 30) + 55,
          earlyAggression: 65,
          lateGameFocus: 45,
          pistolWinRate: Math.floor(Math.random() * 30) + 55,
          objectivePriority: [`${game === 'league' ? 'Dragon Control' : 'Site Control'}`, `${game === 'league' ? 'Baron Control' : 'Entry Frags'}`, `${game === 'league' ? 'Tower Priority' : 'Utility Denial'}`]
        },
        playerTendencies: [
          {
            name: 'Player 1',
            role: game === 'league' ? 'TOP' : 'ENTRY_FRAGGER',
            championPool: [game === 'league' ? 'Garen' : 'Jett'],
            winRate: Math.floor(Math.random() * 30) + 55,
            aggression: Math.floor(Math.random() * 30) + 70,
          },
          {
            name: 'Player 2',
            role: game === 'league' ? 'JUNGLE' : 'INITIATOR',
            championPool: [game === 'league' ? 'Lee Sin' : 'Breach'],
            winRate: Math.floor(Math.random() * 30) + 55,
            aggression: Math.floor(Math.random() * 30) + 60,
          },
          {
            name: 'Player 3',
            role: game === 'league' ? 'MID' : 'CONTROLLER',
            championPool: [game === 'league' ? 'Yasuo' : 'Omen'],
            winRate: Math.floor(Math.random() * 30) + 55,
            aggression: Math.floor(Math.random() * 30) + 65,
          },
          {
            name: 'Player 4',
            role: game === 'league' ? 'ADC' : 'DUELIST',
            championPool: [game === 'league' ? 'Jinx' : 'Reyna'],
            winRate: Math.floor(Math.random() * 30) + 55,
            aggression: Math.floor(Math.random() * 30) + 55,
          },
          {
            name: 'Player 5',
            role: game === 'league' ? 'SUPPORT' : 'SENTINEL',
            championPool: [game === 'league' ? 'Thresh' : 'Sage'],
            winRate: Math.floor(Math.random() * 30) + 55,
            aggression: Math.floor(Math.random() * 30) + 40,
          },
        ],
        compositions: [
          { name: 'Standard Formation', frequency: 40, winRate: Math.floor(Math.random() * 30) + 55 },
          { name: 'Aggressive Push', frequency: 30, winRate: Math.floor(Math.random() * 30) + 50 },
          { name: 'Defensive Setup', frequency: 20, winRate: Math.floor(Math.random() * 30) + 58 },
          { name: 'Split Push', frequency: 10, winRate: Math.floor(Math.random() * 30) + 53 }
        ],
        actionableInsights: [
          {
            title: `Exploit ${game === 'league' ? 'Early Game' : 'Pistol Round'} Weakness`,
            description: `${opponentTeam} struggles in the early phase of matches with a ${game === 'league' ? 'CS deficit' : 'round loss'} rate. Focus early pressure tactics.`,
            confidence: 'High'
          },
          {
            title: `Target ${game === 'league' ? 'Bot Lane' : 'Support Player'}`,
            description: `${opponentTeam}'s ${game === 'league' ? 'ADC' : 'support player'} has a lower performance compared to other roles. Focus early ganks/duels on this player.`,
            confidence: 'Medium'
          }
        ],
        supportingData: [
          { metric: `Average Game Duration`, value: `${Math.floor(Math.random() * 15) + 30} min`, trend: 'Steady' },
          { metric: `${game === 'league' ? 'Dragon Control' : 'Site Control'} Rate`, value: `${Math.floor(Math.random() * 40) + 50}%`, trend: 'Consistent' }
        ]
      });
    }, 500); // Simulate API delay
  });
}