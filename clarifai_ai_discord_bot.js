const {
  Client,
  GatewayIntentBits,
  APIApplicationCommandPermissionsConstant,
  AttachmentBuilder,
} = require("discord.js");
require("dotenv/config");
const Clarifai = require("clarifai");

const app = new Clarifai.App({ apiKey: "YOUR_CLARIFAI_API_KEY" });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("The bot is online'");
});

client.on("messageCreate", (message) => {
  if (
    (message != null) &
    (message.author.id != "YOUR_BOT'S_ID") &
    (message.attachments.size > 0)
  ) {
    const attachmentUrl = message.attachments.first().url;

    // Use the Face Detection model to predict the image
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, attachmentUrl)
      .then((response) => {
        // The response contains the prediction data
        const predictionData = response.outputs[0].data;

        // The number of faces in the image is the length of the regions array
        const numFaces = predictionData.regions.length;

        // Reply to the message with the number of faces detected
        message.reply(`There are ${numFaces} faces in this image.`);
      })
      .catch((TypeError) => {
        // There was an error making the prediction
        message.reply("There are no faces in this picture!");
      })
      .catch((error) => {
        // There was an error making the prediction
        message.reply("Something went wrong, please try again later");
      });
  }
});

client.login(process.env.TOKEN);
