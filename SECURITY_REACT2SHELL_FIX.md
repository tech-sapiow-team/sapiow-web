# Protection contre React2Shell (CVE-2025-55182)

## ✅ Mesures de sécurité mises en place

### 1. Sanitization HTML avec DOMPurify

- ✅ Installation de `dompurify` et `@types/dompurify`
- ✅ Création d'une fonction utilitaire `sanitizeHtml()` dans `src/utils/sanitizeHtml.ts`
- ✅ Mise à jour des pages utilisant `dangerouslySetInnerHTML` :
  - `src/app/[locale]/mentions-legales/page.tsx`
  - `src/app/[locale]/compte/mentions-legales/page.tsx`

### 2. Headers de sécurité

- ✅ Configuration de headers de sécurité dans `vercel.json` :
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### 3. ✅ Mise à jour de React

**Version précédente :** React 19.1.0 (VULNÉRABLE)

**Version actuelle :** React 19.2.1 (CORRIGÉE) ✅

**Mise à jour effectuée :**

```bash
npm install react@^19.1.2 react-dom@^19.1.2
```

La version installée est 19.2.1, qui inclut tous les correctifs de sécurité pour React2Shell.

### 4. ✅ Mise à jour de Next.js

**Version précédente :** Next.js 15.3.4 (VULNÉRABLE - CVE-2025-66478)

**Version actuelle :** Next.js 15.3.6 (CORRIGÉE) ✅

**Mise à jour effectuée :**

```bash
pnpm add next@15.3.6 eslint-config-next@15.3.6
```

La version 15.3.6 inclut le correctif pour CVE-2025-66478, qui est lié à React2Shell.

### 5. ⚠️ Action requise : Protection des Preview Deployments

Les déploiements de prévisualisation doivent être protégés dans le dashboard Vercel :

1. **Accéder au dashboard Vercel :**

   - Aller sur https://vercel.com
   - Sélectionner le projet `sapiow-web`

2. **Configurer la protection des preview deployments :**

   - Aller dans **Settings** → **Deployments**
   - Activer **"Protect Preview Deployments"**
   - Choisir une des options :
     - **Password Protection** : Ajouter un mot de passe pour accéder aux previews
     - **Vercel Authentication** : Restreindre l'accès aux membres de l'équipe
     - **IP Allowlist** : Limiter l'accès à certaines adresses IP

3. **Alternative : Désactiver les preview deployments publics**
   - Dans **Settings** → **Git**
   - Désactiver **"Automatic Preview Deployments"** pour les branches non principales

## 🔍 Vérification de la vulnérabilité

Pour vérifier que les correctifs sont appliqués :

1. **Vérifier la version de React :**

   ```bash
   npm list react react-dom
   ```

2. **Vérifier la version de Next.js :**

   ```bash
   npm list next
   ```

3. **Vérifier que DOMPurify est utilisé :**

   ```bash
   grep -r "sanitizeHtml" src/
   ```

4. **Tester la sanitization :**
   - Les scripts malveillants dans le HTML doivent être supprimés
   - Seuls les tags HTML autorisés doivent être conservés

## 📚 Ressources

- [CVE-2025-55182 - React2Shell](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2025-55182)
- [CVE-2025-66478 - Next.js RCE](https://nextjs.org/blog/CVE-2025-66478)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Vercel Preview Deployment Protection](https://vercel.com/docs/deployments/preview-deployments#password-protection)

## ⚡ Actions immédiates

1. ✅ Sanitization HTML mise en place
2. ✅ Headers de sécurité configurés
3. ✅ **React mis à jour vers 19.2.1 (version corrigée)**
4. ✅ **Next.js mis à jour vers 15.3.6 (version corrigée - CVE-2025-66478)**
5. ⚠️ **Configurer la protection des preview deployments dans Vercel** (action manuelle requise dans le dashboard)

## ✅ Résumé des corrections

Toutes les mesures de protection contre React2Shell ont été mises en place :

- ✅ HTML sanitization avec DOMPurify
- ✅ Headers de sécurité HTTP
- ✅ React mis à jour vers une version corrigée (19.2.1)
- ✅ Next.js mis à jour vers une version corrigée (15.3.6) - CVE-2025-66478
- ⚠️ Protection des preview deployments (à configurer manuellement dans Vercel)
