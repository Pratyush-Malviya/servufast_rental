export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  city: string;
  quote: string;
  initials: string;
  platform: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  category: string;
  badge: "Available now" | "Coming soon" | "Waitlist";
  stats: { label: string; value: string }[];
  inclusions: string[];
  price: string;
  isAvailable: boolean;
  image?: string;
}

export interface LeadForm {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  date: string;
  time: string;
  newCustomer: "Yes" | "Returning";
  message: string;
  termsAccepted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
