import "dotenv/config";
import { SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

client.login(process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.DEV_TOKEN);