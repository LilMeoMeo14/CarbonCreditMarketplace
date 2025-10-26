import React from 'react';
import { useRouter } from '../../contexts/RouterContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Menu, X, Languages } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;        
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { navigateTo } = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.marketplace'), path: '/marketplace' },
    { label: t('nav.howItWorks'), path: '/how-it-works' },
    { label: t('nav.pricing'), path: '/pricing' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.faq'), path: '/faq' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigateTo('/')}
            >
              <div className="w-8 h-8 bg-primary rounded-lg" />
              <span className="font-semibold">EV Carbon Market</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Language Switcher & Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Languages className="w-4 h-4" />
                    {language === 'vi' ? '🇻🇳' : '🇬🇧'}
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

              <Button variant="ghost" onClick={() => navigateTo('/login')}>
                {t('common.login')}
              </Button>
              <Button onClick={() => navigateTo('/register')}>
                {t('common.register')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigateTo(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="flex flex-col gap-2 px-4 pt-2 border-t border-border mt-2">
                  {/* Language Switcher */}
                  <div className="flex gap-2 mb-2">
                    <Button 
                      size="sm" 
                      variant={language === 'vi' ? 'default' : 'outline'}
                      onClick={() => setLanguage('vi')}
                      className="flex-1"
                    >
                      🇻🇳 Tiếng Việt
                    </Button>
                    <Button 
                      size="sm" 
                      variant={language === 'en' ? 'default' : 'outline'}
                      onClick={() => setLanguage('en')}
                      className="flex-1"
                    >
                      🇬🇧 English
                    </Button>
                  </div>
                  
                  <Button variant="ghost" onClick={() => navigateTo('/login')}>
                    {t('common.login')}
                  </Button>
                  <Button onClick={() => navigateTo('/register')}>
                    {t('common.register')}
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-primary/5 to-muted mt-auto border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
                <span className="font-semibold">EV Carbon Market</span>
              </div>
              <p className="text-muted-foreground">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="mb-4">{t('footer.platform')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigateTo('/marketplace')} className="hover:text-primary transition-colors">{t('nav.marketplace')}</button></li>
                <li><button onClick={() => navigateTo('/how-it-works')} className="hover:text-primary transition-colors">{t('nav.howItWorks')}</button></li>
                <li><button onClick={() => navigateTo('/pricing')} className="hover:text-primary transition-colors">{t('nav.pricing')}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">{t('footer.resources')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigateTo('/blog')} className="hover:text-primary transition-colors">{t('nav.blog')}</button></li>
                <li><button onClick={() => navigateTo('/faq')} className="hover:text-primary transition-colors">{t('nav.faq')}</button></li>
                <li><button onClick={() => navigateTo('/contact')} className="hover:text-primary transition-colors">{t('nav.contact')}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => navigateTo('/terms')} className="hover:text-primary transition-colors">{t('footer.terms')}</button></li>
                <li><button onClick={() => navigateTo('/privacy')} className="hover:text-primary transition-colors">{t('footer.privacy')}</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
