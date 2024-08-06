module.exports = {
  config: {
    name: "respect",
    aliases: [],
    version: "1.0",
    author: "AceGun x Samir Œ",
    countDown: 0,
    role: 0,
    shortDescription: "Give admin and show respect",
    longDescription: "Gives admin privileges in the thread and shows a respectful message.",
    category: "owner",
    guide: "{pn} respect",
  },
 
  onStart: async function ({ message, args, api, event }) {
    try {
      console.log('Sender ID:', event.senderID);
 
      const permission = ["61553392844761"];
      if (!permission.includes(event.senderID)) {
        return api.sendMessage(
          "👩‍💻 𝐁𝐫𝐨 𝐭𝐮 𝐞𝐬𝐬𝐚𝐲𝐞 𝐝𝐞 𝐟𝐚𝐢𝐬 𝐪𝐮𝐨𝐢 𝐬𝐞𝐮𝐥 𝐝𝐞𝐥𝐟𝐚 𝐟𝐫𝐨𝐬𝐭 𝐩𝐞𝐮𝐭 𝐮𝐭𝐢𝐥𝐢𝐬𝐞𝐫 𝐜𝐞𝐭𝐭𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞",
          event.threadID,
          event.messageID
        );
      }
 
      const threadID = event.threadID;
      const adminID = event.senderID;
 
      // Change the user to an admin
      await api.changeAdminStatus(threadID, adminID, true);
 
      api.sendMessage(
        `𝐀𝐯𝐞𝐜 𝐭𝐨𝐮𝐭 𝐥𝐞 𝐫𝐞𝐬𝐩𝐞𝐜𝐭 𝐪𝐮𝐞 𝐣𝐚𝐢 𝐩𝐨𝐮𝐫 𝐯𝐨𝐮𝐬 𝐁𝐎𝐒𝐒 , 𝐣𝐞 𝐯𝐨𝐮𝐬 𝐧𝐨𝐦𝐦𝐞 𝐚𝐝𝐦𝐢𝐧 𝐝𝐞 𝐜𝐞 𝐠𝐫𝐨𝐮𝐩𝐞 `,
        threadID
      );
    } catch (error) {
      console.error("Error promoting user to admin:", error);
      api.sendMessage("An error occurred while promoting to admin.", event.threadID);
    }
  },
};