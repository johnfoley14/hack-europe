export type InitiativeStatus = 'open' | 'funded' | 'failed' | 'canceled';
export type Visibility = 'public' | 'private';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Organizer {
  name: string;
  avatar: string | null;
}

export interface Pledger {
  name: string;
  avatar: string | null;
  amount: number;
}

export interface Update {
  date: string;
  text: string;
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  heldAmount: number;
  deadline: string;
  location: Location;
  organizer: Organizer;
  status: InitiativeStatus;
  visibility: Visibility;
  community: string;
  pledgeCount: number;
  updates?: Update[];
  pledgers?: Pledger[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInitiativeData {
  title: string;
  description: string;
  goal_amount: number;
  deadline: string;
  address: string;
  latitude: number;
  longitude: number;
  visibility: Visibility;
  community?: string;
}

export interface CreatePledgeData {
  amount: number;
  name?: string;
  email?: string;
  stripe_payment_intent_id?: string;
}

export interface PledgeResponse {
  id: string;
  amount: number;
  status: string;
  initiative: {
    id: string;
    heldAmount: number;
    status: InitiativeStatus;
  };
}
