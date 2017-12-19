var express = require('express');
var api = require('../api/index');
var router = express.Router();


router.get('/', api.noId);
router.get('/:id', api.getOneUser);
router.get('/:id/groups', api.getUsersGroups);

module.exports = router;
