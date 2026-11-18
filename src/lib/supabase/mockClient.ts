import fs from 'fs';
import path from 'path';

export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  render_credits: number;
  plan: string;
}

const DEFAULT_USER: MockUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'creator@antigravity.test',
  full_name: 'Studio Creator',
  render_credits: 500,
  plan: 'agency',
};

const DATA_DIR = path.resolve(process.cwd(), '.local_dev_db');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getTableFile(table: string) {
  return path.join(DATA_DIR, `${table}.json`);
}

function readTable(table: string): any[] {
  const filePath = getTableFile(table);
  if (!fs.existsSync(filePath)) {
    if (table === 'users') {
      const initial = [DEFAULT_USER];
      fs.writeFileSync(filePath, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeTable(table: string, data: any[]) {
  const filePath = getTableFile(table);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export type SetSessionFn = (val: string | null) => void;

export function createMockClient(session: string | null, setSession: SetSessionFn) {
  const currentUser = DEFAULT_USER;

  const chainable = (table: string) => {
    let rows = readTable(table);
    let filters: Array<(row: any) => boolean> = [];
    let sortFn: ((a: any, b: any) => number) | null = null;
    let limitCount: number | null = null;

    let isHeadCount = false;

    const builder: any = {
      select: (cols?: string, options?: { count?: 'exact'; head?: boolean }) => {
        if (options?.head) {
          isHeadCount = true;
        }
        return builder;
      },
      eq: (field: string, val: any) => {
        filters.push((r) => r[field] === val);
        return builder;
      },
      order: (field: string, opts?: { ascending?: boolean }) => {
        const asc = opts?.ascending !== false;
        sortFn = (a, b) => {
          if (a[field] < b[field]) return asc ? -1 : 1;
          if (a[field] > b[field]) return asc ? 1 : -1;
          return 0;
        };
        return builder;
      },
      limit: (n: number) => {
        limitCount = n;
        return builder;
      },
      single: async () => {
        let filtered = rows.filter((r) => filters.every((f) => f(r)));
        if (sortFn) filtered.sort(sortFn);
        return { data: filtered[0] ?? null, error: null };
      },
      insert: (newRows: any) => {
        const arr = Array.isArray(newRows) ? newRows : [newRows];
        const withIds = arr.map((item) => ({
          id: item.id || `local-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          created_at: item.created_at || new Date().toISOString(),
          ...item,
        }));
        rows.push(...withIds);
        writeTable(table, rows);

        const resultObj: any = {
          data: Array.isArray(newRows) ? withIds : withIds[0],
          error: null,
          select: () => resultObj,
          single: async () => ({ data: withIds[0], error: null }),
          then: (resolve: any) => {
            resolve({ data: Array.isArray(newRows) ? withIds : withIds[0], error: null });
          },
        };

        return resultObj;
      },
      update: (changes: any) => {
        const updateBuilder: any = {
          eq: (field: string, val: any) => {
            filters.push((r) => r[field] === val);
            rows = rows.map((r) => {
              if (filters.every((f) => f(r))) {
                return { ...r, ...changes, updated_at: new Date().toISOString() };
              }
              return r;
            });
            writeTable(table, rows);
            return updateBuilder;
          },
          then: (resolve: any) => {
            resolve({ data: rows, error: null });
          },
        };
        return updateBuilder;
      },
      delete: () => {
        const deleteBuilder: any = {
          eq: (field: string, val: any) => {
            filters.push((r) => r[field] === val);
            rows = rows.filter((r) => !filters.every((f) => f(r)));
            writeTable(table, rows);
            return deleteBuilder;
          },
          then: (resolve: any) => {
            rows = rows.filter((r) => !filters.every((f) => f(r)));
            writeTable(table, rows);
            resolve({ data: [], error: null });
          },
        };
        return deleteBuilder;
      },
      then: (resolve: any) => {
        let filtered = rows.filter((r) => filters.every((f) => f(r)));
        if (sortFn) filtered.sort(sortFn);
        if (limitCount !== null) filtered = filtered.slice(0, limitCount);
        if (isHeadCount) {
          resolve({ data: null, error: null, count: filtered.length });
        } else {
          resolve({ data: filtered, error: null, count: filtered.length });
        }
      },
    };

    return builder;
  };

  const auth = {
    getUser: async () => ({
      data: {
        user: {
          id: currentUser.id,
          email: currentUser.email,
          user_metadata: { full_name: currentUser.full_name },
        },
      },
    }),
    signOut: async () => {
      setSession(null);
      return { error: null };
    },
    signUp: async () => ({ data: { user: currentUser }, error: null }),
    signInWithPassword: async () => ({ data: { user: currentUser }, error: null }),
    signInWithOAuth: async () => ({ data: null, error: null }),
    exchangeCodeForSession: async () => ({ error: null }),
  };

  const storage = {
    from: (_bucket: string) => ({
      upload: async (key: string, data: any) => {
        const dest = path.join(process.cwd(), 'public', key);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        if (Buffer.isBuffer(data)) {
          fs.writeFileSync(dest, data);
        } else if (typeof data === 'string') {
          fs.writeFileSync(dest, data, 'utf-8');
        }
        return { data: { path: key }, error: null };
      },
      getPublicUrl: (key: string) => ({
        data: { publicUrl: key.startsWith('http') ? key : `/${key.replace(/\\/g, '/')}` },
      }),
      download: async (_path: string) => ({ data: null, error: null }),
      remove: async () => ({ error: null }),
    }),
  };

  return {
    from: chainable,
    auth,
    storage,
  };
}
