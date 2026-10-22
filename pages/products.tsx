import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PageBanner from '@/components/PageBanner';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import ProductCard from '@/components/ProductCard';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { FiPackage, FiRefreshCw, FiArrowRight, FiShield } from 'react-icons/fi';

interface Product {
  id: number | string;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  category: {
    id: number | string;
    name_en: string;
    name_ar: string;
  };
}

const Products = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.productsPage;

  const { categories, loading: apiLoading, errors, fetchCategories } = useApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState(false);

  const loading = apiLoading.categories || loadingProducts;
  const error = errors.categories || errorProducts;

  const normalizeItem = (item: any) => item ? { ...item, id: item.id ?? item._id } : null;

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setErrorProducts(false);
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const response = await api.get('/products', { params });
      const data = response.data?.data || response.data || [];
      const normalized = Array.isArray(data) ? data.map(normalizeItem).filter(Boolean) : [];
      setProducts(normalized);
    } catch (error) {
      setErrorProducts(true);
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Layout title={t.products.title}>
      <PageBanner
        title={t.products.title}
        subtitle={page.heroDescription}
        breadcrumb={[{ label: t.products.title }]}
      />

      {/* Products Grid */}
      <section className="section-shell bg-white">
        <div className="container">
          <FadeIn>
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3">
                <span className="eyebrow">
                  <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
                  {page.heroBadge}
                </span>
                <h2 className="section-title mt-0">{t.products.filterByCategory}</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`filter-chip ${!selectedCategory ? 'filter-chip-active' : ''}`}
                >
                  {t.products.allCategories}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id.toString())}
                    className={`filter-chip ${
                      selectedCategory === category.id.toString() ? 'filter-chip-active' : ''
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {getAssetUrl(category.image) && (
                        <img
                          src={getAssetUrl(category.image)}
                          alt=""
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      )}
                      {language === 'en' ? category.name_en : category.name_ar}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-block h-56 rounded-none" />
                  <div className="space-y-4 p-6">
                    <div className="skeleton-line h-3 w-1/3" />
                    <div className="skeleton-line h-5 w-3/4" />
                    <div className="skeleton-line h-3 w-full" />
                    <div className="skeleton-line h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-panel mx-auto max-w-lg p-12 text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#A5C232]/10 text-[#A5C232]">
                <FiPackage className="h-7 w-7" />
              </div>
              <p className="mb-2 font-display text-xl font-bold text-[#0D1615] dark:text-white">{t.common.error}</p>
              <p className="mb-8 leading-relaxed text-[#5E5E5E] dark:text-white/60">
                {language === 'en' ? 'Unable to load products. Please try again.' : 'تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى.'}
              </p>
              <button onClick={fetchProducts} className="btn-primary">
                <FiRefreshCw className="h-4 w-4" />
                {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel mx-auto max-w-lg p-12 text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#0D1615]/5 text-[#5E5E5E] dark:bg-white/10 dark:text-white/60">
                <FiPackage className="h-7 w-7" />
              </div>
              <p className="font-display text-xl font-bold text-[#0D1615] dark:text-white">{t.common.noData}</p>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <StaggerItem key={product.id} className="h-full">
                  <ProductCard
                    id={product.id}
                    name={language === 'en' ? product.name_en : product.name_ar}
                    category={language === 'en' ? product.category.name_en : product.category.name_ar}
                    description={language === 'en' ? product.short_description_en : product.short_description_ar}
                    image={product.image}
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>

      {/* Custom Botanical Sourcing Section */}
      <section className="section-shell section-dim border-t border-[#E2E2E2]/70 dark:border-white/10">
        <div className="container">
          <FadeIn className="mx-auto max-w-4xl text-center">
            <span className="eyebrow justify-center">
              <FiShield className="h-4 w-4 text-[#A5C232]" />
              {language === 'en' ? 'Direct Sourcing' : 'توريد مباشر'}
            </span>
            <h2 className="section-title">
              {language === 'en' ? 'Looking for a Specific Botanical Variety?' : 'تبحث عن صنف أو مواصفة نباتية محددة؟'}
            </h2>
            <p className="section-lead mx-auto mt-4 max-w-2xl">
              {language === 'en'
                ? 'Through our network of contracted farms across Beni Suef, Fayoum, and Upper Egypt, we cultivate and process custom botanical lots tailored to your exact purity, moisture, and essential oil specifications.'
                : 'من خلال شبكة مزارعنا المتعاقد عليها في بني سويف والفيوم وصعيد مصر، نقوم بزراعة ومعالجة دفعات نباتية مخصصة وفقاً لمواصفات النقاء والرطوبة ونسبة الزيوت العطرية المطلوبة.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                {language === 'en' ? 'Request Custom Sourcing Quote' : 'طلب تسعير لتوريد خاص'} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link href="/export" className="btn-white">
                {t.nav.export}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
