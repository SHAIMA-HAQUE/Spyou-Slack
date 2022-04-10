const SlackBot = require('slackbots');
const axios = require('axios');
const { token } = require('./config.json');
const bot = new SlackBot({
    token: 'xoxp-3372260258276-3393665379968-3369920132290-25cf5c4e71209f3325927e29f1e741f7',
    name : 'Spyou-App'
});