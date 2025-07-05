import customResponses from './plugins/custom-responses.js';
import ligaInfo from './plugins/liga-info.js';
import messagesLog from './plugins/messages-log.js';
import nameUpdater from './plugins/name-updater.js';
import roleEarner from './plugins/role-earner.js';

const CHANNEL_DISCORD_GAMES_TRIVIA = '493061298486116352';
const CHANNEL_LOG = '1302655272707166330';

const ROLE_IMAGES = '477557270943760386';
const ROLE_NEW_ROLE = '695720622407417886';
const ROLE_LIGA_WARRIOR = '766333186237399043';
const ROLE_CHAT_MOD = '473908351307087884';
const ROLE_ADMIN = '280718008727633921';

export default [
    nameUpdater(),
    roleEarner({
        excludeMessagesInChannels: [CHANNEL_DISCORD_GAMES_TRIVIA],
        excludeUsersWithRoles: [ROLE_NEW_ROLE],
        rolesToEarn: [
            { roleId: ROLE_IMAGES, minDaysSinceFirstActivity: 1, minMessageCount: 100 },
            { roleId: ROLE_IMAGES, minDaysSinceFirstActivity: 2, minMessageCount: 50 },
            { roleId: ROLE_IMAGES, minDaysSinceFirstActivity: 3, minMessageCount: 30 },
            { roleId: ROLE_IMAGES, minDaysSinceFirstActivity: 7, minMessageCount: 20 },
            { roleId: ROLE_IMAGES, minDaysSinceFirstActivity: 30, minMessageCount: 10 },
        ],
    }),
    ligaInfo({ ligaWarriorRole: ROLE_LIGA_WARRIOR }),
    customResponses({
        adminRoles: [ROLE_CHAT_MOD, ROLE_ADMIN],
    }),
    messagesLog({
        logChannel: CHANNEL_LOG,
    }),
];
