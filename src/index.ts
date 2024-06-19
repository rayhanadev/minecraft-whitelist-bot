import { createClient } from "minecraft-protocol";

const client = createClient({
  host: "mc.prod.cluster.rent",
  port: 25565,
  username: process.env.EMAIL!,
  password: process.env.PASSWORD!,
  version: "1.20.6",
});

client.on("login", () => {
  console.log("Bot logged in");
});

client.on("chat", (packet) => {
  const jsonMsg = JSON.parse(packet.message);
  const message = jsonMsg.text;

  const match = message.match(/^\[([^\]]+)\] (.+)$/);
  if (!match) return;

  const username = match[1];
  const content = match[2];

  if (username === client.username) return;

  if (content.startsWith("!whitelist")) {
    const args = content.split(" ");
    const playerToWhitelist = args[1];
    if (playerToWhitelist) {
      client.write("chat", { message: `/whitelist add ${playerToWhitelist}` });
      client.write("chat", {
        message: `${playerToWhitelist} has been whitelisted.`,
      });
    } else {
      client.write("chat", { message: "Please provide a player name." });
    }
  }
});

client.on("end", () => console.log("Bot disconnected"));

client.on("error", (err) => console.error("Error:", err));
