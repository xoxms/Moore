import {
  ButtonInteraction,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  EmbedField,
  EmbedFooterOptions,
} from "discord.js";

type TemplateEmbedType = "success" | "error" | "default" | "none";

interface TemplateEmbedOptions {
  type: TemplateEmbedType;
  title: string;
  description?: string;
  image?: string;
  footer?: EmbedFooterOptions;
  url?: string;
  thumbnail?: string;
  fields?: Array<EmbedField>;
  emote?: string;
  interaction?: CommandInteraction | ButtonInteraction;
}

export function templateEmbed({ ...opt }: TemplateEmbedOptions): EmbedBuilder {
  const status = {
    success: { emote: "✅", color: Colors.Green },
    error: { emote: "❌", color: Colors.Red },
    default: { emote: "ℹ️", color: Colors.Blue },
    none: { emote: "", color: Colors.Default },
  };

  const embed = new EmbedBuilder()
    .setTitle(`${opt.emote || status[opt.type]?.emote} ${opt.title}`)
    .setColor(status[opt.type].color)
    .setTimestamp();

  if (opt.interaction)
    embed.setFooter({
      text: `Requested by ${opt.interaction.user.tag}`,
      iconURL: opt.interaction.user.displayAvatarURL(),
    });
  if (opt.description) embed.setDescription(opt.description);
  if (opt.image) embed.setImage(opt.image);
  if (opt.url) embed.setURL(opt.url);
  if (opt.footer) embed.setFooter(opt.footer);
  if (opt.fields) embed.setFields(opt.fields);
  if (opt.thumbnail) embed.setThumbnail(opt.thumbnail);

  return embed;
}
