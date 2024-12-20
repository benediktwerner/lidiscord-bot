import customResponses from './plugins/custom-responses.js';
import ligaInfo from './plugins/liga-info.js';
import messagesLog from './plugins/messages-log.js';
import nameUpdater from './plugins/name-updater.js';
import points from './plugins/points.js';

const CHANNEL_DISCORD_GAMES_TRIVIA = '493061298486116352';
const CHANNEL_LOG = '1302655272707166330';
const SECONDS_IN_HOUR = 60 * 60;

const ROLE_IMAGES = '477557270943760386';
const ROLE_NEW_ROLE = '695720622407417886';
const ROLE_LIGA_WARRIOR = '766333186237399043';
const ROLE_CHAT_MOD = '473908351307087884';
const ROLE_ADMIN = '280718008727633921';

export default [
    nameUpdater(),
    points({
        period: SECONDS_IN_HOUR,
        amount: 10,
        excludeChannels: [CHANNEL_DISCORD_GAMES_TRIVIA],
        excludeRoles: [ROLE_NEW_ROLE],
        rewards: [{ roleId: ROLE_IMAGES, requirement: 50 }],
    }),
    ligaInfo({ ligaWarriorRole: ROLE_LIGA_WARRIOR }),
    customResponses({
        adminRoles: [ROLE_CHAT_MOD, ROLE_ADMIN],
    }),
    messagesLog({
        logChannel: CHANNEL_LOG,
    }),
];
