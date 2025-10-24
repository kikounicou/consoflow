# Guide de Démarrage Rapide

## Configuration terminée ✅

Votre application de suivi de compteurs est prête à être utilisée!

## Prochaines étapes

### 1. Exécuter le schéma SQL dans Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet: `bxgtbaoibxycsyvkyjhg`
3. Allez dans **SQL Editor** (dans le menu de gauche)
4. Cliquez sur **New Query**
5. Copiez le contenu du fichier `supabase_schema.sql`
6. Collez-le dans l'éditeur
7. Cliquez sur **Run** pour exécuter le script

Cela créera toutes les tables nécessaires:
- `meter_types` (types de compteurs)
- `locations` (emplacements)
- `meters` (compteurs)
- `readings` (relevés)

### 2. Lancer l'application en mode développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### 3. Construire pour la production

```bash
npm run build
npm start
```

## Structure du projet

```
compteurs/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables (à créer)
├── lib/                   # Utilitaires
│   └── supabase.ts       # Client Supabase configuré
├── types/                 # Types TypeScript
│   └── database.ts       # Types de la base de données
├── .env                   # Variables d'environnement (Ne pas commiter!)
├── .env.example          # Template des variables d'environnement
└── supabase_schema.sql   # Schéma de la base de données

## Fonctionnalités déjà configurées

✅ Next.js 16 avec App Router
✅ TypeScript
✅ Tailwind CSS v4
✅ Client Supabase
✅ Types TypeScript pour la base de données
✅ Row Level Security (RLS) pour la sécurité
✅ Schéma complet de base de données

## Prochaines fonctionnalités à développer

1. **Authentification**
   - Page de connexion/inscription
   - Protection des routes
   - Profil utilisateur

2. **Gestion des emplacements**
   - Liste des emplacements
   - Ajout/modification/suppression

3. **Gestion des compteurs**
   - Liste des compteurs par emplacement
   - Ajout de nouveaux compteurs
   - Modification/désactivation

4. **Relevés de compteurs**
   - Formulaire d'ajout de relevé
   - Upload de photo
   - Historique des relevés

5. **Tableaux de bord**
   - Graphiques de consommation
   - Statistiques
   - Comparaisons

## Commandes utiles

```bash
npm run dev      # Lancer en mode développement
npm run build    # Construire pour production
npm start        # Lancer en production
npm run lint     # Vérifier le code avec ESLint
```

## Support

- Documentation Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
- Documentation Supabase: [https://supabase.com/docs](https://supabase.com/docs)
- Documentation Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
