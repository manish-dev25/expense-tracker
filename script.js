// Default 3 expense rows
const defaults = [
  { name: 'Rent / Housing', amount: '' },
  { name: 'Food & Groceries', amount: '' },
  { name: 'Transport', amount: '' },
];

function addExpense(name = '', amount = '') {
  const list = document.getElementById('expenseList');
  const row = document.createElement('div');
  row.className = 'expense-row';
  row.innerHTML = `
    <input type="text"   placeholder="Category name" value="${name}">
    <input type="number" placeholder="Amount (₹)"  value="${amount}" min="0">
    <button class="btn-remove" title="Remove" onclick="this.parentElement.remove()">×</button>
  `;
  list.appendChild(row);
}

// Init
defaults.forEach(d => addExpense(d.name, d.amount));

function fmt(n) {
  return '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0 });
}

function calculate() {
  const income = parseFloat(document.getElementById('income').value) || 0;

  const rows = document.querySelectorAll('.expense-row');
  let expenses = [];
  let totalExp = 0;

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const name   = inputs[0].value.trim() || 'Unnamed';
    const amount = parseFloat(inputs[1].value) || 0;
    if (amount > 0) {
      expenses.push({ name, amount });
      totalExp += amount;
    }
  });

  const savings = income - totalExp;
  const savingsPct = income > 0 ? (savings / income) * 100 : 0;

  // Status logic
  let statusClass, statusText, statusEmoji;
  if (income === 0) {
    statusClass = 'status-warning';
    statusText  = 'Enter your income to see status';
    statusEmoji = '⚠️';
  } else if (savings < 0) {
    statusClass = 'status-over';
    statusText  = 'Overspending — expenses exceed income!';
    statusEmoji = '🔴';
  } else if (savingsPct < 20) {
    statusClass = 'status-warning';
    statusText  = 'Warning — savings below 20%';
    statusEmoji = '🟡';
  } else {
    statusClass = 'status-safe';
    statusText  = 'Safe — you\'re saving well!';
    statusEmoji = '🟢';
  }

  // Show results
  const results = document.getElementById('results');
  results.style.display = 'block';

  document.getElementById('statusBadge').innerHTML = `
    <div class="status-badge ${statusClass}">
      <span class="dot"></span> ${statusText}
    </div>`;

  document.getElementById('rIncome').textContent   = fmt(income);
  document.getElementById('rExpenses').textContent = fmt(totalExp);

  const savEl = document.getElementById('rSavings');
  savEl.textContent = (savings < 0 ? '-' : '') + fmt(savings);
  savEl.style.color = savings < 0 ? 'var(--red)' : savings === 0 ? 'var(--muted)' : 'var(--green)';

  // Breakdown
  const bd = document.getElementById('breakdown');
  if (expenses.length === 0) {
    bd.innerHTML = '<div style="color:var(--muted);font-size:0.85rem;padding:8px 0">No expenses added.</div>';
  } else {
    bd.innerHTML = expenses.map(e => {
      const pct = totalExp > 0 ? (e.amount / totalExp * 100).toFixed(1) : 0;
      return `
        <div class="breakdown-row">
          <span class="name">${e.name}</span>
          <span class="amount">${fmt(e.amount)} <span style="color:var(--muted);font-size:0.75rem">(${pct}%)</span></span>
        </div>
        <div class="bar-wrap"><div class="bar-fill" style="width:${pct}%"></div></div>`;
    }).join('');
  }

  // Savings note
  const note = document.getElementById('savingsNote');
  if (income > 0 && savings >= 0) {
    note.textContent = `You're saving ${savingsPct.toFixed(1)}% of your income this month.`;
  } else if (savings < 0) {
    note.textContent = `You need ₹${Math.abs(savings).toLocaleString('en-IN')} more or cut expenses.`;
  } else {
    note.textContent = '';
  }

  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
