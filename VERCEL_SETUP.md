# Configuration Vercel pour Kap Numérique Chatbot

## Variables d'environnement à configurer dans Vercel

1. **Connectez-vous à Vercel** : https://vercel.com/dashboard

2. **Allez dans les paramètres du projet** : 
   - Cliquez sur votre projet Kap Numérique
   - Allez dans l'onglet "Settings"
   - Puis "Environment Variables"

3. **Ajoutez les variables suivantes** :

### Airtable
- **Nom** : `AIRTABLE_PAT`
- **Valeur** : Votre Personal Access Token Airtable
- **Environnements** : Production, Preview, Development
- **Comment obtenir** : 
  1. Allez sur https://airtable.com/account
  2. Cliquez sur "Create new token"
  3. Permissions nécessaires : `data.records:read`, `data.records:write`
  4. Sélectionnez la base "Chatbot Kapnumerique"

- **Nom** : `AIRTABLE_BASE_ID`
- **Valeur** : `appvqqHKkysDvIfqU`
- **Environnements** : Production, Preview, Development

### OpenRouter
- **Nom** : `OPENROUTER_API_KEY`
- **Valeur** : Votre clé API OpenRouter
- **Environnements** : Production, Preview, Development
- **Comment obtenir** :
  1. Créez un compte sur https://openrouter.ai/
  2. Allez dans les paramètres API
  3. Créez une nouvelle clé API
  4. Ajoutez des crédits à votre compte

- **Nom** : `OPENROUTER_MODEL`
- **Valeur** : `openai/gpt-4.1-nano`
- **Environnements** : Production, Preview, Development

### Configuration du site
- **Nom** : `NEXT_PUBLIC_SITE_URL`
- **Valeur** : `https://kap-numerique.re`
- **Environnements** : Production, Preview, Development

## Test en local

Avant de déployer, testez en local :

```bash
# 1. Configurez vos variables dans .env.local
# 2. Lancez le serveur de développement
npm run dev

# 3. Dans un autre terminal, testez le chatbot
node test-chatbot.js
```

## Déploiement

### Option 1 : Via l'interface Vercel
1. Allez dans l'onglet "Deployments"
2. Cliquez sur "Redeploy" sur le dernier déploiement
3. Les variables d'environnement seront automatiquement prises en compte

### Option 2 : Via Vercel CLI
```bash
# Installez Vercel CLI si ce n'est pas fait
npm i -g vercel

# Connectez-vous
vercel login

# Déployez
vercel --prod
```

### Option 3 : Via Git (automatique)
```bash
git add .
git commit -m "feat: add AI chatbot with Airtable integration"
git push origin main
```

## Vérification post-déploiement

1. **Testez le chatbot** sur https://kap-numerique.re
2. **Vérifiez les logs** dans Vercel Dashboard > Functions
3. **Consultez Airtable** pour voir les conversations enregistrées

## Monitoring et Coûts

### Airtable
- **Limite gratuite** : 1,000 records par base
- **Rate limit** : 5 requests/second
- **Recommandation** : Surveillez la table Conversations régulièrement

### OpenRouter
- **Coût GPT-4o-mini** : ~$0.15 pour 1M tokens input, ~$0.60 pour 1M tokens output
- **Estimation** : ~$0.0002 par conversation moyenne (15x moins cher que Claude 3.5)
- **Recommandation** : Configurez des alertes de budget dans OpenRouter

### Vercel
- **Limite gratuite** : 100GB bandwidth, 100K function invocations
- **Timeout** : 10 secondes (suffisant pour le chatbot)

## Troubleshooting

### Le chatbot ne répond pas
1. Vérifiez les logs dans Vercel Dashboard > Functions > api/chatbot
2. Assurez-vous que toutes les variables d'environnement sont configurées
3. Vérifiez que les clés API sont valides et ont les permissions nécessaires

### Erreur 401 Unauthorized
- Vérifiez votre clé OpenRouter
- Assurez-vous d'avoir des crédits sur votre compte OpenRouter

### Erreur 403 Forbidden
- Vérifiez les permissions de votre token Airtable
- Assurez-vous que le token a accès à la base spécifiée

### Les conversations ne s'enregistrent pas
- Vérifiez que la table "Conversations" existe dans Airtable
- Vérifiez les permissions d'écriture du token Airtable

## Améliorations futures

1. **Streaming des réponses** : Pour une meilleure UX
2. **Cache intelligent** : Réduire les appels à Airtable
3. **Analytics** : Dashboard de suivi des conversations
4. **Multi-langue** : Support créole/anglais
5. **Voice input** : Intégration vocale