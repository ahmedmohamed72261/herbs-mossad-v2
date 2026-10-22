import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PageBanner from '@/components/PageBanner';
import ProductCard from '@/components/ProductCard';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import { FiArrowLeft, FiCheckCircle, FiShield, FiTruck, FiMapPin, FiLayers, FiDroplet, FiAward, FiCloud, FiArchive, FiClock, FiSend } from 'react-icons/fi';
import { GetStaticProps, GetStaticPaths } from 'next';

interface Product {
  id: number | string;
  _id?: string;
  category_id?: string;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  image: string | null;
  images: string[] | null;
  category: {
    id?: number | string;
    _id?: string;
    name_en: string;
    name_ar: string;
  };
  price?: number | string;
  sku?: string;
  stock?: number;
  is_featured?: boolean;
  origin?: string;
  form?: string;
  color?: string;
  purity?: string;
  moisture?: string;
  packaging?: string;
  shelf_life?: string;
  certifications?: string[];
  export_availability?: string;
}

interface ProductDetailsProps {
  product: Product | null;
  suggestedProducts: Product[];
}

const specIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  origin: FiMapPin,
  form: FiLayers,
  color: FiDroplet,
  purity: FiAward,
  moisture: FiCloud,
  packaging: FiArchive,
  shelf_life: FiClock,
  export_availability: FiSend,
};

// The API is MongoDB-based: a product exposes `category_id` and a nested
// `category` object keyed by `_id` (never a numeric `id`).
const getCategoryId = (product: Product | null): string | null => {
  if (!product) return null;
  if (product.category_id) return String(product.category_id);
  if (product.category?._id) return String(product.category._id);
  return product.category?.id !== undefined ? String(product.category.id) : null;
};

const pickRelated = (list: unknown, excludeId: number | string, limit = 3): Product[] => {
  const items = Array.isArray(list) ? (list as Product[]) : [];
  return items.filter((p) => String(p.id) !== String(excludeId)).slice(0, limit);
};

const ProductDetails = ({ product: initialProduct, suggestedProducts: initialSuggested }: ProductDetailsProps) => {
  const router = useRouter();
  const { language } = useAppStore();
  const t = translations[language];
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>(initialSuggested || []);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialProduct?.image || null);

  interface ProductSpec {
    label: string;
    key: string;
  }

  const specFields: ProductSpec[] = [
    { label: language === 'en' ? 'Origin' : 'بلد المنشأ', key: 'origin' },
    { label: language === 'en' ? 'Form' : 'الشكل', key: 'form' },
    { label: language === 'en' ? 'Color' : 'اللون', key: 'color' },
    { label: language === 'en' ? 'Purity' : 'النقاء', key: 'purity' },
    { label: language === 'en' ? 'Moisture' : 'الرطوبة', key: 'moisture' },
    { label: language === 'en' ? 'Packaging' : 'التغليف', key: 'packaging' },
    { label: language === 'en' ? 'Shelf Life' : 'مدة الصلاحية', key: 'shelf_life' },
    { label: language === 'en' ? 'Export Availability' : 'التوفر للتصدير', key: 'export_availability' },
  ];

  useEffect(() => {
    if (!initialProduct && id) {
      fetchProduct();
    }
  }, [id, language, initialProduct]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      const prod = response.data?.data || response.data;
      setProduct(prod);
      setSelectedImage(prod.image);

      fetchSuggestedProducts(getCategoryId(prod), prod.id);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedProducts = async (categoryId: string | null, excludeId: number | string) => {
    try {
      if (categoryId) {
        const response = await api.get('/products', { params: { category_id: categoryId } });
        const related = pickRelated(response.data?.data || response.data, excludeId);
        if (related.length > 0) {
          setSuggestedProducts(related);
          return;
        }
      }

      // Fallback so the section never disappears on a real product page.
      const fallbackResponse = await api.get('/products');
      setSuggestedProducts(pickRelated(fallbackResponse.data?.data || fallbackResponse.data, excludeId));
    } catch (error) {
      setSuggestedProducts([]);
    }
  };

  if (loading) {
    return (
      <Layout title={t.products.title}>
        <div className="container py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="skeleton-card">
              <div className="skeleton-block m-3 h-[380px] rounded-[16px]" />
            </div>
            <div className="pt-2">
              <div className="skeleton-line h-4 w-24" />
              <div className="skeleton-line mt-5 h-9 w-3/4" />
              <div className="skeleton-line mt-6 h-4 w-full" />
              <div className="skeleton-line mt-3 h-4 w-5/6" />
              <div className="skeleton-block mt-8 h-[240px] rounded-[20px]" />
              <div className="skeleton-block mt-8 h-12 w-full rounded-[12px]" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title={t.products.title}>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <span className="text-6xl mb-4 opacity-50">😔</span>
          <p className="mb-6 font-display text-xl font-bold text-[#5E5E5E] dark:text-white/60">{t.common.noData}</p>
          <button
            onClick={() => router.push('/products')}
            className="btn-primary"
          >
            <FiArrowLeft className="h-5 w-5" />
            Back to Products
          </button>
        </div>
      </Layout>
    );
  }

  const productName = language === 'en' ? product.name_en : product.name_ar;
  const productDesc = language === 'en' ? product.description_en : product.description_ar;
  const categoryName = language === 'en' ? product.category?.name_en : product.category?.name_ar;
  const price = Number(product.price);
  const hasPrice = price > 0;

  return (
    <Layout title={productName}>
      <PageBanner
        title={productName}
        breadcrumb={[
          { label: language === 'en' ? 'Products' : 'المنتجات', href: '/products' },
          { label: categoryName || '' },
        ]}
      />

      {/* Product Details Section */}
      <section className="section-shell bg-white">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image Section */}
            <FadeIn className="lg:sticky lg:top-24 lg:self-start">
              {/* Main Image */}
              <div className="img-frame relative aspect-[4/3]">
                {selectedImage ? (
                  <img src={getAssetUrl(selectedImage)} alt={productName} />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[#F6F4EC] text-center">
                    <div>
                      <span className="mb-4 block text-7xl">🌿</span>
                      <span className="font-display text-lg font-semibold text-[#A5C232]">{productName}</span>
                    </div>
                  </div>
                )}
                {product.is_featured && (
                  <span className="tag-sale">{language === 'en' ? 'Featured' : 'مميز'}</span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setSelectedImage(product.image)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-[16px] border-2 transition-all ${
                      selectedImage === product.image
                        ? 'border-[#A5C232] ring-2 ring-[#A5C232]/20'
                        : 'border-[#E2E2E2] hover:border-[#A5C232]'
                    }`}
                  >
                    {product.image ? (
                      <img
                        src={getAssetUrl(product.image)}
                        alt="Main"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#F6F4EC] text-2xl">🌿</div>
                    )}
                  </button>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-[16px] border-2 transition-all ${
                        selectedImage === img
                          ? 'border-[#A5C232] ring-2 ring-[#A5C232]/20'
                          : 'border-[#E2E2E2] hover:border-[#A5C232]'
                      }`}
                    >
                      <img
                        src={getAssetUrl(img)}
                        alt={`Gallery ${idx}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1.5 rounded-[16px] border border-[#E2E2E2] bg-[#F8F8F8] p-3 dark:border-white/10 dark:bg-white/5">
                  <FiShield className="h-5 w-5 text-[#A5C232]" />
                  <span className="text-center text-[10px] font-bold uppercase leading-tight tracking-wider text-[#5E5E5E] dark:text-white/60">
                    {language === 'en' ? 'Premium Quality' : 'جودة عالية'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-[16px] border border-[#E2E2E2] bg-[#F8F8F8] p-3 dark:border-white/10 dark:bg-white/5">
                  <FiCheckCircle className="h-5 w-5 text-[#A5C232]" />
                  <span className="text-center text-[10px] font-bold uppercase leading-tight tracking-wider text-[#5E5E5E] dark:text-white/60">
                    {language === 'en' ? 'Certified' : 'معتمد'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-[16px] border border-[#E2E2E2] bg-[#F8F8F8] p-3 dark:border-white/10 dark:bg-white/5">
                  <FiTruck className="h-5 w-5 text-[#A5C232]" />
                  <span className="text-center text-[10px] font-bold uppercase leading-tight tracking-wider text-[#5E5E5E] dark:text-white/60">
                    {language === 'en' ? 'Worldwide Ship' : 'شحن عالمي'}
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Details Section */}
            <FadeIn className="flex flex-col">
              {/* Category & Badge */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="tag-chip">{categoryName}</span>
                {hasPrice && (
                  <span className="inline-flex items-center font-stat text-[26px] font-semibold text-[#0D1615] dark:text-white">
                    ${price.toFixed(2)}
                    <span className="ml-1.5 text-xs font-bold uppercase tracking-wider text-[#5E5E5E] dark:text-white/50">
                      / {language === 'en' ? 'kg' : 'كجم'}
                    </span>
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="mb-4 font-display text-[36px] font-bold capitalize leading-tight text-[#0D1615] dark:text-white lg:text-[48px]">
                {productName}
              </h1>

              {/* Short Description */}
              <p className="mb-8 border-s-4 border-[#A5C232]/30 ps-4 text-base italic leading-relaxed text-[#5E5E5E] dark:text-white/60">
                &ldquo;{language === 'en' ? product.short_description_en : product.short_description_ar}&rdquo;
              </p>

              {/* Full Description */}
              <div className="mb-10">
                <h3 className="mb-3 flex items-center gap-2 font-display text-[19px] font-bold text-[#0D1615] dark:text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A5C232]" />
                  {language === 'en' ? 'About this product' : 'عن هذا المنتج'}
                </h3>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-[#5E5E5E] dark:text-white/60">
                  {productDesc}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="mb-10">
                <h3 className="mb-4 flex items-center gap-2 font-display text-[19px] font-bold text-[#0D1615] dark:text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A5C232]" />
                  {language === 'en' ? 'Specifications' : 'المواصفات'}
                </h3>
                <div className="card-organic divide-y divide-[#E2E2E2] dark:divide-white/10">
                  {specFields.map((field) => {
                    const value = (product as any)[field.key];
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    return (
                      <div key={field.key} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[#F8F8F8] dark:hover:bg-white/5">
                        <span className="flex items-center gap-2 text-sm font-medium text-[#5E5E5E] dark:text-white/60">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#A5C232]/10">
                            {(() => {
                              const Icon = specIcons[field.key];
                              return Icon ? <Icon className="h-3.5 w-3.5 text-[#A5C232]" /> : null;
                            })()}
                          </span>
                          {field.label}
                        </span>
                        <span className="text-end text-sm font-semibold text-[#0D1615] dark:text-white">
                          {value}
                        </span>
                      </div>
                    );
                  })}
                  {product.certifications && product.certifications.length > 0 && (
                    <div className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[#F8F8F8] dark:hover:bg-white/5">
                      <span className="flex items-center gap-2 text-sm font-medium text-[#5E5E5E] dark:text-white/60">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#A5C232]/10">
                          <FiCheckCircle className="h-3.5 w-3.5 text-[#A5C232]" />
                        </span>
                        {language === 'en' ? 'Certifications' : 'الشهادات'}
                      </span>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {product.certifications.map((cert: string, i: number) => (
                          <span key={i} className="tag-chip">{cert}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={(() => {
                  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966582848394';
                  const msg = language === 'en'
                    ? `Hello! I'm interested in ${productName}.%0A%0AProduct Details:%0A- Category: ${categoryName}%0A${hasPrice ? `- Price: $${price.toFixed(2)}/kg%0A` : ''}${product.origin ? `- Origin: ${product.origin}%0A` : ''}${product.form ? `- Form: ${product.form}%0A` : ''}${product.certifications?.length ? `- Certifications: ${product.certifications.join(', ')}` : ''}%0A%0ACould you please provide more details and pricing?`
                    : `مرحباً، أنا مهتم بـ ${productName}.%0A%0Aتفاصيل المنتج:%0A- التصنيف: ${categoryName}%0A${hasPrice ? `- السعر: $${price.toFixed(2)}/كجم%0A` : ''}${product.origin ? `- بلد المنشأ: ${product.origin}%0A` : ''}${product.form ? `- الشكل: ${product.form}%0A` : ''}${product.certifications?.length ? `- الشهادات: ${product.certifications.join(', ')}` : ''}%0A%0Aهل يمكنكم تزويدي بمزيد من التفاصيل والأسعار؟`;
                  return `https://wa.me/${phone}?text=${msg}`;
                })()}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full justify-center"
              >
                <FiTruck className="w-5 h-5" />
                <span>{language === 'en' ? 'Request a Quote' : 'طلب عرض سعر'}</span>
              </a>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <section className="section-shell border-t border-[#E2E2E2] bg-[#F8F8F8] dark:border-white/10 dark:bg-[#0A0F0E]">
          <div className="container">
            <FadeIn>
              <div className="mb-12 text-center">
                <span className="eyebrow justify-center">
                  {language === 'en' ? 'You might also like' : 'قد يعجبك أيضاً'}
                </span>
                <h2 className="section-title">
                  {language === 'en' ? 'Related Products' : 'منتجات ذات صلة'}
                </h2>
                <p className="section-lead mx-auto mt-3 max-w-lg">
                  {language === 'en'
                    ? `Explore more products in the ${categoryName} category`
                    : `استكشف المزيد من المنتجات في فئة ${categoryName}`}
                </p>
              </div>

              <StaggerGrid className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {suggestedProducts.map((prod) => (
                  <StaggerItem key={prod.id} className="h-full">
                    <ProductCard
                      id={prod.id}
                      name={language === 'en' ? prod.name_en : prod.name_ar}
                      category={language === 'en' ? prod.category?.name_en : prod.category?.name_ar}
                      description={language === 'en' ? prod.short_description_en : prod.short_description_ar}
                      image={prod.image}
                      isFeatured={prod.is_featured}
                    />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </FadeIn>
          </div>
        </section>
      )}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await api.get('/products?limit=1000');
    const products = response.data?.data || response.data || [];
    
    const paths = products.map((product: Product) => ({
      params: { id: product.id.toString() },
    }));

    return {
      paths,
      fallback: 'blocking', // ISR - generate on demand if not pre-built
    };
  } catch (error) {
    console.error('Error fetching products for static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async ({ params }) => {
  try {
    const productId = params?.id;
    
    // Fetch main product
    const productResponse = await api.get(`/products/${productId}`);
    const product = productResponse.data?.data || productResponse.data;

    if (!product) {
      return { notFound: true };
    }

    // Fetch suggested products from same category
    let suggestedProducts: Product[] = [];
    try {
      const categoryId = getCategoryId(product);
      if (categoryId) {
        const suggestedResponse = await api.get('/products', {
          params: { category_id: categoryId },
        });
        suggestedProducts = pickRelated(
          suggestedResponse.data?.data || suggestedResponse.data,
          product.id
        );
      }

      // Fallback so the section never disappears on a real product page.
      if (suggestedProducts.length === 0) {
        const fallbackResponse = await api.get('/products');
        suggestedProducts = pickRelated(
          fallbackResponse.data?.data || fallbackResponse.data,
          product.id
        );
      }
    } catch (error) {
      console.error('Error fetching suggested products:', error);
    }

    // Ensure price is a number
    if (product.price) {
      product.price = Number(product.price);
    }

    return {
      props: {
        product,
        suggestedProducts,
      },
      revalidate: 3600, // ISR - revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
      revalidate: 60, // Retry after 1 minute if error
    };
  }
};

export default ProductDetails;
