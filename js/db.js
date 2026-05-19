// IndexedDB Wrapper — Expenses Logger

class ExpenseDB {
    constructor() {
        this.dbName = 'ExpensesLoggerDB';
        this.version = 2; // bumped to trigger upgrade
        this.db = null;
    }

    init() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.dbName, this.version);

            req.onerror = () => reject(req.error);

            req.onsuccess = () => {
                this.db = req.result;
                resolve(this.db);
            };

            req.onupgradeneeded = (e) => {
                const db = e.target.result;

                if (!db.objectStoreNames.contains('budget')) {
                    db.createObjectStore('budget', { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains('expenses')) {
                    const store = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('date', 'date', { unique: false });
                }
            };
        });
    }

    // ── Budget ──────────────────────────────────────────

    setBudget(amount, eventName = '') {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['budget'], 'readwrite');
            const req = tx.objectStore('budget').put({ id: 'main', amount, eventName });
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    getBudget() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['budget'], 'readonly');
            const req = tx.objectStore('budget').get('main');
            req.onsuccess = () => resolve(req.result || { amount: 0, eventName: '' });
            req.onerror = () => reject(req.error);
        });
    }

    // ── Expenses ─────────────────────────────────────────

    addExpense(category, outing, item, cost) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['expenses'], 'readwrite');
            const record = {
                category,
                outing,
                item,
                cost: parseFloat(cost),
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now()
            };
            const req = tx.objectStore('expenses').add(record);
            req.onsuccess = () => { record.id = req.result; resolve(record); };
            req.onerror = () => reject(req.error);
        });
    }

    getAllExpenses() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['expenses'], 'readonly');
            const req = tx.objectStore('expenses').getAll();
            req.onsuccess = () => resolve(req.result.sort((a, b) => b.timestamp - a.timestamp));
            req.onerror = () => reject(req.error);
        });
    }

    updateExpense(id, category, outing, item, cost) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['expenses'], 'readwrite');
            const record = {
                id,
                category,
                outing,
                item,
                cost: parseFloat(cost),
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now()
            };
            const req = tx.objectStore('expenses').put(record);
            req.onsuccess = () => resolve(record);
            req.onerror = () => reject(req.error);
        });
    }

    deleteExpense(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['expenses'], 'readwrite');
            const req = tx.objectStore('expenses').delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    clearAllExpenses() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['expenses'], 'readwrite');
            const req = tx.objectStore('expenses').clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async getTotalSpent() {
        const expenses = await this.getAllExpenses();
        return expenses.reduce((sum, e) => sum + e.cost, 0);
    }
}

const expenseDB = new ExpenseDB();