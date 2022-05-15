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

  // app.event('hello', async () =>{
  //   try{
  //     model = await toxicity.load(threshold);
	//     console.log('Ready!');
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // });
  app.event('message', async ({ event, client, logger, say}) => {
    var pred = [];
    try {
      const txt = event.text;
      toxicity.load(threshold).then(model=>{
        model.classify(txt).then(predictions => {
          console.log(predictions.label);
          predictions.forEach(prediction=>{
            if(prediction.results[0].match){
              pred.push(prediction.label);
            }
            });
            var text_display = "";
            if(pred.length > 1){
            for(let i=0; i<pred.length-1;i++){
                text_display += pred[i].charAt(0).toUpperCase() + pred[i].slice(1) + " and ";
            }
            text_display += pred[pred.length-1].charAt(0).toUpperCase() + pred[pred.length-1].slice(1);
          }else{
            text_display = pred[0].charAt(0).toUpperCase() + pred[0].slice(1);
          }
            const result = client.chat.postMessage({
              channel: event.channel,
              text: `${text_display} was detected in message sent by <@${event.user}>! Please adhere to community guidelines`
            });
          });
        }); 
      }catch (error) {
      logger.error(error);
    }
  });
  
  (async () => {
    const port = 3000
    // Start your app
    await app.start(process.env.PORT || port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  })();