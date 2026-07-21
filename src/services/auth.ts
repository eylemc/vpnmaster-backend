// Placeholder — replace with Supabase Auth when ready
export type AuthUser = {
  id: string;
  email: string;
};

export async function signIn(email: string, password: string): Promise<void> {
  // TODO: implement with supabase.auth.signInWithPassword({ email, password })
  throw new Error('Authentication not yet implemented');
}

export async function signUp(email: string, password: string): Promise<void> {
  // TODO: implement with supabase.auth.signUp({ email, password })
  throw new Error('Authentication not yet implemented');
}

export async function signOut(): Promise<void> {
  // TODO: implement with supabase.auth.signOut()
  throw new Error('Authentication not yet implemented');
}

export async function getSession(): Promise<AuthUser | null> {
  // TODO: implement with supabase.auth.getSession()
  return null;
}
