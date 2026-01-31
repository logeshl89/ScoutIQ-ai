'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Team {
  id: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [opponentTeam, setOpponentTeam] = useState('');
  const [dataSource, setDataSource] = useState<'TeamStatisticsForLastThreeMonths' | 'TeamStatisticsForChosenTournaments' | 'PlayerStatisticsForLastThreeMonths' | 'PlayerStatisticsForChosenTournaments'>('TeamStatisticsForLastThreeMonths');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  // Handle URL parameters on initial load
  useEffect(() => {
    if (teams.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const teamIdParam = urlParams.get('teamId');
      const dataSourceParam = urlParams.get('dataSource') as 'TeamStatisticsForLastThreeMonths' | 'TeamStatisticsForChosenTournaments' | 'PlayerStatisticsForLastThreeMonths' | 'PlayerStatisticsForChosenTournaments' || 'TeamStatisticsForLastThreeMonths';
      
      if (teamIdParam) {
        // Find the team by ID and set it as the selected opponent
        const foundTeam = teams.find(t => t.id === teamIdParam);
        if (foundTeam) {
          setOpponentTeam(foundTeam.name);
        }
      }
      
      setDataSource(dataSourceParam);
    }
  }, [teams]);

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);
      const response = await fetch('/api/teams');
      const data = await response.json();
      
      console.log('Teams API Response:', data); // Debug log
      
      if (response.ok && data.success) {
        const fetchedTeams = data.teams || [];
        console.log('Fetched teams count:', fetchedTeams.length);
        
        if (fetchedTeams.length > 0) {
          setTeams(fetchedTeams);
        } else {
          // If no teams from API, show empty list
          console.log('No teams from API');
          setTeams([]);
        }
      } else {
        console.error('Failed to fetch teams:', data.error);
        // Show empty list if API fails
        setTeams([]);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      // Show empty list on error
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ game: 'valorant', opponentTeam, dataSource }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }

      localStorage.setItem('scoutiq_report_data', JSON.stringify(data.report));
      router.push('/report');
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the report');
      console.error('Error generating report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] -z-10"></div>
        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          <span className="text-white">Scout</span>
          <span className="text-gradient">IQ</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
          Dominate the competition with AI-powered esports analytics and automated scouting reports.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="px-4 py-2 rounded-full bg-dark-800/50 border border-white/10 backdrop-blur-md text-sm text-gray-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Powered by GRID Data
          </div>
          <div className="px-4 py-2 rounded-full bg-dark-800/50 border border-white/10 backdrop-blur-md text-sm text-gray-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            Real-time Analytics
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full relative">
        {/* Glow Effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

        <div className="glass-panel rounded-2xl p-8 relative">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Generate Report</h2>
            <p className="text-gray-400 text-sm">
              Enter match details to analyze opponent strategies
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="opponent" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Opponent Team
              </label>
              <div className="relative">
                <select
                  id="opponent"
                  value={opponentTeam}
                  onChange={(e) => setOpponentTeam(e.target.value)}
                  className="glass-input w-full p-4 rounded-xl appearance-none"
                  required
                  disabled={teamsLoading}
                >
                  <option value="" className="bg-dark-900 text-gray-500">
                    {teamsLoading ? 'Loading teams...' : 'Choose opponent team'}
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.name} className="bg-dark-900">
                      {team.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="dataSource" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Data Source
              </label>
              <div className="relative">
                <select
                  id="dataSource"
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value as 'TeamStatisticsForLastThreeMonths' | 'TeamStatisticsForChosenTournaments' | 'PlayerStatisticsForLastThreeMonths' | 'PlayerStatisticsForChosenTournaments')}
                  className="glass-input w-full p-4 rounded-xl appearance-none"
                >
                  <option value="TeamStatisticsForLastThreeMonths" className="bg-dark-900">Team Statistics - Last 3 Months</option>
                  <option value="TeamStatisticsForChosenTournaments" className="bg-dark-900">Team Statistics - Chosen Tournaments</option>
                  <option value="PlayerStatisticsForLastThreeMonths" className="bg-dark-900">Player Statistics - Last 3 Months</option>
                  <option value="PlayerStatisticsForChosenTournaments" className="bg-dark-900">Player Statistics - Chosen Tournaments</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>



            <button
              type="submit"
              disabled={isLoading}
              className="btn-glow w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing Data...</span>
                </div>
              ) : (
                'Generate Intelligence'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto px-4">
        {[
          { icon: '🏆', title: 'Strategy Analysis', desc: 'Deep dive into opponent patterns and tactical tendencies' },
          { icon: '⚡', title: 'Player Metrics', desc: 'Advanced statistics on individual player performance' },
          { icon: '🎯', title: 'Win Conditions', desc: 'AI-generated recommendations to secure the victory' },
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-6 rounded-xl hover:bg-dark-800/80 transition-colors group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}