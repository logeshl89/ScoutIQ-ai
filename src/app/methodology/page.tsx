'use client';

import Link from 'next/link';

export default function MethodologyPage() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[100px] -z-10"></div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-white">Methodology</span> <span className="text-gradient">& Metrics</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
          Understanding ScoutIQ's analytical approach and data-driven insights
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Introduction */}
        <section className="glass-panel p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Our Analytical Framework</h2>
          <div className="prose prose-lg prose-invert max-w-none relative z-10">
            <p className="text-gray-300 mb-4">
              ScoutIQ leverages official GRID historical match data to generate actionable insights for competitive VALORANT teams.
              Our methodology combines real-time API data retrieval with structured analysis to identify patterns and strategic insights.
            </p>
            <p className="text-gray-300">
              All insights are generated based on recent match history (configurable number of matches) to ensure
              the analysis reflects the opponent's current strategy and form. When data is unavailable, the system transparently indicates 
              what information is missing rather than generating placeholder data.
            </p>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">Key Metrics & Definitions</h2>

          <div className="space-y-8">
            <div className="border-b border-white/10 pb-8">
              <h3 className="text-xl font-semibold text-primary-400 mb-6 flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                Team-Level Metrics
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Attack/Defense Win Rate', desc: 'Win percentage when playing on attack vs defense sides' },
                  { title: 'Pistol Round Success', desc: 'Win rate in pistol rounds (first round of each half)' },
                  { title: 'Early Aggression Index', desc: 'Tendency to engage in early-round fights and site takes' },
                  { title: 'Late Game Focus', desc: 'Strategic emphasis on end-game scenarios and clutch situations' }
                ].map((item, i) => (
                  <div key={i} className="bg-dark-800/50 p-6 rounded-xl border border-white/5 hover:border-primary-500/30 transition-colors">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-gray-400 mt-2 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b border-white/10 pb-8">
              <h3 className="text-xl font-semibold text-secondary-400 mb-6 flex items-center gap-3">
                <span className="text-2xl">👥</span>
                Player-Level Metrics
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Agent Pool', desc: 'Primary agents played by each player based on GRID data' },
                  { title: 'Win Rate', desc: 'Individual player win percentage from recent matches' },
                  { title: 'Aggression Score', desc: 'Calculated from K/D ratio - higher values indicate more aggressive playstyle' },
                  { title: 'Role Assignment', desc: 'Assigned VALORANT roles: ENTRY_FRAGGER, INITIATOR, CONTROLLER, DUELIST, SENTINEL' }
                ].map((item, i) => (
                  <div key={i} className="bg-dark-800/50 p-6 rounded-xl border border-white/5 hover:border-secondary-500/30 transition-colors">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-gray-400 mt-2 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Strategic Indicators
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Team Compositions', desc: 'Common tactical formations and their observed frequencies' },
                  { title: 'Actionable Insights', desc: 'Strategic recommendations based on identified patterns and weaknesses' },
                  { title: 'Supporting Data', desc: 'Additional metrics like average game duration, site control rates, and entry success rates' }
                ].map((item, i) => (
                  <div key={i} className="bg-dark-800/50 p-6 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-gray-400 mt-2 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Analytical Methods */}
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">Analytical Methods</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🔍', title: 'Pattern Recognition', desc: 'Our system identifies recurring tactical patterns in opponent behavior, such as preferred site takes, rotation timing, and utility usage.', color: 'from-blue-500/20 to-blue-600/5' },
              { icon: '📊', title: 'Statistical Analysis', desc: 'We analyze K/D ratios, win rates, and performance metrics to calculate aggression scores and identify strengths/weaknesses.', color: 'from-green-500/20 to-green-600/5' },
              { icon: '⚖️', title: 'Comparative Benchmarking', desc: 'Opponent performance is analyzed in context to identify relative strengths and tactical preferences.', color: 'from-purple-500/20 to-purple-600/5' },
              { icon: '🎯', title: 'Actionable Intelligence', desc: 'Data-driven insights are translated into specific strategic recommendations for upcoming matches.', color: 'from-orange-500/20 to-orange-600/5' }
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.color} p-6 rounded-xl border border-white/10`}>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">Data Sources</h2>

          <div className="space-y-6">
            <div className="bg-dark-800/50 p-6 rounded-xl border border-blue-500/20">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">GRID VALORANT Data</h3>
              <p className="text-gray-300 mb-4">
                All analysis is based on official GRID VALORANT tournament data, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                <li>Team roster data (current team members, nicknames)</li>
                <li>Player identifiers and VALORANT game associations</li>
                <li>Basic team information and external links</li>
                <li>Note: Detailed statistics (win rates, K/D ratios, etc.) are currently limited in the GRID API</li>
              </ul>
            </div>

            <div className="bg-dark-800/50 p-6 rounded-xl border border-green-500/20">
              <h3 className="text-xl font-semibold text-green-400 mb-4">Data Processing Pipeline</h3>
              <p className="text-gray-300 text-sm">
                Data flows through our pipeline: Team identification → Player roster extraction → 
                Data availability assessment → Report generation with transparent indication of missing data. All processing is done in real-time.
              </p>
            </div>

            <div className="bg-dark-800/50 p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">No Mock Data Policy</h3>
              <p className="text-gray-300 text-sm">
                ScoutIQ operates exclusively on real GRID API data. When data is unavailable or insufficient, 
                reports will show zero values rather than generating placeholder/mock data, ensuring complete transparency.
              </p>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">Limitations & Considerations</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚠️', title: 'Limited Statistics', desc: 'GRID API currently provides team/player identification data but limited detailed statistics (win rates, K/D ratios, etc.).' },
              { icon: '🔄', title: 'API Availability', desc: 'Detailed statistics may not be available for all teams or may be temporarily unavailable from the GRID API.' },
              { icon: '🧠', title: 'Transparent Reporting', desc: 'When data is unavailable, ScoutIQ clearly indicates what information is missing rather than showing placeholder values.' }
            ].map((item, i) => (
              <div key={i} className="bg-dark-800/30 p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center border-t border-white/5 pt-8">
        <p className="text-gray-500">Methodology v3.0 | Updated: {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-gray-600 mt-2">
          © {new Date().getFullYear()} ScoutIQ - VALORANT Scouting Intelligence Platform
        </p>
      </footer>
    </div>
  );
}