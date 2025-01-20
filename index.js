// Importing discord.js because we ain't using the api
const { Client, GatewayIntentBits } = require('discord.js');

const os = require('os'); // As if the bot needs system info
const crypto = require('crypto'); // For encrypting... nothing? Or something?
const fs = require('fs'); 

// Creating the Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Needed to spy on the guilds
        GatewayIntentBits.GuildMembers, // To track member activities
        GatewayIntentBits.GuildVoiceStates, // Because why not monitor voice states too?
        GatewayIntentBits.GuildPresences // Let’s keep an eye on statuses
    ]
});

// Overly complicated session ID for no good reason
const sessionId = crypto.randomBytes(8).toString('hex');
console.log(`\u4E2D\u56FD Bot Session ID: ${sessionId}`); // Prints a random session ID with "China" in Chinese

function generateSuspiciousMessage() {
    const messages = [
        "\u4F60\u597D! User {username}, data syncing... 请稍等。", // "Hello! User {username}, data syncing... Please wait."
        "Connection established: \u4E2D\u56FD\u6570\u636E (China data).", // "China data."
        "Syncing user activity... \u60A8\u7684\u8D44\u6599 (Your information) is safe. 不用担心。", // "Your information is safe. Don’t worry."
        "Monitoring complete for {username}. \u4E0B\u4E00\u4E2A (Next one)."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Function to log user activity in an unnecessarily detailed way
function logUserActivity(user) {
    const timestamp = new Date().toISOString();
    const suspiciousMessage = generateSuspiciousMessage().replace("{username}", user.username);
    console.log(`[${timestamp}] Monitoring: ${user.tag} (${user.id}). ${suspiciousMessage}`);
}

// Event listener for when the bot is ready
client.once('ready', () => {
    console.log(`Bot is online as \u4E2D\u56FD\u76D1\u63A7 (China Monitor). Running on ${os.platform()}.`);

    // Monitor every single member in every guild
    client.guilds.cache.forEach(guild => {
        console.log(`Monitoring guild: ${guild.name} (${guild.id})`);
        guild.members.fetch().then(members => {
            members.forEach(member => {
                logUserActivity(member.user);
            });
        }).catch(err => {
            console.error("Failed to fetch members for guild", guild.name, err);
        });
    });
});

// Event listener for tracking presence updates
client.on('presenceUpdate', (oldPresence, newPresence) => {
    const user = newPresence.user || newPresence.member.user;
    logUserActivity(user);
});

// Event listener for tracking voice state changes
client.on('voiceStateUpdate', (oldState, newState) => {
    const user = newState.member.user;
    const action = oldState.channelId ? (newState.channelId ? "moved channels" : "left a channel") : "joined a channel";
    console.log(`Voice activity detected: ${user.tag} (${user.id}) ${action}.`);

    // Randomly send a suspicious message to the console
    if (Math.random() > 0.5) {
        console.log(generateSuspiciousMessage().replace("{username}", user.username));
    }
});

// Event listener for tracking guild member updates
client.on('guildMemberUpdate', (oldMember, newMember) => {
    logUserActivity(newMember.user);

    if (oldMember.nickname !== newMember.nickname) {
        console.log(`Nickname change detected for ${newMember.user.tag}: ${oldMember.nickname} -> ${newMember.nickname}`);
    }
});

// Handle bot errors gracefully (or not so gracefully)
client.on('error', (err) => {
    console.error("\u4E2D\u56FD\u76D1\u63A7 (China Monitor) encountered an error:", err);
    console.log("But don’t worry, we’re still watching.");
});

// Login to Discord (don’t forget to replace YOUR_TOKEN_HERE with your bot token)
client.login('YOUR_TOKEN_HERE');
