import { GuardFunction, ArgsOf } from "discordx";

export const IsOnGuild: GuardFunction<ArgsOf<"interactionCreate">> = async (
  [interaction],
  client,
  next
) => {
  if (interaction.guild) {
    return next();
  }
};
