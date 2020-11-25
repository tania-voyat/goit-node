const { HttpCode } = require("../helpers/status");
const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts(req, res, next) {
  try {
    await fs.readFile(contactsPath, "utf-8").then((data) => {
      const contacts = JSON.parse(data);
      res.status(HttpCode.OK).json(contacts);
    });
  } catch (e) {
    next(e);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    await fs.readFile(contactsPath, "utf-8").then((data) => {
      const contacts = JSON.parse(data);
      const requiredContact = contacts.find(
        (contact) => contact.id === Number(contactId)
      );
      if (requiredContact) {
        return res.status(HttpCode.OK).json(requiredContact);
      } else {
        return res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
      }
    });
  } catch (e) {
    next(e);
  }
}

async function addContact(req, res, next) {
  const newContact = req.body;
  try {
    await fs.readFile(contactsPath, "utf-8").then((data) => {
      const contacts = JSON.parse(data);
      contacts.push({ id: contacts.length + 1, ...newContact });
      fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
      res.status(HttpCode.CREATED).json(newContact);
    });
  } catch (e) {
    next(e);
  }
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;
  try {
    fs.readFile(contactsPath, "utf-8").then((data) => {
      const contacts = JSON.parse(data);
      const index = contacts.findIndex(
        (contact) => contact.id === Number(contactId)
      );
      if (index !== -1) {
        contacts.splice(index, 1);
        fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return res.status(HttpCode.OK).json({ message: "Contact deleted" });
      } else {
        return res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
      }
    });
  } catch (e) {
    next(e);
  }
}

function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    fs.readFile(contactsPath, "utf-8").then((data) => {
      const contacts = JSON.parse(data);
      const index = contacts.findIndex(
        (contact) => contact.id === Number(contactId)
      );
      if (index !== -1) {
        const updatedContact = {
          ...contacts[index],
          ...req.body,
        };
        const updatedContacts = [
          ...contacts.slice(0, index),
          updatedContact,
          ...contacts.slice(index + 1),
        ];
        fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
        return res.status(HttpCode.OK).json({ message: "Contact updated" });
      } else {
        return res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
      }
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
