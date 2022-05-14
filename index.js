// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const dotenv = require('dotenv').config();
const toxicity = require('@tensorflow-models/toxicity');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true,
  appToken: process.env.APP_TOKEN
});
threshold = 0.9;
model = toxicity.load(threshold);

app.message("hey", async ({ command, say }) => {
  try {
    say("Yaaay! that command works!");
    // console.log(app.client.conversations.info.channel);
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

  
  console.log(app.client);
  app.event('message', async ({ event, client, logger }) => {
    try {

      // Call chat.postMessage with the built-in client
      const result = await client.chat.postMessage({
        channel: event.channel,
        text: `Welcome to the team, <@${event.user}>! 🎉 You can introduce yourself in this channel.`
      });
      //logger.info(result);
    }
    catch (error) {
      logger.error(error);
    }
  });
 
 
  (async () => {
    const port = 3000
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  })();