import { ApplicationCommandRegistry } from "@sapphire/framework";
import { Subcommand } from "@sapphire/plugin-subcommands";

export class HelpCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: "help",
      description: "Shows a list of all commands or info about a specific command.",
      subcommands: [
        {
          name: "all",
          chatInputRun: "chatInputAll"
        },
        {
          name: "command",
          chatInputRun: "chatInputCommand"
        }
      ]
    });
  }
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("help")
        .setDescription("Shows a list of commands.")
        .addSubcommand((subcommand) => subcommand.setName("all").setDescription("Shows a list of all commands."))
        .addSubcommand((subcommand) =>
          subcommand
            .setName("command")
            .setDescription("Shows specific command information.")
            .addStringOption((command) =>
              command.setName("command").setDescription("The command to show information for.").setRequired(true),
            ),
        ),
    );
  }
  public async chatInputAll(interaction: Subcommand.ChatInputInteraction) {
    const commands = this.container.stores.get("commands");
    const commandsMap = commands.map((cmd) => {
      return { name: cmd.name, description: cmd.description };
    });

  }
  public async chatInputCommand(interaction: Subcommand.ChatInputInteraction) {}
}
