const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.post('/score', async (req, res) => {
  const pointList = req.body.pointList;
  const player1 = req.body.player1;
  const player2 = req.body.player2;
  // console.log('Données de pointList reçues par le backend :', pointList);
  // console.log('Noms des joueurs :', ` Joueur 1 : ${player1}`, '||', `Joueur 2 : ${player2}`);

  let player1Points = 0;
  let player2Points = 0;
  let player1Games = 0;
  let player2Games = 0;
  let player1Sets = 0;
  let player2Sets = 0;
  let currentSet = 1;
  let matchWinner = '';

  const winSets = 3; // Nombre de sets nécessaires pour gagner le match

  // Fonction pour obtenir le score en fonction du nombre de points.
  function getScore(points) {
    switch (points) {
      case 0:
        return '0';
      case 1:
        return '15';
      case 2:
        return '30';
      case 3:
        return '40';
      default:
        return '';
    }
  }

  for (let i = 0; i < pointList.length; i++) {
    const point = pointList[i];
    const winner = point.winner;
    // Ici, je peux console.log "point.winner" qui va me donner "player1" ou "player2" 
    // Je peux aussi console.log "player1" et "player2" qui va cette fois va m'indiquer "Rafael Nadal" et "Novak Djokovic"

    if (winner === "player1") {
      player1Points++;
    } else if (winner === "player2") {
      player2Points++;
    }

    // console.log(player1);  là, je console.log (Ex: Rafael Nadal)
    // console.log(point.winner);  là, je console.log ("player1") le bon nombre de fois, c'est à dire que si mon joueur 1 gagne les 15 premiers points, je console.log bien 15 fois player1

    // Si un joueur gagne 4 points, alors on incrémente un jeu
    if (player1Points >= 4 && player1Points - player2Points >= 2) {
      player1Games++;
      player1Points = 0;
      player2Points = 0;
    } else if (player2Points >= 4 && player2Points - player1Points >= 2) {
      player2Games++;
      player1Points = 0;
      player2Points = 0;
    }

    // Si un joueur gagne 6 jeux, avec 2 jeux d'écarts à 6-6, alors on incrémente un set
    if ((player1Games >= 6 || player2Games >= 6) && Math.abs(player1Games - player2Games) >= 2) {
      if (player1Games > player2Games) {
        player1Sets++;
      } else {
        player2Sets++;
      }
      player1Games = 0;
      player2Games = 0;
      currentSet++;
    };

    if (currentSet === winSets - 1 && player1Sets === winSets - 1 && player2Sets === winSets - 1) {
      // Gestion du tie break
      if (player1Games === 6 && player2Games === 6) {
        if (player1Points >= 7 && player1Points - player2Points >= 2) {
          player1Sets++;
          break;
        } else if (player2Points >= 7 && player2Points - player1Points >= 2) {
          player2Sets++;
          break;
        }
      }
    };

    // Fin du match et détermination du gagnant
    if (player1Sets >= winSets || player2Sets >= winSets) {
      if (player1Sets >= winSets) {
        matchWinner = player1;
      } else if (player2Sets >= winSets) {
        matchWinner = player2;
      }
      break;
    };
  }

  const setsScore = [];
  for (let i = 1; i <= currentSet; i++) {
    setsScore.push(`${player1Sets}-${player2Sets}`);
  };

  let currentGameScore = '';
  if (currentSet === winSets) {
    // Fin du match et résultat
    currentGameScore = null;
  } else {
    // Affichage du score en cours
    const gameScore = getScore(player1Points) + '-' + getScore(player2Points);
    currentGameScore = `Jeu en cours : ${gameScore}`;
  };

  res.json({
    matchWinner: (matchWinner !== '') ? matchWinner : null,
    setsScore: setsScore,
    currentGameScore: currentGameScore,
  });
});



app.listen(port, () => {
  console.log(`Server ready at: http://localhost:${port}`);
});
