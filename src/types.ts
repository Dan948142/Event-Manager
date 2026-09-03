export interface Guest {
  id: string;
  name: string;
  phone: string;
  hallOfResidence: string; // Hall of residence / hostel / society / mandal
  joinedAt: string;
  notes?: string;
}

export type JainEventType =
  | 'Temple Darshan'
  | 'Morning Puja & Abhishek'
  | 'Bhakti Sandhya & Aarti'
  | 'Swadhyay & Pravachan'
  | 'Navkar Jaap & Samayik'
  | 'Tirth Yatra & Pilgrimage'
  | 'Sadarmik Vatsalya & Seva';

export interface JainEventItem {
  id: string;
  title: string;
  eventType: JainEventType;
  templeName: string; // Temple / Derasar / Jinalaya
  location: string;   // Address / City / Campus landmark
  dateTime: string;   // ISO format or date-time string
  description: string;
  guidelines: string; // e.g. dress code, puja vastra, shoes/leather rules
  organizerName: string;
  organizerPhone: string;
  organizerEmail?: string;
  organizerKey: string; // Secret key for organizer privileges
  guests: Guest[];
  isArchived?: boolean; // Past event older than 5 days
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility alias for server/store if needed
export type EventItem = JainEventItem;

export interface UserLocalProfile {
  guestId: string;
  name: string;
  phone: string;
  hallOfResidence: string;
}

export interface JainQuote {
  id: string;
  sanskrit: string;
  hindiTranslation?: string;
  englishTranslation: string;
  source: string;
}

export interface OrganizerAccount {
  email: string;
  name: string;
  token?: string;
  loggedInAt?: string;
}
