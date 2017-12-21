var express = require('express');
var api = require('../api/index');
var router = express.Router();


router.get('/', api.noId);
// User info
router.get('/:id', api.getOneUser);
// Groups
// Get all users groups
router.get('/:id/group', api.getUsersGroup);
// Add a group
router.post('/:id/group', api.postOneGroup);
// Delete group
router.delete('/:id/group/:group', api.deleteOneGroup);
// Teams
// Get all users teams
router.get('/:id/team', api.getUserTeam);
// Add a team
router.post('/:id/team', api.postOneTeam);

module.exports = router;
