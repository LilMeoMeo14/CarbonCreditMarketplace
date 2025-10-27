import React from 'react';
import { useRouter } from '../contexts/RouterContext';
import { useAppContext } from '../contexts/AppContext';

// Public Pages
import { Home } from './pages/public/Home';
import { HowItWorks } from './pages/public/HowItWorks';
import { PricingFees } from './pages/public/PricingFees';
import { FAQ } from './pages/public/FAQ';
import { Contact } from './pages/public/Contact';
import { About } from './pages/public/About';
import { Resources } from './pages/public/Resources';
import { Blog } from './pages/public/Blog';
import { PublicMarketplace } from './pages/public/PublicMarketplace';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { PasswordReset } from './pages/auth/PasswordReset';

// EV Owner Pages
import { Dashboard as EVOwnerDashboard } from './pages/ev-owner/Dashboard';
import { EVProfile } from './pages/ev-owner/EVProfile';
import { CarbonTracking } from './pages/ev-owner/CarbonTracking';
import { DeviceIntegration } from './pages/ev-owner/DeviceIntegration';
import { SubmitEmission } from './pages/ev-owner/SubmitEmission';
import { MyRequests } from './pages/ev-owner/MyRequests';
import { CarbonWallet } from './pages/ev-owner/CarbonWallet';
import { IssuanceHistory } from './pages/ev-owner/IssuanceHistory';
import { ListingsManagement } from './pages/ev-owner/ListingsManagement';

// Buyer Pages
import { Dashboard as BuyerDashboard } from './pages/buyer/Dashboard';
import { Marketplace as BuyerMarketplace } from './pages/buyer/Marketplace';
import { Cart } from './pages/buyer/Cart';
import { Checkout } from './pages/buyer/Checkout';
import { PurchaseHistory } from './pages/buyer/PurchaseHistory';
import { Auctions } from './pages/buyer/Auctions';


// 1. Import các Dashboard mới từ vị trí chính xác
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CVADashboard } from './pages/cva/CVADashboard';
// 2. Import CreditDetail (giả sử bạn đặt trong 'shared')
import { CreditDetail } from './pages/shared/CreditDetail';


// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';


export function Router() {
  const { currentPath } = useRouter();
  const { user } = useAppContext();

  // 3. Kích hoạt lại các route động cho CreditDetail
  if (currentPath.startsWith('/credit/')) {
    const creditId = currentPath.replace('/credit/', '');
    return <CreditDetail creditId={creditId} />;
  }

  if (currentPath.startsWith('/buyer/credit/')) {
    const creditId = currentPath.replace('/buyer/credit/', '');
    return <CreditDetail creditId={creditId} />;
  }
  
  if (currentPath.startsWith('/cva/verification/')) {
    const requestId = currentPath.replace('/cva/verification/', '');
    return <CVADashboard defaultRequestId={requestId} />; 
  }
  

  // Route mapping
  const routes: Record<string, JSX.Element> = {
    // Public routes
    '/': <Home />,
    '/marketplace': <PublicMarketplace />,
    '/how-it-works': <HowItWorks />,
    '/pricing': <PricingFees />,
    '/blog': <Blog />,
    '/faq': <FAQ />,
    '/contact': <Contact />,
    '/about': <About />,
    '/resources': <Resources />,
    
    // Auth routes
    '/login': <Login />,
    '/register': <Register />,
    '/password-reset': <PasswordReset />,
    '/terms': (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20">
          <h1>Terms of Service</h1>
          <p className="mt-4 text-muted-foreground">...</p>
        </div>
      </PublicLayout>
    ),
    '/privacy': (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20">
          <h1>Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">...</p>
        </div>
      </PublicLayout>
    ),
    
    // EV Owner routes
    '/ev-owner/dashboard': <EVOwnerDashboard />,
    '/ev-owner/profile': <EVProfile />,
    '/ev-owner/tracking': <CarbonTracking />,
    '/ev-owner/devices': <DeviceIntegration />,
    '/ev-owner/submit-emission': <SubmitEmission />,
    '/ev-owner/my-requests': <MyRequests />,
    '/ev-owner/wallet': <CarbonWallet />,
    '/ev-owner/issuance-history': <IssuanceHistory />,
    '/ev-owner/listings': <ListingsManagement />,
    
    // Buyer routes
    '/buyer/dashboard': <BuyerDashboard />,
    '/buyer/marketplace': <BuyerMarketplace />,
    '/buyer/cart': <Cart />,
    '/buyer/checkout': <Checkout />,
    '/buyer/auctions': <Auctions />,
    '/buyer/history': <PurchaseHistory />,
  
    '/cva/dashboard': <CVADashboard />,
    '/admin/dashboard': <AdminDashboard />,
    

    // Legacy routes
    '/nguoiban': <EVOwnerDashboard />,
    '/nguoimua': <BuyerDashboard />,
    '/CVA': <CVADashboard />,
    '/admin': <AdminDashboard />,

  };

  return routes[currentPath] || <Home />;
}