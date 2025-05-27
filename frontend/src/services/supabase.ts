import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Custom fetch to route through CORS proxy for Supabase requests - This logic is currently unused.
// const originalFetch = fetch;
// const proxyPrefix = 'https://thingproxy.freeboard.io/fetch/';
// const customFetch: typeof fetch = (input, init) => {
//   let urlStr: string;
//   if (typeof input === 'string') {
//     urlStr = input;
//   } else if (input instanceof Request) {
//     urlStr = input.url;
//   } else if (input instanceof URL) {
//     urlStr = input.href;
//   } else {
//     urlStr = '';
//   }
//   // Only proxy Supabase REST requests
//   if (urlStr.startsWith(supabaseUrl)) {
//     const proxiedUrl = proxyPrefix + urlStr;
//     return originalFetch(proxiedUrl, init);
//   }
//   return originalFetch(input, init);
// };

export const supabase = createClient(supabaseUrl, supabaseKey); // Removed , { global: { fetch: customFetch } }

// Auth service
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
};