// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const dotenv = require('dotenv').config();
require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true,
  appToken: process.env.APP_TOKEN
});
threshold = 0.9;
let model;

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

  app.event('message', async ({event, client, logger}) =>{
    try{
      model = await toxicity.load(threshold);
	    console.log('Ready!');
    }
    catch(error){
      console.log(error);
    }
  });
  app.event('message', async ({ event, client, logger, say}) => {
    var pred = [];
    try {
      const txt = event.text;
        console.log("Ready!");
        let predictions = await model.classify(txt);
        predictions.forEach(prediction=>{
          if(prediction.results[0].match){
            pred.push(prediction.label);
          }
        });
      console.log(pred);
      const result = await client.chat.postMessage({
        channel: event.channel,
        text: `${pred[0].charAt(0).toUpperCase()+pred[0].slice(1)} was detected in message sent by <@${event.user}>! Please adhere to community guidelines`
      });
    }
    catch (error) {
      logger.error(error);
    }
  });
  
  // app.event('message', async ({ event, client, logger, say}) => {
  //   var pred;
  //   try {
  //     let txt = event.text;
  //     console.log(txt);
  //     await toxicity.load(threshold).then(model => {
  //       console.log("Ready!");
  //       const sentences = txt;
  //       model.classify(sentences).then(predictions => {
  //         console.log(predictions.label);
  //         if(predictions.result[0].match){
  //           pred = predictions.label;
  //         }
  //       });
  //     });
  //     // Call chat.postMessage with the built-in client
  //     console.log(pred);
  //     // let predictions = await model.classify(txt);
  //     // console.log(predictions);
  //     const result = await client.chat.postMessage({
  //       channel: event.channel,
  //       text: `${pred.charAt(0).toUpperCase()+pred.slice(1)}was detected in message sent by <@${event.user}>! Please adhere to community guidelines`
  //     });
  //     //logger.info(result);
  //   }
  //   catch (error) {
  //     logger.error(error);
  //   }
  // });
 
 
  (async () => {
    const port = 3000
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  })();