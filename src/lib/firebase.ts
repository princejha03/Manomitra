// Demo Authentication System
// This replaces Firebase with a simple localStorage-based demo auth

export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

class DemoAuth {
  private currentUser: DemoUser | null = null;
  private listeners: ((user: DemoUser | null) => void)[] = [];

  constructor() {
    // Load user from localStorage on initialization
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("demo_user");
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
        } catch (e) {
          localStorage.removeItem("demo_user");
        }
      }
    }
  }

  // Demo login - accepts any email/password combination
  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<DemoUser> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create demo user
    const user: DemoUser = {
      uid: `demo_${Date.now()}`,
      email,
      displayName: email.split("@")[0],
      emailVerified: true,
    };

    this.currentUser = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_user", JSON.stringify(user));
    }

    this.notifyListeners();
    return user;
  }

  // Demo registration
  async createUserWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<DemoUser> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create demo user
    const user: DemoUser = {
      uid: `demo_${Date.now()}`,
      email,
      displayName: email.split("@")[0],
      emailVerified: true,
    };

    this.currentUser = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_user", JSON.stringify(user));
    }

    this.notifyListeners();
    return user;
  }

  // Demo Google sign in
  async signInWithPopup(): Promise<DemoUser> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create demo Google user
    const user: DemoUser = {
      uid: `google_demo_${Date.now()}`,
      email: "demo@gmail.com",
      displayName: "Demo User",
      emailVerified: true,
    };

    this.currentUser = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("demo_user", JSON.stringify(user));
    }

    this.notifyListeners();
    return user;
  }

  // Sign out
  async signOut(): Promise<void> {
    this.currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_user");
    }
    this.notifyListeners();
  }

  // Get current user
  getCurrentUser(): DemoUser | null {
    return this.currentUser;
  }

  // Listen for auth state changes
  onAuthStateChanged(callback: (user: DemoUser | null) => void): () => void {
    this.listeners.push(callback);

    // Call immediately with current user
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.currentUser));
  }
}

// Create singleton instance
const demoAuth = new DemoAuth();

// Export for compatibility
export const auth = demoAuth;
export const db = null; // Not needed for demo
export const isFirebaseConfigured = true; // Always true for demo
