import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import {
  FiArrowRight,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiTwitter,
} from 'react-icons/fi';

const Footer = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const [email, setEmail] = useState('');
  const isEn = language === 'en';

  const copy = {
    location: isEn ? 'LOCATION' : 'الموقع',
    emailUs: isEn ? 'EMAIL US' : 'راسلنا',
    phone: isEn ? 'PHONE' : 'الهاتف',
    contactUs: isEn ? 'Contact Us' : 'اتصل بنا',
    about:
      isEn
        ? 'Exporting premium herbs, spices, seeds, and botanical ingredients with careful sourcing, strict quality control, and professional international handling.'
        : 'نصدر أعشابًا وتوابل وبذورًا ومكونات نباتية فاخرة مع توريد دقيق ورقابة صارمة على الجودة وتعامل دولي احترافي.',
    pages: isEn ? 'PAGES' : 'الصفحات',
    support: isEn ? 'SUPPORT' : 'الدعم',
    newsletter: isEn ? 'JOIN OUR MAILING LIST' : 'انضم إلى قائمتنا البريدية',
    newsletterText:
      isEn
        ? 'Join our weekly newsletter to discover our latest products and sourcing news.'
        : 'اشترك في نشرتنا الأسبوعية لمعرفة أحدث منتجاتنا وأخبار التوريد.',
    emailPlaceholder: isEn ? 'Your email address' : 'بريدك الإلكتروني',
    subscribe: isEn ? 'Subscribe' : 'اشترك',
    rights: isEn ? 'All Rights Reserved.' : 'جميع الحقوق محفوظة.',
    subscribed: isEn ? 'Thanks for subscribing!' : 'شكرًا لاشتراكك!',
  };

  const pageLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.products },
    { href: '/certificates', label: t.nav.certificates },
    { href: '/export', label: t.nav.export },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  const supportLinks = [
    { href: '/catalog', label: t.nav.catalog },
    { href: '/team', label: t.nav.team },
  ];

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    toast.success(copy.subscribed);
    setEmail('');
  };

  return (
    <footer className={`relative overflow-hidden bg-[#0D1615] text-white/75 ${language === 'ar' ? 'rtl' : ''}`}>
      <img
        src="/images/organic/footer-bg.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-10"
      />

      <div className="relative">
        {/* contact strip */}
        <div className="border-b border-white/10">
          <div className="container grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h5 className="mb-4 inline-flex items-center gap-3 font-display text-[17px] font-semibold uppercase tracking-wide text-white">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#A5C232]/15 text-[#A5C232]">
                  <FiMapPin className="h-4 w-4" />
                </span>
                {copy.location}
              </h5>
              <p className="text-[15px] leading-[1.9]">
                {isEn ? 'Kafr Bani Ali, Samasta,' : 'كفر بني علي، سمسطا،'}
                <br />
                {isEn ? 'Beni Suef, Egypt' : 'بني سويف، مصر'}
              </p>
            </div>

            <div>
              <h5 className="mb-4 inline-flex items-center gap-3 font-display text-[17px] font-semibold uppercase tracking-wide text-white">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#A5C232]/15 text-[#A5C232]">
                  <FiMail className="h-4 w-4" />
                </span>
                {copy.emailUs}
              </h5>
              <a href="mailto:export@herbivaeg.com" className="block text-[15px] transition hover:text-[#D1F349]">
                export@herbivaeg.com
              </a>
              <a href="mailto:sales@herbivaeg.com" className="block text-[15px] transition hover:text-[#D1F349]">
                sales@herbivaeg.com
              </a>
            </div>

            <div>
              <h5 className="mb-4 inline-flex items-center gap-3 font-display text-[17px] font-semibold uppercase tracking-wide text-white">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#A5C232]/15 text-[#A5C232]">
                  <FiPhone className="h-4 w-4" />
                </span>
                {copy.phone}
              </h5>
              <a href="tel:+966582848394" className="block text-[15px] transition hover:text-[#D1F349]">
                +966 58 284 8394
              </a>
              <a
                href="https://wa.me/966582848394"
                target="_blank"
                rel="noreferrer"
                className="block text-[15px] transition hover:text-[#D1F349]"
              >
                {isEn ? 'WhatsApp: +966 58 284 8394' : 'واتساب: +966 58 284 8394'}
              </a>
            </div>

            <div className="flex items-center lg:justify-end">
              <Link href="/contact" className="btn-primary">
                {copy.contactUs} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>

        {/* main footer */}
        <div className="container grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center">
              <Link href="/" className="block">
                <img
                  src="/images/logo-horizental.png"
                  alt={t.brand.name}
                  className="h-10 w-auto brightness-0 invert"
                />
              </Link>
              <div className="border-s border-white/15 ps-4 text-[12px] font-medium tracking-wide text-white/60 ltr:ms-5 rtl:ms-5">
                <span className="italic">Nature, sourced with trust</span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-[1.9]">{copy.about}</p>
            <div className="mt-6 flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5 text-white/75 transition hover:border-[#A5C232] hover:bg-[#A5C232] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h5 className="mb-5 font-display text-[17px] font-semibold uppercase tracking-wide text-white">
              {copy.pages}
            </h5>
            <ul className="space-y-3">
              {pageLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[15px] transition hover:text-[#D1F349]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="mb-5 font-display text-[17px] font-semibold uppercase tracking-wide text-white">
              {copy.support}
            </h5>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[15px] transition hover:text-[#D1F349]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h5 className="mb-5 font-display text-[17px] font-semibold uppercase tracking-wide text-white">
              {copy.newsletter}
            </h5>
            <p className="text-[15px] leading-[1.9]">{copy.newsletterText}</p>
            <form onSubmit={handleSubscribe} className="mt-5 flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
                className="h-[50px] w-full rounded-[5px] border border-white/15 bg-white/5 px-4 text-[15px] text-white outline-none transition placeholder:text-white/40 focus:border-[#A5C232]"
              />
              <button type="submit" className="btn-primary shrink-0 px-5" aria-label={copy.subscribe}>
                <FiSend className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* copyright */}
        <div className="border-t border-white/10">
          <div className="container flex flex-col items-center justify-between gap-3 py-5 text-[14px] text-white/60 md:flex-row">
            <p>
              &copy; {new Date().getFullYear()} {t.brand.name}. {copy.rights}
            </p>
            <div className="flex gap-6">
              <Link href="#" className="transition hover:text-[#D1F349]">
                {isEn ? 'Terms & Conditions' : 'الشروط والأحكام'}
              </Link>
              <Link href="#" className="transition hover:text-[#D1F349]">
                {isEn ? 'Privacy Policy' : 'سياسة الخصوصية'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
