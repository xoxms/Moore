import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

@Discord()
@Category("Search")
@SlashGroup({
  description: "Search for a word in the dictionary",
  name: "dictionary",
})
@SlashGroup("dictionary")
export class DictionaryCommand {
  @Slash({ name: "search", description: "Search a word" })
  async search(
    @SlashOption({
      name: "word",
      description: "Word to search",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    word: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}?ui=en&definitions=true&synonyms=true&antonyms=true&examples=true&audio=true`,
    );
    const data = await response.json();
    if (data?.title === "No Definitions Found") {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Word not found")
            .setDescription(`No definitions found for ${word}`)
            .setColor(0xff0000)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      return;
    }

    const [wordData] = data;
    const [wordDefinition] = wordData.meanings[0].definitions;
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(word)
          .setDescription(wordDefinition.definition)
          .addFields([
            { name: "Origin", value: wordDefinition.origin || "Unknown" },
            { name: "Example", value: wordDefinition.example || "-" },
            { name: "Phonetic", value: wordData.phonetic || "-" },
            { name: "Synonyms", value: wordDefinition.synonyms.join(", ") || "-" },
            { name: "Antonyms", value: wordDefinition.antonyms.join(", ") || "-" },
          ])
          .setURL(wordData.phonetics[0].audio.replace("//", "https://"))
          .setColor("#0099ff")
          .setFooter({
            text: `Request by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }

  @Slash({ name: "urban", description: "Search urban dictionary!" })
  async urban(
    @SlashOption({
      name: "word",
      description: "Word to search",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    word: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${word}`);
    const data = await response.json();
    if (data?.list.length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Word not found")
            .setDescription(`No definitions found for ${word}`)
            .setColor(0xff0000)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      return;
    }

    const [wordData] = data.list;
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(wordData.word)
          .setDescription(wordData.definition)
          .addFields([
            { name: "Example", value: wordData.example || "-" },
            { name: "Author", value: wordData.author || "-" },
            { name: "Thumbs up", value: wordData.thumbs_up || "-" },
            { name: "Thumbs down", value: wordData.thumbs_down || "-" },
          ])
          .setURL(wordData.permalink)
          .setColor("#0099ff")
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }
}
