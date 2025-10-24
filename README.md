# ConsoFlow 📊

**Smart Meter Tracking Application** - Suivez vos consommations d'électricité, d'eau et de gaz avec intelligence.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📖 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Captures d'écran](#-captures-décran)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Contribution](#-contribution)
- [License](#-license)

---

## 🎯 À propos

**ConsoFlow** est une application web moderne qui vous permet de suivre facilement vos consommations énergétiques. Que vous souhaitiez monitorer votre électricité, votre eau, votre gaz ou même vos panneaux solaires, ConsoFlow vous offre une interface intuitive avec des graphiques détaillés et des comparaisons avec les moyennes nationales.

### Pourquoi ConsoFlow ?

- 🏡 **Multi-emplacements** : Gérez plusieurs lieux (maison, bureau, location...)
- ⚡ **Multi-compteurs** : Électricité, eau, gaz, et compteurs personnalisés
- 📈 **Visualisations intelligentes** : Graphiques avec saisons, évolution de consommation
- 🌞 **Support panneaux solaires** : Visualisez production et consommation
- 📊 **Comparaisons** : Comparez avec les moyennes nationales belges
- 📱 **Responsive** : Interface optimisée mobile et desktop
- 🔒 **Sécurisé** : Authentification robuste via Supabase

---

## ✨ Fonctionnalités

### Gestion des compteurs
- ✅ Créer et gérer plusieurs emplacements
- ✅ Ajouter des compteurs (électricité, eau, gaz, personnalisé)
- ✅ Encoder rapidement les relevés depuis le dashboard
- ✅ Import d'historique de relevés en masse

### Visualisations
- ✅ Graphiques interactifs avec visualisation des saisons
- ✅ Historique des relevés (index) sur timeline
- ✅ Évolution de la consommation mensuelle
- ✅ Filtres de période (1 an, 2 ans, tout l'historique)
- ✅ Support des valeurs négatives (production solaire)

### Analyses
- ✅ Statistiques détaillées par compteur
- ✅ Comparaison avec moyennes nationales
- ✅ Calcul automatique de consommation
- ✅ Identification des pics de consommation

### Authentification
- ✅ Système d'inscription avec code d'invitation
- ✅ Connexion sécurisée
- ✅ Gestion du profil utilisateur
- ✅ Configuration du foyer (type, taille, nombre de personnes)

---

## 📸 Captures d'écran

_Documentation visuelle à venir - l'application comprend :_
- Landing page moderne avec hero section
- Dashboard avec aperçu de tous les compteurs
- Pages de gestion des emplacements et compteurs
- Pages de détail avec graphiques interactifs
- Formulaires d'ajout de relevés

---

## 🛠 Technologies

### Frontend
- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling moderne
- **Recharts** - Bibliothèque de graphiques

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL (base de données)
  - Authentication (gestion des utilisateurs)
  - Row Level Security (sécurité des données)

### Développement
- **ESLint** - Linting
- **Git** - Versioning

---

## 🚀 Installation

### Prérequis

- **Node.js** 18+ et npm (ou yarn/pnpm)
- Un compte **Supabase** (gratuit : https://supabase.com)
- **Git** installé sur votre machine

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/VOTRE_USERNAME/ConsoFlow.git
cd ConsoFlow
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

---

## ⚙️ Configuration

### 1. Créer un projet Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL du projet** et votre **clé anonyme (anon key)**

### 2. Configurer la base de données

Dans votre dashboard Supabase :

1. Allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez le contenu de `supabase_schema.sql` (à la racine du projet)
4. Exécutez la requête (bouton "Run")

Cela va créer :
- Les tables principales (`meter_types`, `locations`, `meters`, `readings`)
- Les politiques de sécurité (Row Level Security)
- Les triggers et fonctions
- Les données de référence (types de compteurs)

### 3. Ajouter les tables optionnelles

Pour les fonctionnalités avancées :

**Informations du foyer** (pour les comparaisons) :
```sql
-- Copiez et exécutez le contenu de household_info_table.sql
```

**Import d'historique** :
```sql
-- Copiez et exécutez le contenu de import_historique.sql
```

### 4. Configurer les variables d'environnement

1. Copiez le fichier d'exemple :
```bash
cp .env.example .env.local
```

2. Éditez `.env.local` avec vos identifiants Supabase :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

> ⚠️ **Important** : Ne committez JAMAIS votre fichier `.env.local` ! Il est déjà dans `.gitignore`.

### 5. Configurer l'authentification (optionnel)

Par défaut, l'application utilise un système de code d'invitation. Pour configurer :

1. Dans Supabase, allez dans **Authentication > Providers**
2. Activez **Email** comme provider
3. Configurez les paramètres d'email si nécessaire

Pour désactiver le système de codes d'invitation, modifiez `app/auth/signup/page.tsx`.

---

## 🎮 Utilisation

### Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de production

```bash
npm run build
npm start
```

### Premier démarrage

1. **Créez un compte** sur la landing page
2. **Ajoutez un emplacement** (ex: "Maison principale")
3. **Ajoutez un compteur** (sélectionnez le type, numéro de série, etc.)
4. **Encodez vos premiers relevés**
5. **Consultez les graphiques** sur la page de détail du compteur

### Import d'historique

Si vous avez un historique de relevés :

1. Préparez un fichier CSV avec vos relevés
2. Utilisez la fonction `import_meter_readings` dans Supabase
3. Voir `import_historique.sql` pour plus de détails

---

## 📁 Structure du projet

```
ConsoFlow/
├── app/                          # Pages Next.js (App Router)
│   ├── auth/                     # Pages d'authentification
│   │   ├── login/
│   │   └── signup/
│   ├── meters/                   # Gestion des compteurs
│   │   └── [id]/                 # Page de détail d'un compteur
│   ├── locations/                # Gestion des emplacements
│   ├── readings/                 # Historique des relevés
│   ├── profile/                  # Profil utilisateur
│   └── page.tsx                  # Page d'accueil / Dashboard
├── components/                   # Composants React
│   ├── landing/                  # Composants de la landing page
│   ├── header.tsx                # Header de l'application
│   ├── logo.tsx                  # Logo ConsoFlow
│   └── providers.tsx             # Providers React (Auth, etc.)
├── lib/                          # Bibliothèques et utils
│   ├── supabase.ts               # Client Supabase
│   └── auth-context.tsx          # Context d'authentification
├── types/                        # Types TypeScript
│   └── database.ts               # Types de la base de données
├── public/                       # Fichiers statiques
├── supabase_schema.sql           # Schéma de base de données
├── household_info_table.sql      # Table des infos du foyer
├── import_historique.sql         # Fonction d'import
├── .env.example                  # Exemple de variables d'env
├── BRANDING.md                   # Guide de la marque
├── GUIDE_UTILISATION.md          # Guide utilisateur détaillé
└── README.md                     # Ce fichier
```

---

## 🎨 Personnalisation

### Branding

Consultez `BRANDING.md` pour :
- Les couleurs de la marque
- Les typographies
- Le logo et ses variations
- Les guidelines d'utilisation

### Types de compteurs

Pour ajouter un nouveau type de compteur :

1. Allez dans Supabase SQL Editor
2. Insérez un nouveau `meter_type` :
```sql
INSERT INTO meter_types (name, unit, icon, color)
VALUES ('Votre Type', 'unité', '🔧', '#FF5733');
```

### Benchmarks de consommation

Les benchmarks actuels sont basés sur des moyennes belges approximatives. Pour les mettre à jour :

1. Modifiez les données dans `household_info_table.sql`
2. Ou éditez directement la table `consumption_benchmarks` dans Supabase

Sources officielles recommandées :
- VREG (Flandre) : https://www.vreg.be
- CWaPE (Wallonie) : https://www.cwape.be
- BRUGEL (Bruxelles) : https://www.brugel.brussels

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Forkez** le projet
2. Créez une **branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Poussez** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Guidelines

- Suivez les conventions de code TypeScript
- Ajoutez des tests si possible
- Mettez à jour la documentation
- Utilisez des messages de commit clairs

---

## 📝 Documentation supplémentaire

- **GUIDE_UTILISATION.md** - Guide utilisateur complet
- **DEMARRAGE.md** - Guide de démarrage rapide
- **BRANDING.md** - Guide de la marque
- **CONFIGURATION_EMAIL.md** - Configuration des emails

---

## 🐛 Problèmes connus

- Les graphiques nécessitent au moins 2 relevés pour s'afficher
- L'import d'historique doit respecter le format spécifié
- Les extensions de navigateur peuvent causer des avertissements d'hydratation

---

## 📄 License

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

Développé avec ❤️ et Claude Code

---

## 🙏 Remerciements

- **Next.js** - Le framework React
- **Supabase** - Backend as a Service
- **Tailwind CSS** - Framework CSS
- **Recharts** - Bibliothèque de graphiques
- **Claude Code** - Assistant de développement

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez la documentation dans le dossier `/docs`
2. Vérifiez les [Issues](https://github.com/VOTRE_USERNAME/ConsoFlow/issues) existantes
3. Créez une nouvelle issue si nécessaire

---

## 🔮 Roadmap

- [ ] Application mobile (React Native)
- [ ] Export des données (CSV, PDF)
- [ ] Alertes de consommation anormale
- [ ] Intégration API fournisseurs d'énergie
- [ ] Mode sombre
- [ ] Support multilingue (FR/EN/NL)
- [ ] Partage de compteurs entre utilisateurs

---

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile sur GitHub !**
