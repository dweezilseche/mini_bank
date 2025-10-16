# Mini Bank

Ce projet est une mini-banque en JavaScript permettant de gérer des clients, des comptes et des opérations bancaires en mémoire.

## Fonctions disponibles

Voici la liste des fonctions que tu peux utiliser dans la console :

### Création et gestion des clients

- `createNewClient(firstName, lastName)`
  > Crée un nouveau client. Retourne l'id du client.

### Création et gestion des comptes

- `createNewAccount(idClient, balance)`
  > Crée un nouveau compte pour un client avec un solde initial.
- `getAccountsByClient(idClient)`
  > Retourne tous les comptes d'un client.
- `deleteAccount(idAccount)`
  > Supprime un compte (si le solde est à 0).

### Opérations bancaires

- `deposit(idAccount, amount)`
  > Dépose de l'argent sur un compte.
- `withdrawal(idAccount, amountToRemove)`
  > Retire de l'argent d'un compte.
- `transfer(idAccountSender, idAccountReceiver, amountToTransfer)`
  > Transfère de l'argent d'un compte à un autre.

### Consultation des soldes

- `accountBalance(idClient, idAccount)`
  > Affiche le solde d'un compte pour un client donné.
- `globalClientBalance(idClient)`
  > Affiche le solde total de tous les comptes d'un client.
- `globalBankBalance()`
  > Affiche le solde total de la banque (tous les comptes).

### Historique des transactions

- `getAccountHistory(idAccount)`
  > Affiche l'historique des transactions d'un compte.

## Exemple d'utilisation

```js
// Créer un client
const idClient = createNewClient("Alice", "Dupont");

// Créer un compte pour ce client
const idAccount = createNewAccount(idClient, 100);

// Déposer de l'argent
deposit(idAccount, 50);

// Retirer de l'argent
withdrawal(idAccount, 30);

// Afficher le solde
accountBalance(idClient, idAccount); // 120

// Afficher l'historique
getAccountHistory(idAccount);
```

---

Toutes les fonctions sont à utiliser directement dans la console JS après chargement du projet.
