'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

interface TeamStats {
  matchCount: number;
  winPercentage: number;
  avgKills: number;
  avgDeaths: number;
  segmentData: any[];
}

interface PlayerStats {
  playerId: string;
  winPercentage: number;
  avgKills: number;
  avgDeaths: number;
}

interface TeamStrategy {
  attackWinRate: number;
  defenseWinRate: number;
  earlyAggression: number;
  lateGameFocus: number;
  pistolWinRate: number;
  objectivePriority: string[];
};

interface PlayerTendency {
  name: string;
  role: string;
  championPool: string[];
  winRate: number;
  aggression: number;
};

interface Composition {
  name: string;
  frequency: number;
  winRate: number;
};

interface Insight {
  title: string;
  description: string;
  confidence: string;
};

interface SupportingData {
  metric: string;
  value: string;
  trend: string;
};

interface ReportData {
  teamStrategy: TeamStrategy;
  playerTendencies: PlayerTendency[];
  compositions: Composition[];
  actionableInsights: Insight[];
  supportingData: SupportingData[];
  teamName: string;
  game: string;
  numMatchesAnalyzed: number;
  timestamp: string;
};

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      try {
        // Get report data from localStorage
        const storedData = localStorage.getItem('scoutiq_report_data');

        if (storedData) {
          const parsedData = JSON.parse(storedData) as ReportData;
          console.log('Report data received:', parsedData); // Debug log
          console.log('Player tendencies count:', parsedData.playerTendencies?.length || 0); // Debug log
          setReportData(parsedData);
        } else {
          // If no data in localStorage, show an error or redirect
          setError('No report data found. Please generate a report first.');
        }
      } catch (err) {
        console.error('Error loading report data:', err);
        setError('Failed to load report data. Please try generating a new report.');
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-xl font-semibold text-white">Loading scouting report...</p>
          <p className="text-gray-400">Analyzing match data and generating insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl max-w-lg text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Report</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link href="/" className="btn-glow inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-bold">
            Generate New Report
          </Link>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="glass-panel p-8 rounded-2xl max-w-lg text-center">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-2xl font-bold text-white mb-4">No Report Data</h2>
          <p className="text-gray-400 mb-8">Please generate a scouting report first.</p>
          <Link href="/" className="btn-glow inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-bold">
            Generate Report
          </Link>
        </div>
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="py-12">
      {/* Report Header */}
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/20 rounded-full blur-[80px] -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-white">
          Scouting <span className="text-gradient">Report</span>
        </h1>
        <p className="text-2xl text-gray-300">
          <span className="font-bold text-white">{reportData.teamName}</span> <span className="text-gray-500">|</span> VALORANT
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <div className="px-4 py-2 rounded-full bg-dark-800/50 border border-white/10 text-sm text-gray-400">
            📅 Generated: {new Date(reportData.timestamp).toLocaleDateString()}
          </div>
          <div className="px-4 py-2 rounded-full bg-dark-800/50 border border-white/10 text-sm text-gray-400">
            🎯 Matches Analyzed: <span className="text-white font-bold">{reportData.numMatchesAnalyzed}</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-dark-800/50 border border-white/10 text-sm text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Powered by GRID
          </div>
        </div>
      </div>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Team Strategy Overview */}
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
            <span className="text-primary-400">01</span> Team Strategy Overview
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-6">Win Rates by Phase</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Attack', rate: reportData.teamStrategy.attackWinRate },
                      { name: 'Defense', rate: reportData.teamStrategy.defenseWinRate },
                      { name: 'Pistol', rate: reportData.teamStrategy.pistolWinRate }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                      cursor={{ fill: '#ffffff10' }}
                    />
                    <Bar dataKey="rate" name="Win Rate (%)" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-6">Aggression Patterns</h3>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Early Game', value: reportData.teamStrategy.earlyAggression },
                        { name: 'Late Game', value: reportData.teamStrategy.lateGameFocus },
                        { name: 'Mid Game', value: 100 - reportData.teamStrategy.earlyAggression - reportData.teamStrategy.lateGameFocus }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {reportData.compositions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Objective Priorities</h3>
            <div className="flex flex-wrap gap-3">
              {reportData.teamStrategy.objectivePriority.map((obj, idx) => (
                <span key={idx} className="px-4 py-2 bg-primary-500/10 border border-primary-500/20 text-primary-300 rounded-lg text-sm font-medium">
                  {obj}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Player Tendencies */}
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
            <span className="text-secondary-400">02</span> Player Tendencies
          </h2>

          {reportData.playerTendencies.length > 0 && reportData.playerTendencies[0].name !== 'No player data available' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Agent Pool</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Win Rate</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Aggression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reportData.playerTendencies.map((player, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">{player.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium bg-dark-800 text-gray-300 rounded-full border border-white/10">
                          {player.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {player.championPool.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">
                        {player.winRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-dark-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-secondary-500 h-full rounded-full"
                              style={{ width: `${player.aggression}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{player.aggression}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Player Data Available</h3>
              <p className="text-gray-400 max-w-md mx-auto">Player roster information could not be retrieved from the GRID API for this team. This may be due to the team not having recent match data or API limitations.</p>
            </div>
          )}
        </section>

        {/* Compositions & Setups */}
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
            <span className="text-green-400">03</span> Compositions & Setups
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData.compositions}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" tick={{ fill: '#0ea5e9' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fill: '#10b981' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  cursor={{ fill: '#ffffff10' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="frequency" name="Pick Rate (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar yAxisId="right" dataKey="winRate" name="Win Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* How to Win - Actionable Insights */}
        <section className="glass-panel p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-3 relative z-10">
            <span className="text-yellow-400">04</span> Keys to Victory
          </h2>

          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            {reportData.actionableInsights.map((insight, idx) => (
              <div key={idx} className="bg-dark-800/50 border border-white/10 p-6 rounded-xl hover:border-primary-500/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white">{insight.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${insight.confidence === 'High'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                    {insight.confidence} Confidence
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">{insight.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Supporting Data & Reasoning */}
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
            <span className="text-gray-400">05</span> Supporting Data
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportData.supportingData.map((data, idx) => (
              <div key={idx} className="bg-dark-800/30 border border-white/5 p-6 rounded-xl">
                <h3 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">{data.metric}</h3>
                <p className={`text-3xl font-bold mb-3 ${data.value === 'No data' ? 'text-gray-500' : 'text-white'}`}>{data.value}</p>
                <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${data.trend === 'Positive' || data.trend === 'Improving' || data.trend === 'Increasing'
                    ? 'text-green-400'
                    : data.trend === 'Negative' || data.trend === 'Decreasing'
                      ? 'text-red-400'
                      : data.trend === 'N/A'
                        ? 'text-gray-500'
                        : 'text-yellow-400'
                  }`}>
                  {data.trend === 'Positive' ? '↑' : data.trend === 'Negative' ? '↓' : data.trend === 'N/A' ? '⊘' : '→'} {data.trend} Trend
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center border-t border-white/5 pt-8">
        <p className="text-gray-500">
          Report generated based on GRID Historical Match Data from last {reportData.numMatchesAnalyzed} matches
        </p>
        <p className="text-sm text-gray-600 mt-2">
          © {new Date().getFullYear()} ScoutIQ - Automated Scouting Report Generator
        </p>
      </footer>
    </div>
  );
}