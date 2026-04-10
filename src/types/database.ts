export type DogSize = "small" | "medium" | "large";

export interface Dog {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  birthdate: string; // ISO date string
  size: DogSize;
  weight: number | null;
  created_at: string;
}

export interface WeightLog {
  id: string;
  dog_id: string;
  weight: number;
  recorded_at: string;
}

export interface Vaccination {
  id: string;
  dog_id: string;
  name: string;
  vaccinated_at: string;
  next_due_at: string | null;
}

export interface VetVisit {
  id: string;
  dog_id: string;
  visited_at: string;
  clinic_name: string;
  diagnosis: string | null;
  notes: string | null;
}

export interface MealLog {
  id: string;
  dog_id: string;
  food_name: string;
  amount: number | null;
  recorded_at: string;
}

export interface WalkLog {
  id: string;
  dog_id: string;
  duration_minutes: number;
  distance_km: number | null;
  recorded_at: string;
}

export interface Database {
  public: {
    Tables: {
      dogs: {
        Row: Dog;
        Insert: Omit<Dog, "id" | "created_at">;
        Update: Partial<Omit<Dog, "id" | "created_at">>;
        Relationships: [];
      };
      weight_logs: {
        Row: WeightLog;
        Insert: Omit<WeightLog, "id">;
        Update: Partial<Omit<WeightLog, "id">>;
        Relationships: [];
      };
      vaccinations: {
        Row: Vaccination;
        Insert: Omit<Vaccination, "id">;
        Update: Partial<Omit<Vaccination, "id">>;
        Relationships: [];
      };
      vet_visits: {
        Row: VetVisit;
        Insert: Omit<VetVisit, "id">;
        Update: Partial<Omit<VetVisit, "id">>;
        Relationships: [];
      };
      meal_logs: {
        Row: MealLog;
        Insert: Omit<MealLog, "id">;
        Update: Partial<Omit<MealLog, "id">>;
        Relationships: [];
      };
      walk_logs: {
        Row: WalkLog;
        Insert: Omit<WalkLog, "id">;
        Update: Partial<Omit<WalkLog, "id">>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
