# Conquête des Territoires — Règles du Jeu v3

## Objectif
Contrôler **33 cases** sur 64 ou **éliminer toutes les unités** adverses.

## Unités (5 par joueur)

| Unité | Force | Dépl. | Capacité spéciale |
|-------|-------|-------|-------------------|
| **Tank** | +3 | 1 | 🎯 Attaque à distance 2 en ligne droite (capture adjacente seulement) |
| **Soldat** | +2 | 1 | ⚔ +1 au combat si un allié est sur une case adjacente (formation) |
| **Cavalier** | +1 | 2 | 🐴 Ignore les pièges (le malus -1 ne s'applique pas) |

Composition : 1 Tank, 2 Soldats, 2 Cavaliers.

## Déroulement d'un tour

1. **Lancer de dé** — les deux joueurs lancent. Le plus haut joue en premier.
2. **2 actions maximum** — chaque joueur ne peut agir qu'avec 2 unités par tour.
3. **Passer la main** — le joueur peut passer avant d'avoir utilisé ses 2 actions.
4. Pour chaque action : sélectionner → déplacer → Attaquer / Capturer / Défendre / Passer.

## Combat
Score = **dé (1-6) + force + bonus/malus case + bonus formation + bonus défense**
- Attaquant gagne si score **strictement supérieur**
- Égalité = le défenseur tient

## Capacités détaillées

### 🎯 Tank — Artillerie à distance
Le tank peut **attaquer un ennemi à 2 cases** en ligne droite (pas en diagonale).
Il ne peut **capturer que des cases adjacentes** (1 case).
→ Rôle : menace à distance, arme de siège.

### ⚔ Soldat — Combattant de formation
Le soldat gagne **+1 au combat** si au moins une unité alliée est sur une case adjacente.
Deux soldats côte à côte = chacun a effectivement +3 (comme un tank !).
→ Rôle : fort en groupe, faible seul.

### 🐴 Cavalier — Éclaireur
Le cavalier **n'est pas affecté par les pièges** (le -1 ne s'applique pas).
Avec 2 cases de déplacement, il explore le terrain en sécurité.
→ Rôle : scout, sécurise les zones piégées.

## Cases spéciales
- **Bonus** (● or) : +1 au combat. Cachée, révélée au passage.
- **Piège** (▲ rouge) : -1 au combat (sauf cavalier). Cachée, révélée au passage.

## Défendre vs Passer — Le vrai choix stratégique

| Action | Ce tour | Tour suivant |
|--------|---------|-------------|
| **Attaquer** | Combat immédiat | Libre |
| **Capturer** | Prend une case neutre adjacente | Libre |
| **🛡 Défendre** | +1 si attaqué | ⚠ **Ne peut PAS attaquer** (🚫) |
| **— Passer** | Rien | Libre |

### Pourquoi ce design ?
- **Défendre** donne un vrai avantage défensif (+1) mais **sacrifie la capacité offensive au tour suivant**. Le badge 🚫 s'affiche sur l'unité pour rappeler cette pénalité.
- **Passer** ne donne rien mais l'unité reste **totalement libre** au tour suivant.
- Ce choix crée de la **tension stratégique** : protection immédiate vs liberté future.

### Comment fonctionne la pénalité ?
1. L'unité choisit "Défendre" → ajoutée à la liste `enDefense`, gagne +1 si attaquée
2. Au tour suivant, l'unité est toujours dans `enDefense` → `casesAttaquables()` renvoie une liste vide → impossible d'attaquer
3. Quand l'unité agit au tour suivant (n'importe quelle action), la pénalité est **purgée** → libre au tour d'après

## Méta-jeu : Campagne mondiale

### Concept
- 6 pays neutres sont **verrouillés** au départ (🔒)
- Après chaque partie, le **gagnant capture le prochain pays neutre**
- Le premier camp à capturer **4 pays neutres sur 6** gagne la guerre

### Pays
**Alliés (8)** : 🇺🇸 🇬🇧 🇷🇺 🇫🇷 🇨🇳 🇨🇦 🇦🇺 🇧🇷
**Axe (8)** : 🇩🇪 🇮🇹 🇯🇵 🇭🇺 🇷🇴 🇧🇬 🇫🇮 🇹🇭
**Neutres (6)** : 🇨🇭 🇸🇪 🇪🇸 🇵🇹 🇹🇷 🇦🇷

### Carte de conquête
Accessible via le bouton "🗺 Carte de conquête", elle montre :
- Un chemin sinueux style carte au trésor
- Les 6 pays neutres comme étapes
- Pays verrouillés (🔒), capturés (colorés par faction)
- Score : Alliés vs Axe

## IA — 3 niveaux
| Niveau | Timer | Comportement |
|--------|-------|-------------|
| Facile | 60s | 35% erreurs |
| Normal | 45s | Heuristique prioritaire |
| Difficile | 30s | Anticipation menaces |

L'IA respecte la limite de 2 actions/tour et exploite les capacités spéciales.

