import chalk from 'chalk';
import { UI } from './UI.js';
import { getAccountAge, sleep } from './utils.js';
import { serverManager } from './serverManager.js';


let ID;
let timeout = 20000;
while (true) {
    let answer = await UI.choosePresetOrCustomID();
    switch (answer) {
        case 'preset':
            ID = await UI.choosePreset();
            break;
        case 'custom':
            ID = await UI.promptCustomID();
            break;
        case 'delay':
            timeout = await UI.promptTimeout();
            console.log(chalk.green(`Timeout delay changed to ${timeout} milliseconds`));
            await sleep(2000);
            break;
    }
    if (answer != 'delay') {
        break;
    }
    console.clear();
}

console.log(chalk.yellow(`Fetching ${ID}`));
let players = await serverManager.getPlayers(ID);
if (players == 404) {
    console.log(chalk.red('The provided server ID dosen\'t exist\nExiting in 3 seconds...'));
    await sleep(3000);
    process.exit();
} else if (!players) {
    console.log(chalk.red('An unexpected error has occurred\nExiting in 3 seconds...'));
    await sleep(3000);
    process.exit();
}
console.log(chalk.green(`Successfully fetched\nNumber of currently online players: ${chalk.cyan(players.length)}\nScanning...`));

let zeroLinkedAccounts = [];
for (let player of players) {
    if (player.identifiers.length == 0) {
        console.log(chalk.red('This server dosen\'t provide their player\'s identifiers\nExiting in 3 seconds...'));
        await sleep(3000);
        process.exit();
    }

    let presentIdentifiers = {
        discord: player.identifiers.some(element => element.startsWith('discord')) ? chalk.green('Linked') : chalk.red('Not linked'),
        live: player.identifiers.some(element => element.startsWith('live')) ? chalk.green('Linked') : chalk.red('Not linked'),
        xbl: player.identifiers.some(element => element.startsWith('xbl')) ? chalk.green('Linked') : chalk.red('Not linked')
    };
    if (presentIdentifiers.discord.includes('Not linked') && presentIdentifiers.live.includes('Not linked') && presentIdentifiers.xbl.includes('Not linked')) {
        let steamHex = player.identifiers.filter(element => element.includes('steam'))[0];
        if (steamHex) {
            zeroLinkedAccounts.push({
                name: player.name,
                id: player.id,
                steam: steamHex
            });
        }
    }
    console.log(chalk.blue('Name:'), `"${chalk.magenta(player.name)}"`, chalk.blue('ID:'), chalk.yellow(player.id), chalk.blue('Discord:'), presentIdentifiers.discord, chalk.blue('Live:'), presentIdentifiers.live, chalk.blue('Xbox:'), presentIdentifiers.xbl);
}

console.log(chalk.yellow(`There are a total of ${chalk.red(zeroLinkedAccounts.length)} players that have no Discord, Live or Xbox account linked and have a Steam account linked, checking their Steam account's age...`));
for (let player of zeroLinkedAccounts) {
    console.log(chalk.yellow('Checking ->'), chalk.blue('Name:'), `"${chalk.magenta(player.name)}"`, chalk.blue('ID:'), chalk.yellow(player.id), chalk.blue('SteamHex:'), chalk.yellow(player.steam));
    try {
        let age = await getAccountAge(player.steam, timeout);
        if (age < 6) {
            console.log(chalk.red(`This account's age is less than 6 months ->`), chalk.blue('Age:'), chalk.red(age), chalk.blue('Name:'), `"${chalk.magenta(player.name)}"`, chalk.blue('ID:'), chalk.yellow(player.id), chalk.blue('SteamHex:'), chalk.yellow(player.steam));
        } else {
            console.log(chalk.blue('Age:'), chalk.yellow(age), chalk.blue('Name:'), `"${chalk.magenta(player.name)}"`, chalk.blue('ID:'), chalk.yellow(player.id), chalk.blue('SteamHex:'), chalk.yellow(player.steam));
        }
    } catch (e) {
        if (e.name == 'TimeoutError') {
            console.log(chalk.red('Connection timeout after 20 seconds. Skipping this player...'));
            continue;
        } else {
            console.log(chalk.red('An unexpected error has occurred. Skipping this player...'));
            continue;
        }
    }
}