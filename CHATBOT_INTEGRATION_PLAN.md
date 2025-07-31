# Plan d'Intégration Chatbot avec Airtable et OpenRouter

## État Actuel ✅
1. **Migration Vercel**
   - Instructions de migration fournies
   - Token Vercel : `nQHmfY9ZB6HXzh5cIob1zRMn`
   - MCP Vercel installé dans `/root/.claude/vercel-mcp-server`

2. **Dépendances Installées**
   - `airtable@0.12.2`
   - `openai@5.11.0` (pour compatibilité OpenRouter)

3. **Fichier d'environnement créé**
   - `.env.local` avec les variables nécessaires
   - À compléter avec les vraies clés API

## Architecture Prévue

### 1. Structure Airtable
- **Table FAQ**
  - Colonne `Question` (text)
  - Colonne `Reponse` (long text)
  
- **Table Conversations**
  - Colonne `MessageID` (text)
  - Colonne `UserMessage` (text)
  - Colonne `BotResponse` (long text)
  - Colonne `Timestamp` (date/time)
  - Colonne `SessionID` (text)

### 2. API Routes à Créer

#### `/api/chatbot` (POST)
```typescript
interface ChatRequest {
  message: string;
  sessionId?: string;
}

interface ChatResponse {
  response: string;
  sessionId: string;
}
```

**Logique:**
1. Au premier message : charger toutes les Q&R d'Airtable
2. Construire le prompt avec le contexte FAQ
3. Envoyer à OpenRouter
4. Retourner la réponse
5. Optionnel : streaming avec Server-Sent Events

#### `/api/chatbot/conversation` (POST)
```typescript
interface ConversationLog {
  sessionId: string;
  userMessage: string;
  botResponse: string;
}
```

**Logique:**
1. Enregistrer la conversation dans Airtable
2. Retourner un ID de conversation

### 3. Modifications du Composant

#### `ai-chatbot.tsx`
- Remplacer `predefinedResponses` par appel API
- Ajouter gestion du `sessionId`
- Implémenter le streaming (optionnel)
- Gérer les erreurs réseau

### 4. Configuration OpenRouter

**Modèle recommandé:** `openai/gpt-4.1-nano`

**Headers requis:**
```javascript
{
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'https://kap-numerique.re',
  'X-Title': 'Kap Numérique Chatbot'
}
```

### 5. Prompt System

```text
Tu es l'assistant virtuel de Kap Numérique, une agence digitale à La Réunion.

Base de connaissances FAQ:
{FAQ_DATA}

Instructions:
- Réponds en français
- Sois concis et professionnel
- Si la question est dans la FAQ, utilise cette réponse
- Sinon, propose de contacter l'équipe

Question: {USER_MESSAGE}
```

## Étapes de Mise en Œuvre

### Phase 1 : Backend
1. ✅ Installer dépendances
2. ✅ Créer `.env.local`
3. ⏳ Créer `/api/chatbot`
4. ⏳ Créer `/api/chatbot/conversation`
5. ⏳ Tester avec Postman/curl

### Phase 2 : Frontend
6. ⏳ Modifier `ai-chatbot.tsx`
7. ⏳ Ajouter gestion sessionId
8. ⏳ Implémenter appels API
9. ⏳ Gérer états loading/error

### Phase 3 : Déploiement
10. ⏳ Configurer variables Vercel
11. ⏳ Déployer avec MCP
12. ⏳ Tester en production

## Variables d'Environnement Nécessaires

```bash
# Airtable
AIRTABLE_PAT=pat... # Personal Access Token
AIRTABLE_BASE_ID=app... # ID de la base
AIRTABLE_TABLE_NAME=FAQ

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=openai/gpt-4.1-nano
```

## Commandes pour la Suite

```bash
# Développement local
npm run dev

# Build pour production
npm run build

# Déploiement Vercel (avec MCP)
# À faire via le MCP une fois configuré
```

## Points d'Attention

1. **Timeout Vercel:** 60 secondes max (largement suffisant)
2. **Coûts OpenRouter:** ~$0.00015 par 1K tokens input (GPT-4o-mini)
3. **Rate Limits Airtable:** 5 requests/second
4. **CORS:** Configurer les headers appropriés

## Prochaine Session

Reprendre à l'étape 4 : Créer `/api/chatbot`