// User entity class
export class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.wallet_address = data.wallet_address;
    this.created_date = data.created_date;
    this.last_login = data.last_login;
  }

  // Static method to get current user
  static async me() {
    // In a real app, this would make an API call
    // For now, return a demo user
    const demoUser = {
      id: '1',
      email: 'demo@degenprop.com',
      name: 'Demo Trader',
      wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
      created_date: new Date().toISOString(),
      last_login: new Date().toISOString()
    };

    return new User(demoUser);
  }

  // Static method to create a new user
  static async create(data) {
    // In a real app, this would make an API call
    const user = new User({
      id: Date.now().toString(),
      ...data,
      created_date: new Date().toISOString()
    });

    return user;
  }

  // Instance method to update user
  async update(data) {
    // In a real app, this would make an API call
    Object.assign(this, data);
    return this;
  }
}
