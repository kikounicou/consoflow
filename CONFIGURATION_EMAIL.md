# Configuration des Emails Supabase

## Problème: Je ne reçois pas l'email de confirmation

Il y a plusieurs raisons possibles:
1. La confirmation d'email est activée mais le service email n'est pas configuré
2. L'email arrive dans les spams
3. Le service d'email par défaut de Supabase a des limitations

## Solution 1: Désactiver la confirmation d'email (RECOMMANDÉ pour développement) ⚡

### Étapes:

1. **Allez sur votre dashboard Supabase**:
   - https://app.supabase.com
   - Sélectionnez votre projet

2. **Naviguez vers les paramètres d'authentification**:
   - Cliquez sur **Authentication** dans le menu de gauche
   - Puis cliquez sur **Settings** (ou **Providers**)

3. **Désactivez la confirmation d'email**:
   - Cherchez la section **Email Auth** ou **Auth Providers**
   - Trouvez l'option "**Enable email confirmations**" ou "**Confirm email**"
   - **Désactivez cette option** (toggle OFF)
   - Cliquez sur **Save**

4. **C'est tout!**
   - Les nouveaux utilisateurs pourront se connecter immédiatement
   - Les utilisateurs existants qui n'ont pas confirmé leur email pourront aussi se connecter

### Vérification:

Essayez de créer un nouveau compte:
1. Allez sur http://localhost:3000/auth/signup
2. Créez un compte
3. Vous devriez pouvoir vous connecter directement sans email

---

## Solution 2: Configurer les emails (pour production) 📧

### A. Vérifier les emails dans Supabase Dashboard

1. Allez dans **Authentication** → **Users**
2. Regardez si votre utilisateur apparaît
3. Si la colonne "Email Confirmed" est à "false", vous pouvez:
   - **Manuellement confirmer**: Cliquez sur l'utilisateur → Actions → Confirm user

### B. Configurer un service SMTP personnalisé

Pour la production, vous devriez configurer un vrai service d'email:

#### Option 1: Resend (Recommandé - Simple et gratuit)

1. **Créez un compte sur Resend**:
   - https://resend.com
   - 3,000 emails/mois gratuits

2. **Obtenez votre clé API**:
   - Dashboard → API Keys
   - Créez une nouvelle clé

3. **Configurez dans Supabase**:
   - Authentication → Settings
   - Scrollez jusqu'à "SMTP Settings"
   - Activez "Enable Custom SMTP"
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP Username: resend
   SMTP Password: [votre clé API Resend]
   Sender email: noreply@votre-domaine.com
   Sender name: Votre App
   ```

#### Option 2: SendGrid

1. **Créez un compte sur SendGrid**:
   - https://sendgrid.com
   - 100 emails/jour gratuits

2. **Créez une clé API**:
   - Settings → API Keys
   - Create API Key

3. **Configurez dans Supabase**:
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP Username: apikey
   SMTP Password: [votre clé API SendGrid]
   ```

#### Option 3: Gmail (Simple mais limité)

⚠️ **Attention**: Gmail a des limitations strictes, utilisez uniquement pour le développement!

1. **Activez l'authentification 2 facteurs** sur votre compte Gmail

2. **Créez un mot de passe d'application**:
   - Compte Google → Sécurité
   - Authentification à 2 facteurs
   - Mots de passe des applications
   - Générez un nouveau mot de passe

3. **Configurez dans Supabase**:
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP Username: votre-email@gmail.com
   SMTP Password: [mot de passe d'application généré]
   ```

### C. Personnaliser les templates d'email

1. Allez dans **Authentication** → **Email Templates**
2. Vous pouvez personnaliser:
   - Confirmation d'email
   - Email de récupération de mot de passe
   - Magic Link
   - Changement d'email

---

## Solution 3: Utiliser l'authentification sans email

Si vous ne voulez pas gérer les emails du tout:

### A. Auto-confirmer les utilisateurs côté serveur

Vous pouvez créer une fonction Supabase qui auto-confirme les utilisateurs après inscription.

### B. Utiliser d'autres méthodes d'authentification

Supabase supporte:
- OAuth (Google, GitHub, etc.) - Pas besoin de confirmation d'email
- Magic Links - Email nécessaire mais pas de mot de passe
- SMS/Phone - Alternative à l'email

---

## Recommandation

**Pour le développement**:
✅ **Désactivez simplement la confirmation d'email** (Solution 1)

**Pour la production**:
✅ Utilisez **Resend** ou **SendGrid** avec un domaine personnalisé

---

## Vérification finale

Après avoir désactivé la confirmation ou configuré SMTP:

1. **Testez l'inscription**:
   ```
   Email: test@example.com
   Mot de passe: test123
   ```

2. **Vérifiez dans Supabase**:
   - Authentication → Users
   - Votre utilisateur devrait apparaître
   - "Email Confirmed" devrait être "true" (ou n'a plus d'importance si désactivé)

3. **Testez la connexion**:
   - Utilisez les mêmes identifiants pour vous connecter
   - Vous devriez accéder au tableau de bord

---

## Dépannage

### "Email not confirmed"

Si vous obtenez cette erreur:
1. Désactivez la confirmation d'email dans Supabase (Solution 1)
2. OU confirmez manuellement l'utilisateur dans le dashboard Supabase

### "Invalid login credentials"

- Vérifiez que l'email et le mot de passe sont corrects
- Le mot de passe doit faire au moins 6 caractères
- Vérifiez que l'utilisateur existe dans Authentication → Users

### Toujours pas d'email

1. Vérifiez vos **spams**
2. Vérifiez que SMTP est bien configuré dans Supabase
3. Regardez les logs dans Authentication → Logs
4. Testez avec un email différent (Gmail, Outlook, etc.)

---

## Configuration actuelle de votre application

Le message d'inscription a été mis à jour pour indiquer:
- Le compte est créé avec succès
- Redirection vers la page de connexion
- Note sur la vérification d'email si activée

Vous pouvez maintenant vous connecter directement après avoir désactivé la confirmation d'email!
