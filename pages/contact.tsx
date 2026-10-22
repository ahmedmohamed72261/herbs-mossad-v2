import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PageBanner from '@/components/PageBanner';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiPackage, FiGlobe, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useApi } from '@/hooks/useApi';

const popularProducts = [
  { en: 'Egyptian Chamomile (Flowers / TBC)', ar: 'بابونج مصري (زهور / مجروش)' },
  { en: 'Coriander Seeds (Sortex Cleaned)', ar: 'بذور كزبرة (فرز ليزر)' },
  { en: 'Fennel Seeds (Export Grade)', ar: 'بذور شمر (درجة تصدير)' },
  { en: 'Basil Leaves (Rubbed / Crushed)', ar: 'أوراق ريحان (مجروش)' },
  { en: 'Dried Hibiscus (Flowers / Cut)', ar: 'كركديه مجفف (زهور / مقطع)' },
  { en: 'Marjoram (Rubbed Leaves)', ar: 'بردقوش (أوراق مجروشة)' },
  { en: 'Peppermint / Spearmint Leaves', ar: 'نعناع فلفلي / بلدي' },
  { en: 'Anise Seeds', ar: 'بذور ينسون' },
  { en: 'Cumin Seeds', ar: 'بذور كمون' },
  { en: 'Other Egyptian Botanicals', ar: 'نباتات ومحاصيل مصرية أخرى' },
];

const quantityOptions = [
  { en: '1 x 20ft FCL Container (~6-10 MT)', ar: 'حاوية 20 قدم كاملة (~6-10 طن)' },
  { en: '1 x 40ft HC FCL Container (~18-24 MT)', ar: 'حاوية 40 قدم كاملة (~18-24 طن)' },
  { en: '5 to 10 Metric Tons', ar: 'من 5 إلى 10 أطنان مترية' },
  { en: '1 to 5 Metric Tons', ar: 'من 1 إلى 5 أطنان مترية' },
  { en: 'Less than Container Load (LCL / Sample order)', ar: 'أقل من حمولة حاوية (LCL / طلب تجريبي)' },
];

const Contact = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.contactPage;
  const isEn = language === 'en';
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { exportCountries: countries, fetchExportCountries } = useApi();

  useEffect(() => {
    if (countries.length === 0) {
      fetchExportCountries();
    }
  }, [countries.length]);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product_name: popularProducts[0][isEn ? 'en' : 'ar'],
    quantity: quantityOptions[0][isEn ? 'en' : 'ar'],
    destination: '',
    specifications: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppMessage = () => {
    const text = isEn
      ? `Hello Herbivaeg Export Team!%0A%0AI would like to request an official wholesale price quotation:%0A` +
        `• *Client Name:* ${formData.name}%0A` +
        `• *Company:* ${formData.company || 'N/A'}%0A` +
        `• *Email:* ${formData.email}%0A` +
        `• *Phone/WhatsApp:* ${formData.phone}%0A` +
        `• *Product Required:* ${formData.product_name}%0A` +
        `• *Quantity:* ${formData.quantity}%0A` +
        `• *Destination Country & Port:* ${formData.destination}%0A` +
        (formData.specifications ? `• *Specifications:* ${formData.specifications}%0A` : '') +
        (formData.message ? `• *Notes:* ${formData.message}%0A` : '') +
        `%0APlease provide CIF/FOB pricing and lead time.`
      : `مرحباً فريق تصدير Herbivaeg،%0A%0Aأود طلب عرض سعر رسمي للمنتجات التالية:%0A` +
        `• *اسم العميل:* ${formData.name}%0A` +
        `• *الشركة:* ${formData.company || 'غير محدد'}%0A` +
        `• *البريد الإلكتروني:* ${formData.email}%0A` +
        `• *الهاتف/واتساب:* ${formData.phone}%0A` +
        `• *المنتج المطلوب:* ${formData.product_name}%0A` +
        `• *الكمية:* ${formData.quantity}%0A` +
        `• *دولة وميناء الوصول:* ${formData.destination}%0A` +
        (formData.specifications ? `• *المواصفات المطلوبة:* ${formData.specifications}%0A` : '') +
        (formData.message ? `• *ملاحظات إضافية:* ${formData.message}%0A` : '') +
        `%0Aيرجى تزويدنا بالأسعار وشروط الشحن (FOB/CIF).`;
    return text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `RFQ: ${formData.product_name} (${formData.quantity}) to ${formData.destination}`,
          message: `Company: ${formData.company}\nProduct: ${formData.product_name}\nQuantity: ${formData.quantity}\nDestination: ${formData.destination}\nSpecs: ${formData.specifications}\nNotes: ${formData.message}`,
        };
        await api.post('/contact-messages', payload).catch(() => {});
      }

      setSubmitted(true);
      toast.success(isEn ? 'Quote request transmitted successfully!' : 'تم إرسال طلب عرض السعر بنجاح!');
    } catch (error) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FiMapPin, label: t.contact.address, value: page.addressText, href: null },
    { icon: FiPhone, label: t.contact.phoneNumber, value: '+966 58 284 8394', href: 'tel:+966582848394' },
    { icon: FaWhatsapp, label: 'WhatsApp', value: '+966 58 284 8394', href: 'https://wa.me/966582848394' },
    { icon: FiMail, label: t.contact.emailAddress, value: 'info@herbivaeg.com', href: 'mailto:info@herbivaeg.com' },
  ];

  return (
    <Layout
      title={isEn ? 'Request a Quote & Contact Us' : 'طلب عرض سعر والتواصل'}
      description={
        isEn
          ? 'Request a wholesale botanical quote from Herbivaeg. Direct Egyptian exporter of premium chamomile, coriander, fennel, basil & hibiscus to global ports.'
          : 'اطلب عرض سعر لتوريد الأعشاب والتوابل بالجملة من هيربيفاج مصر. تصدير البابونج والكزبرة والشمر والريحان والكركديه لجميع موانئ العالم.'
      }
    >
      <PageBanner
        title={isEn ? 'Request a Quote & Contact Us' : 'طلب عرض سعر والتواصل معنا'}
        subtitle={
          isEn
            ? 'Direct wholesale supply inquiries for importers, blenders & global food industries'
            : 'استفسارات التوريد بالجملة للمستوردين ومصنعي الأغذية وخلاطي الشاي حول العالم'
        }
        breadcrumb={[{ label: t.nav.contact }]}
      />

      {/* Main Content (B2B Request a Quote Form & Direct Channels) */}
      <section className="section-shell bg-white">
        <FadeIn className="container">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            {/* RFQ Form Box */}
            <div className="glass-panel p-8 md:p-10 shadow-sm border border-[#E2E2E2]/70 dark:border-white/10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="eyebrow mb-2">
                    <FiPackage className="h-4 w-4 text-[#A5C232]" />
                    {isEn ? 'B2B Wholesale Quotation' : 'طلب تسعير توريد بالجملة'}
                  </span>
                  <h2 className="font-display text-[26px] font-bold text-[#0D1615] dark:text-white md:text-[32px]">
                    {isEn ? 'Request a Formal Price Quote' : 'اطلب عرض سعر رسمي لشحنتك'}
                  </h2>
                </div>
                <span className="rounded-full bg-[#A5C232]/10 px-3.5 py-1 text-xs font-bold text-[#738827] dark:text-[#D1F349]">
                  {isEn ? 'Response within 24h' : 'رد خلال ٢٤ ساعة'}
                </span>
              </div>

              <p className="section-lead mb-8">
                {isEn
                  ? 'Fill out your target product, order volume, and destination country. Our commercial export desk will prepare an official proforma quote with FOB or CIF shipping terms.'
                  : 'حدد المنتج والكمية المطلوبة ودولة الوصول، وسيقوم قسم التصدير لدينا بإعداد عرض سعر رسمي بأسعار FOB أو CIF وفق متطلباتك.'}
              </p>

              {submitted ? (
                <div className="rounded-[20px] bg-[#F6F4EC] p-8 text-center dark:bg-white/5 border border-[#A5C232]/40">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#A5C232] text-white shadow-lg">
                    <FiCheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#0D1615] dark:text-white">
                    {isEn ? 'Inquiry Transmitted Successfully!' : 'تم استلام طلبك بنجاح!'}
                  </h3>
                  <p className="section-lead mx-auto mt-3 max-w-lg">
                    {isEn
                      ? `Thank you, ${formData.name}. Our export specialist is reviewing your request for ${formData.product_name} to ${formData.destination || 'your destination'}.`
                      : `شكراً لك ${formData.name}. يقوم فريق التصدير لدينا بمراجعة طلبك لـ ${formData.product_name} إلى ${formData.destination || 'وجهتك'}.`}
                  </p>

                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <a
                      href={`https://wa.me/966582848394?text=${generateWhatsAppMessage()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary w-full sm:w-auto"
                    >
                      <FaWhatsapp className="h-5 w-5" />
                      <span>{isEn ? 'Chat Instantly on WhatsApp' : 'تأكيد الطلب فورا عبر واتساب'}</span>
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          company: '',
                          email: '',
                          phone: '',
                          product_name: popularProducts[0][isEn ? 'en' : 'ar'],
                          quantity: quantityOptions[0][isEn ? 'en' : 'ar'],
                          destination: '',
                          specifications: '',
                          message: '',
                        });
                      }}
                      className="btn-white w-full sm:w-auto"
                    >
                      <FiRefreshCw className="h-4 w-4" />
                      <span>{isEn ? 'Submit Another Request' : 'إرسال طلب آخر'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Name & Company */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label">
                        {isEn ? 'Contact Person Name' : 'اسم المسؤول'} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="field-input"
                        placeholder={isEn ? 'e.g., John Smith' : 'مثال: محمد أحمد'}
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        {isEn ? 'Company / Importer Name' : 'اسم الشركة / المستورد'} *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="field-input"
                        placeholder={isEn ? 'e.g., Global Tea Blenders GmbH' : 'مثال: شركة استيراد وتوزيع'}
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone/WhatsApp */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label">
                        {isEn ? 'Business Email' : 'البريد الإلكتروني للعمل'} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="field-input"
                        placeholder={isEn ? 'procurement@company.com' : 'procurement@company.com'}
                      />
                    </div>
                    <div>
                      <label className="field-label">
                        {isEn ? 'Phone / WhatsApp with Country Code' : 'رقم الهاتف / واتساب مع رمز الدولة'} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="field-input"
                        placeholder={isEn ? '+49 151 2345678 or +966...' : '+966 50 000 0000 أو +20...'}
                      />
                    </div>
                  </div>

                  {/* Row 3: Product Required & Destination Country */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label">
                        {isEn ? 'Required Botanical Product' : 'المنتج النباتي المطلوب'} *
                      </label>
                      <select
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        className="field-input cursor-pointer"
                      >
                        {popularProducts.map((p) => {
                          const val = isEn ? p.en : p.ar;
                          return (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">
                        {isEn ? 'Destination Country & Port' : 'دولة وميناء الوصول'} *
                      </label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        className="field-input"
                        placeholder={isEn ? 'e.g., Germany - Hamburg Port' : 'مثال: السعودية - ميناء جدة الإسلامي'}
                      />
                    </div>
                  </div>

                  {/* Row 4: Quantity & Specifications */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label">
                        {isEn ? 'Estimated Order Quantity' : 'الكمية المطلوبة'} *
                      </label>
                      <select
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="field-input cursor-pointer"
                      >
                        {quantityOptions.map((q) => {
                          const val = isEn ? q.en : q.ar;
                          return (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">
                        {isEn ? 'Form / Packaging / Cut' : 'الشكل والمواصفات والتعبئة'}
                      </label>
                      <input
                        type="text"
                        name="specifications"
                        value={formData.specifications}
                        onChange={handleChange}
                        className="field-input"
                        placeholder={isEn ? 'e.g., Whole, 25kg Kraft Bags, 99% Purity' : 'مثال: أزهار كاملة، أكياس ورق ٢٥ كجم'}
                      />
                    </div>
                  </div>

                  {/* Row 5: Additional Requirements */}
                  <div>
                    <label className="field-label">
                      {isEn ? 'Additional Technical Requirements or Questions' : 'متطلبات فنية أو ملاحظات إضافية'}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="field-area"
                      placeholder={
                        isEn
                          ? 'Specify any certificate requirements (COA, Phytosanitary), steam sterilization, target shipping schedule...'
                          : 'حدد الشهادات المطلوبة (صحة نباتية، COA)، أو التعقيم بالبخار، أو موعد الشحن المتوقع...'
                      }
                    />
                  </div>

                  {/* Submit Actions */}
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>{loading ? t.common.loading : isEn ? 'Submit Quote Request (RFQ)' : 'إرسال طلب عرض السعر'}</span>
                      {!loading && <FiSend className="h-5 w-5" />}
                    </button>

                    <a
                      href={`https://wa.me/966582848394?text=${encodeURIComponent(
                        isEn
                          ? 'Hello Herbivaeg! I would like to request a wholesale price quote for Egyptian herbs & seeds.'
                          : 'مرحباً هيربيفاج! أود طلب عرض سعر بالجملة للنباتات والأعشاب المصرية.'
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-dark justify-center gap-2"
                    >
                      <FaWhatsapp className="h-4 w-4 text-[#25d366]" />
                      <span>{isEn ? 'Instant WhatsApp RFQ' : 'طلب فوري عبر واتساب'}</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Info & Verified Channels */}
            <div className="flex flex-col gap-6">
              {/* Direct Channels */}
              <div className="glass-panel relative flex-1 overflow-hidden p-8 md:p-10 border border-[#E2E2E2]/70 dark:border-white/10">
                <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 opacity-10">
                  <div className="h-full w-full rounded-full bg-[#A5C232] blur-3xl" />
                </div>
                <h2 className="relative z-10 mb-6 font-display text-[24px] font-bold text-[#0D1615] dark:text-white">
                  {isEn ? 'Direct Commercial Channels' : 'قنوات التواصل المباشرة'}
                </h2>
                <div className="relative z-10 space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="group flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#A5C232]/10 text-[#A5C232] transition-all duration-300 group-hover:bg-[#A5C232] group-hover:text-white">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="pt-0.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#738827] dark:text-[#A5C232]">
                          {item.label}
                        </h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                            className="font-display text-[16px] font-semibold text-[#0D1615] transition hover:text-[#A5C232] dark:text-white"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-display text-[15px] font-semibold text-[#0D1615] dark:text-white">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality & Traceability Commitment */}
              <div className="glass-panel p-8 border border-[#E2E2E2]/70 dark:border-white/10">
                <h3 className="mb-3 font-display text-[19px] font-bold text-[#0D1615] dark:text-white">
                  {isEn ? 'Export Assurance & Documentation' : 'ضمانات التصدير والمستندات'}
                </h3>
                <p className="section-lead mb-5 text-sm">
                  {isEn
                    ? 'All shipments are prepared under ISO 22000 & HACCP standards with official Phytosanitary certificate, Certificate of Analysis (COA), and Certificate of Origin.'
                    : 'يتم تجهيز كافة الشحنات وفقاً لمعايير ISO 22000 و HACCP مع شهادة صحة نباتية رسمية وشهادة تحليل مخبري وشهادة منشأ.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['ISO 22000', 'HACCP', 'Phytosanitary', 'COA Verified', 'Fumigated'].map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 rounded-full bg-[#A5C232]/10 px-3 py-1 text-xs font-bold text-[#738827] dark:text-[#D1F349]"
                    >
                      <FiCheckCircle className="h-3 w-3" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Facility Location Card */}
              <div className="relative h-52 overflow-hidden rounded-[20px] border border-[#E2E2E2]/70">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/agriculture-healthy-food.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1615]/80 via-[#0D1615]/30 to-transparent flex items-end p-6">
                  <div className="flex items-center gap-3 text-white">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#A5C232] text-white">
                      <FiMapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#D1F349] font-bold">
                        {isEn ? 'Processing & Farm Facilities' : 'منشآت التجهيز والمزارع'}
                      </p>
                      <p className="font-display font-bold text-sm">
                        {isEn ? 'Beni Suef & Upper Egypt Agriculture Zone' : 'بني سويف ومنطقة وادي النيل الزراعية'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Export Countries (Global Reach) */}
      {countries.length > 0 && (
        <section className="section-shell section-dim border-t border-[#E2E2E2]/70 dark:border-white/10">
          <FadeIn className="container">
            <div className="mb-14 text-center">
              <span className="eyebrow justify-center">🌍 {t.exportCountries.title}</span>
              <h2 className="section-title">{isEn ? 'Where We Export' : 'أين نصدر'}</h2>
              <p className="section-lead mx-auto mt-4 max-w-xl">{t.exportCountries.subtitle}</p>
            </div>
            <StaggerGrid className="flex flex-wrap justify-center gap-8">
              {countries.map((country) => (
                <StaggerItem key={country._id}>
                  <div className="group flex flex-col items-center gap-3">
                    <div className="img-frame h-16 w-24 rounded-[12px] border border-[#E2E2E2] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[10px_20px_30px_rgba(0,0,0,0.12)]">
                      {country.flag ? (
                        <img
                          src={getAssetUrl(country.flag)}
                          alt={isEn ? country.name_en : country.name_ar}
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-[#0D1615]/5">
                          <FiMapPin className="h-6 w-6 text-[#5E5E5E]" />
                        </div>
                      )}
                    </div>
                    <span className="text-center text-sm font-bold leading-tight text-[#0D1615] dark:text-white">
                      {isEn ? country.name_en : country.name_ar}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </FadeIn>
        </section>
      )}
    </Layout>
  );
};

export default Contact;
