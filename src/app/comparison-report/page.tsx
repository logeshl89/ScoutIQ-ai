'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Define types for our data
interface Team {
  id: string;
  name: string;
}

interface Player {
  id: string;
  nickname: string;
  title: string;
}

interface TeamComparison {
  myTeam: string;
  opponentTeam: string;
  myTeamStats: any;
  opponentStats: any;
  strengths: string[];
  weaknesses: string[];
  winStrategies: string[];
  tacticalRecommendations: string[];
  playerComparison: any[];
  mapPreferences: any[];
  game: string;
  numMatchesAnalyzed: number;
  timestamp: string;
}

export default function ComparisonReportPage() {
  const [comparisonData, setComparisonData] = useState<TeamComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch comparison data from API
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        
        // Get team IDs from URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const myTeamId = urlParams.get('myTeam');
        const opponentTeamId = urlParams.get('opponentTeam');
        
        if (!myTeamId || !opponentTeamId) {
          setError('Missing team IDs in URL');
          setLoading(false);
          return;
        }
        
        // Make API call to generate comparison
        const response = await fetch('/api/generate-comparison', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            myTeam: myTeamId,
            opponentTeam: opponentTeamId,
            numMatches: 5, // Default to 5 matches
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate comparison');
        }
        
        const result = await response.json();
        
        if (result.success) {
          setComparisonData(result.comparison);
        } else {
          setError(result.error || 'Failed to generate comparison');
        }
      } catch (err: any) {
        console.error('Error fetching comparison data:', err);
        setError(err.message || 'Error fetching comparison data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComparisonData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-700 rounded w-1/3"></div>
              <div className="h-96 bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
              <div className="h-80 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-900/30 border border-red-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-red-300 mb-4">Error Loading Report</h2>
              <p className="text-red-200">{error}</p>
              <Link href="/comparison" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
                ← Back to Comparison Tool
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">No Comparison Data</h2>
              <p className="text-gray-300">No comparison data available. Please generate a comparison first.</p>
              <Link href="/comparison" className="inline-block mt-4 text-blue-400 hover:text-blue-300">
                ← Back to Comparison Tool
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Team Comparison Report</h1>
              <p className="text-gray-400">
                Comparing {comparisonData.myTeam} vs {comparisonData.opponentTeam}
              </p>
            </div>
            <Link href="/comparison" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Comparison
            </Link>
          </div>
          
          {/* Summary Section */}
          <section className="mb-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Matchup Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-400 mb-4">{comparisonData.myTeam}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Attack Win Rate</span>
                    <span className="font-semibold">{comparisonData.myTeamStats.attackWinRate > 0 ? `${comparisonData.myTeamStats.attackWinRate}%` : 'No data'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Defense Win Rate</span>
                    <span className="font-semibold">{comparisonData.myTeamStats.defenseWinRate > 0 ? `${comparisonData.myTeamStats.defenseWinRate}%` : 'No data'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Round Win After First Kill</span>
                    <span className="font-semibold">{comparisonData.myTeamStats.roundWinAfterFirstKill > 0 ? `${comparisonData.myTeamStats.roundWinAfterFirstKill}%` : 'No data'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg Economy Rating</span>
                    <span className="font-semibold">{comparisonData.myTeamStats.averageEconomyRating > 0 ? comparisonData.myTeamStats.averageEconomyRating : 'No data'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-4">{comparisonData.opponentTeam}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Attack Win Rate</span>
                    <span className="font-semibold">{comparisonData.opponentStats.attackWinRate > 0 ? `${comparisonData.opponentStats.attackWinRate}%` : 'No data'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Defense Win Rate</span>
                    <span className="font-semibold">{comparisonData.opponentStats.defenseWinRate > 0 ? `${comparisonData.opponentStats.defenseWinRate}%` : 'No data'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Round Win After First Kill</span>
                    <span className="font-semibold">{comparisonData.opponentStats.roundWinAfterFirstKill > 0 ? `${comparisonData.opponentStats.roundWinAfterFirstKill}%` : 'No data'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg Economy Rating</span>
                    <span className="font-semibold">{comparisonData.opponentStats.averageEconomyRating > 0 ? comparisonData.opponentStats.averageEconomyRating : 'No data'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Strengths & Weaknesses */}
          <section className="mb-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Team Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-400 mb-4">Your Team's Strengths</h3>
                <ul className="space-y-2">
                  {comparisonData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-4">Your Team's Weaknesses</h3>
                <ul className="space-y-2">
                  {comparisonData.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-2">✗</span>
                      <span className="text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          
          {/* Win Strategies */}
          <section className="mb-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Win Strategies</h2>
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
              <ul className="space-y-3">
                {comparisonData.winStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-400 mr-3 text-lg">🎯</span>
                    <span className="text-gray-300">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          
          {/* Tactical Recommendations */}
          <section className="mb-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Tactical Recommendations</h2>
            <div className="bg-purple-900/20 border border-purple-800 rounded-xl p-6">
              <ul className="space-y-3">
                {comparisonData.tacticalRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-3 text-lg">💡</span>
                    <span className="text-gray-300">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          
          {/* Player Comparison Chart */}
          <section className="mb-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Player Performance Comparison</h2>
            {comparisonData.playerComparison.some(p => p.myTeamValue > 0 || p.opponentValue > 0) ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData.playerComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="player" stroke="#ccc" angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#ccc" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2d3748', borderColor: '#4a5568', borderRadius: '0.5rem' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="myTeamValue" fill="#4299e1" name={`${comparisonData.myTeam} Performance`} />
                    <Bar dataKey="opponentValue" fill="#e53e3e" name={`${comparisonData.opponentTeam} Performance`} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Player Statistics Available</h3>
                  <p>Data for individual player performance is currently unavailable.</p>
                </div>
              </div>
            )}
          </section>
          
          {/* Map Preferences */}
          <section className="mb-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Map Preferences & Win Rates</h2>
            {comparisonData.mapPreferences.some(m => m.myTeamWinRate > 0 || m.opponentWinRate > 0) ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData.mapPreferences}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="map" tick={{ fill: '#ccc' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#ccc' }} />
                    <Radar 
                      name={`${comparisonData.myTeam} Win Rate`} 
                      dataKey="myTeamWinRate" 
                      stroke="#4299e1" 
                      fill="#4299e1" 
                      fillOpacity={0.4} 
                    />
                    <Radar 
                      name={`${comparisonData.opponentTeam} Win Rate`} 
                      dataKey="opponentWinRate" 
                      stroke="#e53e3e" 
                      fill="#e53e3e" 
                      fillOpacity={0.4} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#2d3748', borderColor: '#4a5568', borderRadius: '0.5rem' }} 
                      formatter={(value) => [`${value}%`, 'Win Rate']}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Map Statistics Available</h3>
                  <p>Map preference and win rate data is currently unavailable.</p>
                </div>
              </div>
            )}
          </section>
          
          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm">
            <p>Generated on {new Date(comparisonData.timestamp).toLocaleString()}</p>
            <p>Analyzed {comparisonData.numMatchesAnalyzed} matches for this comparison</p>
          </footer>
        </div>
      </div>
    </div>
  );
}