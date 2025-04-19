
export type BodyType = {
  id: string;
  name: string;
  bodyfat_range: string;
  population_percentage: string;
  image_url?: string; // Make this optional since we're getting it from storage now
};

export type UserBodyType = {
  id: string;
  user_id: string;
  body_type_id: string;
  selected_date: string;
};
