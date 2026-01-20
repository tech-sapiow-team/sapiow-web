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

export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

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
    }
  }

  /**
   * Sauvegarder les tokens dans localStorage
   */
  private saveTokensToStorage(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('google_access_token', accessToken);
      
      if (refreshToken) {
        this.refreshToken = refreshToken;
        localStorage.setItem('google_refresh_token', refreshToken);
      }
    }
  }

  /**
   * Nettoyer les tokens
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');
      localStorage.removeItem('google_calendar_connected');
    }
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
        sapiow_access_token: string;
        refresh_token: string;
        expires_in: number;
      }>('google-calendar/callback', { code: authCode });

      // Sauvegarder les tokens
      this.saveTokensToStorage(response.sapiow_access_token, response.refresh_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('google_calendar_connected', 'true');
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la finalisation de la connexion:', error);
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
          sapiow_access_token: this.accessToken 
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

    try {
      const response = await apiClient.get<{ events: GoogleCalendarEvent[] }>(
        `google-calendar/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      
      return response.events;
    } catch (error) {
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

    try {
      const response = await apiClient.post<GoogleCalendarEvent>(
        'google-calendar/events',
        event
      );
      
      return response;
    } catch (error) {
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

    try {
      const response = await apiClient.put<GoogleCalendarEvent>(
        `google-calendar/events/${eventId}`,
        event
      );
      
      return response;
    } catch (error) {
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

    try {
      await apiClient.delete(`google-calendar/events/${eventId}`);
    } catch (error) {
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

    try {
      await apiClient.post('google-calendar/sync-availabilities', {
        availabilities
      });
    } catch (error) {
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

    try {
      const response = await apiClient.get<{ conflicts: GoogleCalendarEvent[] }>(
        `google-calendar/conflicts?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      
      return response.conflicts;
    } catch (error) {
      console.error('Erreur lors de la vérification des conflits:', error);
      return [];
    }
  }
}

// Instance singleton
export const googleCalendar = GoogleCalendarService.getInstance();
