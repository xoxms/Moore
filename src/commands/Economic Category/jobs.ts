import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { CommandInteraction } from "discord.js";
import { findTargetUser, getJobsData, saveNewUserData } from "../../lib/utils.js";
import { templateEmbed } from "../../lib/embeds.js";
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

    if (!jobsList) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Not found",
            description: "No jobs found in the database, if you are the developer please consider adding one.",
            interaction,
          }),
        ],
      });
      return;
    }

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "default",
          title: "Available Jobs",
          description: jobsList,
          emote: "🎓",
          interaction,
        }),
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
          templateEmbed({
            type: "error",
            title: "Job not found",
            description: `Job **${jobName}** is not found in our list`,
            interaction,
          }),
        ],
      });
      return;
    }

    const jobsData = jobs.find((j: any) => j.name === jobName);
    if (Number(data.level) < Number(jobsData?.minimumLevel)) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Insufficient level",
            description: `You need to be level ${jobsData?.minimumLevel} to choose this jobs`,
            interaction,
          }),
        ],
      });
      return;
    }

    if (jobsData?.name === data.jobs) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Invalid job",
            description: "You already occupied for this job, choose another one.",
            interaction,
          }),
        ],
      });
      return;
    }

    if (Date.now() - (<any>data.timeout).jobsChange < ms("1d")) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Cool down error",
            description: `You can change jobs again in **${ms(
              ms("1d") - (Date.now() - (<any>data.timeout).jobsChange),
              {
                long: true,
              },
            )}**`,
            interaction,
          }),
        ],
      });
      return;
    }

    data.jobs = jobName;
    (<any>data.timeout).jobsChange = Date.now();
    await saveNewUserData(interaction.user.id, data);

    await interaction.reply({
      embeds: [
        templateEmbed({
          type: "success",
          title: "Successfully execute operation",
          description: `Congrats! Now your job is ${jobName}`,
          interaction,
        }),
      ],
    });
  }

  @Slash({ description: "Go to work" })
  async work(interaction: CommandInteraction): Promise<void> {
    const jobs = await getJobsData();
    const data = await findTargetUser(interaction.user.id, interaction);
    if (!data) return;

    const jobsData = jobs.find((j: any) => j.name.toLowerCase() === data.jobs?.toLowerCase());
    if (!jobsData) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Not found",
            description: "You didn't occupied any jobs, choose one from `/jobs choose` command",
            interaction,
          }),
        ],
      });
      return;
    }
    if (Date.now() - (<any>data.timeout).work < ms(jobsData?.cooldown || "30m")) {
      await interaction.reply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Cool down error",
            description: `You can work again in **${ms(
              ms(jobsData?.cooldown || "30m") - (Date.now() - (<any>data.timeout).work),
            )}**`,
            interaction,
          }),
        ],
      });
      return;
    }
    try {
      await interaction.deferReply();
      const { default: jobCommand } = await import(`../../lib/jobs/${data.jobs?.toLowerCase()}.js`);
      jobCommand(interaction, data, jobsData);
    } catch (error) {
      await interaction.editReply({
        embeds: [
          templateEmbed({
            type: "error",
            title: "Cannot execute operation",
            description: "Cannot find action to do for this job, if you are the developer please consider adding one",
            interaction,
          }),
        ],
      });
    }
  }
}
