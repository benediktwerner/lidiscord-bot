import customResponses from './plugins/custom-responses.js';
import ligaInfo from './plugins/liga-info.js';
import messagesLog from './plugins/messages-log.js';
import nameUpdater from './plugins/name-updater.js';
import points from './plugins/points.js';

const CHANNEL_LOG = '1083140753380872303';
const SECONDS_IN_HOUR = 60 * 60;

const ROLE_TEST = '1302324085300396063';
const ROLE_LIGA = '1302324441769840762';
const ROLE_ADMIN = '1302324566827335762';

export default [
    nameUpdater(),
    points({
        period: SECONDS_IN_HOUR,
        amount: 10,
        excludeChannels: [],
        excludeRoles: [],
        rewards: [{ roleId: ROLE_TEST, requirement: 10 }],
    }),
    ligaInfo({ ligaWarriorRole: ROLE_LIGA }),
    customResponses({
        adminRoles: [ROLE_ADMIN],
    }),
    messagesLog({
        logChannel: CHANNEL_LOG,
    }),
];
