const clients = [
  { id: crypto.randomUUID(), firstName: "Alice", lastName: "Dupont" },
  { id: crypto.randomUUID(), firstName: "Bob", lastName: "Martin" },
  { id: crypto.randomUUID(), firstName: "Charlie", lastName: "Durand" },
];

const accounts = [
  {
    id: crypto.randomUUID(),
    clientId: clients[0].id,
    balance: 5000,
    transactions: [],
  },
  {
    id: crypto.randomUUID(),
    clientId: clients[1].id,
    balance: 3000,
    transactions: [],
  },
  {
    id: crypto.randomUUID(),
    clientId: clients[2].id,
    balance: 7000,
    transactions: [],
  },
];

const isValidAmount = (amount) =>
  typeof amount === "number" && !isNaN(amount) && amount > 0;

const findAccountById = (accountId) =>
  accounts.find((account) => account.id === accountId);

const createClient = (firstName, lastName) => {
  const newClient = { id: crypto.randomUUID(), firstName, lastName };
  clients.push(newClient);

  return newClient.id;
};

const createAccount = (clientId, initialBalance) => {
  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    throw new Error("Client not found.");
  }

  if (!isValidAmount(initialBalance)) {
    throw new Error("Initial balance is not valid.");
  }

  const newAccount = {
    id: crypto.randomUUID(),
    clientId,
    balance: initialBalance,
    transactions: [],
  };
  accounts.push(newAccount);

  return newAccount.id;
};

const deleteAccount = (accountId) => {
  const index = accounts.findIndex((account) => account.id === accountId);
  const account = index !== -1 ? accounts[index] : null;

  if (!account) {
    throw new Error("Account not found.");
  }

  if (account.balance > 0) {
    throw new Error("Cannot delete account with a positive balance.");
  }

  accounts.splice(index, 1);
};

const deposit = (accountId, amount) => {
  if (!isValidAmount(amount)) {
    throw new Error("Deposit amount is not valid.");
  }

  const account = findAccountById(accountId);
  if (!account) {
    throw new Error("Account not found.");
  }

  account.balance += amount;
  account.transactions.push({ type: "deposit", amount, date: new Date() });
};

const withdraw = (accountId, amount) => {
  if (!isValidAmount(amount)) {
    throw new Error("Withdrawal amount is not valid.");
  }

  const account = findAccountById(accountId);
  if (!account) {
    throw new Error("Account not found.");
  }

  if (account.balance < amount) {
    throw new Error("Insufficient funds.");
  }

  account.balance -= amount;
  account.transactions.push({ type: "withdrawal", amount, date: new Date() });
};

const transfer = (fromAccountId, toAccountId, amount) => {
  if (!isValidAmount(amount)) {
    throw new Error("Transfer amount is not valid.");
  }

  const fromAccount = findAccountById(fromAccountId);
  const toAccount = findAccountById(toAccountId);

  if (!fromAccount || !toAccount) {
    throw new Error("One or both accounts not found.");
  }

  if (fromAccount.balance < amount) {
    throw new Error("Insufficient funds in the source account.");
  }

  fromAccount.balance -= amount;
  toAccount.balance += amount;
  const now = new Date();
  fromAccount.transactions.push({
    type: "transfer",
    amount,
    date: now,
    to: toAccountId,
  });
  toAccount.transactions.push({
    type: "transfer",
    amount,
    date: now,
    from: fromAccountId,
  });
};

const applyInterest = (rate) => {
  if (!isValidAmount(rate) || rate > 100) {
    throw new Error("Interest rate is not valid.");
  }

  accounts.forEach((account) => {
    const now = new Date();
    const lastInterestDate = account.transactions
      .filter((tx) => tx.type === "interest")
      .sort((a, b) => b.date - a.date)[0]?.date;
    const oneYearLater = new Date(lastInterestDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (lastInterestDate && now < oneYearLater) {
      console.log(
        `Interest already applied in the last year for account ID: ${account.id}`
      );
      return;
    }

    const interest = (account.balance * rate) / 100;
    account.balance += interest;
    account.transactions.push({
      type: "interest",
      amount: interest,
      date: new Date(),
    });
  });
};

const applyFees = (feeAmount) => {
  if (!isValidAmount(feeAmount)) {
    throw new Error("Fee amount is not valid.");
  }

  accounts.forEach((account) => {
    if (account.balance < feeAmount) {
      console.log(
        `Insufficient funds to apply fees for account ID: ${account.id}`
      );
      return;
    }
    const now = new Date();
    const lastFeeDate = account.transactions
      .filter((tx) => tx.type === "fee")
      .sort((a, b) => b.date - a.date)[0]?.date;
    const oneMonthLater = new Date(lastFeeDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    if (lastFeeDate && now < oneMonthLater) {
      console.log(
        `Fees already applied in the last month for account ID: ${account.id}`
      );
      return;
    }

    account.balance -= feeAmount;
    account.transactions.push({
      type: "fee",
      amount: feeAmount,
      date: new Date(),
    });
  });
};

const displayAccountBalance = (accountId) => {
  const account = findAccountById(accountId);

  if (!account) {
    throw new Error("Account not found.");
  }

  console.log(
    `Account ID: ${account.id}, Balance: ${account.balance.toFixed(2)}€`
  );
};

const displayAccountTransactionsHistory = (accountId) => {
  const account = findAccountById(accountId);

  if (!account) {
    throw new Error("Account not found.");
  }

  console.log(`Transaction History for Account ID: ${account.id}`);
  account.transactions.forEach((tx) => {
    console.log(
      `${tx.date.toISOString()} - ${tx.type} - ${tx.amount.toFixed(2)}€${
        tx.to ? " to " + tx.to : ""
      }${tx.from ? " from " + tx.from : ""}`
    );
  });
};

const displayClientTotalBalance = (clientId) => {
  const clientAccounts = accounts.filter(
    (account) => account.clientId === clientId
  );

  if (clientAccounts.length === 0) {
    throw new Error("Client has no accounts.");
  }

  const totalBalance = clientAccounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  console.log(
    `Client ID: ${clientId}, Total Balance Across All Accounts: ${totalBalance.toFixed(
      2
    )}€`
  );
};

const displayBankTotalBalance = () => {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  console.log(
    `Total Balance Across All Accounts in the Bank: ${totalBalance.toFixed(2)}€`
  );
};
