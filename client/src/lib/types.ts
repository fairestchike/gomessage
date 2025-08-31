export interface CurrentUser {
  id: number;
  username: string;
  role: string;
  fullName: string;
  phone: string;
  address?: string | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt?: Date | null;
}

export interface AppState {
  currentUser: CurrentUser | null;
  selectedGasSize: string;
  deliveryType: "new" | "refill";
  orderStatus: "idle" | "pending" | "accepted" | "in_transit" | "delivered";
  currentView: "customer" | "supplier" | "admin";
}

export interface CartItem {
  gasTypeId: number;
  gasTypeName: string;
  gasPrice: number;
  quantity: number;
  deliveryType: "new" | "refill";
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  bottlePrice: number;
  deliveryFee: number;
  total: number;
  deliveryType: "new" | "refill";
}
