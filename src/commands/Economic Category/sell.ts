import { Discord, Slash, SlashOption } from "discordx"; 
import { Category } from "@discordx/utilities"; 
import { ApplicationCommandOptionType } from "discord-api-types/v10"; 
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js"; 
import { findItemByName, getFullUserDetails, saveNewUserData } from "../../lib/utils.js"; 
import { FullInventory, Item } from "../../typings/types"; 
 
@Discord() 
@Category("Economic") 
export class SellCommand { 
  @Slash({ name: "sell", description: "Sell an item from your inventory" }) 
  async sell( 
    @SlashOption({ 
      name: "item", 
      description: "Item to sell", 
      type: ApplicationCommandOptionType.String, 
      required: true, 
    }) 
    @SlashOption({ 
      name: "quantity", 
      description: "Quantity of item to sell", 
      type: ApplicationCommandOptionType.Number, 
      required: false, 
    }) 
    item: string, 
    quantity = 1, 
    interaction: CommandInteraction, 
  ): Promise<void> { 
    const data = await getFullUserDetails(interaction.user.id, interaction); 
    if (!data) return; 
 
    const itemData = await findItemByName(item); 
    if (!itemData) { 
      await interaction.reply({ 
        embeds: [ 
          new EmbedBuilder() 
            .setTitle("❌ Item not found") 
            .setDescription(`Item **${item}** not found`) 
            .setColor(Colors.Red) 
            .setFooter({ 
              text: `Requested by ${interaction.user.tag}`, 
              iconURL: interaction.user.displayAvatarURL(), 
            }) 
            .setTimestamp(), 
        ], 
      }); 
      return; 
    } 
 
    if (!itemData.price) { 
      await interaction.reply({ 
        embeds: [ 
          new EmbedBuilder() 
            .setTitle("❌ Item not sellable") 
            .setDescription(`Item **${item}** is not sellable`) 
            .setColor(Colors.Red) 
            .setFooter({ 
              text: `Requested by ${interaction.user.tag}`, 
              iconURL: interaction.user.displayAvatarURL(), 
            }) 
            .setTimestamp(), 
        ], 
      }); 
      return; 
    } 
 
    const itemIndex = (data.inventory as FullInventory).findIndex((i: Item) => i.name === item); 
    if (itemIndex === -1) { 
      await interaction.reply({ 
        embeds: [ 
          new EmbedBuilder() 
            .setTitle("❌ Item not found") 
            .setDescription(`Item **${item}** not found in your inventory`) 
            .setColor(Colors.Red) 
            .setFooter({ 
              text: `Requested by ${interaction.user.tag}`, 
              iconURL: interaction.user.displayAvatarURL(), 
            }) 
            .setTimestamp(), 
        ], 
      }); 
      return; 
    } 
 
    if (data.inventory[itemIndex].quantity < quantity) { 
      await interaction.reply({ 
        embeds: [ 
          new EmbedBuilder() 
            .setTitle("❌ Not enough items") 
            .setDescription(`You don't have enough **${item}** in your inventory`) 
            .setColor(Colors.Red) 
            .setFooter({ 
              text: `Requested by ${interaction.user.tag}`, 
              iconURL: interaction.user.displayAvatarURL(), 
            }) 
            .setTimestamp(), 
        ], 
      }); 
      return; 
    } 
 
    data.inventory[itemIndex].quantity -= quantity; 
    if (data.inventory[itemIndex].quantity === 0) { 
      data.inventory!.splice(itemIndex, 1); 
    } 
    data.coin! += itemData.price * quantity; 
    await saveNewUserData(interaction.user.id, data); 
    await interaction.reply({ 
      embeds: [ 
        new EmbedBuilder() 
          .setTitle("✅ Item sold") 
          .setDescription(`You sold **${quantity}x ${item}** for **${itemData.price * quantity}** coins`) 
          .setColor(Colors.Green) 
          .setFooter({ 
            text: `Requested by ${interaction.user.tag}`, 
            iconURL: interaction.user.displayAvatarURL(), 
          }) 
          .setTimestamp(), 
      ], 
    }); 
  } 
} 
