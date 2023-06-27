const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

let player1Points = 0;
let player2Points = 0;
let player1Games = 0;
let player2Games = 0;
let player1Sets = 0;
let player2Sets = 0;

app.post('/score', async (req, res) => {
  const pointList = req.body.pointList;
  console.log('Données de pointList reçues par le backend :', pointList);
  // Ici, je reçois bien les données puisque mon console.log affiche les points obtenus sur mon front

  // Score
  // AJOUTER LA LOGIQUE DE CALCUL DU SCORE
  for (let i = 0; i < pointList.length; i++) {
    const point = pointList[i];

    if (point === 'player 1') {
      if (player1Points === 40 && player2Points === 40) {
        player1Points = 'AV.';
        player2Points = '';
      } else if (player1Points === 'AV.') {
        player1Points = '';
        player2Points = '';
        player1Games++;
      } else if (player2Points === 'AV.') {
        player1Points = 40;
        player2Points = 40;
      } else if (player2Points === 40) {
        player1Points = 40;
        player2Points = '';
      } else {
        if (player1Points === 0) {
          player1Points = 15;
        } else if (player1Points === 15) {
          player1Points = 30;
        } else if (player1Points === 30) {
          player1Points = 40;
        } else if (player1Points === 40 && player2Points < 40) {
          // Gagne le jeu
          player1Points = 0;
          player2Points = 0;
          player1Games++;
        }
      }
    } else if (point === 'player2') {
      if (player2Points === 40 && player1Points === 40) {
        // Égalité
        player2Points = 'AV.';
        player1Points = '';
      } else if (player2Points === 'AV.') {
        // Avantage joueur 2
        player2Points = '';
        player1Points = '';
        player2Games++;
      } else if (player1Points === 'AV.') {
        // Retour à l'égalité
        player2Points = 40;
        player1Points = 40;
      } else if (player1Points === 40) {
        // Retour à l'égalité après avantage joueur 1
        player2Points = 40;
        player1Points = '';
      } else {
        // Ajoute un point au joueur 2
        if (player2Points === 0) {
          player2Points = 15;
        } else if (player2Points === 15) {
          player2Points = 30;
        } else if (player2Points === 30) {
          player2Points = 40;
        } else if (player2Points === 40 && player1Points < 40) {
          // Gagne le jeu
          player2Points = 0;
          player1Points = 0;
          player2Games++;
        }
      }
    }

    // JEUX ET SETS
    if (player1Games >=6 && player2Games >= 6) {
      if (player1Games === player2Games && player1Games === 6) {
        if (player1Points === 6 && player2Points === 6) {
          if (player1Games === player2Games && player1Games === 6) {
            if (player1Points > 6 && player1Points - player2Points >= 2) {
              // Gagne le tie-break, le set et le match
              player1Games = 0;
              player2Games = 0;
              player1Sets++;
              if (player1Sets === 3) {
                // Gagne le match
                winner = 'player1';
                break;
              }
            } else if (player2Points > 6 && player2Points - player1Points >= 2) {
              // Gagne le tie-break, le set et le match
              player1Games = 0;
              player2Games = 0;
              player2Sets++;
              if (player2Sets === 3) {
                // Gagne le match
                winner = 'player2';
                break;
              }
            } else {
              // Ajoute un point au joueur en cours de tie-break
              if (point === 'player1') {
                player1Points++;
              } else if (point === 'player2') {
                player2Points++;
              }
            }
          }
        }
      }
    }
  }

  res.json({
    sets: [player1Sets, player2Sets],
    winner: player1Sets > player2Sets ? 'player1' : 'player2',
  });
})

app.post('/reset', (req, res) => {
  player1Sets = 0;
  player2Sets = 0;
  winner = null;
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server ready at : http://localhost:${port}`);
})
