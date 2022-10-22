import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";

export class ReadyListener extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
      event: "ready"
    });
  }
  public run(client: Client) {
    this.container.logger.info(`Logged in as ${client.user?.tag}`);
  }
}