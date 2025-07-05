import customResponses from './plugins/custom-responses.js';
import ligaInfo from './plugins/liga-info.js';
import messagesLog from './plugins/messages-log.js';
import nameUpdater from './plugins/name-updater.js';
import roleEarner from './plugins/role-earner.js';

const CHANNEL_LOG = '1083140753380872303';

const ROLE_TEST = '1302324085300396063';
const ROLE_LIGA = '1302324441769840762';
const ROLE_ADMIN = '1302324566827335762';

export default [
    nameUpdater(),
    roleEarner({
        excludeMessagesInChannels: [],
        excludeUsersWithRoles: [],
        minSecondsBetweenMessagesToCount: 10,
        rolesToEarn: [{ roleId: ROLE_TEST, minDaysSinceFirstActivity: 1, minMessageCount: 10 }],
    }),
    ligaInfo({ ligaWarriorRole: ROLE_LIGA }),
    customResponses({
        adminRoles: [ROLE_ADMIN],
    }),
    messagesLog({
        logChannel: CHANNEL_LOG,
    }),
];
