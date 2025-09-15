
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { TraderAttempt } from '@/entities/TraderAttempt';
import { User } from '@/entities/User';
import { useNavigate } from 'react-router-dom';

const platformLogos = {
    'Pump.fun': 'https://pump.fun/logo.png',
    'Drift': 'https://app.drift.trade/favicon.ico',
    'Hyperliquid': 'https://app.hyperliquid.xyz/hyperliquid.svg',
    'Jupiter': 'https://jup.ag/favicon.ico',
    'Multi-Platform': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=40&h=40&fit=crop&crop=center',
    'Drift + Hyperliquid': [
        'https://app.drift.trade/favicon.ico',
        'https://app.hyperliquid.xyz/hyperliquid.svg'
    ],
    'Axiom': 'https://axiom.trade/favicon.ico',
    'Rollbit': 'https://rollbit.com/favicon.ico'
};

function Stat({ label, value }) {
    return (
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
        </div>
    );
}

export default function ChallengeCard({ challenge }) {
    const navigate = useNavigate();
    
    const startChallenge = async () => {
        try {
            const user = await User.me();
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + challenge.duration_days);

            // Generate realistic PnL data for demonstration
            let pnlHistory = [];
            let currentSimBalance = challenge.initial_capital;
            
            for (let i = 0; i <= Math.min(challenge.duration_days, 30); i++) {
                pnlHistory.push({ day: i, balance: currentSimBalance });
                // Simulate volatile degen trading
                const volatility = challenge.platform === 'Pump.fun' ? 0.15 : 0.08;
                const change = (Math.random() - 0.48) * challenge.initial_capital * volatility;
                currentSimBalance = Math.max(0, currentSimBalance + change);
            }

            await TraderAttempt.create({
                user_email: user.email,
                challenge_id: challenge.id,
                challenge_name: challenge.name,
                status: 'active',
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                initial_capital: challenge.initial_capital,
                current_balance: pnlHistory[pnlHistory.length - 1].balance,
                equity_high: Math.max(...pnlHistory.map(p => p.balance)),
                simulated_pnl_history: pnlHistory,
                simulated_trades: []
            });
            navigate(createPageUrl('Dashboard'));
        } catch (error) {
            console.error("Error starting challenge:", error);
            alert('Please connect your wallet to start a challenge.');
        }
    };

    const logoSrc = platformLogos[challenge.platform];

    return (
        <div className="relative rounded-2xl overflow-hidden border border-gray-700/50 group hover:border-cyan-500/50 transition-all duration-300">
            {challenge.image_url && (
                <img src={challenge.image_url} alt={challenge.name} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/60"></div>
            
            <div className="relative p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold tracking-tight">{challenge.name}</h3>
                    <div className="flex items-center space-x-2 bg-gray-900/80 backdrop-blur p-2 rounded-lg border border-gray-700/50">
                        {Array.isArray(logoSrc) ? (
                            logoSrc.map((src, index) => (
                                <img 
                                    key={index} 
                                    src={src} 
                                    alt={`${challenge.platform} logo`} 
                                    className="h-6 w-6 rounded-sm object-contain bg-white/10 p-1" 
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ))
                        ) : logoSrc ? (
                            <img 
                                src={logoSrc} 
                                alt={`${challenge.platform} logo`} 
                                className="h-6 w-6 rounded-sm object-contain bg-white/10 p-1" 
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="h-6 w-6 bg-cyan-500/20 rounded-sm flex items-center justify-center text-xs text-cyan-400 font-bold">
                                {challenge.platform.charAt(0)}
                            </div>
                        )}
                        <span className="text-xs text-gray-400 font-medium">{challenge.platform}</span>
                    </div>
                </div>
                
                <p className="text-gray-400 text-sm flex-grow mb-6">{challenge.description}</p>

                <div className="grid grid-cols-3 gap-4 text-center bg-black/30 p-4 rounded-lg mb-6">
                    <Stat label="Capital" value={`$${(challenge.initial_capital / 1000).toFixed(0)}k`} />
                    <Stat label="Target" value={`${challenge.profit_target_percent}%`} />
                    <Stat label="Max Loss" value={`${challenge.max_drawdown_percent}%`} />
                </div>

                <div className="flex justify-between text-sm text-gray-400 mb-6">
                    <span>{challenge.duration_days} days</span>
                    <span>Up to {challenge.leverage} leverage</span>
                    <span>{challenge.profit_split}% profit split</span>
                </div>

                <Button onClick={startChallenge} size="lg" className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold text-lg rounded-lg transition-all transform group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                    Start Challenge - ${challenge.fee}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
