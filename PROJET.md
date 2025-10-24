# Suivi des Compteurs

## Objectif

Application web simple pour enregistrer et suivre les relevés de compteurs
(eau, électricité, gaz, et compteurs personnalisés)

## Stack technique

- Backend: Supabase (PostgreSQL + Auth + Storage)
- Frontend: Next.js 14 avec React et TypeScript
- UI: Tailwind CSS
- Graphiques: Recharts

## Fonctionnalités souhaitées

- [x] Configuration base de données Supabase
- [ ] Authentification utilisateur
- [ ] Gestion des emplacements (multi-lieux)
- [ ] Ajouter des compteurs par type
- [ ] Ajouter un nouveau relevé (date, type compteur, valeur, photo optionnelle)
- [ ] Voir l'historique des relevés
- [ ] Calculer la consommation entre deux relevés
- [ ] Afficher un graphique simple de l'évolution
- [ ] Export des données

## Base de données Supabase

✅ **Configuration terminée!**

- URL du projet: https://bxgtbaoibxycsyvkyjhg.supabase.co
- Tables créées: `meter_types`, `locations`, `meters`, `readings`
- Sécurité: Row Level Security (RLS) activé
- Vue: `consumption_stats` pour les calculs de consommation

**Prochaine étape**: Exécuter le fichier `supabase_schema.sql` dans votre dashboard Supabase (SQL Editor)

## Structure des tables

### meter_types
Types de compteurs prédéfinis (électricité, eau, gaz, personnalisé)

### locations
Emplacements où se trouvent les compteurs (maison, bureau, etc.)

### meters
Compteurs individuels avec référence au type et à l'emplacement

### readings
Relevés de compteurs avec date, valeur, notes et photo optionnelle

## Sécurité

✅ Fichier `.env` créé avec les identifiants Supabase
✅ Fichier `.gitignore` créé pour protéger les secrets
