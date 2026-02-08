export interface Professional {
  id: string | number; // Support both UUID and number
  name?: string;
  first_name?: string;
  last_name?: string;
  price?: string | number;
  image?: string;
  avatar?: string | null;
  verified?: boolean;
  category?: string;
  domain?: string;
  topExpertise?: boolean;
  description?: string | null;
  linkedin?: string | null;
  job?: string | null;
  // Optionnel: utile pour calculer le prix "à partir de" côté UI
  sessions?: any[];
}
