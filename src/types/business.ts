export type BusinessType = 'headquarters' | 'branch' | 'franchise';
export type BusinessStatus = 'active' | 'inactive' | 'suspended';
export type LocationStatus = 'active' | 'inactive' | 'temporarily_closed';

export interface Business {
  id: string;
  name: string;
  registered_name: string | null;
  business_code: string;
  logo_url: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  address_line1: string | null;
  address_line2: string | null;
  slug: string;
  parent_business_id: string | null;
  business_type: BusinessType | null;
  status: BusinessStatus;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface BusinessLocation {
  id: string;
  business_id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
  coordinates: [number, number] | null;
  operating_hours: OperatingHours | null;
  status: LocationStatus;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface BusinessContact {
  id: string;
  business_id: string;
  location_id: string | null;
  name: string;
  designation: string | null;
  phone: string | null;
  email: string | null;
  is_primary: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface OperatingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
  timezone: string;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}
