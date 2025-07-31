# Instructions de Débogage - Section Interactivité

## Problème
La section d'interactivité (qui contient le chatbot) ne s'affiche pas après les animations graphiques sur le site déployé.

## Page de Debug Créée
J'ai créé une page de debug accessible à : `/debug`

### Accès Local
```bash
npm run dev
# Visitez http://localhost:3000/debug
```

### Accès Production
Une fois déployé, visitez : `https://kap-numerique.re/debug`

## Ce que teste la page de debug

1. **Variables d'environnement** : Vérifie que les variables publiques sont bien configurées
2. **Montage des composants** : Vérifie si les composants client-side se montent correctement
3. **API Chatbot** : Teste l'endpoint `/api/chatbot` directement
4. **Rendu de InteractivitySection** : 
   - Sans wrapper ClientOnly
   - Avec wrapper ClientOnly

## Vérifications à faire

### 1. Console du navigateur
Ouvrez la console du navigateur (F12) et vérifiez :
- Les erreurs JavaScript
- Les erreurs de chargement de ressources
- Les messages de log

### 2. Vérifiez les variables Vercel
Dans le dashboard Vercel, assurez-vous que ces variables sont configurées :
- `AIRTABLE_PAT`
- `AIRTABLE_BASE_ID` (devrait être `appvqqHKkysDvIfqU`)
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (devrait être `openai/gpt-4.1-nano`)

### 3. Testez l'API directement
```bash
# Remplacez YOUR_SITE_URL par votre URL Vercel
curl -X POST https://YOUR_SITE_URL/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "sessionId": "test"}'
```

### 4. Vérifiez les logs Vercel
Dans le dashboard Vercel :
1. Allez dans l'onglet "Functions"
2. Cherchez les logs pour `/api/chatbot`
3. Vérifiez s'il y a des erreurs

## Solutions possibles

### Si c'est un problème de ClientOnly
Le composant `ClientOnly` pourrait empêcher le rendu. Essayez de :
1. Retirer temporairement le wrapper ClientOnly dans `page.tsx`
2. Vérifier si le composant s'affiche

### Si c'est un problème d'API
1. Les variables d'environnement ne sont pas configurées dans Vercel
2. Les clés API sont invalides ou expirées
3. Il y a une erreur CORS

### Si c'est un problème de build
1. Vérifiez les logs de build dans Vercel
2. Essayez de build localement : `npm run build`

## Déploiement de la page de debug

La page de debug va être déployée automatiquement avec le prochain push.

```bash
git add .
git commit -m "feat: add debug page for interactivity section"
git push origin main
```

## Une fois le problème identifié

La page de debug peut être supprimée en supprimant simplement le dossier `/src/app/debug/`.