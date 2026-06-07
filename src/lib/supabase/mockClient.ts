export type SetSessionFn = (val: string | null) => void;

export function createMockClient(session: string | null, setSession: SetSessionFn) {
  const db: Record<string, any[]> = {};

  function ensureTable(table: string) {
    if (!db[table]) db[table] = [];
  }

  const chainable = (table: string) => {
    ensureTable(table);

    return {
      select: async (cols?: string) => ({ data: db[table], error: null }),
      insert: async (rows: any) => {
        const toInsert = Array.isArray(rows) ? rows : [rows];
        db[table].push(...toInsert);
        return { data: toInsert, error: null };
      },
      update: async (changes: any) => {
        // naive: apply changes to first row for convenience
        if (db[table].length > 0) {
          db[table][0] = { ...db[table][0], ...changes };
          return { data: [db[table][0]], error: null };
        }
        return { data: [], error: null };
      },
      delete: async () => ({ data: [], error: null }),
      eq() { return this; },
      single: async function() { return { data: db[table][0] ?? null, error: null } }
    } as const;
  };

  const auth = {
    getUser: async () => ({ data: { user: session ? { id: session } : null } }),
    signOut: async () => { setSession(null); return { error: null } },
    signUp: async (_: any) => ({ data: { user: session ? { id: session } : 'mock-user' }, error: null }),
    signInWithPassword: async (_: any) => ({ data: { user: session ? { id: session } : 'mock-user' }, error: null }),
    signInWithOAuth: async (_: any) => ({ data: null, error: null }),
    exchangeCodeForSession: async (_: any) => ({ error: null })
  };

  const storage = {
    from: (_bucket: string) => ({
      upload: async (_path: string, _data: any) => ({ data: null, error: null }),
      download: async (_path: string) => ({ data: null, error: null }),
    })
  };

  return {
    from: chainable,
    auth,
    storage,
  };
}
