import { addMessage, updateAwardedRoles } from '../db/users.js';
import log from '../log.js';
import { memberHasAnyRole } from '../utils/members.js';
import { Plugin } from './plugin.js';

type Reward = {
    roleId: string;
    minDaysSinceFirstActivity: number;
    minMessageCount: number;
};

export default function ({
    excludeMessagesInChannels,
    excludeUsersWithRoles,
    rolesToEarn,
}: {
    excludeMessagesInChannels: string[];
    excludeUsersWithRoles: string[];
    rolesToEarn: Reward[];
}): Plugin {
    return {
        name: 'role-earner',

        async onMessage({ message, member, channel, command, user, guild }) {
            if (
                memberHasAnyRole(member, excludeUsersWithRoles) ||
                excludeMessagesInChannels.includes(channel.id) ||
                command
            ) {
                return;
            }

            const messageCount = addMessage(user.id);

            const awardedRoleIds = user.awardedRoleIds ? user.awardedRoleIds.split(',') : [];

            for (const reward of rolesToEarn) {
                if (awardedRoleIds.includes(reward.roleId)) {
                    continue;
                }

                if (messageCount < reward.minMessageCount) {
                    continue;
                }

                const activeDays = (+new Date() - user.firstActivityTimestamp) / 1_000 / 60 / 60 / 24;
                if (activeDays < reward.minDaysSinceFirstActivity) {
                    continue;
                }

                const role = guild.roles.resolve(reward.roleId);
                log(`${user.name} has been rewarded role ${role?.name || reward.roleId}`);
                await member.roles.add(reward.roleId);
                awardedRoleIds.push(reward.roleId);
                updateAwardedRoles(user.id, awardedRoleIds.join(','));

                return;
            }
        },
    };
}
