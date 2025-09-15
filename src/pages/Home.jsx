import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Target, BarChart, TrendingUp, Shield, Clock } from 'lucide-react';
import { Challenge } from '@/entities/Challenge';
import ChallengeCard from '../components/challenges/ChallengeCard.jsx';

const features = [
  { name: "Select a Challenge", description: "Pick a challenge that matches your risk appetite, from memecoin flips to 100x perps.", icon: Target },
  { name: "Pass the Test", description: "Hit the profit target within the rules. No daily drawdown, just one simple max loss rule.", icon: BarChart },
  { name: "Get Funded & Paid", description: "Pass, and you'll trade our capital. Keep up to 80% of the profits, paid out in SOL.", icon: Zap },
];

const stats = [
  { name: "Active Traders", value: "1,247", change: "+12%" },
  { name: "Funded Capital", value: "$2.8M", change: "+23%" },
  { name: "Profits Paid", value: "$487K", change: "+34%" },
  { name: "Success Rate", value: "18%", change: "+2%" },
];

export default function HomePage() {
  const [challenges, setChallenges] = React.useState([]);

  React.useEffect(() => {
    async function loadChallenges() {
      const featured = await Challenge.list('', 3);
      setChallenges(featured);
    }
    loadChallenges();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-400">
            Prove Your Degen.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Trade Our Capital.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
            The first prop firm built for Solana degens. No BS rules. High profit splits. Trade memecoins, perps, and DeFi with our capital.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to={createPageUrl('Challenges')}>
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold text-lg rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                View Challenges <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.name} className="p-6">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-400">{stat.name}</div>
                <div className="mt-1 text-xs text-green-400 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Three Steps to Profit</h2>
            <p className="mt-4 text-lg text-gray-400">Simple, fast, and built for degens.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature) => (
              <div key={feature.name} className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700/50 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-500/10 text-cyan-400 mx-auto">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-medium">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Challenges Section */}
       <section className="py-16 sm:py-24 bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Choose Your Arena</h2>
            <p className="mt-4 text-lg text-gray-400">Challenges for every type of degen.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to={createPageUrl('Challenges')}>
              <Button variant="outline" size="lg" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-gray-900">
                View All Challenges
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to Get Funded?</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Join the degens who've already proven themselves. Start with a challenge, get funded, and keep the profits.
          </p>
          <div className="mt-8">
            <Link to={createPageUrl('Challenges')}>
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105">
                Start Trading Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}