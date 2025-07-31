import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'kap_numerique_session';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 jours en secondes

export interface SessionData {
  sessionId: string;
  createdAt: string;
  consentGiven: boolean;
}

export function getOrCreateSession(req?: any, res?: any): SessionData {
  // Utiliser l'API cookies de Next.js
  const cookieStore = cookies();
  const existingSession = cookieStore.get(COOKIE_NAME);
  
  if (existingSession?.value) {
    try {
      const sessionData = JSON.parse(existingSession.value);
      // Vérifier que la session a les bonnes propriétés
      if (sessionData.sessionId && sessionData.createdAt) {
        return sessionData;
      }
    } catch (e) {
      // Session corrompue, on en crée une nouvelle
      console.error('Invalid session cookie:', e);
    }
  }

  // Créer une nouvelle session
  const newSession: SessionData = {
    sessionId: uuidv4(),
    createdAt: new Date().toISOString(),
    consentGiven: false,
  };

  return newSession;
}

export function saveSession(sessionData: SessionData, req?: any, res?: any): void {
  // Cette fonction sera utilisée différemment dans l'API route
  // Les cookies seront définis via NextResponse
}

export function clearSession(req?: any, res?: any): void {
  // Cette fonction sera utilisée différemment dans l'API route
}

export function updateSessionConsent(consent: boolean, req?: any, res?: any): SessionData {
  const session = getOrCreateSession(req, res);
  session.consentGiven = consent;
  return session;
}