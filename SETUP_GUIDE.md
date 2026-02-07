# Client Setup & Implementation Guide

## 🎯 What's Been Implemented

### ✅ Firebase Authentication
- Email/Password login and signup
- Global auth context (`AuthContext`)
- Auth state persistence across page reloads
- Secure logout functionality

### ✅ Guest User Detection
- Smart popup that appears once per session
- Friendly onboarding for new users
- "Continue as Guest" option
- localStorage-based session tracking

### ✅ Modern Navbar
- Responsive sticky navigation
- Login/Signup buttons for guests
- User dropdown menu when authenticated
- Token balance display (placeholder)
- Smooth hover effects and transitions

### ✅ Plans Section
- Dynamic plan cards from data structure
- API-ready architecture (no hardcoded values)
- Currency support (INR/USD)
- Feature lists and pricing display
- "Most Popular" highlighting
- Trust indicators section

### ✅ Enhanced UI/UX
- Professional SaaS design
- Gradient accents and smooth animations
- Clean modal designs with backdrop blur
- Responsive layouts
- Dark mode support

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd client
npm install
```

This will install all required packages including:
- Firebase SDK (`firebase`)
- Radix UI components (Avatar, Dropdown Menu, etc.)
- All existing dependencies

### 2. Setup Firebase Project

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**:
   - In your Firebase project, go to "Authentication"
   - Click "Get Started"
   - Enable "Email/Password" provider

3. **Get Your Config**:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (`</>`)
   - Copy the config object

### 3. Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 New File Structure

```
client/src/
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx          # Login/Signup modal
│   │   └── GuestModal.tsx         # Guest onboarding popup
│   ├── plans/
│   │   ├── PlanCard.tsx           # Individual plan card
│   │   └── PlansSection.tsx       # Full plans display
│   ├── Navbar.tsx                 # Main navigation bar
│   └── ... (existing components)
│
├── contexts/
│   └── AuthContext.tsx            # Global auth state
│
├── data/
│   └── plans.ts                   # Plans data & helpers
│
├── lib/
│   ├── firebase.ts                # Firebase configuration
│   └── ... (existing)
│
└── pages/
    ├── home.tsx                   # Enhanced with auth
    └── ... (existing)
```

---

## 🔧 Key Features Explained

### 1. Firebase Authentication

**Location**: `src/contexts/AuthContext.tsx`

Global context that manages:
- User authentication state
- Login/Signup methods
- Logout functionality
- Loading states

**Usage in any component**:
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // user: Current user object (null if not logged in)
  // isAuthenticated: Boolean helper
  // login: Function to log in
  // logout: Function to log out
}
```

### 2. Guest Detection Modal

**Location**: `src/components/auth/GuestModal.tsx`

Behavior:
- Shows once per session for non-authenticated users
- 2-second delay after page load for better UX
- Stores flag in `localStorage['guestPromptShown']`
- Never shows to authenticated users
- Options: Login, Signup, or Continue as Guest

### 3. Auth Modal

**Location**: `src/components/auth/AuthModal.tsx`

Features:
- Tabbed interface (Login / Signup)
- Email + Password forms
- Real-time validation
- Error handling with toast notifications
- Loading states during authentication
- Smooth animations

### 4. Navbar

**Location**: `src/components/Navbar.tsx`

Dynamic states:
- **Guest users**: Login and Signup buttons
- **Authenticated users**: User dropdown with:
  - Email display
  - Token balance (placeholder: 5,000 tokens)
  - Profile link
  - Token usage link
  - Settings link
  - Logout button

### 5. Plans Section

**Location**: `src/data/plans.ts` (data) + `src/components/plans/` (UI)

Architecture:
- Plan data in separate file (simulates API response)
- Dynamic rendering from data array
- API-ready structure:
  ```typescript
  interface Plan {
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
  ```

**Helper functions**:
- `getActivePlans()` - Get only active plans
- `getPlanById(id)` - Get specific plan
- `formatPrice()` - Format price with currency
- `formatTokens()` - Format large numbers (5K, 200K)

---

## 🎨 UI/UX Highlights

### Design Principles
- **Clean & Modern**: Professional SaaS aesthetic
- **Conversion-Focused**: Clear CTAs and user flows
- **Smooth Animations**: Subtle transitions and hover effects
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper ARIA labels and keyboard navigation

### Color Scheme
- **Primary Gradient**: Blue to Purple (`from-blue-600 to-purple-600`)
- **Accent Colors**: 
  - Free tier: Slate
  - Pro tier: Blue-Purple
  - Advance tier: Purple-Pink

### Components
- Modal backdrops with blur effect
- Gradient buttons for primary actions
- Badge highlights for "Most Popular"
- Icon-enhanced features
- Smooth shadow and hover states

---

## 🔄 Future Integration Points

### Admin Panel Connection
The plans data structure is ready for API integration:

```typescript
// Current (dummy data):
import { PLANS } from '@/data/plans';

// Future (API call):
const { data: plans } = useQuery('/api/plans', fetchPlans);
```

Just replace the import with API call - the UI components remain unchanged!

### Token Management
Navbar shows placeholder token balance:
```tsx
// Current:
<span>5,000 tokens</span>

// Future:
<span>{user.tokenBalance} tokens</span>
```

### Payment Integration
Plan selection currently shows toast:
```typescript
// Current:
const handleSelectPlan = (planId) => {
  toast({ title: 'Plan selected' });
};

// Future:
const handleSelectPlan = async (planId) => {
  const session = await createCheckoutSession(planId);
  redirectToCheckout(session);
};
```

---

## 🧪 Testing the Features

### Test Authentication
1. Open the app in browser
2. Guest modal should appear after 2 seconds
3. Click "Create Free Account"
4. Fill form with email/password
5. Submit - you should be logged in
6. Check navbar - should show user email
7. Click logout

### Test Guest Flow
1. Open app in incognito/private window
2. Guest modal appears
3. Click "Continue as Guest"
4. Modal closes and doesn't reappear
5. Refresh page - modal should NOT appear again

### Test Plans Section
1. Scroll down to Plans section
2. All 3 plans should display
3. "Pro" plan should have "Most Popular" badge
4. Click any plan - toast notification appears
5. As guest, clicking paid plan shows login requirement

---

## 📝 Environment Variables Reference

```env
# Required for Firebase Authentication
VITE_FIREBASE_API_KEY=          # Your Firebase API key
VITE_FIREBASE_AUTH_DOMAIN=      # yourapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=       # Your project ID
VITE_FIREBASE_STORAGE_BUCKET=   # yourapp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID= # Numeric ID
VITE_FIREBASE_APP_ID=           # App identifier

# Backend API (when ready)
VITE_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

### Firebase Errors
**Error**: "Firebase: Error (auth/invalid-api-key)"
- **Fix**: Check your `.env.local` file has correct Firebase credentials

**Error**: "Firebase: Error (auth/configuration-not-found)"
- **Fix**: Ensure Email/Password auth is enabled in Firebase Console

### Build Errors
**Error**: "Module not found: Can't resolve 'firebase'"
- **Fix**: Run `npm install` to install dependencies

### Auth Not Persisting
**Issue**: User logged out after refresh
- **Check**: AuthContext is wrapped around app in `App.tsx`
- **Check**: Firebase config is correct

### Guest Modal Not Appearing
**Issue**: Modal doesn't show
- **Check**: Clear localStorage: `localStorage.removeItem('guestPromptShown')`
- **Check**: Make sure you're not logged in

---

## 🚀 Next Steps

### Immediate (Ready to Build)
- [ ] Add Firebase credentials to `.env.local`
- [ ] Test authentication flow
- [ ] Customize plan features/pricing
- [ ] Add your branding/colors

### Short-term (Next Features)
- [ ] Password reset flow
- [ ] Email verification
- [ ] User profile page
- [ ] Token usage tracking
- [ ] Payment integration (Stripe/Razorpay)

### Long-term (Backend Integration)
- [ ] Replace dummy plans with API
- [ ] Implement real token system
- [ ] Add admin panel connection
- [ ] Subscription management
- [ ] Usage analytics

---

## 💡 Tips

1. **Customize Plans**: Edit `src/data/plans.ts` to match your pricing
2. **Add More Features**: Extend the Plan interface as needed
3. **Theme Customization**: Update Tailwind colors in `tailwind.config.js`
4. **Add Social Auth**: Firebase supports Google, GitHub, etc.
5. **Secure Routes**: Add route protection for premium features

---

## 📚 Documentation Links

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Radix UI Components](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)

---

## ✅ Implementation Checklist

- [x] Firebase setup and configuration
- [x] AuthContext with login/signup/logout
- [x] Guest detection modal
- [x] Login/Signup modal
- [x] Navbar with auth states
- [x] Plans section with dynamic data
- [x] Responsive design
- [x] Dark mode support
- [x] Error handling
- [x] Loading states
- [ ] Firebase credentials configured
- [ ] Tested with real users

---

Need help? Check the inline code comments or create an issue!
