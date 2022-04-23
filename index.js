// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const dotenv = require('dotenv').config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true,
  appToken: process.env.APP_TOKEN
});

app.message("hey", async ({ command, say }) => {
  try {
    say("Yaaay! that command works!");
  } catch (error) {
      console.log("err")
    console.error(error);
  }
});

// All the room in the world for your code
app.message('knock knock', async ({ message, say }) => {
    await say(`_Who's there?_`);
    console.log("here");
  });

  (async () => {
    const port = 3000
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  })();