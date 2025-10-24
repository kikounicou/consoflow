# Guide d'utilisation - Application de Suivi de Compteurs

## 🎉 Application complète et fonctionnelle!

Votre application de suivi de compteurs est maintenant entièrement développée et prête à l'emploi.

## 🚀 Démarrage rapide

### Le serveur est déjà lancé!
L'application tourne actuellement sur:
- **Local**: http://localhost:3000
- **Network**: http://192.168.0.15:3000

### Première utilisation

1. **Créer un compte**
   - Allez sur http://localhost:3000
   - Cliquez sur "Créer un compte"
   - Remplissez le formulaire d'inscription
   - Vérifiez votre email pour confirmer (si activé dans Supabase)

2. **Se connecter**
   - Utilisez vos identifiants pour vous connecter
   - Vous serez redirigé vers le tableau de bord

## 📋 Fonctionnalités disponibles

### 1. Tableau de bord (Page d'accueil)
- **Vue d'ensemble**: Nombre de compteurs, emplacements et relevés
- **Cartes par compteur**: Dernière valeur et consommation depuis le dernier relevé
- **Actions rapides**: Liens directs vers les pages principales

### 2. Gestion des emplacements (`/locations`)
- ✅ Créer des emplacements (maison, bureau, etc.)
- ✅ Modifier les emplacements existants
- ✅ Supprimer des emplacements
- Champs: Nom, Adresse (optionnel)

### 3. Gestion des compteurs (`/meters`)
- ✅ Créer des compteurs
- ✅ Choisir le type (Électricité, Eau, Gaz, Personnalisé)
- ✅ Associer à un emplacement
- ✅ Numéro de série et description
- ✅ Activer/désactiver
- ✅ Modifier et supprimer

### 4. Gestion des relevés (`/readings`)
- ✅ Ajouter des relevés avec date et valeur
- ✅ Filtrer par compteur
- ✅ Calcul automatique de la consommation
- ✅ Affichage du nombre de jours entre relevés
- ✅ Notes optionnelles
- ✅ Tableau complet avec historique
- ✅ Modifier et supprimer

### 5. Authentification
- ✅ Inscription avec email/mot de passe
- ✅ Connexion
- ✅ Déconnexion
- ✅ Protection des routes (redirection si non connecté)
- ✅ Données isolées par utilisateur (RLS)

## 🎨 Interface utilisateur

### Navigation
- **Header dynamique**: Affiche le menu et l'email de l'utilisateur
- **Navigation adaptative**: Menu visible uniquement si connecté
- **Footer**: Informations de copyright

### Design
- **Responsive**: Fonctionne sur mobile, tablette et desktop
- **Tailwind CSS v4**: Design moderne et épuré
- **Couleurs par type de compteur**:
  - ⚡ Électricité: Orange (#F59E0B)
  - 💧 Eau: Bleu (#3B82F6)
  - 🔥 Gaz: Rouge (#EF4444)
  - 📈 Personnalisé: Violet (#8B5CF6)

## 🔐 Sécurité

### Row Level Security (RLS)
Toutes les tables sont protégées:
- Les utilisateurs ne voient que leurs propres données
- Impossible d'accéder aux données d'autres utilisateurs
- Politiques configurées dans Supabase

### Variables d'environnement
- Fichier `.env` non commité (`.gitignore`)
- Clés Supabase sécurisées
- Template disponible dans `.env.example`

## 📊 Structure des données

### Base de données Supabase

```
meter_types (types de compteurs)
├── Électricité (kWh)
├── Eau (m³)
├── Gaz (m³)
└── Personnalisé (unité)

locations (emplacements)
├── nom
├── adresse
└── user_id (lien vers l'utilisateur)

meters (compteurs)
├── nom
├── type de compteur (FK)
├── emplacement (FK)
├── numéro de série
├── description
├── actif/inactif
└── user_id

readings (relevés)
├── compteur (FK)
├── date du relevé
├── valeur
├── notes
└── photo (URL - à implémenter)
```

## 🛠️ Workflow recommandé

### Première configuration
1. **Créer un compte** et se connecter
2. **Ajouter des emplacements** (optionnel mais recommandé)
3. **Créer des compteurs** (1 par compteur réel)
4. **Ajouter le premier relevé** avec la valeur actuelle
5. **Ajouter des relevés régulièrement** pour suivre la consommation

### Utilisation quotidienne
1. Consulter le **tableau de bord** pour voir les dernières valeurs
2. Aller sur **Relevés** pour ajouter un nouveau relevé
3. Vérifier les **consommations calculées** automatiquement
4. Gérer les compteurs/emplacements si nécessaire

## 📈 Calculs automatiques

### Consommation
- Calculée automatiquement entre deux relevés successifs
- Formule: `Valeur actuelle - Valeur précédente`
- Affiche le nombre de jours écoulés
- Visible dans le tableau de bord et la page des relevés

### Statistiques
- Nombre total de compteurs actifs
- Nombre d'emplacements
- Nombre total de relevés
- Dernière valeur par compteur

## 🔄 Prochaines améliorations possibles

### Fonctionnalités futures
- [ ] Upload de photos des compteurs
- [ ] Graphiques d'évolution (avec Recharts)
- [ ] Export des données (CSV, PDF)
- [ ] Notifications par email
- [ ] Tarifs et calcul des coûts
- [ ] Comparaison mensuelle/annuelle
- [ ] Objectifs de consommation
- [ ] Mode sombre

## 🐛 Dépannage

### Problèmes courants

**1. Page blanche ou erreur**
- Vérifiez que le serveur tourne (`npm run dev`)
- Vérifiez les variables d'environnement dans `.env`
- Regardez la console du navigateur (F12)

**2. Impossible de se connecter**
- Vérifiez que l'email est correct
- Le mot de passe doit contenir au moins 6 caractères
- Vérifiez dans Supabase Auth que l'utilisateur existe

**3. Données ne s'affichent pas**
- Vérifiez que vous êtes connecté
- Assurez-vous d'avoir exécuté `supabase_schema.sql`
- Vérifiez les politiques RLS dans Supabase

**4. Erreur lors de l'ajout de données**
- Vérifiez que tous les champs obligatoires sont remplis
- Regardez la console pour les erreurs détaillées

## 📝 Commandes utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start

# Vérifier le code
npm run lint
```

## 📚 Documentation technique

### Stack technologique
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel (recommandé)

### Structure du projet
```
compteurs/
├── app/                    # Pages Next.js
│   ├── auth/              # Pages d'authentification
│   ├── locations/         # Page des emplacements
│   ├── meters/            # Page des compteurs
│   ├── readings/          # Page des relevés
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Tableau de bord
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables
│   ├── header.tsx         # En-tête avec navigation
│   └── providers.tsx      # Providers (Auth)
├── lib/                   # Utilitaires
│   ├── supabase.ts        # Client Supabase
│   └── auth-context.tsx   # Contexte d'authentification
├── types/                 # Types TypeScript
│   └── database.ts        # Types de la BDD
└── supabase_schema.sql    # Schéma de la base de données
```

## 🎓 Support

Pour toute question:
1. Consultez ce guide
2. Vérifiez la documentation Supabase: https://supabase.com/docs
3. Documentation Next.js: https://nextjs.org/docs

---

**Bonne utilisation de votre application de suivi de compteurs!** 🎉
