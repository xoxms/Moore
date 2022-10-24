import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";

export class PingCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: "ping",
      description: "Replies with pong!",
    });
  }
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName("ping").setDescription("Check the bot's ping")
    );
  }
  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const msg = await interaction.reply({ content: "Pinging...", fetchReply: true });

    if (isMessageInstance(msg)) {
      const diff = msg.createdTimestamp - interaction.createdTimestamp;
      const ping = Math.round(this.container.client.ws.ping);
      return interaction.editReply(`Round trip latency : ${diff}ms\nWebsocket heartbeat : ${ping}ms`);
    }

    return interaction.editReply("Failed to retrieve ping :(");
  }
}