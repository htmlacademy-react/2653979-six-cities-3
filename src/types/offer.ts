import { City } from './city';
import { Location } from './location';
import { Host } from './host';

export type Offer = {
  id: string;
  title: string;
  type: 'apartment' | 'room' | 'house' | 'hotel';
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  description: string;
  bedrooms: number;
  goods: string[];
  previewImage: string;
  images: string[];
  maxAdults: number;
  host: Host;
}
