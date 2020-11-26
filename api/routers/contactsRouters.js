const express = require("express");
const router = express.Router();
const contactsControllers = require("../controllers/contactsControllers");
const {
  validateCreateContact,
  validateUpdateContact,
} = require("../validation/validation");

router
  .get("/", contactsControllers.listContacts)
  .get("/:contactId", contactsControllers.getContactById)
  .post("/", validateCreateContact, contactsControllers.addContact)
  .delete("/:contactId", contactsControllers.removeContact)
  .patch(
    "/:contactId",
    validateUpdateContact,
    contactsControllers.updateContact
  );

module.exports = router;
