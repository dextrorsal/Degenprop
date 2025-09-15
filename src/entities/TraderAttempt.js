// TraderAttempt entity class
export class TraderAttempt {
  constructor(data) {
    this.id = data.id;
    this.user_email = data.user_email;
    this.challenge_id = data.challenge_id;
    this.challenge_name = data.challenge_name;
    this.status = data.status || 'active';
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.initial_capital = data.initial_capital;
    this.current_balance = data.current_balance;
    this.equity_high = data.equity_high;
    this.simulated_pnl_history = data.simulated_pnl_history || [];
    this.simulated_trades = data.simulated_trades || [];
    this.created_date = data.created_date || new Date().toISOString();
  }

  // Static method to create a new trader attempt
  static async create(data) {
    // In a real app, this would make an API call
    // For now, simulate creation and store in localStorage
    const attempt = new TraderAttempt({
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString()
    });

    // Store in localStorage for demo purposes
    const attempts = JSON.parse(localStorage.getItem('traderAttempts') || '[]');
    attempts.push(attempt);
    localStorage.setItem('traderAttempts', JSON.stringify(attempts));

    return attempt;
  }

  // Static method to filter attempts
  static async filter(filters = {}, sortBy = '-created_date', limit = null) {
    // In a real app, this would make an API call
    // For now, get from localStorage
    const attempts = JSON.parse(localStorage.getItem('traderAttempts') || '[]');
    
    let filtered = attempts;

    // Apply filters
    if (filters.user_email) {
      filtered = filtered.filter(attempt => attempt.user_email === filters.user_email);
    }
    if (filters.status) {
      filtered = filtered.filter(attempt => attempt.status === filters.status);
    }
    if (filters.challenge_id) {
      filtered = filtered.filter(attempt => attempt.challenge_id === filters.challenge_id);
    }

    // Apply sorting
    if (sortBy.startsWith('-')) {
      const field = sortBy.substring(1);
      filtered.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    } else {
      filtered.sort((a, b) => new Date(a[sortBy]) - new Date(b[sortBy]));
    }

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered.map(attempt => new TraderAttempt(attempt));
  }

  // Static method to get a specific attempt by ID
  static async get(id) {
    const attempts = JSON.parse(localStorage.getItem('traderAttempts') || '[]');
    const attempt = attempts.find(attempt => attempt.id === id);
    return attempt ? new TraderAttempt(attempt) : null;
  }

  // Instance method to update attempt
  async update(data) {
    const attempts = JSON.parse(localStorage.getItem('traderAttempts') || '[]');
    const index = attempts.findIndex(attempt => attempt.id === this.id);
    
    if (index !== -1) {
      attempts[index] = { ...attempts[index], ...data };
      localStorage.setItem('traderAttempts', JSON.stringify(attempts));
      
      // Update this instance
      Object.assign(this, data);
    }
    
    return this;
  }
}
