var express = require('express');
var contrUsers = require('../controller/users');
var router = express.Router();

router.get('/', contrUsers.usersOnly);
router.get('/:id', contrUsers.frontPage);
router.get('/:id/addGroup', contrUsers.addGroup);
router.get('/:id/addTeam', contrUsers.addTeam);
router.get('/:id/group/:group', contrUsers.group);
router.get('/:id/teams/:teamId', contrUsers.teams);
router.get('/:id/calendar', contrUsers.calendar);
router.get('/:id/calendar/add', contrUsers.addToCal);
router.post('/:id/addToCalCheck', contrUsers.addToCalCheck);
module.exports = router;
