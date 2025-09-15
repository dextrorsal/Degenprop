
import React, { useState, useEffect } from 'react';
import { Challenge } from '@/entities/Challenge';
import ChallengeCard from '../components/challenges/ChallengeCard.jsx';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const platformLogos = {
    'all': null,
    'pump.fun': 'https://pump.fun/logo.png',
    'drift': 'https://app.drift.trade/favicon.ico',
    'hyperliquid': 'https://app.hyperliquid.xyz/hyperliquid.svg', // Fixed Hyperliquid logo URL
    'jupiter': 'https://jup.ag/favicon.ico',
    'multi-platform': null,
    'axiom': 'https://axiom.trade/favicon.ico',
    'rollbit': 'https://rollbit.com/favicon.ico'
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function loadChallenges() {
      setIsLoading(true);
      const allChallenges = await Challenge.list();
      setChallenges(allChallenges);
      setIsLoading(false);
    }
    loadChallenges();
  }, []);

  const filteredChallenges = filter === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.platform.toLowerCase().includes(filter.toLowerCase()));

  const platforms = ['all', 'pump.fun', 'drift', 'hyperliquid', 'jupiter', 'multi-platform'];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-400">All Challenges</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Find the perfect challenge to prove your skills. Pass the test, get funded.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
        {platforms.map((platform) => (
          <Button
            key={platform}
            variant={filter === platform ? "default" : "outline"}
            onClick={() => setFilter(platform)}
            className={`flex items-center gap-2 capitalize transition-all ${filter === platform ? "bg-cyan-500 text-gray-900 shadow-lg" : "border-gray-600 text-gray-300 hover:border-cyan-500/50"}`}
          >
            {platformLogos[platform] && (
              <img 
                src={platformLogos[platform]} 
                alt={`${platform} logo`} 
                className="h-4 w-4 rounded-sm object-contain bg-white/10 p-0.5" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            {platform === 'all' ? 'All Platforms' : 
             platform === 'multi-platform' ? 'Multi-Platform' : 
             platform.replace('.', '').toUpperCase()}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}

      {filteredChallenges.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-400">No challenges found for this platform</h3>
          <p className="text-gray-500 mt-2">Try selecting a different platform or check back later</p>
        </div>
      )}
    </div>
  );
}
