import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { useAppStore } from '@/store';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}

const PageBanner = ({ title, subtitle, breadcrumb = [] }: PageBannerProps) => {
  const { language } = useAppStore();

  return (
    <section className="page-banner">
      <div className="absolute inset-0 bg-[#0D1615]" />
      <img
        src="/images/organic/banner-img01.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <img
        src="/images/organic/sub-img.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-4 hidden w-56 opacity-60 md:block"
      />

      <div className="container relative z-10">
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-2 text-[15px] font-medium text-white/70">
          <Link href="/" className="transition hover:text-[#D1F349]">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          {breadcrumb.map((crumb) => (
            <span key={crumb.label} className="inline-flex items-center gap-2">
              <FiChevronRight className="h-4 w-4 text-[#A5C232] rtl:rotate-180" />
              {crumb.href ? (
                <Link href={crumb.href} className="transition hover:text-[#D1F349]">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#D1F349]">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="font-display text-[32px] font-bold capitalize leading-tight text-white md:text-[52px]">
          {title}
        </h1>

        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-[1.85] text-white/75 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageBanner;
