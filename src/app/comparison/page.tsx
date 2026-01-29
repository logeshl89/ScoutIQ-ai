'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Team {
  id: string;
  name: string;
}

export default function ComparisonPage() {
  const router = useRouter();
  const [myTeam, setMyTeam] = useState('');
  const [opponentTeam, setOpponentTeam] = useState('');
  const [dataSource, setDataSource] = useState<'TeamStatisticsForLastThreeMonths' | 'TeamStatisticsForChosenTournaments' | 'PlayerStatisticsForLastThreeMonths' | 'PlayerStatisticsForChosenTournaments'>('TeamStatisticsForLastThreeMonths');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);
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
      setTeamsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!myTeam || !opponentTeam) {
      setError('Please select both teams');
      return;
    }
    
    if (myTeam === opponentTeam) {
      setError('Please select different teams');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          myTeam,
          opponentTeam,
          dataSource,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Navigate to the comparison report page
        router.push(`/comparison-report?myTeam=${myTeam}&opponentTeam=${opponentTeam}`);
      } else {
        setError(result.error || 'Failed to generate comparison');
      }
    } catch (err) {
      console.error('Error generating comparison:', err);
      setError('Error generating comparison');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Team Comparison</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Reports
            </Link>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="myTeam" className="block text-sm font-medium text-gray-300 mb-2">
                  My Team
                </label>
                {teamsLoading ? (
                  <div className="animate-pulse bg-gray-700 h-12 rounded-lg"></div>
                ) : (
                  <select
                    id="myTeam"
                    value={myTeam}
                    onChange={(e) => setMyTeam(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select your team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <label htmlFor="opponentTeam" className="block text-sm font-medium text-gray-300 mb-2">
                  Opponent Team
                </label>
                {teamsLoading ? (
                  <div className="animate-pulse bg-gray-700 h-12 rounded-lg"></div>
                ) : (
                  <select
                    id="opponentTeam"
                    value={opponentTeam}
                    onChange={(e) => setOpponentTeam(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select opponent team</option>
                    {teams.filter(t => t.id !== myTeam).map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <label htmlFor="dataSource" className="block text-sm font-medium text-gray-300 mb-2">
                  Data Source
                </label>
                <select
                  id="dataSource"
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value as 'TeamStatisticsForLastThreeMonths' | 'TeamStatisticsForChosenTournaments' | 'PlayerStatisticsForLastThreeMonths' | 'PlayerStatisticsForChosenTournaments')}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TeamStatisticsForLastThreeMonths">Team Statistics - Last 3 Months</option>
                  <option value="TeamStatisticsForChosenTournaments">Team Statistics - Chosen Tournaments</option>
                  <option value="PlayerStatisticsForLastThreeMonths">Player Statistics - Last 3 Months</option>
                  <option value="PlayerStatisticsForChosenTournaments">Player Statistics - Chosen Tournaments</option>
                </select>
              </div>
              

              
              {error && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading || teamsLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Comparison...
                  </span>
                ) : (
                  'Generate Team Comparison'
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">About Team Comparison</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The Team Comparison feature analyzes two teams' strategies, player tendencies, and tactical approaches 
                to provide insights on how your team can gain an advantage. It identifies strengths and weaknesses 
                in both teams and suggests specific strategies to exploit opponent vulnerabilities while maximizing 
                your team's strengths.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}