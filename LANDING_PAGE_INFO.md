# Landing Page & Code d'Invitation

## 🎨 Landing Page

Une superbe landing page a été créée pour présenter votre service!

### Sections de la Landing Page

#### 1. **Hero Section** 🚀
- Titre accrocheur avec gradient
- Sous-titre descriptif
- 2 boutons CTA (Commencer / Découvrir)
- Statistiques (100% gratuit, Instantané, Sécurisé, Illimité)
- Animations de blobs colorés en arrière-plan

#### 2. **Features** ✨
Présentation de 6 fonctionnalités principales:
- ⚡ Suivi multi-compteurs
- 📊 Calculs automatiques
- 📍 Multi-emplacements
- 📈 Historique complet
- 🔒 Sécurité garantie
- ⚙️ Interface intuitive

Chaque carte a:
- Une icône avec gradient de couleur
- Animation au hover
- Description claire

#### 3. **How It Works** 🎯
4 étapes simples:
1. Créez votre compte
2. Ajoutez vos compteurs
3. Enregistrez vos relevés
4. Suivez vos consommations

Avec des badges numérotés et des icônes

#### 4. **CTA Section** 💫
- Fond avec gradient bleu-violet
- Badge "Accès sur invitation uniquement"
- Gros bouton d'appel à l'action
- Indicateurs de confiance (gratuit, sans pub, sécurisé)
- Pattern décoratif en arrière-plan

#### 5. **Footer** 📄
- Informations sur l'entreprise
- Liens vers les sections
- Liens sociaux (Twitter, GitHub)
- Copyright et mentions légales

### Design & Animations

**Couleurs**:
- Gradients bleu → violet
- Touches d'orange, vert, rose
- Fond blanc/gris clair

**Animations**:
- Blobs animés dans le hero
- Hover effects sur les cartes
- Transitions douces
- Animations de pulse et bounce

**Responsive**:
- Mobile-first
- Adaptatif tablette/desktop
- Grid flexible

---

## 🔐 Système de Code d'Invitation

### Code Unique

Le code d'invitation est maintenant stocké en tant que **variable d'environnement** pour des raisons de sécurité.

### Où le configurer?

Le code est défini dans le fichier `.env` (non versionné sur GitHub):

```env
NEXT_PUBLIC_INVITATION_CODE=your-invitation-code
```

### Comment ça fonctionne?

1. **Sur la page d'inscription**:
   - L'utilisateur doit entrer le code d'invitation
   - Le champ est **obligatoire** (required)
   - Message: "Ce service est actuellement sur invitation uniquement"

2. **Validation**:
   - Le code est vérifié **avant** de créer le compte
   - Si le code est incorrect: erreur "Code d'invitation invalide"
   - Si le code est correct: le processus continue normalement

3. **Processus d'inscription**:
   ```
   1. Entrer code d'invitation ✓
   2. Entrer email
   3. Entrer mot de passe
   4. Confirmer mot de passe
   5. Validation → Création du compte
   ```

### Changer le code

Pour changer le code d'invitation:

1. Ouvrez votre fichier `.env` local
2. Modifiez la valeur:
   ```env
   NEXT_PUBLIC_INVITATION_CODE=VotreNouveauCode
   ```
3. Redémarrez le serveur de développement

### Désactiver le système d'invitation

Si vous voulez permettre les inscriptions libres:

1. Ouvrez `app/auth/signup/page.tsx`
2. Supprimez ou commentez les lignes 26-30:
   ```typescript
   // if (invitationCode !== INVITATION_CODE) {
   //   setError('Code d\'invitation invalide')
   //   return
   // }
   ```
3. Supprimez le champ du code dans le formulaire (lignes 88-105)

---

## 🎯 Accès à la Landing Page

### Pour les visiteurs non connectés

1. Allez sur http://localhost:3000
2. Vous verrez la **landing page complète**
3. Cliquez sur "Commencer gratuitement" → Page d'inscription

### Pour les utilisateurs connectés

1. Allez sur http://localhost:3000
2. Vous verrez le **tableau de bord** avec vos compteurs

---

## 📁 Structure des Fichiers

```
components/landing/
├── hero.tsx           # Section principale
├── features.tsx       # Fonctionnalités
├── how-it-works.tsx   # Comment ça marche
├── cta.tsx            # Call-to-action
└── footer.tsx         # Pied de page

app/
├── page.tsx           # Affiche landing OU dashboard
├── auth/signup/
│   └── page.tsx       # Inscription avec code
└── globals.css        # Animations CSS
```

---

## ✨ Personnalisation

### Modifier les couleurs

Dans chaque composant, changez les classes Tailwind:
- `from-blue-600 to-purple-600` → vos couleurs
- `text-blue-600` → votre couleur
- etc.

### Modifier les textes

Tous les textes sont en français et facilement modifiables dans chaque fichier de composant.

### Ajouter des sections

Créez un nouveau composant dans `components/landing/` et importez-le dans `app/page.tsx`.

---

## 🚀 Améliorations Futures Possibles

1. **Codes d'invitation multiples**
   - Stocker les codes dans Supabase
   - Codes à usage unique
   - Codes avec limite d'utilisations

2. **Tracking des invitations**
   - Qui a invité qui
   - Statistiques d'inscription

3. **Système de parrainage**
   - Récompenses pour invitations
   - Codes personnalisés par utilisateur

4. **Page de demande d'invitation**
   - Formulaire de demande
   - Liste d'attente

---

## 🎨 Aperçu de la Landing Page

Sections:
1. **Hero** - Grand titre + CTA
2. **Features** - 6 cartes de fonctionnalités
3. **How It Works** - 4 étapes
4. **CTA** - Appel à l'action final
5. **Footer** - Informations légales

Animations:
- Blobs animés
- Hover effects
- Transitions fluides
- Responsive design

---

## 📝 Notes Importantes

1. **Code sensible à la casse**: `C0mpteur` ≠ `c0mpteur`
2. **Code visible dans le code source**: Pour un vrai système sécurisé, utilisez une base de données
3. **Pas de limitation par IP**: Un utilisateur peut essayer plusieurs codes

Pour une version production:
- Stocker les codes dans Supabase
- Ajouter un rate limiting
- Logger les tentatives
- Générer des codes uniques

---

**La landing page est maintenant live sur http://localhost:3000** 🎉

Déconnectez-vous pour la voir!
