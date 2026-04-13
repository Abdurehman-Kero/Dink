const userRegistration = require('./userRegistration');
const accountStatus = require('./accountStatus');
const organizerStatus = require('./organizerStatus');
const organizerApplicationReceived = require('./organizerApplicationReceived');
const passwordReset = require('./passwordReset');
const staffInvitation = require('./staffInvitation');
const ticketConfirmation = require('./ticketConfirmation');
const eventReminder = require('./eventReminder');

module.exports = {
  userRegistration,
  accountStatus,
  organizerStatus,
  organizerApplicationReceived,
  passwordReset,
  staffInvitation,
  ticketConfirmation,
  eventReminder
};
