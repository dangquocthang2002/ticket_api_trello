const axios = require("axios");

async function sendMessage(text, board, slack, type) {
  const dateObj = new Date();
  const url = "https://slack.com/api/chat.postMessage";
  const res = await axios.post(
    url,
    {
      channel: slack.channel,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${text}`,
          },
        },
      ],
      username: `${board.name}`,
      icon_emoji: "",
    },
    { headers: { authorization: `Bearer ${slack.botToken}` } }
  );
}
module.exports = { sendMessage };
