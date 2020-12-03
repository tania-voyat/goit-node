const { HttpCode } = require("../helpers/status");
const contactModel = require("../model/contactsModel");

async function listContacts(req, res, next) {
  try {
    const contacts = await contactModel.find();
    res.status(HttpCode.OK).json(contacts);
  } catch (e) {
    next(e);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const requiredContact = await contactModel.findById(contactId);
    if (requiredContact) {
      return res.status(HttpCode.OK).json(requiredContact);
    } else {
      return res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
    }
  } catch (e) {
    next(e);
  }
}

async function addContact(req, res, next) {
  try {
    const newContact = await contactModel.insert(req.body);
    res.status(HttpCode.CREATED).json(newContact);
  } catch (e) {
    next(e);
  }
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const deletedContact = await contactModel.findByIdAndDelete(contactId);
    if (deletedContact) {
      return res.status(HttpCode.OK).json({ message: "Contact deleted" });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
    }
  } catch (e) {
    next(e);
  }
}

async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const updatedContact = await contactModel.findByIdAndUpdate(contactId, {
      $set: req.body,
    });
    if (updatedContact) {
      return res.status(HttpCode.OK).json({ message: "Contact updated" });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({ message: "Not found" });
    }
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
