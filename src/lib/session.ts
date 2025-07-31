import { getCookie, setCookie } from 'cookies-next';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = 'kap_numerique_session';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 jours en secondes

export interface SessionData {
  sessionId: string;
  createdAt: string;
  consentGiven: boolean;
}

export function getOrCreateSession(req?: any, res?: any): SessionData {
  // Essayer de récupérer la session existante
  const existingSession = getCookie(COOKIE_NAME, { req, res });
  
  if (existingSession && typeof existingSession === 'string') {
    try {
      const sessionData = JSON.parse(existingSession);
      // Vérifier que la session a les bonnes propriétés
      if (sessionData.sessionId && sessionData.createdAt) {
        return sessionData;
      }
    } catch (e) {
      // Session corrompue, on en crée une nouvelle
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
  setCookie(COOKIE_NAME, JSON.stringify(sessionData), {
    req,
    res,
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export function clearSession(req?: any, res?: any): void {
  setCookie(COOKIE_NAME, '', {
    req,
    res,
    maxAge: 0,
    path: '/',
  });
}

export function updateSessionConsent(consent: boolean, req?: any, res?: any): SessionData {
  const session = getOrCreateSession(req, res);
  session.consentGiven = consent;
  saveSession(session, req, res);
  return session;
}