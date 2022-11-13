import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { findItemByName, findTargetUser, saveNewUserData } from "../../lib/utils.js";

@Discord()
@Category("Economic")
export class BuyCommand {
  @Slash({ name: "buy", description: "Buy an item from the shop" })
  async buy(
    @SlashOption({
      name: "item",
      description: "Item to buy",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    @SlashOption({
      name: "quantity",
      description: "Quantity of item to buy",
      type: ApplicationCommandOptionType.Number,
      required: false,
    })
    item: string,
    quantity: number = 1,
    interaction: CommandInteraction,
  ): Promise<void> {
    const data = await findTargetUser(interaction.user.id, interaction);
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
            .setTitle("❌ Item not purchasable")
            .setDescription(`Item **${item}** is not purchasable`)
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

    if ((data.coin || 0) < itemData.price * quantity) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Insufficient balance")
            .setDescription(`You don't have enough coins to buy **${item}**`)
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

    data.coin! -= itemData.price * quantity;
    (data.inventory as Array<any>).push({
      id: itemData.id,
      quantity: 1,
    });
    await saveNewUserData(interaction.user.id, data);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ Item purchased")
          .setDescription(`You have purchased **${item}** for **${itemData.price * quantity}** coins`)
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
