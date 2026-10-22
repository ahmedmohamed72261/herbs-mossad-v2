import { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import PageBanner from '@/components/PageBanner';
import { FadeIn } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { FiShield, FiClock, FiPackage, FiTrendingUp, FiCheckCircle, FiArrowRight, FiX, FiChevronLeft, FiChevronRight, FiPlay, FiAward, FiUsers, FiGlobe } from 'react-icons/fi';

const exportImages = Array.from({ length: 16 }, (_, i) => `/images/export/export${i + 1}.jpeg`);

const sections = [
  {
    id: 'introduction',
    icon: FiShield,
    titleEn: 'Introduction',
    titleAr: 'مقدمة',
    contentEn:
      'In the modern global food supply chain, accountability is no longer a premium marketing feature; it is an operational prerequisite. For the international trade of agricultural commodities—specifically dried herbs, seeds, and spices—the journey from cultivation fields to overseas shipping containers is filled with complexity. Transparency is the foundation of trust, and end-to-end batch traceability is the mechanism that delivers it.',
    contentAr:
      'في سلسلة التوريد الغذائي العالمية الحديثة، لم تعد المساءلة مجرد ميزة تسويقية متميزة؛ بل أصبحت شرطاً تشغيلياً أساسياً. بالنسبة للتجارة الدولية للمنتجات الزراعية - وتحديداً الأعشاب والبذور والتوابل المجففة - فإن الرحلة من حقول الزراعة إلى حاويات الشحن الخارجية مليئة بالتعقيدات. الشفافية هي أساس الثقة، وتتبع الدفعات من البداية إلى النهاية هو الآلية التي تحققها.',
  },
  {
    id: 'anatomy',
    icon: FiClock,
    titleEn: 'The Anatomy of a Batch',
    titleAr: 'تشريح الدفعة',
    contentEn:
      'A unique Batch ID serves as the genetic code of every shipment, linking country of origin, botanical species, harvest year, and processing sequence into one traceable record.',
    contentAr:
      'يعمل معرف الدفعة الفريد كالرمز الجيني لكل شحنة، حيث يربط بلد المنشأ والأنواع النباتية وسنة الحصاد وتسلسل المعالجة في سجل واحد قابل للتتبع.',
    stats: [
      { labelEn: 'Countries Served', labelAr: 'الدول المخدومة', value: '50+' },
      { labelEn: 'Years Experience', labelAr: 'سنوات الخبرة', value: '30+' },
      { labelEn: 'Batch Types', labelAr: 'أنواع الدفعات', value: '200+' },
    ],
  },
  {
    id: 'processing',
    icon: FiPackage,
    titleEn: 'Processing & Quality Control',
    titleAr: 'المعالجة ومراقبة الجودة',
    contentEn:
      'Throughout cleaning, cutting, milling, sorting, and packing operations, every process parameter is documented and linked to the batch, ensuring complete product integrity and accountability.',
    contentAr:
      'خلال عمليات التنظيف والقطع والطحن والفرز والتعبئة، يتم توثيق كل معلمة عملية وربطها بالدفعة، مما يضمن سلامة المنتج الكاملة والمساءلة.',
    steps: [
      { labelEn: 'Cleaning', labelAr: 'التنظيف' },
      { labelEn: 'Cutting', labelAr: 'القطع' },
      { labelEn: 'Milling', labelAr: 'الطحن' },
      { labelEn: 'Sorting', labelAr: 'الفرز' },
      { labelEn: 'Packing', labelAr: 'التعبئة' },
    ],
  },
  {
    id: 'logistics',
    icon: FiGlobe,
    titleEn: 'Export Preparation, Packaging & Documentation',
    titleAr: 'التجهيز للتصدير، التعبئة ومستندات الشحن',
    contentEn:
      'At Herbivaeg, we prepare every botanical shipment specifically for export according to the destination country’s food safety regulations and client packaging preferences. We handle all custom packaging requirements (multi-wall kraft paper bags, poly-lined woven bags, reinforced flower cartons, and bulk big bags) alongside complete export documentation—including official Phytosanitary certificates, Certificates of Origin, lab-tested COAs, and Fumigation certificates—ensuring swift customs clearance across Europe, the Americas, Asia, and the Gulf.',
    contentAr:
      'في Herbivaeg، نقوم بتجهيز المنتجات الزراعية والنباتية للتصدير وفقاً لمتطلبات بلد العميل والمعايير الفنية المعتمدة لديه. نتعامل مع كافة متطلبات التعبئة والشحن ومستندات التصدير حسب نوع المنتج ورغبة العميل (أكياس ورق كرافت متعددة الطبقات، أكياس منسوجة مبطنة، كراتين مقواة للأزهار، عبوات جامبو) بالإضافة إلى استخراج كافة مستندات التصدير الرسمية (شهادة الصحة النباتية، شهادة المنشأ، شهادة التحليل المخبري COA، شهادة التبخير) لضمان تخليص جمركي سلس وموثوق في جميع موانئ العالم.',
  },
  {
    id: 'future',
    icon: FiTrendingUp,
    titleEn: 'The Future of Traceability',
    titleAr: 'مستقبل التتبع',
    contentEn:
      'Modern ERP systems, cloud platforms, and digital records provide buyers with immediate access to farm data, laboratory analyses, processing records, and export certifications.',
    contentAr:
      'توفر أنظمة ERP الحديثة والمنصات السحابية والسجلات الرقمية للمشترين وصولاً فورياً إلى بيانات المزارع والتحاليل المخبرية وسجلات المعالجة وشهادات التصدير.',
  },
  {
    id: 'conclusion',
    icon: FiAward,
    titleEn: 'Conclusion',
    titleAr: 'الخاتمة',
    contentEn:
      "At Herbivaeg, we understand that complete traceability is essential for building trust in today's global food supply chain. Through advanced documentation, rigorous quality controls, and transparent supply chain management, we provide customers with complete visibility across every stage of production, processing, packaging, and export. By maintaining the highest standards of traceability, we deliver premium Egyptian herbs, spices, seeds, flowers, and herbal teas to customers worldwide.",
    contentAr:
      'في Herbivaeg، ندرك أن التتبع الكامل ضروري لبناء الثقة في سلسلة التوريد الغذائي العالمية اليوم. من خلال التوثيق المتقدم وضوابط الجودة الصارمة وإدارة سلسلة التوريد الشفافة، نوفر للعملاء رؤية كاملة عبر كل مرحلة من مراحل الإنتاج والمعالجة والتعبئة والتصدير. من خلال الحفاظ على أعلى معايير التتبع، نقدم الأعشاب والتوابل والبذور والزهور والشاي العشبي المصري الممتاز للعملاء في جميع أنحاء العالم.',
  },
];

export default function ExportPage() {
  const { language } = useAppStore();
  const t = translations[language];
  const isEn = language === 'en';
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? exportImages.length - 1 : prev - 1));
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === exportImages.length - 1 ? 0 : prev + 1));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }, [closeLightbox, prevImage, nextImage]);

  return (
    <Layout title={isEn ? 'Export & Traceability' : 'التصدير والتتبع'}>
      <PageBanner
        title={isEn ? 'Export & Traceability' : 'التصدير والتتبع'}
        subtitle={isEn ? 'Establishing End-to-End Batch Traceability' : 'إنشاء تتبع شامل للدفعات'}
        breadcrumb={[{ label: isEn ? 'Export & Traceability' : 'التصدير والتتبع' }]}
      />

      {/* Article intro */}
      <section className="section-shell bg-white pb-0 lg:pb-0">
        <div className="container max-w-4xl text-center">
          <FadeIn>
            <span className="eyebrow justify-center">
              <FiAward className="h-4 w-4 text-[#A5C232]" />
              {isEn ? 'Herbivaeg — Professional Article' : 'Herbivaeg — مقال احترافي'}
            </span>
            <h2 className="section-title">
              {isEn ? 'From Field to Container' : 'من الحقل إلى الحاوية'}
            </h2>
            <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#A5C232]" />
          </FadeIn>
        </div>
      </section>

      {/* Section 1: Introduction */}
      <section className="section-shell bg-white">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="lg:sticky lg:top-28">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[14px] bg-[#A5C232]/10 text-[#A5C232]">
                        <FiShield className="h-7 w-7" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A5C232]">
                          {isEn ? 'Section 01' : 'القسم 01'}
                        </span>
                        <h2 className="font-display text-2xl font-bold text-[#0D1615] dark:text-white lg:text-3xl">
                          {isEn ? 'Introduction' : 'مقدمة'}
                        </h2>
                      </div>
                    </div>
                    <p className="text-sm italic text-[#5E5E5E] dark:text-white/50">
                      {isEn ? 'Setting the foundation for traceability excellence' : 'وضع الأساس لتميز التتبع'}
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <div className="relative rounded-[20px] border border-[#E2E2E2]/70 bg-[#F6F4EC] p-8 dark:border-white/5 dark:bg-white/5 lg:p-10">
                    <p className="relative z-10 text-base leading-[1.9] text-[#272320] dark:text-white/80 lg:text-lg">
                      {isEn ? sections[0].contentEn : sections[0].contentAr}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 2: Anatomy — Visual flow diagram */}
      <section className="section-shell section-dim">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <div className="mb-14 text-center">
                <span className="eyebrow justify-center">
                  <FiClock className="h-4 w-4 text-[#A5C232]" />
                  {isEn ? 'Section 02' : 'القسم 02'}
                </span>
                <h2 className="section-title">
                  {isEn ? 'The Anatomy of a Batch' : 'تشريح الدفعة'}
                </h2>
                <p className="section-lead mx-auto mt-2 max-w-xl">
                  {isEn
                    ? 'Every shipment carries a unique identity — here\'s how we build it'
                    : 'كل شحنة تحمل هوية فريدة — إليك كيف نبنيها'}
                </p>
              </div>
            </FadeIn>

            <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { icon: FiGlobe, labelEn: 'Country of Origin', labelAr: 'بلد المنشأ', descEn: 'Egypt — Nile Valley region', descAr: 'مصر — منطقة وادي النيل', color: 'from-[#A5C232] to-[#D1F349]' },
                { icon: FiShield, labelEn: 'Botanical Species', labelAr: 'النوع النباتي', descEn: 'Latin name & variety code', descAr: 'الاسم اللاتيني ورمز الصنف', color: 'from-[#FECB0E] to-[#A5C232]' },
                { icon: FiClock, labelEn: 'Harvest Year', labelAr: 'سنة الحصاد', descEn: 'Season & harvest batch code', descAr: 'الموسم ورمز دفعة الحصاد', color: 'from-[#0D1615] to-[#272320]' },
                { icon: FiPackage, labelEn: 'Processing Sequence', labelAr: 'تسلسل المعالجة', descEn: 'Step-by-step process log', descAr: 'سجل خطوة بخطوة للمعالجة', color: 'from-[#D1F349] to-[#A5C232]' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <FadeIn key={idx} delay={idx * 0.08}>
                    <div className="relative rounded-[20px] border border-[#E2E2E2]/70 bg-white p-6 text-center shadow-[10px_20px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5">
                      <div className={`mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-1 font-display text-sm font-bold text-[#0D1615] dark:text-white">
                        {isEn ? item.labelEn : item.labelAr}
                      </h3>
                      <p className="text-xs text-[#5E5E5E] dark:text-white/50">
                        {isEn ? item.descEn : item.descAr}
                      </p>
                      {idx < 3 && (
                        <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                          <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#E2E2E2] bg-white text-xs text-[#A5C232] dark:border-white/20 dark:bg-[#0D1615]">
                            &rarr;
                          </div>
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>

            <FadeIn delay={0.2}>
              <div className="mx-auto max-w-3xl rounded-[20px] border border-[#E2E2E2]/70 bg-white p-8 text-center shadow-[10px_20px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5">
                <div className="mb-4 inline-flex items-center gap-2 rounded-[4px] bg-[#A5C232]/10 px-3 py-1 text-xs font-bold text-[#A5C232]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#A5C232]" />
                  {isEn ? 'Single Traceable Record' : 'سجل واحد قابل للتتبع'}
                </div>
                <p className="text-base leading-relaxed text-[#272320] dark:text-white/80 lg:text-lg">
                  {isEn ? sections[1].contentEn : sections[1].contentAr}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 3: Processing & QC */}
      <section className="section-shell bg-white">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <div className="mb-10 flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#A5C232]/10 text-[#A5C232]">
                  <FiPackage className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#A5C232]">
                    {isEn ? 'Section 03' : 'القسم 03'}
                  </span>
                  <h2 className="font-display text-3xl font-bold text-[#0D1615] dark:text-white lg:text-4xl">
                    {isEn ? 'Processing & Quality Control' : 'المعالجة ومراقبة الجودة'}
                  </h2>
                </div>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <FadeIn>
                <div className="space-y-6">
                  <p className="text-base leading-relaxed text-[#272320] dark:text-white/80 lg:text-lg">
                    {isEn ? sections[2].contentEn : sections[2].contentAr}
                  </p>
                  <div className="space-y-3">
                    {sections[2].steps?.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#A5C232]/10">
                          <span className="text-sm font-bold text-[#A5C232]">0{idx + 1}</span>
                        </div>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#E2E2E2] dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#A5C232] to-[#D1F349]"
                            style={{ width: `${((idx + 1) / (sections[2].steps?.length || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="w-20 text-right text-sm font-semibold text-[#272320] dark:text-white/70">
                          {isEn ? step.labelEn : step.labelAr}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div
                  className="img-frame group relative aspect-[4/3] cursor-pointer"
                  onClick={() => openLightbox(4)}
                >
                  <img
                    src="/images/export/export5.jpeg"
                    alt="Processing"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0D1615]/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-2 text-sm font-bold text-white">
                      <FiPlay className="h-4 w-4" />
                      {isEn ? 'View Gallery' : 'عرض المعرض'}
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Packaging & Logistics — Full width with image */}
      <section className="section-dark py-[70px] lg:py-[110px]">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <FadeIn className="order-2 lg:order-1">
                <div
                  className="img-frame group relative aspect-[4/3] cursor-pointer"
                  onClick={() => openLightbox(6)}
                >
                  <img
                    src="/images/export/export7.jpeg"
                    alt="Logistics"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0D1615]/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-2 text-sm font-bold text-white">
                      <FiPlay className="h-4 w-4" />
                      {isEn ? 'View Gallery' : 'عرض المعرض'}
                    </span>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.1} className="order-1 lg:order-2">
                <div className="mb-6 flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#D1F349]">
                    <FiGlobe className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#D1F349]">
                      {isEn ? 'Section 04' : 'القسم 04'}
                    </span>
                    <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
                      {isEn ? 'Packaging & Logistics' : 'التعبئة والخدمات اللوجستية'}
                    </h2>
                  </div>
                </div>
                <p className="text-base leading-relaxed text-white/75 lg:text-lg">
                  {isEn ? sections[3].contentEn : sections[3].contentAr}
                </p>

                {/* Packaging & Documentation breakdown */}
                <div className="mt-8 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#D1F349]">
                      {isEn ? 'Tailored Export Packaging Options:' : 'خيارات التعبئة والتغليف المخصصة للمستورد:'}
                    </h4>
                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { en: 'Multi-wall Kraft Paper Bags (20-25 kg)', ar: 'أكياس ورق كرافت متعددة الطبقات (20-25 كجم)' },
                        { en: 'Poly-lined Woven PP Bags', ar: 'أكياس بولي بروبيلين منسوجة ومبطنة' },
                        { en: 'Reinforced Corrugated Cartons', ar: 'كراتين مقواة مخصصة للزهور والأوراق' },
                        { en: 'Jumbo Big Bags (500-1000 kg)', ar: 'أكياس جامبو للمطاحن والمصانع' },
                      ].map((pkg, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 rounded-[12px] border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-white/85">
                          <FiPackage className="h-3.5 w-3.5 shrink-0 text-[#A5C232]" />
                          <span>{isEn ? pkg.en : pkg.ar}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#D1F349]">
                      {isEn ? 'Official Export Documentation Provided:' : 'المستندات الرسمية المرفقة مع كل شحنة:'}
                    </h4>
                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { en: 'Phytosanitary Certificate', ar: 'شهادة الصحة النباتية (فحص الحجر)' },
                        { en: 'Certificate of Origin (EUR.1 / Form A)', ar: 'شهادة المنشأ الرسمية المعتمدة' },
                        { en: 'Certificate of Analysis (Lab COA)', ar: 'شهادة تحليل الجودة ونسب النقاوة COA' },
                        { en: 'Fumigation & Inspection Certificate', ar: 'شهادة التبخير والتطهير البحري' },
                      ].map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 rounded-[12px] border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-medium text-white/85">
                          <FiCheckCircle className="h-3.5 w-3.5 shrink-0 text-[#D1F349]" />
                          <span>{isEn ? doc.en : doc.ar}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Future of Traceability */}
      <section className="section-shell section-cream">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <FadeIn>
              <div className="mb-10 flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#A5C232]/10 text-[#A5C232]">
                  <FiTrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#A5C232]">
                    {isEn ? 'Section 05' : 'القسم 05'}
                  </span>
                  <h2 className="font-display text-3xl font-bold text-[#0D1615] dark:text-white lg:text-4xl">
                    {isEn ? 'The Future of Traceability' : 'مستقبل التتبع'}
                  </h2>
                </div>
              </div>
            </FadeIn>
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                { icon: FiGlobe, labelEn: 'Cloud Platforms', labelAr: 'منصات سحابية', descEn: 'Real-time data access from anywhere in the world', descAr: 'الوصول الفوري للبيانات من أي مكان في العالم' },
                { icon: FiShield, labelEn: 'Digital Records', labelAr: 'سجلات رقمية', descEn: 'Immutable audit trail for every batch', descAr: 'سجل تدقيق غير قابل للتغيير لكل دفعة' },
                { icon: FiCheckCircle, labelEn: 'ERP Integration', labelAr: 'تكامل ERP', descEn: 'Seamless connection with enterprise systems', descAr: 'اتصال سلس مع أنظمة المؤسسات' },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <FadeIn key={idx} delay={idx * 0.08} className="h-full">
                    <div className="h-full rounded-[20px] border border-[#E2E2E2]/70 bg-white p-8 shadow-[10px_20px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5">
                      <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[#A5C232]/10 text-[#A5C232]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 font-display text-lg font-bold text-[#0D1615] dark:text-white">
                        {isEn ? card.labelEn : card.labelAr}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#5E5E5E] dark:text-white/60">
                        {isEn ? card.descEn : card.descAr}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
            <FadeIn delay={0.2}>
              <div className="rounded-[20px] border border-[#E2E2E2]/70 bg-white p-8 shadow-[10px_20px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5">
                <p className="text-base leading-relaxed text-[#272320] dark:text-white/80 lg:text-lg">
                  {isEn ? sections[4].contentEn : sections[4].contentAr}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 6: Conclusion */}
      <section className="section-dark py-[70px] lg:py-[110px]">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
              <FadeIn className="lg:col-span-2">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 rounded-[4px] bg-[#D1F349]/10 px-4 py-2">
                    <FiAward className="h-4 w-4 text-[#D1F349]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D1F349]">
                      {isEn ? 'Section 06' : 'القسم 06'}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl font-bold leading-tight text-white lg:text-5xl">
                    {isEn ? 'Our Commitment' : 'التزامنا'}
                  </h2>
                  <div className="h-1 w-16 rounded-full bg-[#D1F349]" />
                  <p className="text-sm leading-relaxed text-white/60">
                    {isEn
                      ? 'Building trust through complete transparency across every stage'
                      : 'بناء الثقة من خلال الشفافية الكاملة في كل مرحلة'}
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.1} className="lg:col-span-3">
                <div className="relative rounded-[20px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm lg:p-10">
                  <span className="absolute -left-3 -top-3 font-serif text-6xl leading-none text-[#D1F349]/20">&ldquo;</span>
                  <p className="relative z-10 text-base leading-[1.9] text-white/80 lg:text-lg">
                    {isEn ? sections[5].contentEn : sections[5].contentAr}
                  </p>
                  <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#D1F349]/20">
                      <span className="text-xs font-bold text-[#D1F349]">HV</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Herbivaeg</p>
                      <p className="text-xs text-white/50">{isEn ? 'Traceability Excellence' : 'التميز في التتبع'}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="section-shell bg-white">
        <div className="container">
          <FadeIn>
            <div className="mb-12 text-center">
              <span className="eyebrow justify-center">{isEn ? 'Gallery' : 'معرض الصور'}</span>
              <h2 className="section-title">
                {isEn ? 'Our Export Process in Pictures' : 'عملية التصدير في صور'}
              </h2>
              <p className="section-lead mx-auto mt-2 max-w-lg">
                {isEn
                  ? 'Click on any image to preview'
                  : 'انقر على أي صورة للمعاينة'}
              </p>
            </div>
          </FadeIn>

          <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
            {exportImages.map((src, idx) => (
              <FadeIn key={src} delay={idx * 0.02}>
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-[20px] bg-[#F8F8F8] break-inside-avoid dark:bg-white/5"
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={src}
                    alt={`Export ${idx + 1}`}
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1615]/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <FiArrowRight className="h-4 w-4 text-[#0D1615]" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="section-dark py-[70px] lg:py-[110px]">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <FadeIn>
              <div className="text-center">
                <div className="mb-8 inline-flex items-center gap-2 rounded-[4px] bg-[#D1F349]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#D1F349]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#D1F349]" />
                  {isEn ? 'Start Your Partnership' : 'ابدأ شراكتك'}
                </div>
                <h2 className="mb-6 font-display text-4xl font-bold leading-tight text-white lg:text-6xl">
                  {isEn ? (
                    <>
                      Partner with <span className="text-[#D1F349]">Us</span>
                    </>
                  ) : (
                    'كن شريكاً لنا'
                  )}
                  <br />
                </h2>
                <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-white/60">
                  {isEn
                    ? 'Experience the highest standards of traceability and quality. Our export team is ready to discuss your requirements.'
                    : 'اختبر أعلى معايير التتبع والجودة. فريق التصدير لدينا مستعد لمناقشة متطلباتك.'}
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a href="/contact" className="btn-primary px-10 py-4 text-lg">
                    {isEn ? 'Contact Export Team' : 'اتصل بفريق التصدير'}
                    <FiArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </a>
                  <a href="/products" className="btn-white px-10 py-4 text-lg">
                    {isEn ? 'Browse Products' : 'تصفح المنتجات'}
                  </a>
                </div>
              </div>
            </FadeIn>
            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: isEn ? 'HACCP Certified' : 'معتمد HACCP' },
                { label: isEn ? 'Full Traceability' : 'تتبع كامل' },
                { label: isEn ? 'Global Shipping' : 'شحن عالمي' },
                { label: isEn ? 'Bulk Supply' : 'توريد بالجملة' },
              ].map((item, idx) => (
                <FadeIn key={idx} delay={idx * 0.05}>
                  <div className="flex items-center justify-center gap-2 rounded-[12px] border border-white/10 bg-white/5 px-4 py-3">
                    <FiCheckCircle className="h-4 w-4 shrink-0 text-[#D1F349]" />
                    <span className="text-sm font-semibold text-white/80">{item.label}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-6 top-6 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <FiX className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-8"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>

          <img
            src={exportImages[lightboxIndex]}
            alt={`Export ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-[20px] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-white/60">
            {lightboxIndex + 1} / {exportImages.length}
          </div>
        </div>
      )}
    </Layout>
  );
}
