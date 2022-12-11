import { Discord, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { CommandInteraction } from "discord.js";
import { findItemByName, findTargetUser, saveNewUserData } from "../../lib/utils.js";
import { templateEmbed } from "../../lib/embeds.js";

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
    quantity = 1,
    interaction: CommandInteraction,
  ): Promise<void> {
    const data = await findTargetUser(interaction.user.id, interaction);
    if (!data) return;

    const itemData = await findItemByName(item);
    if (!itemData) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Not found",
            description: `Item **${item}** is not found, maybe check your spelling again?`,
            interaction,
          }),
        ],
      });
      return;
    }

    if (!itemData.price) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Not purchasable",
            description: `Item **${item}** is not purchasable or the price has been set up incorrectly by the developer`,
            interaction,
          }),
        ],
      });
      return;
    }

    if ((data.coin || 0) < itemData.price * quantity) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Insufficient balance",
            description: `You don't have enough coins to buy **${item}**`,
            interaction,
          }),
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
        templateEmbed({
          type: "success",
          title: "Item purchased",
          description: `You have purchased **${item}** for **${itemData.price * quantity}** coins`,
          interaction,
        }),
      ],
    });
  }
}
