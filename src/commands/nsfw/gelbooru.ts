import { Discord, Slash, SlashOption } from "discordx"; 
import { ApplicationCommandOptionType, Colors, CommandInteraction, EmbedBuilder, TextChannel } from "discord.js"; 
import { Category } from "@discordx/utilities"; 
import axios from "axios"; 
 
@Discord() 
@Category("Age-Restricted") 
export class GelbooruCommand { 
  @Slash({ description: "Get random gelbooru image", name: "gelbooru" }) 
  async gelbooru( 
    @SlashOption({ 
      name: "tags", 
      description: "Tags to search (Seperated with commas)", 
      type: ApplicationCommandOptionType.String, 
      required: false, 
    }) 
    tags = "", 
    interaction: CommandInteraction, 
  ): Promise<void> { 
    if (!(<TextChannel>interaction.channel).nsfw) { 
      await interaction.reply("This channel is not Age-Restricted!"); 
      return; 
    } 
 
    const { data } = await axios.get( 
      `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&pid=${ 
        Math.floor(Math.random() * 100) + 1 
      }&tags=${tags.split(",").join("+")}`, 
    ); 
 
    if (!data.post) { 
      await interaction.reply("No results found!"); 
      return; 
    } 
 
    await interaction.reply({ 
      embeds: [ 
        new EmbedBuilder() 
          .setTitle(`Image from ${data.post[0].owner}`) 
          .setColor(Colors.Fuchsia) 
          .setImage(data.post[0].file_url) 
          .setFooter({ text: `rating: ${data.post[0].rating} | score: ${data.post[0].score}` }) 
          .setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${data.post[0].id}`), 
      ], 
    }); 
  } 
} 
