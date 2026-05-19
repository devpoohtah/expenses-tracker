// Expenses Logger - Main App Logic

let currentEditId = null;

// DOM Elements
const budgetInput = document.getElementById('budgetInput');
const eventInput = document.getElementById('eventInput');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const budgetDisplay = document.getElementById('budgetDisplay');
const grandTotalDisplay = document.getElementById('grandTotalDisplay');
const budgetRemainingDisplay = document.getElementById('budgetRemainingDisplay');

const categoryInput = document.getElementById('categoryInput');
const outingInput = document.getElementById('outingInput');
const itemInput = document.getElementById('itemInput');
const costInput = document.getElementById('costInput');
const addExpenseBtn = document.getElementById('addExpenseBtn');

const expensesList = document.getElementById('expensesList');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const themeToggle = document.getElementById('themeToggle');

const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const confirmModal = document.getElementById('confirmModal');
const exportBeforeClearBtn = document.getElementById('exportBeforeClearBtn');
const confirmClearBtn = document.getElementById('confirmClearBtn');
const cancelClearBtn = document.getElementById('cancelClearBtn');

// ─── Init ────────────────────────────────────────────────
async function initApp() {
    await expenseDB.init();
    applyTheme();
    await updateBudgetDisplay();
    await loadExpenses();
    attachListeners();
}

// ─── Theme ───────────────────────────────────────────────
function applyTheme() {
    const dark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    themeToggle.textContent = dark ? '☀️' : '🌙';
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

// ─── Budget ──────────────────────────────────────────────
async function setBudget() {
    const amount = parseFloat(budgetInput.value);
    const eventName = eventInput.value.trim();

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid budget amount.');
        return;
    }
    if (!eventName) {
        alert('Please enter an event name.');
        return;
    }

    await expenseDB.setBudget(amount, eventName);
    budgetInput.value = '';
    eventInput.value = '';
    await updateBudgetDisplay();
    await loadExpenses();
}

async function updateBudgetDisplay() {
    const { amount, eventName } = await expenseDB.getBudget();
    const totalSpent = await expenseDB.getTotalSpent();
    const remaining = amount - totalSpent;

    budgetDisplay.textContent = `₱${amount.toFixed(2)}`;
    if (eventName) budgetDisplay.title = `Event: ${eventName}`;

    grandTotalDisplay.textContent = `₱${totalSpent.toFixed(2)}`;

    budgetRemainingDisplay.textContent = `₱${Math.abs(remaining).toFixed(2)}`;
    budgetRemainingDisplay.className = remaining < 0
        ? 'text-2xl font-bold text-red-500 dark:text-red-400'
        : 'text-2xl font-bold text-green-600 dark:text-green-400';
}

// ─── Expenses ────────────────────────────────────────────
async function addExpense() {
    const category = categoryInput.value.trim();
    const outing = outingInput.value.trim();
    const item = itemInput.value.trim();
    const cost = parseFloat(costInput.value);

    if (!category || !outing || !item || isNaN(cost) || cost < 0) {
        alert('Please fill in all fields with valid values.');
        return;
    }

    if (currentEditId !== null) {
        await expenseDB.updateExpense(currentEditId, category, outing, item, cost);
        currentEditId = null;
        addExpenseBtn.textContent = '+ Add Expense';
    } else {
        await expenseDB.addExpense(category, outing, item, cost);
    }

    categoryInput.value = '';
    outingInput.value = '';
    itemInput.value = '';
    costInput.value = '';

    await loadExpenses();
    await updateBudgetDisplay();
}

async function loadExpenses() {
    const expenses = await expenseDB.getAllExpenses();
    const { eventName } = await expenseDB.getBudget();
    expensesList.innerHTML = '';

    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="text-center text-gray-400 dark:text-gray-500 py-10">No expenses logged yet</p>';
        return;
    }

    expenses.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'p-4 mb-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow transition-shadow';

        // Top row: event badge + category + cost
        const topRow = document.createElement('div');
        topRow.className = 'flex items-start justify-between gap-2 mb-2';

        const topLeft = document.createElement('div');
        topLeft.className = 'flex flex-wrap items-center gap-2';

        if (eventName) {
            const badge = document.createElement('span');
            badge.className = 'text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full font-medium whitespace-nowrap';
            badge.textContent = eventName;
            topLeft.appendChild(badge);
        }

        const cat = document.createElement('span');
        cat.className = 'font-semibold text-gray-900 dark:text-white break-all';
        cat.textContent = exp.category;
        topLeft.appendChild(cat);

        const cost = document.createElement('span');
        cost.className = 'text-lg font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap ml-auto';
        cost.textContent = `₱${exp.cost.toFixed(2)}`;

        topRow.appendChild(topLeft);
        topRow.appendChild(cost);

        // Middle: outing & item
        const mid = document.createElement('p');
        mid.className = 'text-sm text-gray-600 dark:text-gray-400 break-all mb-1';
        mid.textContent = `${exp.outing} • ${exp.item}`;

        // Bottom row: date + action buttons
        const bottomRow = document.createElement('div');
        bottomRow.className = 'flex items-center justify-between mt-2';

        const date = document.createElement('span');
        date.className = 'text-xs text-gray-400 dark:text-gray-500';
        date.textContent = exp.date;

        const actions = document.createElement('div');
        actions.className = 'flex gap-2';

        const editBtn = document.createElement('button');
        editBtn.className = 'px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => startEdit(exp);

        const delBtn = document.createElement('button');
        delBtn.className = 'px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors';
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteExpense(exp.id);

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        bottomRow.appendChild(date);
        bottomRow.appendChild(actions);

        div.appendChild(topRow);
        div.appendChild(mid);
        div.appendChild(bottomRow);
        expensesList.appendChild(div);
    });
}

function startEdit(exp) {
    currentEditId = exp.id;
    categoryInput.value = exp.category;
    outingInput.value = exp.outing;
    itemInput.value = exp.item;
    costInput.value = exp.cost;
    addExpenseBtn.textContent = '✓ Update Expense';
    categoryInput.focus();
    categoryInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;
    await expenseDB.deleteExpense(id);
    await loadExpenses();
    await updateBudgetDisplay();
}

// ─── Export PDF ──────────────────────────────────────────
async function exportToPDF() {
    const { amount, eventName } = await expenseDB.getBudget();
    const totalSpent = await expenseDB.getTotalSpent();
    const remaining = amount - totalSpent;
    const expenses = await expenseDB.getAllExpenses();

    const el = document.createElement('div');
    el.style.cssText = 'padding:24px;font-family:Arial,sans-serif;color:#111;';

    el.innerHTML = `
        <h1 style="text-align:center;color:#4f46e5;margin-bottom:8px;">Expenses Report</h1>
        ${eventName ? `<p style="text-align:center;color:#6b7280;margin-bottom:24px;">Event: <strong>${eventName}</strong></p>` : ''}
        <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin-bottom:24px;">
            <p><strong>Total Budget:</strong> ₱${amount.toFixed(2)}</p>
            <p><strong>Total Spent:</strong> ₱${totalSpent.toFixed(2)}</p>
            <p><strong>Remaining:</strong> ₱${Math.abs(remaining).toFixed(2)} ${remaining < 0 ? '(Over Budget)' : ''}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr style="background:#4f46e5;color:#fff;">
                    <th style="padding:10px;text-align:left;border:1px solid #ddd;">Category</th>
                    <th style="padding:10px;text-align:left;border:1px solid #ddd;">Outing</th>
                    <th style="padding:10px;text-align:left;border:1px solid #ddd;">Item</th>
                    <th style="padding:10px;text-align:right;border:1px solid #ddd;">Cost</th>
                    <th style="padding:10px;text-align:center;border:1px solid #ddd;">Date</th>
                </tr>
            </thead>
            <tbody>
                ${expenses.map((e, i) => `
                <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};">
                    <td style="padding:10px;border:1px solid #ddd;">${e.category}</td>
                    <td style="padding:10px;border:1px solid #ddd;">${e.outing}</td>
                    <td style="padding:10px;border:1px solid #ddd;">${e.item}</td>
                    <td style="padding:10px;border:1px solid #ddd;text-align:right;font-weight:bold;">₱${e.cost.toFixed(2)}</td>
                    <td style="padding:10px;border:1px solid #ddd;text-align:center;">${e.date}</td>
                </tr>`).join('')}
            </tbody>
        </table>
        <p style="margin-top:24px;text-align:center;color:#9ca3af;font-size:12px;">Generated from Expenses Logger</p>
    `;

    html2pdf().set({
        margin: 10,
        filename: `expenses-${new Date().toISOString().split('T')[0]}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }).from(el).save();
}

// ─── Modals ──────────────────────────────────────────────
function openModal(modal) { modal.classList.remove('hidden'); }
function closeModal(modal) { modal.classList.add('hidden'); }

// ─── Listeners ───────────────────────────────────────────
function attachListeners() {
    // Theme
    themeToggle.addEventListener('click', toggleTheme);

    // Budget
    setBudgetBtn.addEventListener('click', setBudget);
    [budgetInput, eventInput].forEach(el =>
        el.addEventListener('keypress', e => e.key === 'Enter' && setBudget())
    );

    // Expenses
    addExpenseBtn.addEventListener('click', addExpense);
    [categoryInput, outingInput, itemInput, costInput].forEach(el =>
        el.addEventListener('keypress', e => e.key === 'Enter' && addExpense())
    );

    // Export
    exportPdfBtn.addEventListener('click', exportToPDF);

    // Settings modal
    settingsBtn.addEventListener('click', () => openModal(settingsModal));
    closeSettingsBtn.addEventListener('click', () => closeModal(settingsModal));
    settingsModal.addEventListener('click', e => e.target === settingsModal && closeModal(settingsModal));

    // Clear flow
    clearAllBtn.addEventListener('click', () => {
        closeModal(settingsModal);
        openModal(confirmModal);
    });
    cancelClearBtn.addEventListener('click', () => closeModal(confirmModal));
    confirmModal.addEventListener('click', e => e.target === confirmModal && closeModal(confirmModal));
    exportBeforeClearBtn.addEventListener('click', exportToPDF);
    confirmClearBtn.addEventListener('click', async () => {
        await expenseDB.clearAllExpenses();
        await loadExpenses();
        await updateBudgetDisplay();
        closeModal(confirmModal);
    });
}

// ─── Start ───────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}