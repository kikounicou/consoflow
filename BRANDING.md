# ConsoFlow - Guide de Marque

## 🎨 Identité de Marque

### Nom
**ConsoFlow** - Smart Meter Tracking

### Signification
- **Conso**: Consommation (énergie, eau, gaz)
- **Flow**: Flux, fluidité, suivi continu
- **Smart Tracking**: Suivi intelligent

Le nom évoque le suivi fluide et continu de vos consommations.

---

## 🎭 Logo

### Design
Le logo ConsoFlow est composé de:
- **Icône**: Trois barres verticales de hauteurs croissantes dans un carré arrondi
- **Gradient**: Bleu (#2563eb) → Violet (#9333ea)
- **Symbolisme**:
  - Les barres représentent des relevés/mesures qui augmentent
  - Le gradient évoque la modernité et la technologie
  - Les coins arrondis donnent un aspect amical et accessible

### Variations

#### 1. Logo Complet
```
[Icône] ConsoFlow
        Smart Tracking
```
- Utilisation: Header, landing page, footer
- Tailles: sm, md, lg

#### 2. Logo Icon Seul
```
[Icône seule]
```
- Utilisation: Favicon, icône d'app mobile
- Format: SVG, 64x64px

#### 3. Logo Light (fond sombre)
- Icône: Gradient bleu-violet clair
- Texte: Blanc
- Sous-titre: Bleu clair (#DBEAFE)

---

## 🎨 Palette de Couleurs

### Couleurs Principales

**Gradient Principal**
```css
background: linear-gradient(to right, #2563eb, #9333ea);
```
- Bleu: `#2563eb` (rgb(37, 99, 235))
- Violet: `#9333ea` (rgb(147, 51, 234))

### Couleurs Fonctionnelles

**Types de Compteurs**
- Électricité: `#F59E0B` (Orange) ⚡
- Eau: `#3B82F6` (Bleu) 💧
- Gaz: `#EF4444` (Rouge) 🔥
- Personnalisé: `#8B5CF6` (Violet) 📈

**UI**
- Succès: `#10B981` (Vert)
- Erreur: `#EF4444` (Rouge)
- Avertissement: `#F59E0B` (Orange)
- Info: `#3B82F6` (Bleu)

**Neutrals**
- Texte principal: `#111827` (gray-900)
- Texte secondaire: `#6B7280` (gray-500)
- Bordures: `#E5E7EB` (gray-200)
- Fond: `#F9FAFB` (gray-50)
- Blanc: `#FFFFFF`

---

## 📝 Typographie

### Polices
- **Système**: Sans-serif system fonts (Tailwind default)
- **Poids utilisés**:
  - Regular (400): Texte normal
  - Medium (500): Navigation
  - Semibold (600): Sous-titres
  - Bold (700): Titres importants
  - Extrabold (800): Titres principaux

### Hiérarchie
```
Hero Title:     text-5xl md:text-6xl lg:text-7xl (extrabold)
Section Title:  text-4xl md:text-5xl (bold)
Card Title:     text-xl (bold)
Body:           text-base (regular)
Small:          text-sm (regular)
Caption:        text-xs (regular)
```

---

## 🎯 Utilisation du Logo

### Composant Logo

```tsx
import { Logo } from '@/components/logo'

// Logo complet (par défaut)
<Logo />

// Logo avec lien
<Logo href="/" />

// Tailles
<Logo size="sm" />  // Petit
<Logo size="md" />  // Moyen (défaut)
<Logo size="lg" />  // Grand

// Variantes
<Logo variant="default" />  // Fond clair
<Logo variant="light" />    // Fond sombre
<Logo variant="dark" />     // Fond clair (alternatif)

// Icon seul
<Logo showText={false} />
```

### Emplacements

1. **Header** (toutes les pages)
   - Taille: md
   - Variant: default
   - Avec lien vers /

2. **Landing Page Hero**
   - Taille: lg
   - Icon seul
   - Centré

3. **Footer**
   - Taille: md
   - Variant: light (fond sombre)

4. **Favicon**
   - Format: SVG
   - Fichier: app/icon.svg

---

## 🎨 Animations

### Logo
- Hover: Légère mise à l'échelle (scale-105)
- Texte hover: Gradient animé
- Transition: 300ms ease

### Landing Page
- Blobs: Animation flottante continue (7s)
- Cards: Hover scale + shadow
- Buttons: Hover translate-y + shadow

---

## 📐 Espacement

### Logo
- Gap entre icône et texte: 12px (gap-3)
- Padding icône: 6px
- Margin autour du logo: Selon contexte

### Grille
- Max width container: 1280px (max-w-7xl)
- Padding horizontal: 16px (sm), 24px (md), 32px (lg)

---

## ✅ À Faire / À Ne Pas Faire

### ✅ À Faire
- Utiliser le gradient bleu-violet pour les éléments clés
- Garder le logo lisible (contraste suffisant)
- Utiliser les variantes appropriées selon le fond
- Maintenir les proportions du logo
- Utiliser les couleurs fonctionnelles de manière cohérente

### ❌ À Ne Pas Faire
- Ne pas étirer ou déformer le logo
- Ne pas changer les couleurs du gradient
- Ne pas utiliser le logo sur fond avec peu de contraste
- Ne pas créer de nouvelles variantes sans raison
- Ne pas mélanger différents styles de logo

---

## 📱 Assets

### Fichiers
```
components/logo.tsx          # Composant Logo principal
app/icon.svg                 # Favicon/icône d'app
```

### Export
Pour exporter le logo en différents formats:
1. Ouvrir le navigateur sur une page avec le logo
2. Utiliser les DevTools pour copier le SVG
3. Convertir si nécessaire (PNG, etc.)

### Tailles Recommandées
- Favicon: 64x64px
- App icon: 512x512px
- Social media: 1200x630px
- Print: Vectoriel (SVG)

---

## 🌈 Exemples d'Utilisation

### Header Standard
```tsx
<header className="bg-white shadow-sm">
  <Logo href="/" size="md" />
</header>
```

### Footer Sombre
```tsx
<footer className="bg-gray-900">
  <Logo variant="light" size="md" />
</footer>
```

### Landing Page
```tsx
<div className="text-center">
  <Logo size="lg" showText={false} />
  <h1>ConsoFlow</h1>
</div>
```

---

## 📊 Cohérence de Marque

Tous les éléments de la marque doivent:
1. **Suivre le gradient bleu-violet** pour les actions principales
2. **Utiliser les couleurs fonctionnelles** de manière cohérente
3. **Respecter la hiérarchie typographique**
4. **Maintenir des animations subtiles** mais efficaces
5. **Assurer l'accessibilité** (contraste, tailles)

---

## 🎯 Ton de Voix

**Moderne**: Technologie, innovation
**Accessible**: Simple, compréhensible
**Professionnel**: Fiable, sérieux
**Amical**: Accueillant, utile

### Messages Clés
- "Smart Tracking" - Suivi intelligent
- Simplicité et efficacité
- Sécurité et confidentialité
- Multi-compteurs et multi-emplacements

---

**ConsoFlow** - La solution moderne pour suivre vos compteurs 🚀
