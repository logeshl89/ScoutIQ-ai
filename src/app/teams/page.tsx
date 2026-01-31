'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Team {
  id: string;
  name: string;
  matchCount?: number;
  winRate?: number;
  lastPlayed?: string | null;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teams');
      const data = await response.json();
      
      if (response.ok && data.success) {
        const fetchedTeams = data.teams || [];
        
        if (fetchedTeams.length > 0) {
          setTeams(fetchedTeams);
        } else {
          console.log('No teams from API');
          setTeams([]);
        }
      } else {
        console.error('Failed to fetch teams:', data.error);
        setError('Failed to fetch teams');
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Error fetching teams');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Available Teams</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Reports
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 mb-8">
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <div 
                    key={team.id} 
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-white mb-2">{team.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">Team ID: {team.id}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-900/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Matches Played</p>
                        <p className="text-lg font-bold text-white">{team.matchCount !== undefined ? team.matchCount : 'N/A'}</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Win Rate</p>
                        <p className="text-lg font-bold text-white">{team.winRate !== undefined ? `${team.winRate}%` : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link 
                        href={`/report?teamId=${team.id}&dataSource=TeamStatisticsForLastThreeMonths`}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Team - Last 3 Months
                      </Link>
                      <Link 
                        href={`/report?teamId=${team.id}&dataSource=TeamStatisticsForChosenTournaments`}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Team - Chosen Tournaments
                      </Link>
                      <Link 
                        href={`/report?teamId=${team.id}&dataSource=PlayerStatisticsForLastThreeMonths`}
                        className="text-xs bg-teal-600 hover:bg-teal-700 text-white py-2 px-3 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Player - Last 3 Months
                      </Link>
                      <Link 
                        href={`/report?teamId=${team.id}&dataSource=PlayerStatisticsForChosenTournaments`}
                        className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-3 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Player - Chosen Tournaments
                      </Link>
                      <Link 
                        href={`/comparison?myTeam=${team.id}`}
                        className="text-xs bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Compare
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No teams available at the moment.</p>
                  <p className="text-gray-500 text-sm mt-2">Try again later or contact support if the issue persists.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}