import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { TraderAttempt } from '@/entities/TraderAttempt';
import { Challenge } from '@/entities/Challenge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Loader2, BarChart, Trophy, ShieldOff, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const StatCard = ({ icon, title, value, footer, trend }) => (
    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
            <div className="bg-cyan-500/10 text-cyan-400 p-3 rounded-lg">{icon}</div>
            {trend && (
                <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
        {footer && <div className="mt-4">{footer}</div>}
    </div>
);

export default function DashboardPage() {
    const [attempt, setAttempt] = useState(null);
    const [challenge, setChallenge] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            setIsLoading(true);
            try {
                const user = await User.me();
                const attempts = await TraderAttempt.filter({ user_email: user.email, status: 'active' }, '-created_date', 1);
                if (attempts.length > 0) {
                    const currentAttempt = attempts[0];
                    setAttempt(currentAttempt);
                    const relatedChallenge = await Challenge.get(currentAttempt.challenge_id);
                    setChallenge(relatedChallenge);
                } 
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadDashboard();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-4rem)]"><Loader2 className="h-16 w-16 text-cyan-400 animate-spin" /></div>;
    }

    if (!attempt || !challenge) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)] text-center">
                <h2 className="text-3xl font-bold">No Active Challenge</h2>
                <p className="mt-4 text-gray-400">You don't have an active challenge. Pick one to get started.</p>
                <Link to={createPageUrl('Challenges')} className="mt-6">
                    <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold">View Challenges</Button>
                </Link>
            </div>
        );
    }

    const profitTargetValue = attempt.initial_capital * (1 + challenge.profit_target_percent / 100);
    const maxDrawdownValue = attempt.initial_capital * (1 - challenge.max_drawdown_percent / 100);
    const currentProgress = Math.max(0, Math.min(100, ((attempt.current_balance - attempt.initial_capital) / (profitTargetValue - attempt.initial_capital)) * 100));
    const daysLeft = Math.max(0, Math.round((new Date(attempt.end_date) - new Date()) / (1000 * 60 * 60 * 24)));
    const pnlPercent = ((attempt.current_balance - attempt.initial_capital) / attempt.initial_capital) * 100;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{challenge.name} Dashboard</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Status: <span className="font-semibold text-yellow-400 capitalize">{attempt.status}</span></span>
                        <span>Platform: <span className="font-semibold text-cyan-400">{challenge.platform}</span></span>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    attempt.current_balance >= profitTargetValue ? 'bg-green-500/20 text-green-400' :
                    attempt.current_balance <= maxDrawdownValue ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                }`}>
                    {attempt.current_balance >= profitTargetValue ? '🎉 Challenge Passed!' :
                     attempt.current_balance <= maxDrawdownValue ? '💀 Challenge Failed' :
                     '⚡ In Progress'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    icon={<BarChart className='h-6 w-6' />} 
                    title="Current Balance" 
                    value={`$${attempt.current_balance.toLocaleString()}`}
                    footer={<p className={`text-sm ${pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>PnL: {pnlPercent.toFixed(2)}%</p>}
                    trend={pnlPercent}
                />
                <StatCard 
                    icon={<Trophy className='h-6 w-6' />} 
                    title="Profit Target" 
                    value={`$${profitTargetValue.toLocaleString()}`}
                    footer={<Progress value={currentProgress} className="h-2" />}
                />
                <StatCard 
                    icon={<ShieldOff className='h-6 w-6' />} 
                    title="Max Drawdown" 
                    value={`$${maxDrawdownValue.toLocaleString()}`}
                    footer={<p className='text-sm text-gray-400'>Equity must stay above this</p>}
                />
                <StatCard 
                    icon={<Clock className='h-6 w-6' />} 
                    title="Time Remaining" 
                    value={`${daysLeft} Days`}
                    footer={<p className='text-sm text-gray-400'>Ends {new Date(attempt.end_date).toLocaleDateString()}</p>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4">Equity Curve</h3>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <AreaChart data={attempt.simulated_pnl_history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="day" stroke="#9ca3af" tickFormatter={(value) => `Day ${value}`} />
                                <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} domain={['dataMin - 100', 'dataMax + 100']}/>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(20, 20, 30, 0.9)', 
                                        borderColor: '#374151',
                                        color: '#e5e7eb'
                                    }} 
                                    labelFormatter={(label) => `Day ${label}`}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                                />
                                <Area type="monotone" dataKey="balance" stroke="#22d3ee" fillOpacity={1} fill="url(#colorBalance)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4">Challenge Rules</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Profit Target:</span>
                                <span className="text-green-400">{challenge.profit_target_percent}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Max Drawdown:</span>
                                <span className="text-red-400">{challenge.max_drawdown_percent}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Duration:</span>
                                <span>{challenge.duration_days} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Profit Split:</span>
                                <span className="text-cyan-400">{challenge.profit_split}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-4">Next Steps</h3>
                        <div className="space-y-3 text-sm text-gray-400">
                            {attempt.current_balance >= profitTargetValue ? (
                                <p className="text-green-400">🎉 Congratulations! You've passed this challenge. You'll be contacted about funded account opportunities.</p>
                            ) : attempt.current_balance <= maxDrawdownValue ? (
                                <p className="text-red-400">💀 This challenge has ended. Try again with a new challenge to improve your skills.</p>
                            ) : (
                                <>
                                    <p>• Hit your profit target of ${profitTargetValue.toLocaleString()}</p>
                                    <p>• Don't let equity fall below ${maxDrawdownValue.toLocaleString()}</p>
                                    <p>• Complete within {daysLeft} days</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}