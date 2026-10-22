import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PageBanner from '@/components/PageBanner';
import { StaggerGrid, StaggerItem, FadeIn } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import { FiDownload, FiFileText, FiRefreshCw, FiArrowRight, FiPackage } from 'react-icons/fi';
import { useApi, Catalog } from '@/hooks/useApi';

const CatalogPage = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.catalogPage;

  const { catalogs, loading: apiLoading, errors, fetchCatalogs } = useApi();
  const loading = apiLoading.catalogs;
  const error = errors.catalogs;

  useEffect(() => {
    if (catalogs.length === 0) {
      fetchCatalogs();
    }
  }, [catalogs.length]);

  return (
    <Layout title={t.catalog.title}>
      <PageBanner
        title={t.catalog.title}
        subtitle={t.catalog.subtitle}
        breadcrumb={[{ label: t.catalog.title }]}
      />

      {/* Catalog Grid */}
      <section className="section-shell bg-white">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-block h-64 rounded-none" />
                  <div className="space-y-4 p-8">
                    <div className="skeleton-line h-6 w-3/4" />
                    <div className="skeleton-line h-4 w-full" />
                    <div className="skeleton-line h-4 w-1/2" />
                    <div className="skeleton-line h-12 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-panel mx-auto max-w-lg p-12 text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#A5C232]/10 text-[#A5C232]">
                <FiFileText className="h-7 w-7" />
              </div>
              <p className="mb-2 font-display text-xl font-bold text-[#0D1615] dark:text-white">{t.common.error}</p>
              <p className="mb-8 leading-relaxed text-[#5E5E5E] dark:text-white/60">
                {language === 'en' ? 'Unable to load catalogs. Please try again.' : 'تعذر تحميل الكتالوجات. يرجى المحاولة مرة أخرى.'}
              </p>
              <button onClick={fetchCatalogs} className="btn-primary">
                <FiRefreshCw className="h-4 w-4" />
                {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
              </button>
            </div>
          ) : catalogs.length === 0 ? (
            <div className="glass-panel mx-auto max-w-lg p-12 text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#0D1615]/5 text-[#5E5E5E] dark:bg-white/10 dark:text-white/60">
                <FiFileText className="h-7 w-7" />
              </div>
              <p className="font-display text-xl font-bold text-[#0D1615] dark:text-white">{t.common.noData}</p>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {catalogs.map((catalog) => (
                <StaggerItem key={catalog.id} className="h-full">
                  <article className="card-organic group">
                    <div className="img-frame relative h-64 rounded-none">
                      {catalog.image ? (
                        <img
                          src={getAssetUrl(catalog.image)}
                          alt={language === 'en' ? catalog.title_en : catalog.title_ar}
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-[#F8F8F8]">
                          <FiFileText className="h-16 w-16 text-[#0D1615]/20" />
                        </div>
                      )}
                      {catalog.file && (
                        <a
                          href={getAssetUrl(catalog.file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0D1615]/85 via-transparent to-transparent p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        >
                          <span className="btn-primary btn-sm">
                            <FiDownload className="h-4 w-4" />
                            {t.catalog.download}
                          </span>
                        </a>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-8">
                      <div className="mb-3 flex items-center justify-between">
                        {catalog.version ? (
                          <span className="tag-chip">{`${page.versionLabel} ${catalog.version}`}</span>
                        ) : (
                          <span />
                        )}
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E5E5E] dark:text-white/50">PDF</span>
                      </div>
                      <h3 className="font-display text-[22px] font-bold text-[#0D1615] dark:text-white">
                        {language === 'en' ? catalog.title_en : catalog.title_ar}
                      </h3>
                      <p className="section-lead mb-6 mt-3 flex-1">
                        {(language === 'en' ? catalog.short_description_en : catalog.short_description_ar) ||
                          (language === 'en' ? catalog.description_en : catalog.description_ar)}
                      </p>
                      {catalog.file && (
                        <a
                          href={getAssetUrl(catalog.file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary w-full"
                        >
                          <FiDownload className="h-5 w-5" />
                          <span>{t.catalog.download}</span>
                        </a>
                      )}
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>

      {/* Custom Specifications & Samples Request */}
      <section className="section-shell section-dim border-t border-[#E2E2E2]/70 dark:border-white/10">
        <div className="container">
          <FadeIn className="mx-auto max-w-4xl text-center">
            <span className="eyebrow justify-center">
              <FiPackage className="h-4 w-4 text-[#A5C232]" />
              {language === 'en' ? 'B2B Procurement' : 'التوريد التجاري'}
            </span>
            <h2 className="section-title">
              {language === 'en' ? 'Need Custom Cuts or Physical Samples?' : 'هل تحتاج مواصفات خاصة أو عينات مجانية؟'}
            </h2>
            <p className="section-lead mx-auto mt-4 max-w-2xl">
              {language === 'en'
                ? 'We provide tailored mesh sizes, whole or crushed cuts, steam-sterilized lots, and custom packaging. Contact our export desk to request specific data sheets and sample parcels dispatched worldwide via express courier.'
                : 'نوفر مقاسات طحن مخصصة، وأوراق كاملة أو مجروشة، ودفعات معقمة بالبخار، وتعبئة خاصة. تواصل مع قسم التصدير لدينا لطلب مواصفات فنية وعينات تُشحن لجميع أنحاء العالم.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                {language === 'en' ? 'Request Product Samples' : 'طلب عينات منتجات'} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link href="/products" className="btn-white">
                {t.nav.products}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default CatalogPage;
