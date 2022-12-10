import { Discord, SlashGroup, Slash, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { findTargetUser, getJobsData, saveNewUserData } from "../../lib/utils.js";
import ms from "ms";

@Discord()
@Category("Economic")
@SlashGroup({
  name: "jobs",
  description: "Choose a new jobs or just go to work",
})
@SlashGroup("jobs")
export class JobsCommand {
  @Slash({ name: "list", description: "List all jobs" })
  async list(interaction: CommandInteraction): Promise<void> {
    const jobs = await getJobsData();
    const data = await findTargetUser(interaction.user.id, interaction);
    if (!data) return;

    const jobsList = jobs
      .map(
        (j: any) =>
          `${Number(data.level) < Number(j.minimumLevel) ? "🔒" : "✅"} **${j.name}** - *${j.description}*\nIncome: $${
            j.income
          }`,
      )
      .join("\n\n");

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🎓 Available jobs")
          .setDescription(jobsList)
          .setColor(Colors.Green)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }

  @Slash({ description: "Choose a jobs" })
  async choose(
    @SlashOption({
      name: "job",
      description: "Jobs to choose",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    job: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const jobs = await getJobsData();
    const data = await findTargetUser(interaction.user.id, interaction);
    if (!data) return;
    const jobName = job.toLowerCase();

    const jobsList = jobs.map((j: any) => j.name.toLowerCase());
    if (!jobsList.includes(jobName)) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Jobs not found")
            .setDescription("Jobs not found, please check the jobs list with `/jobs list`")
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

    const jobsData = jobs.find((j: any) => j.name === jobName);
    if (Number(data.level) < Number(jobsData?.minimumLevel)) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Jobs not found")
            .setDescription(`You need to be level ${jobsData?.minimumLevel} to choose this jobs`)
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

    if (jobsData?.name === data.jobs) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ You already have this jobs")
            .setDescription("You already have this jobs, please choose another jobs")
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

    if (Date.now() - (<any>data.timeout).jobsChange < ms("1d")) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ You can't change jobs yet")
            .setDescription(
              `You can change jobs again in **${ms(ms("1d") - (Date.now() - (<any>data.timeout).jobsChange), {
                long: true,
              })}**`,
            )
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

    data.jobs = jobName;
    (<any>data.timeout).jobsChange = Date.now();
    await saveNewUserData(interaction.user.id, data);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ Successfully changed jobs")
          .setDescription(`You have successfully changed your jobs to **${jobName}**`)
          .setColor(Colors.Green)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  }

  @Slash({ description: "Go to work" })
  async work(interaction: CommandInteraction): Promise<void> {
    const jobs = await getJobsData();
    const data = await findTargetUser(interaction.user.id, interaction);
    if (!data) return;

    const jobsData = jobs.find((j: any) => j.name === data.jobs);
    if (!jobsData) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ You don't have a jobs")
            .setDescription("You don't have a jobs, please choose a jobs with `/jobs choose`")
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
    if (Date.now() - (<any>data.timeout).work < ms(jobsData?.cooldown || "30m")) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ You can't work yet")
            .setDescription(
              `You can work again in **${ms(
                ms(jobsData?.cooldown || "30m") - (Date.now() - (<any>data.timeout).work),
              )}**`,
            )
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
    try {
      const { default: jobCommand } = await import(`../../lib/jobs/${data.jobs?.toLowerCase()}.js`);
      jobCommand(interaction, data, jobsData);
    } catch (error) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("❌ Something went wrong")
            .setDescription("The jobs may not be available or something else went **really** wrong")
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
}
