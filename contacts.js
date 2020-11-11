const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("db", "contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => {
      const contacts = JSON.parse(data);
      contacts.map((contact) => console.table(contact));
    })
    .catch((err) => console.log(err.message));
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => {
      const contacts = JSON.parse(data);
      contacts.map((contact) => {
        if (contactId === contact.id) {
          console.log(contact);
        }
      });
    })
    .catch((err) => console.log(err.message));
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf-8")
    .then((data) => {
      const contacts = JSON.parse(data);
      const filteredContacts = contacts.filter(
        (contact) => contact.id !== contactId
      );
      fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 4));
    })
    .catch((err) => console.log(err.message));
}

function addContact(name, email, phone) {
  const newContact = { Name: name, Email: email, Phone: phone };
  fs.readFile(contactsPath, "utf-8")
    .then((data) => {
      const contacts = JSON.parse(data);
      contacts.push(newContact);
      fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
    })
    .catch((err) => console.log(err.message));
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
