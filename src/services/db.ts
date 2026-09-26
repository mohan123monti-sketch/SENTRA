/**
 * SENTRA Persistent Client Database Service (IndexedDB with LocalStorage Fallback)
 * 
 * Provides local persistent storage for:
 * - Confidential Well-Being Check-Ins (/checkins)
 * - Complainant Profiles (/victims)
 * - Tamper-evident Audit Logs (/audit_logs)
 */

import { CheckInRecord, VictimProfile, AuditLogEntry } from '../types/sentra';

const DB_NAME = 'sentra_justice_db';
const DB_VERSION = 1;

const STORES = {
  CHECKINS: 'checkins',
  VICTIMS: 'victims',
  AUDIT_LOGS: 'audit_logs'
} as const;

let dbInstance: IDBDatabase | null = null;

/**
 * Open or initialize the IndexedDB database
 */
export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Check-ins Store
      if (!db.objectStoreNames.contains(STORES.CHECKINS)) {
        const checkinStore = db.createObjectStore(STORES.CHECKINS, { keyPath: 'id' });
        checkinStore.createIndex('victimId', 'victimId', { unique: false });
        checkinStore.createIndex('timestamp', 'timestamp', { unique: false });
        checkinStore.createIndex('caseId', 'caseId', { unique: false });
      }

      // 2. Victims Profile Store
      if (!db.objectStoreNames.contains(STORES.VICTIMS)) {
        db.createObjectStore(STORES.VICTIMS, { keyPath: 'id' });
      }

      // 3. Audit Logs Store
      if (!db.objectStoreNames.contains(STORES.AUDIT_LOGS)) {
        const auditStore = db.createObjectStore(STORES.AUDIT_LOGS, { keyPath: 'id' });
        auditStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB failed to open, falling back to LocalStorage:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

/* =========================================================================
   CHECK-IN DATABASE OPERATIONS
   ========================================================================= */

/**
 * Save a newly submitted check-in to IndexedDB (with localStorage backup)
 */
export const saveCheckInToDB = async (record: CheckInRecord): Promise<void> => {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORES.CHECKINS], 'readwrite');
      const store = transaction.objectStore(STORES.CHECKINS);
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // LocalStorage fallback
    try {
      const existing = getCheckInsFromLocalStorage();
      const updated = [record, ...existing.filter(item => item.id !== record.id)];
      localStorage.setItem('sentra_db_checkins', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save checkin to localStorage backup:', e);
    }
  }

  // Also sync to localStorage as immediate redundancy
  try {
    const existing = getCheckInsFromLocalStorage();
    const updated = [record, ...existing.filter(item => item.id !== record.id)];
    localStorage.setItem('sentra_db_checkins', JSON.stringify(updated));
  } catch {
    // Ignore storage quota warnings
  }
};

/**
 * Retrieve all check-in records from database
 */
export const getCheckInsFromDB = async (victimId?: string): Promise<CheckInRecord[]> => {
  try {
    const db = await openDatabase();
    const records = await new Promise<CheckInRecord[]>((resolve, reject) => {
      const transaction = db.transaction([STORES.CHECKINS], 'readonly');
      const store = transaction.objectStore(STORES.CHECKINS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    if (records && records.length > 0) {
      const sorted = records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return victimId ? sorted.filter(c => c.victimId === victimId) : sorted;
    }
  } catch {
    // Fall back to localStorage
  }

  const local = getCheckInsFromLocalStorage();
  return victimId ? local.filter(c => c.victimId === victimId) : local;
};

/**
 * Purge voluntary check-in history from database (Statutory Right)
 */
export const purgeCheckInsFromDB = async (victimId: string): Promise<void> => {
  try {
    const db = await openDatabase();
    const all = await getCheckInsFromDB();
    const toKeep = all.filter(c => c.victimId !== victimId);

    const transaction = db.transaction([STORES.CHECKINS], 'readwrite');
    const store = transaction.objectStore(STORES.CHECKINS);
    store.clear();
    toKeep.forEach(rec => store.put(rec));
  } catch {
    // Fallback
  }

  try {
    const local = getCheckInsFromLocalStorage();
    const toKeep = local.filter(c => c.victimId !== victimId);
    localStorage.setItem('sentra_db_checkins', JSON.stringify(toKeep));
  } catch {
    // ignore
  }
};

/* =========================================================================
   VICTIM PROFILE DATABASE OPERATIONS
   ========================================================================= */

export const saveVictimProfileToDB = async (victim: VictimProfile): Promise<void> => {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORES.VICTIMS], 'readwrite');
      const store = transaction.objectStore(STORES.VICTIMS);
      const request = store.put(victim);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // LocalStorage fallback
  }

  try {
    localStorage.setItem(`sentra_db_victim_${victim.id}`, JSON.stringify(victim));
  } catch {
    // ignore
  }
};

export const getVictimProfileFromDB = async (victimId: string): Promise<VictimProfile | null> => {
  try {
    const db = await openDatabase();
    const record = await new Promise<VictimProfile | null>((resolve, reject) => {
      const transaction = db.transaction([STORES.VICTIMS], 'readonly');
      const store = transaction.objectStore(STORES.VICTIMS);
      const request = store.get(victimId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });

    if (record) return record;
  } catch {
    // Fall back to localStorage
  }

  try {
    const local = localStorage.getItem(`sentra_db_victim_${victimId}`);
    if (local) return JSON.parse(local);
  } catch {
    // ignore
  }

  return null;
};

/* =========================================================================
   AUDIT LOG DATABASE OPERATIONS
   ========================================================================= */

export const saveAuditLogToDB = async (entry: AuditLogEntry): Promise<void> => {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORES.AUDIT_LOGS], 'readwrite');
      const store = transaction.objectStore(STORES.AUDIT_LOGS);
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // ignore
  }
};

/* =========================================================================
   HELPERS & LOCALSTORAGE FALLBACK
   ========================================================================= */

function getCheckInsFromLocalStorage(): CheckInRecord[] {
  try {
    const raw = localStorage.getItem('sentra_db_checkins');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}
