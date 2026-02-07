// Plans data structure - API-ready format
// This simulates what would come from admin panel API in the future

export interface Plan {
  id: string;
  name: string;
  description: string;
  tokenLimit: number;
  price: number;
  currency: 'INR' | 'USD';
  interval: 'month' | 'year' | 'lifetime';
  features: string[];
  recommended?: boolean;
  active: boolean;
}

// Dummy plans data - will be replaced with API call later
export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out our service',
    tokenLimit: 5000,
    price: 0,
    currency: 'INR',
    interval: 'month',
    features: [
      '5,000 tokens/month',
      'Basic humanization',
      'Standard support',
      'Limited history',
    ],
    active: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and content creators',
    tokenLimit: 50000,
    price: 499,
    currency: 'INR',
    interval: 'month',
    features: [
      '50,000 tokens/month',
      'Advanced humanization',
      'Priority support',
      'Unlimited history',
      'Multiple AI models',
      'Custom settings',
    ],
    recommended: true,
    active: true,
  },
  {
    id: 'advance',
    name: 'Advance',
    description: 'For teams and heavy users',
    tokenLimit: 200000,
    price: 1499,
    currency: 'INR',
    interval: 'month',
    features: [
      '200,000 tokens/month',
      'Premium humanization',
      '24/7 dedicated support',
      'Unlimited history',
      'All AI models',
      'API access',
      'Team collaboration',
      'Custom integrations',
    ],
    active: true,
  },
];

// Helper function to get active plans only
export const getActivePlans = (): Plan[] => {
  return PLANS.filter((plan) => plan.active);
};

// Helper function to get plan by ID
export const getPlanById = (id: string): Plan | undefined => {
  return PLANS.find((plan) => plan.id === id);
};

// Helper to format price
export const formatPrice = (price: number, currency: 'INR' | 'USD'): string => {
  if (price === 0) return 'Free';
  
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${price.toLocaleString()}`;
};

// Helper to format tokens
export const formatTokens = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`;
  }
  return tokens.toString();
};
