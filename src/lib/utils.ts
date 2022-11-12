import { prisma } from "../database/connect.js";
import { Colors, CommandInteraction, EmbedBuilder } from "discord.js";
import { Item, Job } from "../typings/types";

let cacheItems = await cachePrismaItemsData();
let cacheJobs = await cachePrismaJobsData();

export async function findTargetUser(userId: string, interaction?: CommandInteraction) {
  const user = await prisma.user.findFirst({
    where: {
      userId,
    },
  });

  if (!user && interaction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("❌ User not found")
          .setDescription("This user doesn't have an account yet")
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

  return user;
}

export async function createNewProfile(userId: string) {
  const user = await prisma.user.create({
    data: {
      userId,
      coin: 0,
      timeout: { daily: 0, weekly: 0, jobsChange: 0, work: 0 },
      xp: 0,
      level: 0,
      inventory: [
        {
          id: 1,
          quantity: 1,
        },
      ],
      jobs: "",
    },
  });

  return user;
}

async function findItemById(id: number) {
  const item = await cacheItems.find((item) => item.id === id);
  return item;
}

export async function getUserInventoryData(userId: string, interaction?: CommandInteraction) {
  const user = await findTargetUser(userId, interaction);
  if (!user) return;

  const { inventory } = user;
  const itemsData = await Promise.all(
    (<Array<{ id: number; quantity: number }>>inventory).map(async (item) => {
      const itemData = await findItemById(item.id);
      return {
        ...itemData,
        quantity: item.quantity,
      };
    }),
  );

  return itemsData;
}

export async function getFullUserDetails(userId: string, interaction?: CommandInteraction) {
  const user = await findTargetUser(userId, interaction);
  if (!user) return;

  const inventory = await getUserInventoryData(userId, interaction);
  if (!inventory) return;

  const fullUserDetails = {
    ...user,
    inventory,
  };

  return fullUserDetails;
}

export async function updateUserLevel(userId: string, interaction: CommandInteraction) {
  const user = await findTargetUser(userId, interaction);
  if (!user) return;

  const { xp, level } = user;
  const nextLevel = (level || 0) + 1;
  const nextLevelXp = 5 * (nextLevel ^ 2) + 50 * nextLevel + 100;

  if ((xp || 0) >= nextLevelXp) {
    await prisma.user.update({
      where: {
        userId,
      },
      data: {
        level: nextLevel,
      },
    });

    if (interaction) {
      await interaction.channel!.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎉 Level up!")
            .setDescription(`**${interaction.member}** has leveled up to level **${nextLevel}**`)
            .setColor(Colors.Green)
            .setFooter({
              text: `Requested by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ]
      });
    }
  }
}

export async function getJobsData() {
  const jobs = await cacheJobs;
  return jobs;
}

export async function saveNewUserData(userId: string, data: any) {
  const user = await prisma.user.updateMany({
    where: {
      userId,
    },
    data,
  });

  return user;
}

export async function cachePrismaJobsData() {
  const jobs = await prisma.jobs.findMany();
  return jobs;
}

async function cachePrismaItemsData() {
  const items = await prisma.items.findMany();
  return items;
}

setInterval(async () => {
  cacheItems = await cachePrismaItemsData();
  cacheJobs = await cachePrismaJobsData();
}, 1000 * 60 * 60 * 24);
