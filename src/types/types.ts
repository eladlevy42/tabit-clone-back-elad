export interface IRestaurant {
  restId?: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  lat: number;
  lng: number;
  address: string;
  mainPhoto: string;
  phoneNumber: string;
  website?: string;
  instagram?: string;
  facebook?: string;
}
export interface IOpeningHours {
  id?: number; // Primary key in the SQL structure
  restId: number; // Foreign key reference to `Restaurants`
  sunday?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
}

export interface IReservation {
  reservationId?: number; // Made optional for cases where it's auto-generated
  tableId?: number; // Made optional if it’s determined later
  restId: number;
  partySize: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  notes?: string;
  date: Date;
}

export interface ITable {
  tableId?: number; // Matches the AUTO_INCREMENT primary key from SQL
  restId: number; // Foreign key reference to `Restaurants`
  position: string; // E.g., 'inside', 'outside'
  capacity: number; // Number of guests the table can accommodate
}

export interface IRestaurantMenu {
  menuId?: number; // Matches the AUTO_INCREMENT primary key from SQL
  restId: number; // Foreign key reference to `Restaurants`
  title: string; // E.g., 'Dinner Menu'
  url: string; // URL to the menu
}
export interface IRestaurantPhoto {
  photoId?: number; // Matches the AUTO_INCREMENT primary key from SQL
  restId: number; // Foreign key reference to `Restaurants`
  url: string; // URL to the photo
}
