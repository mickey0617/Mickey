const TIMEOUT_SECONDS = 120 ; // Durée du délai d'attente du jeu en secondes, à modifier selon les besoins

// Initialise une carte pour suivre les combats en cours par threadID
const en coursFights = new Map();
// Initialise une carte pour stocker les instances de jeu pour chaque paire
const gameInstances = new Map();

module.exports = {
  configuration : {
    nom : "combat",
    version : "1.0",
    auteur : "Shikaki",
    compte à rebours : 10,
    rôle : 0,
    courteDescription : {
      vi : "",
      fr: "Combattez avec vos amis !",
    },
    longueDescription : {
      vi : "",
      fr: "Défiez vos amis dans un combat et voyez qui gagne !",
    },
    catégorie : "amusant",
    guide : "{prefix}combat @mention",
  },

  onStart : fonction asynchrone ({ événement, message, api, usersData, args }) {
    const threadID = event.threadID;

    // Vérifiez s'il y a déjà un combat en cours dans ce fil
    if (ongoingFights.has(threadID)) {
      return message.send("⚔ Un combat est déjà en cours dans ce groupe.");
    }

    const mention = Object.keys(event.mentions);

    if (mention.length !== 1) {
      return message.send("🤔 Veuillez mentionner une personne avec qui commencer un combat.𝐕𝐞𝐮𝐢𝐥𝐥𝐞𝐳 𝐦𝐞𝐧𝐭𝐢𝐨𝐧𝐧𝐞𝐫 𝐮𝐧𝐞 𝐩𝐞𝐫𝐬𝐨𝐧𝐧𝐞 𝐚𝐯𝐞𝐜 𝐪𝐮𝐢 𝐜𝐨𝐦𝐦𝐞𝐧𝐜𝐞𝐫 𝐮𝐧 𝐜𝐨𝐦𝐛𝐚𝐭");
    }

    const challengerID = event.senderID;
    const IDadversaire = mention[0];

    const challenger = wait usersData.getName(challengerID);
    const adversaire = wait usersData.getName (opponentID);

    // Crée une nouvelle instance de combat pour cette paire
    combat const = {
      participants : [],
      joueur actuel : nul,
      ID de fil : ID de fil,
      startTime : null, // Stocke l'heure de début
    } ;

    combat.participants.push({
      identifiant : challengerID,
      nom : challenger,
      hp : 100, // HP de démarrage
    });
    combat.participants.push({
      identifiant : ID de l'adversaire,
      nom : adversaire,
      hp : 100, // HP de démarrage
    });

    // Crée une nouvelle instance de jeu pour cette paire
    const gameInstance = {
      combat : combat,
      dernière attaque : nulle,
      dernierJoueur : nul,
      timeoutID : null, // Stocke l'ID du délai d'attente
      turnMessageSent : false, // Gardez une trace de l'envoi du message de tour
    } ;

    // Détermine aléatoirement le premier joueur de la paire
    gameInstance.fight.currentPlayer = Math.random() < 0,5 ? challengerID : adversaireID;

    // Ajoute l'instance de jeu à la carte
    gameInstances.set(threadID, gameInstance);

    // Commencer le combat pour cette paire
    startFight(message, combat);

    // Démarre le timeout pour ce jeu
    startTimeout(threadID, message);
  },

  // Modifiez la fonction onChat comme suit :
  onChat : fonction asynchrone ({événement, message}) {
    const threadID = event.threadID;

    // Retrouvez le combat en cours pour ce fil
    const gameInstance = gameInstances.get(threadID);

    si (!gameInstance) retourne ;

    const currentPlayerID = gameInstance.fight.currentPlayer;
    const currentPlayer = gameInstance.fight.participants.find(
      (p) => p.id === currentPlayerID
    );

    const attaque = event.body.trim().toLowerCase();

    // Vérifiez si l'expéditeur du message est l'un des joueurs actuels
    const isCurrentPlayer = event.senderID === currentPlayerID;

    // Vérifiez si l'adversaire a déjà attaqué
    if (gameInstance.lastAttack !== null && !isCurrentPlayer) {
      // Informe le joueur actuel que c'est le tour de son adversaire
      message.reply(`😒 C'est actuellement le tour de 𝐂'𝐞𝐬𝐭 𝐚𝐜𝐭𝐮𝐞𝐥𝐥𝐞𝐦𝐞𝐧𝐭 𝐥𝐞 𝐭𝐨𝐮𝐫 𝐝𝐞 ${currentPlayer.name}. Vous ne pouvez pas attaquer tant qu'ils n'ont pas bougé.𝐕𝐨𝐮𝐬 𝐧𝐞 𝐩𝐨𝐮𝐯𝐞𝐳 𝐩𝐚𝐬 𝐚𝐭𝐭𝐚𝐪𝐮𝐞𝐫 𝐭𝐚𝐧𝐭 𝐪𝐮'𝐢𝐥𝐬 𝐧'𝐨𝐧𝐭 𝐩𝐚𝐬 𝐛𝐨𝐮𝐠é`);
      retour;
    }

    // Vérifiez si l'adversaire essaie d'attaquer alors que ce n'est pas son tour
    if (!isCurrentPlayer && gameInstance.lastPlayer.id === event.senderID) {
      message.send(`👎 C'est actuellement le tour de  ${currentPlayer.name}. Vous ne pouvez pas attaquer tant qu'ils n'ont pas fait un mouvement 𝐮𝐧 𝐦𝐨𝐮𝐯𝐞𝐦𝐞𝐧𝐭.`);
      retour;
    }

    // Vérifiez si l'expéditeur du message n'est PAS l'un des joueurs actuels
    si (!isCurrentPlayer) {
      // Si ce n'est pas le tour du joueur actuel, prépare le message pour l'adversaire
      si (!gameInstance.turnMessageSent) {
        // Préparez le message, mais ne l'envoyez pas encore
        const adverseName = gameInstance.fight.participants.find(p => p.id !== event.senderID).name;
        const turnMessage = `C'est le tour de ${currentPlayer.name}.`;
        message.prepare(turnMessage, event.senderID);

        // N'oubliez pas que le message de tour a été envoyé
        gameInstance.turnMessageSent = true ;
      }
      retour;
    }

    // Vérifiez si l'adversaire a esquivé l'attaque
    if (attaque === "forfait") {
      const forfeiter = currentPlayer.name;
      const adversaire = gameInstance.fight.participants.find(
        (p) => p.id !== currentPlayerID
      ).nom;
      message.send(`🏃 ${forfeiter} déclare forfait ! ${opponent} gagne !`);
      endFight(threadID);
    } else if (["coup de pied", "coup de poing", "gifle"].includes(attaque)) {
      // Calculer les dégâts (avec 10 % de chances de rater)
      const dégâts = Math.random() < 0,1 ? 0 : Math.floor(Math.random() * 20 + 10);

      // Appliquer des dégâts à l'adversaire
      const adversaire = gameInstance.fight.participants.find((p) => p.id !== currentPlayerID);
      adversaire.hp -= dégâts ;

      // Afficher le message des dégâts infligés
      message.envoyer(
        `🥊 ${currentPlayer.name} attaque 𝐚𝐭𝐭𝐚𝐪𝐮𝐞 ${opponent.name} avec 𝐚𝐯𝐞𝐜 ${attack} et inflige 𝐞𝐭 𝐢𝐧𝐟𝐥𝐢𝐠𝐞 ${damage} dégâts 𝐝é𝐠â𝐭𝐬.\n\nMaintenant 𝐌𝐚𝐢𝐧𝐭𝐞𝐧𝐚𝐧𝐭, ${opponent.name} a 𝐚 ${opponent.hp} HP et 𝐇𝐏 𝐞𝐭 $ {currentPlayer.name} a 𝐚 ${currentPlayer.hp} HP.`
      );

      // Vérifie si le jeu est terminé
      si (adversaire.hp <= 0) {
        const gagnant = currentPlayer.name;
        const perdant = adversaire.nom;
        message.send(`⏰ Le temps est écoulé ! Le jeu est terminé.𝐋𝐞 𝐭𝐞𝐦𝐩𝐬 𝐞𝐬𝐭 é𝐜𝐨𝐮𝐥é ! 𝐋𝐞 𝐣𝐞𝐮 𝐞𝐬𝐭 𝐭𝐞𝐫𝐦𝐢𝐧é. ${winner} 𝐠𝐚𝐠𝐧𝐞 ! ${loser} est vaincu.𝐞𝐬𝐭 𝐯𝐚𝐢𝐧𝐜𝐮`);
        endFight(threadID);
      } autre {
        // Changer de tour au sein de la paire
        gameInstance.fight.currentPlayer =
          currentPlayerID === gameInstance.fight.participants[0].id
            ? gameInstance.fight.participants[1].id
            : gameInstance.fight.participants[0].id;
        const newCurrentPlayer = gameInstance.fight.participants.find(p => p.id === gameInstance.fight.currentPlayer);

        // Mise à jour de la dernière attaque et du joueur
        gameInstance.lastAttack = attaque ;
        gameInstance.lastPlayer = currentPlayer;

        // Réinitialise l'état du message de virage
        gameInstance.turnMessageSent = false;

        // Afficher à qui c'est maintenant le tour
        message.send(`🥲 C'est actuellement le tour de ${newCurrentPlayer.name}.`);
      }
    } autre {
      message.réponse(
        "❌ Attaque invalide 𝐀𝐭𝐭𝐚𝐪𝐮𝐞 𝐢𝐧𝐯𝐚𝐥𝐢𝐝𝐞! Utilisez 𝐔𝐭𝐢𝐥𝐢𝐬𝐞𝐳 'coup de pied', 'coup de poing', 'gifle' ou 'forfait'."
      );
    }
  },

} ;

// Fonction pour démarrer un combat
function startFight(message, combat) {
  en coursFights.set(fight.threadID, combat);

  const currentPlayer = combat.participants.find(p => p.id === combat.currentPlayer);
  const adversaire = combat.participants.find(p => p.id !== combat.currentPlayer);

  // Liste des attaques disponibles
  const AttackList = ["coup de pied", "coup de poing", "gifle", "forfait"];
  
  message.envoyer(
    `${currentPlayer.name} a défié 𝐚 𝐝é𝐟𝐢é ${opponent.name} en duel 𝐞𝐧 𝐝𝐮𝐞𝐥 !\n\n${currentPlayer.name} a 𝐚 ${currentPlayer.hp} HP et 𝐇𝐩 𝐞𝐭 ${opponent.name} a 𝐚 ${opponent. hp} HP.\n\nC'est actuellement le tour de  𝐂'𝐞𝐬𝐭 𝐚𝐜𝐭𝐮𝐞𝐥𝐥𝐞𝐦𝐞𝐧𝐭 𝐥𝐞 𝐭𝐨𝐮𝐫 𝐝𝐞 ${currentPlayer.name}.\n\nAttaques disponibles 𝐀𝐭𝐭𝐚𝐪𝐮𝐞𝐬 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐥𝐞𝐬: ${attackList.join(', ')}`
  );
}

// Fonction pour démarrer un timeout pour un jeu
fonction startTimeout (threadID, message) {
  const timeoutID = setTimeout(() => {
    const gameInstance = gameInstances.get(threadID);
    si (instance de jeu) {
      const currentPlayer = gameInstance.fight.participants.find(
        (p) => p.id === gameInstance.fight.currentPlayer
      );
      const adversaire = gameInstance.fight.participants.find(
        (p) => p.id !== gameInstance.fight.currentPlayer
      );
      const gagnant = currentPlayer.hp > adversaire.hp ? joueur actuel : adversaire ;
      const perdant = currentPlayer.hp > adversaire.hp ? adversaire : joueur actuel ;

      message.envoyer(
        « Le temps est écoulé ! Le jeu est terminé. ${winner.name} a plus de HP, donc ${winner.name} gagne ! ${loser.name} est vaincu.`
      );

      // Fin du combat
      endFight(threadID);
    }
  }, TIMEOUT_SECONDS * 1000); // Convertit les secondes en millisecondes

  // Stocke l'ID du délai d'attente dans l'instance de jeu
  gameInstances.get(threadID).timeoutID = timeoutID;
}

// Fonction pour mettre fin à un combat et nettoyer
fonction endFight (threadID) {
  en coursFights.delete(threadID);
  // Efface le délai d'attente pour ce jeu
  const gameInstance = gameInstances.get(threadID);
  if (gameInstance && gameInstance.timeoutID) {
    clearTimeout(gameInstance.timeoutID);
  }
  // Supprime l'instance de jeu pour ce fil
  gameInstances.delete(threadID);
}

🌐 Translate from en to fr