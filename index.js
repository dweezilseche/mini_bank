// Stockage
let clients = (() => {
  const stored = localStorage.getItem("clients");
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultClients = [
    { id: crypto.randomUUID(), firstName: "Alice", lastName: "Dupont" },
    { id: crypto.randomUUID(), firstName: "Bob", lastName: "Martin" },
    { id: crypto.randomUUID(), firstName: "Charlie", lastName: "Durand" },
  ];
  localStorage.setItem("clients", JSON.stringify(defaultClients));
  return defaultClients;
})();

let accounts = (() => {
  const stored = localStorage.getItem("accounts");
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultAccounts = [
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
  localStorage.setItem("accounts", JSON.stringify(defaultAccounts));
  return defaultAccounts;
})();

// ------------------ Bank Operations ------------------ //

const isValidAmount = (amount) =>
  typeof amount === "number" && !isNaN(amount) && amount > 0;

const findAccountById = (accountId) =>
  accounts.find((account) => account.id === accountId);

const createClient = (firstName, lastName) => {
  const newClient = { id: crypto.randomUUID(), firstName, lastName };
  clients.push(newClient);

  localStorage.setItem("clients", JSON.stringify(clients));

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

  localStorage.setItem("accounts", JSON.stringify(accounts));

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
  localStorage.setItem("accounts", JSON.stringify(accounts));
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

  localStorage.setItem("accounts", JSON.stringify(accounts));
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

  localStorage.setItem("accounts", JSON.stringify(accounts));
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

// ------------------ UI ------------------ //
const app = document.getElementById("app");
const clientSection = document.getElementById("clients-section");
const accountSection = document.getElementById("accounts-section");

const createClientList = () => {
  let div = document.querySelector("#client-list");

  if (!div) {
    div = document.createElement("div");
    div.id = "client-list";

    const tableDiv = document.createElement("table");
    tableDiv.id = "client-table";
    div.appendChild(tableDiv);
    clientSection.appendChild(div);
  }

  const tableDiv = document.getElementById("client-table");
  tableDiv.innerHTML = `
    <thead>
      <tr>
        <th>Prénom</th>
        <th>Nom</th>
        <th>Id</th>
      </tr>
    </thead>
    <tbody>
      ${clients
        .map(
          (client) => `
        <tr>
          <td>${client.firstName}</td>
          <td>${client.lastName}</td>
          <td>${client.id}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;
};

createClientList();

const createAccountList = () => {
  let div = document.querySelector("#account-list");

  if (!div) {
    div = document.createElement("div");
    div.id = "account-list";

    const tableDiv = document.createElement("table");
    tableDiv.id = "account-table";
    div.appendChild(tableDiv);
    accountSection.appendChild(div);
  }

  const tableDiv = document.getElementById("account-table");
  tableDiv.innerHTML = `
    <thead>
      <tr>
        <th>Compte Id</th>
        <th>Client Id</th>
        <th>Balance</th>
        <th>Supprimer</th>
      </tr>
    </thead>
    <tbody>
      ${accounts
        .map(
          (account) => `
        <tr>
          <td>${account.id}</td>
          <td>${account.clientId}</td>
          <td>${account.balance.toFixed(2)}€</td>
          <td><button class="delete-account-btn" data-account-id="${
            account.id
          }">Supprimer</button></td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;
};

createAccountList();

// New client creation form
const createClientBtn = document.getElementById("create-client-btn");
const clientForm = document.getElementById("client-form");
const submitClientBtn = document.getElementById("submit-client-btn");

createClientBtn.addEventListener("click", () => {
  clientForm.style.display = "block";
});

submitClientBtn.addEventListener("click", () => {
  const firstNameInput = document.getElementById("client-first-name");
  const lastNameInput = document.getElementById("client-last-name");

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();

  if (firstName && lastName) {
    const newClientId = createClient(firstName, lastName);
    alert(`Nouveau client créé avec l'ID : ${newClientId}`);
    firstNameInput.value = "";
    lastNameInput.value = "";
    clientForm.style.display = "none";
    createClientList();
    createAccountList();
  } else {
    alert("Veuillez remplir les deux champs.");
  }
});

// New account creation form
const createAccountBtn = document.getElementById("create-account-btn");
const accountForm = document.getElementById("account-form");
const submitAccountBtn = document.getElementById("submit-account-btn");

createAccountBtn.addEventListener("click", () => {
  accountForm.style.display = "block";
});

submitAccountBtn.addEventListener("click", () => {
  const ownerInput = document.getElementById("account-owner");
  const initialBalanceInput = document.getElementById("initial-balance");

  const clientId = ownerInput.value.trim();
  const initialBalance = parseFloat(initialBalanceInput.value);

  if (clientId && isValidAmount(initialBalance)) {
    try {
      const newAccountId = createAccount(clientId, initialBalance);
      alert(`Nouveau compte créé avec l'ID : ${newAccountId}`);
      ownerInput.value = "";
      initialBalanceInput.value = "";
      accountForm.style.display = "none";
      createAccountList();
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert("Veuillez fournir un ID client valide et un solde initial.");
  }
});

// Delete account buttons
const deleteAccountButtons = document.querySelectorAll(".delete-account-btn");

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-account-btn")) {
    const accountId = event.target.getAttribute("data-account-id");
    try {
      deleteAccount(accountId);
      alert(`Compte avec l'ID : ${accountId} supprimé.`);
      createAccountList();
    } catch (error) {
      alert(error.message);
    }
  }
});

// Deposit
document.getElementById("submit-deposit-btn").addEventListener("click", () => {
  const accountId = document.getElementById("deposit-account-id").value.trim();
  const amount = parseFloat(
    document.getElementById("deposit-amount").value.trim()
  );

  try {
    deposit(accountId, amount);
    alert(`Dépôt de ${amount}€ effectué sur le compte ${accountId}.`);
    createAccountList();
  } catch (error) {
    alert(error.message);
  }
});

// Withdraw
document
  .getElementById("submit-withdrawal-btn")
  .addEventListener("click", () => {
    const accountId = document
      .getElementById("withdrawal-account-id")
      .value.trim();
    const amount = parseFloat(
      document.getElementById("withdrawal-amount").value.trim()
    );

    try {
      withdraw(accountId, amount);
      alert(`Retrait de ${amount}€ effectué sur le compte ${accountId}.`);
      createAccountList();
    } catch (error) {
      alert(error.message);
    }
  });

// Transfer
document.getElementById("submit-transfer-btn").addEventListener("click", () => {
  const fromAccountId = document
    .getElementById("transfer-from-account-id")
    .value.trim();
  const toAccountId = document
    .getElementById("transfer-to-account-id")
    .value.trim();
  const amount = parseFloat(
    document.getElementById("transfer-amount").value.trim()
  );

  try {
    transfer(fromAccountId, toAccountId, amount);
    alert(
      `Transfert de ${amount}€ effectué du compte ${fromAccountId} au compte ${toAccountId}.`
    );
    createAccountList();
  } catch (error) {
    alert(error.message);
  }
});
