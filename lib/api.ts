// Use relative paths - Next.js API routes are served from the same origin
export interface ShipmentData {
  sender: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  receiver: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  packageDetails: {
    weight: number;
    length: number;
    width: number;
    height: number;
    contents: string;
    value: number;
  };
  deliveryOptions: {
    serviceType: string;
    insurance: boolean;
    specialInstructions: string;
  };
}

export interface TrackingStatus {
  trackingNumber: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  history: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
  sender: {
    name: string;
    city: string;
    country: string;
  };
  receiver: {
    name: string;
    city: string;
    country: string;
  };
  packageDetails: {
    weight: number;
    dimensions: string;
    contents: string;
  };
}

export interface RateRequest {
  origin: string;
  destination: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  serviceType: string;
}

export interface RateResponse {
  cost: number;
  estimatedDelivery: string;
  currency: string;
}

export interface Review {
  _id?: string;
  customerName: string;
  rating: number;
  reviewText: string;
  location: string;
  createdAt: string | Date;
  approved?: boolean;
}

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Shipment API
export const createShipment = async (data: ShipmentData) => {
  const response = await fetch('/api/shipments/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create shipment');
  }

  return response.json();
};

export const getShipment = async (trackingNumber: string) => {
  const response = await fetch(`/api/shipments/${trackingNumber}`);

  if (!response.ok) {
    throw new Error('Shipment not found');
  }

  return response.json();
};

// Tracking API
export const getTracking = async (trackingNumber: string): Promise<TrackingStatus> => {
  const response = await fetch(`/api/tracking/${trackingNumber}`);

  if (!response.ok) {
    throw new Error('Tracking number not found');
  }

  return response.json();
};

// Rates API
export const calculateRate = async (data: RateRequest): Promise<RateResponse> => {
  const response = await fetch('/api/rates/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate rate');
  }

  return response.json();
};

// Reviews API
export const getReviews = async (): Promise<Review[]> => {
  const response = await fetch('/api/reviews');

  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }

  return response.json();
};

export const createReview = async (data: Omit<Review, '_id' | 'createdAt' | 'approved'>): Promise<Review> => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create review');
  }

  return response.json();
};

// Contact API
export const submitContact = async (data: ContactData) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit contact form');
  }

  return response.json();
};