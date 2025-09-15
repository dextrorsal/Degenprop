// Challenge entity class
export class Challenge {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.platform = data.platform;
    this.initial_capital = data.initial_capital;
    this.profit_target_percent = data.profit_target_percent;
    this.max_drawdown_percent = data.max_drawdown_percent;
    this.duration_days = data.duration_days;
    this.fee = data.fee;
    this.profit_split = data.profit_split;
    this.image_url = data.image_url;
    this.leverage = data.leverage;
  }

  // Static method to get all challenges
  static async list(searchTerm = '', limit = null) {
    // In a real app, this would make an API call
    // For now, return sample data
    const sampleChallenges = [
      {
        id: '1',
        name: 'Memecoin Madness',
        description: 'Prove you can ride the memecoin wave. Trade the hottest tokens on Pump.fun with our capital.',
        platform: 'Pump.fun',
        initial_capital: 10000,
        profit_target_percent: 20,
        max_drawdown_percent: 10,
        duration_days: 30,
        fee: 99,
        profit_split: 80,
        image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
        leverage: '10x'
      },
      {
        id: '2',
        name: 'Perp Master',
        description: 'Master perpetual futures on Drift. Show us your risk management skills.',
        platform: 'Drift',
        initial_capital: 25000,
        profit_target_percent: 15,
        max_drawdown_percent: 8,
        duration_days: 45,
        fee: 199,
        profit_split: 75,
        image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
        leverage: '20x'
      },
      {
        id: '3',
        name: 'Hyperliquid Hero',
        description: 'Conquer the Hyperliquid ecosystem. Trade spot, perps, and options.',
        platform: 'Hyperliquid',
        initial_capital: 50000,
        profit_target_percent: 12,
        max_drawdown_percent: 6,
        duration_days: 60,
        fee: 399,
        profit_split: 70,
        image_url: 'https://images.unsplash.com/photo-1642790104077-9a7b8a5f5c5c?w=400&h=300&fit=crop',
        leverage: '50x'
      },
      {
        id: '4',
        name: 'Jupiter Juggernaut',
        description: 'Navigate the Jupiter ecosystem. Master DEX aggregators and yield farming.',
        platform: 'Jupiter',
        initial_capital: 15000,
        profit_target_percent: 25,
        max_drawdown_percent: 12,
        duration_days: 30,
        fee: 149,
        profit_split: 80,
        image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
        leverage: '5x'
      },
      {
        id: '5',
        name: 'Multi-Platform Master',
        description: 'Trade across multiple platforms. Show versatility in your approach.',
        platform: 'Multi-Platform',
        initial_capital: 75000,
        profit_target_percent: 18,
        max_drawdown_percent: 8,
        duration_days: 90,
        fee: 599,
        profit_split: 65,
        image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
        leverage: '25x'
      },
      {
        id: '6',
        name: 'Drift + Hyperliquid',
        description: 'Master both Drift and Hyperliquid. Dual platform expertise required.',
        platform: 'Drift + Hyperliquid',
        initial_capital: 100000,
        profit_target_percent: 15,
        max_drawdown_percent: 7,
        duration_days: 75,
        fee: 799,
        profit_split: 60,
        image_url: 'https://images.unsplash.com/photo-1642790104077-9a7b8a5f5c5c?w=400&h=300&fit=crop',
        leverage: '30x'
      }
    ];

    let filtered = sampleChallenges;
    
    if (searchTerm) {
      filtered = sampleChallenges.filter(challenge => 
        challenge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered.map(challenge => new Challenge(challenge));
  }

  // Static method to get a specific challenge by ID
  static async get(id) {
    const challenges = await this.list();
    return challenges.find(challenge => challenge.id === id);
  }
}
