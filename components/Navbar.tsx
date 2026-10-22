import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'motion/react';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { useApi } from '@/hooks/useApi';
import { FiArrowRight, FiChevronDown, FiGlobe, FiMail, FiMapPin, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, theme, setLanguage, toggleTheme } = useAppStore();
  const t = translations[language];
  const { categories, fetchCategories } = useApi();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products, dropdown: true },
    { href: '/certificates', label: t.nav.certificates },
    { href: '/export', label: t.nav.export },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const productsDropdown = [
    { href: '/products', label: language === 'en' ? 'All Products' : 'كل المنتجات' },
    ...categories.map((cat) => ({
      href: `/products?category_id=${cat.id}`,
      label: language === 'en' ? cat.name_en : cat.name_ar,
    })),
  ];

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* utility bar */}
      <div className="hidden bg-[#0D1615] text-white/75 lg:block">
        <div className="container flex items-center justify-between py-2 text-[13px]">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <FiMapPin className="h-4 w-4 text-[#A5C232]" />
              {language === 'en' ? 'Kafr Bani Ali, Samasta – Beni Suef, Egypt' : 'كفر بني علي، سمسطا – بني سويف، مصر'}
            </span>
            <a href="mailto:export@herbivaeg.com" className="inline-flex items-center gap-2 transition hover:text-[#D1F349]">
              <FiMail className="h-4 w-4 text-[#A5C232]" />
              export@herbivaeg.com
            </a>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="inline-flex items-center gap-1.5 transition hover:text-[#D1F349]"
            >
              <FiGlobe className="h-4 w-4" />
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={toggleTheme} className="inline-flex items-center transition hover:text-[#D1F349]">
              {theme === 'light' ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* main nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`border-b border-[#E2E2E2]/70 bg-white/95 backdrop-blur-xl transition-shadow duration-300 dark:bg-[#0F1613]/95 ${isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.08)]' : ''
          }`}
      >
        <div className="container flex items-center justify-between gap-3 py-3">
          {/* Brand Logo & Marketing Slogan (near logo but distinct and not glued) */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="block">
              <img
                src="/images/logo-horizental.png"
                alt={t.brand.name}
                className="h-10 w-auto transition-transform hover:scale-[1.02] dark:brightness-0 dark:invert"
              />
            </Link>
            <div className="hidden border-s border-[#DCDCDC] ps-4 text-[12px] font-medium tracking-wide text-[#5D6F63] xl:inline-block ltr:ms-5 rtl:ms-5 dark:border-white/15 dark:text-white/60">
              <span className="italic">Nature, sourced with trust</span>
            </div>
          </div>

          <div className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => (
              <div key={link.href} className="group relative">
                {link.dropdown ? (
                  <>
                    <button
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[12px] px-2.5 py-2.5 text-[13px] font-semibold transition ${
                        isActive(link.href)
                          ? 'text-[#A5C232]'
                          : 'text-[#272320] hover:text-[#A5C232] dark:text-white/85'
                      }`}
                    >
                      <span>{link.label}</span>
                      <FiChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                    </button>
                    <div
                      className="invisible absolute top-full z-50 mt-2 w-56 translate-y-2 overflow-hidden rounded-[16px] border border-[#E2E2E2] bg-white p-2 opacity-0 shadow-[10px_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-[#0F1613] ltr:left-0 rtl:right-0"
                    >
                      {productsDropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-[#272320] transition hover:bg-[#F6F4EC] hover:text-[#A5C232] dark:text-white/80 dark:hover:bg-white/5"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`block whitespace-nowrap rounded-[12px] px-2.5 py-2.5 text-[13px] font-semibold transition ${
                      isActive(link.href)
                        ? 'text-[#A5C232]'
                        : 'text-[#272320] hover:text-[#A5C232] dark:text-white/85'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/contact" className="btn-primary btn-sm hidden xl:inline-flex">
              <span>{t.homePage.shopNow}</span>
              <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="grid h-11 w-11 place-items-center rounded-[12px] border border-[#E2E2E2] text-[#0D1615] transition hover:border-[#0D1615] dark:border-white/15 dark:text-white xl:hidden"
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* mobile menu */}
      {isMenuOpen && (
        <div className="border-b border-[#E2E2E2] bg-white px-6 pb-6 pt-4 shadow-xl dark:border-white/10 dark:bg-[#0F1613] xl:hidden">
          <p className="mb-4 border-b border-[#EFEFEF] pb-3 text-[12px] font-medium italic text-[#5D6F63] dark:border-white/10 dark:text-[#A7B3A9]">
            Nature, sourced with trust
          </p>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => setIsProductsOpen((open) => !open)}
                      className="flex w-full items-center justify-between rounded-[12px] px-4 py-3 text-[15px] font-semibold text-[#272320] dark:text-white/85"
                    >
                      <span>{link.label}</span>
                      <FiChevronDown className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProductsOpen && (
                      <div className="mt-1 space-y-1 ltr:ml-4 rtl:mr-4">
                        {productsDropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-[10px] px-4 py-2 text-[14px] font-medium text-[#5E5E5E] hover:text-[#A5C232] dark:text-white/60"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block rounded-[12px] px-4 py-3 text-[15px] font-semibold text-[#272320] hover:text-[#A5C232] dark:text-white/85"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex-1 rounded-[12px] border border-[#E2E2E2] px-4 py-3 text-center text-sm font-semibold text-[#0D1615] dark:border-white/15 dark:text-white"
            >
              <FiGlobe className="inline h-4 w-4 align-middle ltr:mr-2 rtl:ml-2" />
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              className="flex-1 rounded-[12px] border border-[#E2E2E2] px-4 py-3 text-center text-sm font-semibold text-[#0D1615] dark:border-white/15 dark:text-white"
            >
              {theme === 'light' ? (
                <FiMoon className="inline h-4 w-4 align-middle ltr:mr-2 rtl:ml-2" />
              ) : (
                <FiSun className="inline h-4 w-4 align-middle ltr:mr-2 rtl:ml-2" />
              )}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>

          <Link href="/contact" className="btn-primary mt-4 w-full justify-center">
            <span>{t.homePage.shopNow}</span>
            <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
