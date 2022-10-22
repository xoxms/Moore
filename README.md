<p align="center">
  <a href="https://zelar.tinarskii.com/">
    <img src="assets/logo.png" height="128" width="128" style="border-radius: 9999px" />
    <h2 align="center">
      Zelar
    </h2>
  </a>
  <p align="center">
    An open-source, general purpose discord bot with a lot of commands and utilities
  </p>
  <div style="display: flex; flex-wrap: wrap; justify-items: center; justify-content: center">
    <img src="https://wakatime.com/badge/user/5cb7cd14-ac7e-4fc0-9f81-6036760cb6a3/project/43c4defc-5916-4bc2-aca5-0683f99c9e2d.svg" />
    <a href="https://github.com/mulforma/zelar/pulse"><img src="https://img.shields.io/github/commit-activity/m/badges/shields" /></a>
    <a href="https://www.codefactor.io/repository/github/mulforma/zelar"><img src="https://www.codefactor.io/repository/github/mulforma/zelar/badge" /></a>
    <img src="https://img.shields.io/node/v/discord.js?style=plastic" />
    <img src="https://img.shields.io/github/license/mulforma/zelar" />   
    <img src="https://img.shields.io/github/languages/top/mulforma/zelar" />
    <a href="https://tinvv.tech/discord/"><img src="https://img.shields.io/discord/828842616442454066" /></a>
    <a href="https://deepsource.io/gh/mulforma/Zelar/?ref=repository-badge}" target="_blank"><img alt="DeepSource" title="DeepSource" src="https://deepsource.io/gh/mulforma/Zelar.svg/?label=active+issues&show_trend=true&token=QMU7qTxWjqwrQ5m1G50_SD5C"/></a>
    <a href="https://deepsource.io/gh/mulforma/Zelar/?ref=repository-badge}" target="_blank"><img alt="DeepSource" title="DeepSource" src="https://deepsource.io/gh/mulforma/Zelar.svg/?label=resolved+issues&show_trend=true&token=QMU7qTxWjqwrQ5m1G50_SD5C"/></a>
    <a href="/.github/CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg" /></a>
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=plastic" />
  </div>
</p>

Zelar is a general purpose discord bot with a lot of commands and utilities. It is open source and community driven, it's
written in TypeScript and uses the latest version of discord.js library (v.14). It also has music commands too! This project
is driven by the community and is always in development. Source code is clean and well documented because we use EsLint and
prettier to enforce clean code. More information down below.

## Contribute

You can contribute to the project by [fork](https://github.com/mulforma/Zelar/fork) the repository, and make a [pull request](https://github.com/mulforma/Zelar/pulls).
Major and minor changes are welcome! It is our goal to make the bot better and more stable. No matter who you are, you can help us!
But make sure you follow the [Code of Conduct](/.github/CODE_OF_CONDUCT.md) and [Contributing](/.github/CONTRIBUTING.md) guidelines.
Please don't send any security issue to the server as stated above. We use [DeepSource](https://deepsource.io/) and [CodeFactor](https://codefactor.io/) to monitor the quality of the code.
If all the test is pass, it is more likely your pull request will get merge to the main branch first.

## Support

Hmm? Seems like you have problems to initializing the bot? You can ask it at the [Discussion tab](/discussions).
But if you think it's a bug, you can report it at the [Issues tab](/issues). Oh what? It's vulnerability issues and security stuff?
Email me! At `tinarskii@tinarskii.com` as soon as possible. Wait, legal stuff? Just email me too at `legal@tinarskii.com`
If you want to join the [Discord server](https://discord.gg/Zelar), join the [Discord server](https://discord.gg/PbFhFQeUEt), I just want to let you know
that **it is not active anymore**. But you can still talk at the Discussion tab.

## Hosting

You can host the bot on your own server. You can host it on your own server like Raspberry Pi, and it will be free to hosting (not to mention its price, internet fees, maintenance...). But
if you don't want your mom to accidentally close your pi or lightning strike at your house, you can host it on a cloud services. There are many major
cloud services provider like [Amazon Web Services](https://aws.amazon.com/), [Google Cloud](https://cloud.google.com/), [Digital Ocean](https://www.digitalocean.com/),
and [Heroku](https://www.heroku.com/).
Amazon has a free instance (t2.micro) for a year that is enough for the bot.
Google Cloud Platform also has a free forever instance (f1-micro) that you can use for hosting the bot. However, you need
to add billing to your Google Cloud account.
And Microsoft Azure that we are using, offers a free credits ($100 for students, $300 for users that have verified with their credit card). And students pack
has free B1s instance for a year.

# Installation

Before you continue, **make sure you don't forget to change `.env.example` to `.env` and insert your data**

### Prerequisites

- 500 MB of disk space (1 GB or more is recommended)
- 100 MB of RAM (256 MB or more is recommended)
- [Node.js (v16.9.0 or above)](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/) (preferred over npm and yarn) or other node package manager
- [Python 3.6](https://www.python.org/) or above. This will usually come with node installer for windows if you accept to install **Tools for native modules** (For `@discordjs/opus` library)
- [Visual Studio C++ Build Tools](https://go.microsoft.com/fwlink/?LinkId=691126) This will usually come with node installer for windows if you accept to install **Tools for native modules** (For `@discordjs/opus` library)
- [Database (CockroachDB or Postgres)](https://www.cockroachlabs.com/), You can get a free account on [CockroachDB](https://www.cockroachlabs.com/) choosing serverless options.

Install the required dependencies by running this:

```bash
$ pnpm install # It will install all the dependencies
```

Then you have to build the typescript files first

```bash
$ pnpm build:all # This will build the typescript file and copy the files to the `dist` folder
```

If you don't want to run script every time you make a change, you could run this instead
```bash
$ pnpm build:watch # It will watch for changes and build the typescript file
```

After that, you could cd to the `dist/app` directory

```bash
$ cd dist/app # Change to the `dist/app` directory
```

Register all the command by running

```bash
$ node deploy # This will deploy the bot commands
```

And run the bot

```bash
$ node index # You can run "nodemon" for development (Recommended if you also use build:watch too)
```

## License

This project uses Apache-2.0 License, see more [here](/LICENSE.md)

## Commands

The bot has a lot of commands which can be found below. Each divided into categories. You can also use `help` command to get more information about the command.

#### Economics Category

This category contains commands that are related to economics;
storing money, buying and selling, trading items and working.

| Commands | Description             | 
|----------|-------------------------|
| balance  | Check your balance      |
| buy      | Buy an item             |
| daily    | Get your daily reward   |
| item     | Get item information    |
| rob      | Rob someone             |
| sell     | Sell an item            |
| send     | Send an item to someone |
| shop     | Get shop information    |
| weekly   | Get your weekly reward  |
| work     | Work and earn money     |

#### Fun Category

This category contains commands that are... funny? I guess?

| Commands    | Description                         | 
|-------------|-------------------------------------|
| meme        | Get a random meme                   |
| xkcd        | Get a random xkcd comic             |
| magik       | Make an image distort               |
| triggered   | Make an image triggered             |


#### Game Category

This category contains commands that require user interaction, or playing of course.

| Commands    | Description                                  | 
|-------------|----------------------------------------------|
| 8ball       | Ask 8ball a question!                        |
| bet         | Choose a number between 1 - 10 and bet on it |
| coin-flip   | Flip a coin                                  |
| fast        | Answer question with fast responses          |
| fishing     | Catch a fish                                 |
| rps         | Play a game of rock-paper-scissors           |
| tic-tac-toe | Play a game of tic-tac-toe                   |
| trivia      | Play a game of trivia                        |
| word        | Play a word game!                            |

#### Moderation Category

This category contains commands that require moderator permissions.

| Commands | Description                      | 
|----------|----------------------------------|
| ban      | Ban a user                       |
| channel  | Create or remove a channel       |
| kick     | Kick a user                      |
| role     | Add or remove a role from a user |
| timeout  | Timeout a user                   |
| unban    | Unban a user                     |
| delete   | Delete a message                 |

#### Music Category

This category can play you a song! What a nice thing.

| Commands    | Description                   | 
|-------------|-------------------------------|
| loop        | Set the loop mode             |
| now-playing | Get the current song          |
| pause       | Pause the music               |
| play        | Play a song                   |
| progress    | Get the progress of the music |
| queue       | Get the queue                 |
| remove      | Remove a song from the queue  |
| resume      | Resume the music              |
| skip        | Skip the current song         |

#### NSFW Category

This category contains commands that are not safe for work. And will only work
in channel marked as NSFW.

| Commands | Description                        | 
|----------|------------------------------------|
| danbooru | Get a random image from Danbooru   |
| hentai   | Get a random hentai image          |
| rule34   | Get a random image from Rule34.xxx |

#### Profile Category

This category contains commands that check your user status, such as balance

| Commands    | Description                           | 
|-------------|---------------------------------------|
| inventory   | Get your inventory                    |
| jobs        | Get your jobs info or apply for a job |
| leaderboard | Get the money leaderboard             |
| profile     | Get your profile                      |

#### Search Category

This category contains commands that search for something.

| Commands   | Description                               | 
|------------|-------------------------------------------|
| dictionary | Get a definition from the dictionary      |
| reddit     | Get a random post from selected subreddit |
| search     | Search for a specific item                |

#### Miscellaneous

This category contains commands that are not categorized. (Or I'm too lazy to categorize them)

| Commands  | Description                              | 
|-----------|------------------------------------------|
| avatar    | Get your avatar                          |
| bot-stats | Get bot information and statistics       |
| help      | Get help                                 |
| info      | Get information about the server or user |
| ping      | Get the bots ping                        |
| short     | Get a shorten link                       |