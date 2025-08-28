export type Repo = {
  name: string;
  email: string;
  phone: string;
  role: string;
  userId: string;
  level?:string;
};

export type User = {
  userId: string | number;
  name: string;
  email: string;
  phone: string;
  role: string;
  level?: string;
  whats?: string;
  pixKey?:string;
  active: boolean;
};

export type Boat = {
  name?: string;
  description?: string;
  capacity: string;
  details?: string[]; // <-- Tipado corretamente
  boarding?: string;
  scripts?: string[]; // <-- Tipado corretamente
  structure?: string[]; // <-- Tipado corretamente
  images: string[]; // Supondo que 'images' é um array de File, ajuste conforme necessário
  price?: string;
  duration?: string;
  boardingTime?: string;
  type?: string;
  city?: string;
  sailor?: boolean;
  id?: string;
  managerId?: string;
  // boatAllData?:string;
};

export type Reservation = {
  clientId: string;
  boatId: string;
  boatName: string;
  managerId: string;
  name: string;
  email: string;
  phone: string;
  quantity: string;
  data: string;
  dataTour: string;
  script: string;
  price: string;
  imgBoat?: string;
  acceptedTerms: boolean;
  // acceptedReserv: boolean;
  paid: boolean;
  boarding: string;
  boardingTime: string;
  duration: string;
  assessment?:object;
  status: string;
  paymentLink?: string;
  finishLink?: string;
  productName?: string;
};

export type Review = {
  boatId: string;
  text: string;
  value: number;
  userName: string;
  date:string;
};

export const typesOfBoats = [
  { label: "Lancha", value: "speedboat" },
  { label: "Veleiro", value: "sailboat" },
  { label: "Escuna", value: "schooner" },
];

export const citiesOfBoats = [
  { label: "Caraguatatuba", value: "Caraguatatuba" },
  { label: "Ilhabela", value: "Ilhabela" },
  { label: "São Sebastião", value: "São Sebastião" },
  { label: "Ubatuba", value: "Ubatuba" },
];


export const statusOfReservation = [
  { label: "Solicitado", value: "requested" },
  { label: "Aprovado", value: "aproved" },
  { label: "Finalizado", value: "finished" },
  { label: "Cancelado", value: "canceled" },
];
