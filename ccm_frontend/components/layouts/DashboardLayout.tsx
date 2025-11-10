import React from 'react';
import { useRouter } from '../../contexts/RouterContext';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Home, 
  ShoppingCart, 
  FileText, 
  Wallet, 
  ClipboardList,
  CheckCircle,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Award,
  Languages
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { navigateTo } = useRouter();
  const { user, logout } = useAppContext();
  const { language, setLanguage, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Menu items based on role
  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'BUYER':
        return [
          { icon: Home, label: t('buyer.dashboard'), path: '/buyer/dashboard' },
          { icon: ShoppingCart, label: t('buyer.marketplace'), path: '/buyer/marketplace' },
          { icon: ShoppingCart, label: t('buyer.cart'), path: '/buyer/cart' },
          { icon: ClipboardList, label: t('buyer.auctions'), path: '/buyer/auctions' },
          { icon: FileText, label: t('buyer.history'), path: '/buyer/history' },
        ];
      
      case 'EV_OWNER':
        return [
          { icon: Home, label: t('evOwner.dashboard'), path: '/ev-owner/dashboard' },
          { icon: ShoppingCart, label: t('evOwner.profile'), path: '/ev-owner/profile' },
          { icon: BarChart3, label: t('evOwner.tracking'), path: '/ev-owner/tracking' },
          { icon: Settings, label: t('evOwner.devices'), path: '/ev-owner/devices' },
          { icon: FileText, label: t('evOwner.submitEmission'), path: '/ev-owner/submit-emission' },
          { icon: ClipboardList, label: t('evOwner.myRequests'), path: '/ev-owner/my-requests' },
          { icon: Wallet, label: t('evOwner.wallet'), path: '/ev-owner/wallet' },
          { icon: ClipboardList, label: t('evOwner.issuanceHistory'), path: '/ev-owner/issuance-history' },
          { icon: ShoppingCart, label: t('evOwner.listings'), path: '/ev-owner/listings' },
        ];
      
      case 'CVA':
        return [
          { icon: Home, label: t('cva.dashboard'), path: '/cva/dashboard' },
          { icon: ClipboardList, label: t('cva.queue'), path: '/cva/verification-queue' },
          { icon: CheckCircle, label: t('cva.verified'), path: '/cva/verified' },
        ];
      
      case 'ADMIN':
        return [
          { icon: Home, label: t('admin.dashboard'), path: '/admin/dashboard' },
          { icon: Users, label: t('admin.users'), path: '/admin/users' },
          { icon: Award, label: t('admin.credits'), path: '/admin/credits' },
          { icon: ShoppingCart, label: t('admin.transactions'), path: '/admin/transactions' },
          { icon: BarChart3, label: t('admin.reports'), path: '/admin/reports' },
          { icon: Settings, label: t('admin.settings'), path: '/admin/settings' },
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    navigateTo('/');
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'BUYER': return t('role.buyer');
      case 'EV_OWNER': return t('role.evOwner');
      case 'CVA': return t('role.cva');
      case 'ADMIN': return t('role.admin');
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-muted border-r border-border transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 mb-8 cursor-pointer"
            onClick={() => navigateTo('/')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg" />
            <span className="font-semibold">Carbon Market</span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Language Switcher & User Menu */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Languages className="w-4 h-4" />
                    <span className="hidden md:inline">{language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
                    <span className="md:hidden">{language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'bg-accent' : ''}>
                    🇻🇳 Tiếng Việt
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:bg-accent px-3 py-2 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <div className="text-sm">{user?.name || 'User'}</div>
                      <div className="text-xs text-muted-foreground">{getRoleLabel()}</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>{user?.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigateTo('/')}>
                    <Home className="w-4 h-4 mr-2" />
                    {t('common.home')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
