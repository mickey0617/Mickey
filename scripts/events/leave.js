const { getTime, drive } = global.utils;

module.exports = {
        config: {
                name: "leave",
                version: "1.4",
                author: "NTKhang",
                category: "events"
        },

        langs: {
                vi: {
                        session1: "sáng",
                        session2: "trưa",
                        session3: "chiều",
                        session4: "tối",
                        leaveType1: "tự rời",
                        leaveType2: "bị kick",
                        defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
                },
                en: {
                        session1: "morning",
                        session2: "noon",
                        session3: "afternoon",
                        session4: "evening",
                        leaveType1: "left",
                        leaveType2:
 "",
                        defaultLeaveMessage: " ⚡𝐋𝐞𝐬 𝐟𝐥𝐚𝐦𝐦𝐞𝐬 𝐚𝐫𝐝𝐞𝐧𝐭𝐞𝐬 𝐬𝐨𝐧𝐭 𝐥𝐞 𝐬𝐨𝐮𝐟𝐟𝐥𝐞 𝐝𝐞 𝐥'𝐚̂𝐦𝐞 𝐥𝐚 𝐟𝐮𝐦𝐞́𝐞 𝐧𝐨𝐢𝐫 𝐥𝐢𝐛𝐞̀𝐫𝐞 𝐥𝐞𝐬 𝐚̂𝐦𝐞𝐬 𝐩𝐨𝐮𝐬𝐬𝐢𝐞̀𝐫𝐞 𝐭𝐮 𝐫𝐞𝐝𝐞𝐯𝐢𝐞𝐧𝐝𝐫𝐚 𝐩𝐨𝐮𝐬𝐬𝐢𝐞̀𝐫𝐞 𝐞𝐭 𝐭𝐨𝐧 𝐚̂𝐦𝐞 𝐚𝐩𝐩𝐞́𝐬𝐞́ 𝐫𝐞𝐭𝐨𝐮𝐫𝐧𝐞𝐫𝐚 𝐝𝐚𝐧𝐬 𝐥𝐞𝐬 𝐟𝐥𝐚𝐦𝐦𝐞𝐬 𝐚𝐫𝐝𝐞𝐧𝐭𝐞𝐬...𝐥𝐚𝐭𝐮𝐦 🚶"
                }
        },

        onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
                if (event.logMessageType == "log:unsubscribe")
                        return async function () {
                                const { threadID } = event;
                                const threadData = await threadsData.get(threadID);
                                if (!threadData.settings.sendLeaveMessage)
                                        return;
                                const { leftParticipantFbId } = event.logMessageData;
                                if (leftParticipantFbId == api.getCurrentUserID())
                                        return;
                                const hours = getTime("HH");

                                const threadName = threadData.threadName;
                                const userName = await usersData.getName(leftParticipantFbId);

                                // {userName}   : name of the user who left the group
                                // {type}       : type of the message (leave)
                                // {boxName}    : name of the box
                                // {threadName} : name of the box
                                // {time}       : time
                                // {session}    : session

                                let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;
                                const form = {
                                        mentions: leaveMessage.match(/\{userNameTag\}/g) ? [{
                                                tag: userName,
                                                id: leftParticipantFbId
                                        }] : null
                                };

                                leaveMessage = leaveMessage
                                        .replace(/\{userName\}|\{userNameTag\}/g, userName)
                                        .replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
                                        .replace(/\{threadName\}|\{boxName\}/g, threadName)
                                        .replace(/\{time\}/g, hours)
                                        .replace(/\{session\}/g, hours <= 10 ?
                                                getLang("session1") :
                                                hours <= 12 ?
                                                        getLang("session2") :
                                                        hours <= 18 ?
                                                                getLang("session3") :
                                                                getLang("session4")
                                        );

                                form.body = leaveMessage;

                                if (leaveMessage.includes("{userNameTag}")) {
                                        form.mentions = [{
                                                id: leftParticipantFbId,
                                                tag: userName
                                        }];
                                }

                                if (threadData.data.leaveAttachment) {
                                        const files = threadData.data.leaveAttachment;
                                        const attachments = files.reduce((acc, file) => {
                                                acc.push(drive.getFile(file, "stream"));
                                                return acc;
                                        }, []);
                                        form.attachment = (await Promise.allSettled(attachments))
                                                .filter(({ status }) => status == "fulfilled")
                                                .map(({ value }) => value);
                                }
                                message.send(form);
                        };
        }
};