import { Colors, CommandInteraction, EmbedBuilder, Message } from "discord.js";
import { saveNewUserData } from "../utils.js";
import type { Job, User } from "../../typings/types";

export default async function (interaction: CommandInteraction, data: User, jobsData: Job) {
  const number1 = Math.floor(Math.random() * 10) + 1;
  const number2 = Math.floor(Math.random() * 10) + 1;
  const randomOp = ["+", "-", "*"][Math.floor(Math.random() * 3)];
  const result = eval(`${number1}${randomOp}${number2}`);

  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("📝 Math Quiz (15 seconds)")
        .setDescription(`What is the result of ${number1} ${randomOp} ${number2}?`)
        .setColor(Colors.Yellow)
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp(),
    ],
  });

  const filter = (i: Message) => i.author.id === interaction.user.id;
  const collector = interaction.channel?.createMessageCollector({ filter, time: 15000 });
  let tries = 3;
  let ended = false;

  collector?.on("collect", async (i: Message) => {
    if (i.content === result.toString()) {
      await i.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("✅ Correct Answer")
            .setDescription(`You have successfully answered the math quiz and earned **${jobsData.income}** coins`)
            .setColor(Colors.Green)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      data.coin += jobsData.income;
      data.timeout.work = Date.now();
      await saveNewUserData(interaction.user.id, data);
      ended = true;
      collector.stop();
    } else {
      tries--;
      if (tries === 0) {
        const amount = Math.round(jobsData.income / Math.floor(Math.random() * 4) + 2);
        await i.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Wrong Answer")
              .setDescription(`You have failed to answer the math quiz, you only get **${amount}** coins`)
              .setColor(Colors.Red)
              .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
        data.coin += amount;
        data.timeout.work = Date.now();
        await saveNewUserData(interaction.user.id, data);
        collector?.stop();
      } else {
        await i.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Wrong Answer")
              .setDescription(`That's incorrect! You have **${tries}** more tries`)
              .setColor(Colors.Red)
              .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
      }
    }
  });

  collector?.on("end", () => {
    if (!ended) {
      interaction.channel?.send(`⏰ Time's up! The correct answer was **${result}**.`);
    }
  });
}
