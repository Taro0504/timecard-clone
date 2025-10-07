export type AuthData = {
  isAuthenticated: boolean;
  user: { last_name?: string; full_name?: string; role?: string } | null;
};
