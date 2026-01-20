import { supabase } from '../lib/supabase/client';

/**
 * Utilitaires pour gérer l'authentification via localStorage avec support Supabase
 */

export const authUtils = {
  /**
   * Stocker les tokens d'authentification
   */
  setTokens: (sapiow_access_token: string, refreshToken: string, userId: string) => {
    localStorage.setItem("sapiow_access_token", sapiow_access_token);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user_id", userId);
  },

  /**
   * Récupérer le token d'accès
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem("sapiow_access_token");
  },

  /**
   * Récupérer le token de rafraîchissement
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem("refresh_token");
  },

  /**
   * Récupérer l'ID utilisateur
   */
  getUserId: (): string | null => {
    return localStorage.getItem("user_id");
  },

  /**
   * Décoder un JWT pour vérifier son expiration
   */
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return true; // Considérer comme expiré en cas d'erreur
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié avec un token valide
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("sapiow_access_token");
    if (!token) return false;
    
    // Vérifier si le token est expiré
    if (authUtils.isTokenExpired(token)) {
      console.log('Token expiré, nettoyage automatique');
      authUtils.clearTokens();
      return false;
    }
    
    return true;
  },

  /**
   * Rafraîchir le token d'accès en utilisant le refresh token
   */
  refreshAccessToken: async (): Promise<boolean> => {
    const refreshToken = authUtils.getRefreshToken();
    if (!refreshToken) {
      console.log('Aucun refresh token disponible');
      return false;
    }

    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error || !data?.session) {
        console.error('Erreur lors du refresh du token:', error);
        authUtils.clearTokens();
        return false;
      }

      // Mettre à jour les tokens avec la nouvelle session
      authUtils.setTokens(
        data.session.access_token,
        data.session.refresh_token,
        data.user?.id || authUtils.getUserId() || ''
      );

      console.log('Token rafraîchi avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors du refresh du token:', error);
      authUtils.clearTokens();
      return false;
    }
  },

  /**
   * Vérifier et rafraîchir automatiquement le token si nécessaire
   */
  ensureValidToken: async (): Promise<boolean> => {
    const token = authUtils.getAccessToken();
    if (!token) return false;

    // Si le token n'est pas expiré, tout va bien
    if (!authUtils.isTokenExpired(token)) {
      return true;
    }

    // Essayer de rafraîchir le token
    console.log('Token expiré, tentative de refresh...');
    return await authUtils.refreshAccessToken();
  },

  /**
   * Nettoyer tous les tokens (déconnexion)
   */
  clearTokens: () => {
    localStorage.removeItem("sapiow_access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
  },

  /**
   * Récupérer les headers d'authentification pour les requêtes API
   */
  getAuthHeaders: (): Record<string, string> => {
    const sapiow_access_token = authUtils.getAccessToken();
    return sapiow_access_token ? { Authorization: `Bearer ${sapiow_access_token}` } : {};
  },
};
