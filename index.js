// Historique des transactions
let transactions = [];

/*
 * Ajouter une transaction à l'historique
 */
const addTransaction = (type, idAccount, amount) => {
  transactions.push({
    id: crypto.randomUUID(),
    type,
    idAccount,
    amount,
    date: new Date(),
  });
};

/*
 * Récupérer l'historique d'un compte
 */
const getAccountHistory = (idAccount) => {
  return transactions.filter((tx) => tx.idAccount === idAccount);
};

// Style console
console.log("%cBienvenue dans la Mini Bank", "color: gray;");
// Fin style console

/*
 * Base de clients
 */
const clients = [
  {
    firstName: "John",
    lastName: "Doe",
    idClient: crypto.randomUUID(),
  },
  {
    firstName: "Louis",
    lastName: "Garel",
    idClient: crypto.randomUUID(),
  },
  {
    firstName: "Jean",
    lastName: "Dujardin",
    idClient: crypto.randomUUID(),
  },
];

/*
 * Base de comptes bancaires
 */
let accounts = [
  {
    idAccount: crypto.randomUUID(),
    balance: 10,
    idClient: clients[0].idClient,
  },
  {
    idAccount: crypto.randomUUID(),
    balance: 15,
    idClient: clients[0].idClient,
  },
  {
    idAccount: crypto.randomUUID(),
    balance: 200,
    idClient: clients[1].idClient,
  },
  {
    idAccount: crypto.randomUUID(),
    balance: 55,
    idClient: clients[2].idClient,
  },
  {
    idAccount: crypto.randomUUID(),
    balance: 32,
    idClient: clients[1].idClient,
  },
];

/*
 * Création d'un nouveau client
 */
const createNewClient = (firstName, lastName) => {
  const newClient = { firstName, lastName, idClient: crypto.randomUUID() };
  clients.push(newClient);

  return newClient.idClient;
};

/*
 * Création d'un nouveau compte bancaire
 */
/*
 * Création d'un nouveau compte bancaire
 */
const createNewAccount = (idClient, balance) => {
  const existingClient = clients.some((client) => client.idClient === idClient);

  if (!existingClient) {
    console.error("Erreur: L'identifiant du client n'est pas correct");
    return;
  }

  const newAccount = { idAccount: crypto.randomUUID(), balance, idClient };
  accounts.push(newAccount);

  return newAccount.idAccount;
};

/*
 * Récupérer les comptes d'un client
 */
const getAccountsByClient = (idClient) => {
  const existingClient = clients.some((client) => client.idClient === idClient);

  if (!existingClient) {
    console.error("Le client n'existe pas");
    return;
  }

  const accountClient = accounts.filter(
    (account) => account.idClient === idClient
  );

  return accountClient;
};

/*
 * Supprimer un compte bancaire
 */
const deleteAccount = (idAccount) => {
  const findAccountById = accounts.find(
    (account) => account.idAccount === idAccount
  );

  if (!findAccountById) {
    console.error("Le compte n'existe pas");
    return false;
  } else if (findAccountById.balance > 0) {
    console.error("Il y'a encore de l'argent sur le compte");
    return false;
  }

  accounts = accounts.filter((account) => account.idAccount !== idAccount);
  console.log("Compte supprimé avec succès");
  return true;
};

/*
 * Déposer de l'argent sur le compte d'un client
 */
const deposit = (idAccount, amount) => {
  const findAccountById = accounts.find(
    (account) => account.idAccount === idAccount
  );

  if (!findAccountById) {
    console.error("Le compte n'existe pas");
    return false;
  }

  accounts = accounts.map((account) => {
    if (account.idAccount === idAccount) {
      return {
        ...account,
        balance: account.balance + amount,
      };
    } else {
      return account;
    }
  });

  addTransaction("deposit", idAccount, amount);
  return findAccountById.balance + amount;
};

/*
 * Retirer de l'argent sur le compte d'un client
 */
const withdrawal = (idAccount, amountToRemove) => {
  const findAccountById = accounts.find(
    (account) => account.idAccount === idAccount
  );

  if (!findAccountById) {
    console.error("Le compte n'existe pas");
    return false;
  } else if (findAccountById.balance < amountToRemove) {
    console.error("Le solde du compte n'est pas suffisant");
    return false;
  }

  accounts = accounts.map((account) => {
    if (account.idAccount === idAccount) {
      return {
        ...account,
        balance: account.balance - amountToRemove,
      };
    } else {
      return account;
    }
  });

  addTransaction("withdrawal", idAccount, amountToRemove);
  return findAccountById.balance - amountToRemove;
};

/*
 * Transférer de l'argent entre deux comptes
 */
const transfer = (idAccountSender, idAccountReceiver, amountToTransfer) => {
  const findAccountById = (id) =>
    accounts.find((account) => account.idAccount === id);

  const sender = findAccountById(idAccountSender);
  const receiver = findAccountById(idAccountReceiver);

  if (!sender || !receiver) {
    console.error("Un des deux comptes n'est pas valide");
    return false;
  }

  if (sender.balance < amountToTransfer) {
    console.error("Le solde du compte envoyeur n'est pas suffisant");
    return false;
  }

  accounts = accounts.map((account) => {
    if (account.idAccount === idAccountSender) {
      return { ...account, balance: account.balance - amountToTransfer };
    }
    if (account.idAccount === idAccountReceiver) {
      return { ...account, balance: account.balance + amountToTransfer };
    }
    return account;
  });

  addTransaction("transfer", idAccountSender, -amountToTransfer, {
    to: idAccountReceiver,
  });
  addTransaction("transfer", idAccountReceiver, amountToTransfer, {
    from: idAccountSender,
  });
  return true;
};

/*
 * Afficher le solde d'un compte pour un client donné
 */
const accountBalance = (idClient, idAccount) => {
  const account = accounts.find(
    (acc) => acc.idAccount === idAccount && acc.idClient === idClient
  );

  if (!account) {
    console.error("Informations erronées");
    return false;
  }

  return account.balance;
};

/*
 * Afficher le solde total d'un client
 */
const globalClientBalance = (idClient) => {
  const findClientById = clients.find((client) => client.idClient === idClient);

  if (!findClientById) {
    console.error("L'identifiant client est incorrecte");
    return false;
  }

  const clientAccounts = accounts.filter(
    (account) => account.idClient === idClient
  );
  const totalBalance = clientAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );
  return totalBalance;
};

/*
 * Afficher le solde total de la banque
 */
const globalBankBalance = () => {
  const globalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  return globalBalance;
};
