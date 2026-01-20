import { apiClient } from './api-client';

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

/**
 * Service de gestion de Google Calendar
 * 
 * Note: Les tokens Google Calendar sont stockés dans localStorage car ce sont des tokens
 * OAuth2 tiers (Google), différents des tokens Supabase qui sont gérés via cookies.
 */
export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  private constructor() {
    // Récupérer les tokens depuis localStorage si disponibles
    this.loadTokensFromStorage();
  }

  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  /**
   * Charger les tokens depuis localStorage
   */
  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('google_access_token');
      this.refreshToken = localStorage.getItem('google_refresh_token');
      const expiresAt = localStorage.getItem('google_token_expires_at');
      this.tokenExpiresAt = expiresAt ? parseInt(expiresAt, 10) : null;
    }
  }

  /**
   * Sauvegarder les tokens dans localStorage
   */
  private saveTokensToStorage(
    accessToken: string, 
    refreshToken?: string,
    expiresIn?: number
  ): void {
    this.accessToken = accessToken;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('google_access_token', accessToken);
      
      if (refreshToken) {
        this.refreshToken = refreshToken;
        localStorage.setItem('google_refresh_token', refreshToken);
      }

      // Calculer et stocker la date d'expiration
      if (expiresIn) {
        this.tokenExpiresAt = Date.now() + (expiresIn * 1000);
        localStorage.setItem('google_token_expires_at', this.tokenExpiresAt.toString());
      }
    }
  }

  /**
   * Nettoyer les tokens
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');
      localStorage.removeItem('google_token_expires_at');
      localStorage.removeItem('google_calendar_connected');
    }
  }

  /**
   * Vérifier si le token est expiré
   */
  private isTokenExpired(): boolean {
    if (!this.tokenExpiresAt) return true;
    // Considérer expiré 5 minutes avant l'expiration réelle
    return Date.now() >= (this.tokenExpiresAt - 5 * 60 * 1000);
  }

  /**
   * Rafraîchir le token d'accès Google
   */
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      console.log('Aucun refresh token Google disponible');
      this.clearTokens();
      return false;
    }

    try {
      const response = await apiClient.post<{
        access_token: string;
        expires_in: number;
      }>('google-calendar/refresh', { 
        refresh_token: this.refreshToken 
      });

      this.saveTokensToStorage(
        response.access_token,
        undefined, // Le refresh token ne change pas
        response.expires_in
      );

      console.log('Token Google Calendar rafraîchi avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors du refresh du token Google:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Assurer que le token est valide avant une requête
   */
  private async ensureValidToken(): Promise<boolean> {
    if (!this.accessToken) return false;

    if (this.isTokenExpired()) {
      console.log('Token Google expiré, tentative de refresh...');
      return await this.refreshAccessToken();
    }

    return true;
  }

  /**
   * Vérifier si l'utilisateur est connecté à Google Calendar
   */
  public isConnected(): boolean {
    if (typeof window === 'undefined') return false;
    return !!this.accessToken && localStorage.getItem('google_calendar_connected') === 'true';
  }

  /**
   * Initier la connexion Google OAuth2
   */
  public async initiateConnection(): Promise<string> {
    try {
      // Appeler l'endpoint backend pour obtenir l'URL d'autorisation
      const response = await apiClient.get<{ authUrl: string }>('google-calendar/auth-url');
      return response.authUrl;
    } catch (error) {
      console.error('Erreur lors de l\'initiation de la connexion Google:', error);
      throw new Error('Impossible d\'initier la connexion Google Calendar');
    }
  }

  /**
   * Finaliser la connexion avec le code d'autorisation
   */
  public async completeConnection(authCode: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
      }>('google-calendar/callback', { code: authCode });

      // Sauvegarder les tokens
      this.saveTokensToStorage(
        response.access_token, 
        response.refresh_token,
        response.expires_in
      );
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('google_calendar_connected', 'true');
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la finalisation de la connexion:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Déconnecter Google Calendar
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.accessToken) {
        await apiClient.post('google-calendar/revoke', { 
          access_token: this.accessToken 
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Récupérer les événements du calendrier Google
   */
  public async getEvents(
    startDate: Date, 
    endDate: Date
  ): Promise<GoogleCalendarEvent[]> {
    if (!this.isConnected()) {
      throw new Error('Non connecté à Google Calendar');
    }

    // Vérifier et rafraîchir le token si nécessaire
    const isValid = await this.ensureValidToken();
    if (!isValid) {
      throw new Error('Token Google Calendar invalide ou expiré');
    }

    try {
      const response = await apiClient.get<{ events: GoogleCalendarEvent[] }>(
        `google-calendar/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      
      return response.events;
    } catch (error: any) {
      // Si erreur 401, le token est invalide
      if (error?.status === 401) {
        this.clearTokens();
      }
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  }

  /**
   * Créer un événement dans Google Calendar
   */
  public async createEvent(event: GoogleCalendarEvent): Promise<GoogleCalendarEvent> {
    if (!this.isConnected()) {
      throw new Error('Non connecté à Google Calendar');
    }

    const isValid = await this.ensureValidToken();
    if (!isValid) {
      throw new Error('Token Google Calendar invalide ou expiré');
    }

    try {
      const response = await apiClient.post<GoogleCalendarEvent>(
        'google-calendar/events',
        event
      );
      
      return response;
    } catch (error: any) {
      if (error?.status === 401) {
        this.clearTokens();
      }
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un événement dans Google Calendar
   */
  public async updateEvent(
    eventId: string, 
    event: Partial<GoogleCalendarEvent>
  ): Promise<GoogleCalendarEvent> {
    if (!this.isConnected()) {
      throw new Error('Non connecté à Google Calendar');
    }

    const isValid = await this.ensureValidToken();
    if (!isValid) {
      throw new Error('Token Google Calendar invalide ou expiré');
    }

    try {
      const response = await apiClient.put<GoogleCalendarEvent>(
        `google-calendar/events/${eventId}`,
        event
      );
      
      return response;
    } catch (error: any) {
      if (error?.status === 401) {
        this.clearTokens();
      }
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw error;
    }
  }

  /**
   * Supprimer un événement de Google Calendar
   */
  public async deleteEvent(eventId: string): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Non connecté à Google Calendar');
    }

    const isValid = await this.ensureValidToken();
    if (!isValid) {
      throw new Error('Token Google Calendar invalide ou expiré');
    }

    try {
      await apiClient.delete(`google-calendar/events/${eventId}`);
    } catch (error: any) {
      if (error?.status === 401) {
        this.clearTokens();
      }
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  }

  /**
   * Synchroniser les disponibilités avec Google Calendar
   */
  public async syncAvailabilities(availabilities: any[]): Promise<void> {
    if (!this.isConnected()) {
      throw new Error('Non connecté à Google Calendar');
    }

    const isValid = await this.ensureValidToken();
    if (!isValid) {
      throw new Error('Token Google Calendar invalide ou expiré');
    }

    try {
      await apiClient.post('google-calendar/sync-availabilities', {
        availabilities
      });
    } catch (error: any) {
      if (error?.status === 401) {
        this.clearTokens();
      }
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  }

  /**
   * Vérifier les conflits avec Google Calendar
   */
  public async checkConflicts(
    startDate: Date, 
    endDate: Date
  ): Promise<GoogleCalendarEvent[]> {
    if (!this.isConnected()) {
      return [];
    }

    const isValid = await this.ensureValidToken();
    if (!isValid) {
      console.warn('Token Google Calendar invalide, impossible de vérifier les conflits');
      return [];
    }

    try {
      const response = await apiClient.get<{ conflicts: GoogleCalendarEvent[] }>(
        `google-calendar/conflicts?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      
      return response.conflicts;
    } catch (error: any) {
      if (error?.status === 401) {
        this.clearTokens();
      }
      console.error('Erreur lors de la vérification des conflits:', error);
      return [];
    }
  }
}

// Instance singleton
export const googleCalendar = GoogleCalendarService.getInstance();
