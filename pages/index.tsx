import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView } from 'motion/react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Reveal, StaggerItem, StaggerScroll } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import api, { getAssetUrl } from '@/lib/api';
import { useApi, Product } from '@/hooks/useApi';
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiDroplet,
  FiFeather,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiSend,
  FiShield,
  FiStar,
  FiTag,
  FiTrendingUp,
  FiTruck,
  FiVolume2,
  FiVolumeX,
} from 'react-icons/fi';

const ease = [0.22, 1, 0.36, 1] as const;

function Counter({ value, suffix = '', className = '' }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const duration = 1500;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

function ProgressBarLine({ percent, delay = 0 }: { percent: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (inView) setHasEntered(true);
  }, [inView]);

  const isVisible = inView || hasEntered;

  return (
    <div ref={ref} className="mt-3 h-[6px] overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-[#A5C232] transition-all duration-1000 ease-out"
        style={{
          width: isVisible ? `${percent}%` : '0%',
          transitionDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

const Home = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.homePage;
  const isEn = language === 'en';
  const { products, categories: apiCategories, loading: apiLoading, fetchProducts, fetchCategories } = useApi();

  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
    if (apiCategories.length === 0) {
      fetchCategories();
    }
  }, [products.length, apiCategories.length]);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);
  const loading = apiLoading.products || apiLoading.categories;

  useEffect(() => {
    if (page.testimonialsItems.length < 2) return;
    const timer = window.setInterval(
      () => setActiveTestimonial((prev) => (prev + 1) % page.testimonialsItems.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [page.testimonialsItems.length]);

  const metrics = [
    { value: 200, suffix: '+', label: isEn ? 'Products' : 'منتج' },
    { value: 50, suffix: '+', label: isEn ? 'Export Markets' : 'سوق تصدير' },
    { value: 30, suffix: '+', label: isEn ? 'Years Sourcing' : 'سنة خبرة' },
    { value: 98, suffix: '%', label: isEn ? 'Purity Verified' : 'نقاء معتمد' },
  ];

  const whyUsCards = [
    {
      icon: FiShield,
      title: page.featureCards[0].title,
      description: page.featureCards[0].description,
      image: '/images/why-us-farm.jpg',
    },
    {
      icon: FiTrendingUp,
      title: page.featureCards[1].title,
      description: page.featureCards[1].description,
      image: '/images/why-us-processing.jpg',
    },
    {
      icon: FiAward,
      title: page.featureCards[2].title,
      description: page.featureCards[2].description,
      image: '/images/why-us-quality.jpg',
    },
  ];

  const serviceIcons = [FiPackage, FiFeather, FiTag, FiTruck, FiShield, FiDroplet];

  const categories = apiCategories.slice(0, 4).map((cat) => ({
    title: isEn ? cat.name_en : cat.name_ar,
    link: `/products?category_id=${cat.id}`,
    image: getAssetUrl(cat.image) || '/images/category/all.jpeg',
  }));


  const contactCards = [
    { icon: FiMapPin, label: isEn ? 'Address' : 'العنوان', value: isEn ? 'Beni Suef, Egypt' : 'بني سويف، مصر', href: '/contact' },
    { icon: FiPhone, label: isEn ? 'Phone' : 'الهاتف', value: '+966 58 284 8394', href: 'tel:+966582848394' },
    { icon: FiMail, label: isEn ? 'Email' : 'البريد', value: 'export@herbiva.com', href: 'mailto:export@herbiva.com' },
    { icon: FiGlobe, label: 'WhatsApp', value: '+966 58 284 8394', href: 'https://wa.me/966582848394' },
  ];

  const activeTestimonialItem = page.testimonialsItems[activeTestimonial];

  return (
    <Layout title={t.home.heroTitle}>
      {/* 1. HERO */}
      <section className="relative isolate overflow-hidden bg-[#0D1615]">
        <video
          src="/images/herbiva-showreel.mp4"
          poster="/images/hero-section.jpg"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Light scrims: enough contrast for the copy, but the video stays clearly visible. */}
        <div className="absolute inset-0 bg-[#0D1615]/35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,22,21,0.92)_0%,rgba(13,22,21,0.55)_32%,rgba(13,22,21,0.12)_62%,rgba(13,22,21,0.7)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D1615] to-transparent" />
        <div className="grid-lines absolute inset-0 opacity-15" />
        <div className="pointer-events-none absolute -left-24 top-4 h-[420px] w-[420px] rounded-full bg-[#A5C232]/15 blur-[130px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-[#D1F349]/10 blur-[130px]" />
        <img
          src="/images/organic/weat.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 left-0 hidden w-56 opacity-25 lg:block"
        />

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-8 z-20 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 ltr:right-8 rtl:left-8"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <FiVolumeX className="h-5 w-5" /> : <FiVolume2 className="h-5 w-5" />}
        </button>

        <div className="container relative py-[100px] lg:min-h-[760px] lg:py-[130px]">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow border border-[#C6A15B]/35 bg-[#C6A15B]/10 text-[#C6A15B]">
                {page.heroBadge}
              </span>
              <h1 className="mt-5 font-display text-[38px] font-bold leading-[1.12] text-white md:text-[52px] lg:text-[62px]">
                <span className="block">{page.heroTitleLine1}</span>
                <span className="mt-3 block text-[#C6A15B]">{page.heroTitleLine2}</span>
              </h1>
              <p className="mt-6 max-w-xl text-[16px] leading-[1.9] text-white/75">{page.heroDescription}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary shadow-lg shadow-[#A5C232]/25">
                  {isEn ? 'Request Export Quote' : 'طلب عرض سعر للتصدير'} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
                <Link href="/products" className="btn-white">
                  {t.home.heroCta}
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[14px] text-white/60">
                {page.featuredTagSecondary.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <FiCheckCircle className="h-4 w-4 text-[#C6A15B]" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-11 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['M', 'E', 'A', 'K'].map((initial, index) => (
                    <span
                      key={initial}
                      className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#0D1615] bg-[#C6A15B] font-display text-[15px] font-bold text-[#0D1615]"
                      style={{ opacity: 1 - index * 0.12 }}
                    >
                      {initial}
                    </span>
                  ))}
                </div>
                <p className="max-w-[280px] text-[13px] font-medium leading-snug text-white/80">
                  {isEn
                    ? 'Reliable Botanical Export Solutions for Global Markets'
                    : 'حلول تصدير نباتية موثوقة للأسواق العالمية'}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Trust panels floating over the video */}
        <div className="pointer-events-none absolute inset-y-0 hidden w-[320px] flex-col justify-center gap-8 lg:flex ltr:right-12 rtl:left-12">
          <div className="animate-float-delayed relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0D1615]/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-500 hover:bg-[#0D1615]/60">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[#A5C232] text-white shadow-[0_8px_20px_rgba(165,194,50,0.3)]">
                <FiCheckCircle className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-[16px] font-bold text-white">
                  {isEn ? 'Clean handling' : 'تداول نظيف'}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-white/60">
                  {isEn ? 'Traceable, tested, export-ready.' : 'قابل للتتبع، مختبر، جاهز للتصدير.'}
                </p>
              </div>
            </div>
          </div>

          <div className="animate-float-slow relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0D1615]/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-500 hover:bg-[#0D1615]/60 ltr:translate-x-8 rtl:-translate-x-8">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-white/10 text-[#D1F349] ring-1 ring-white/20">
                <FiGlobe className="h-6 w-6" />
              </span>
              <div>
                <p className="stat-number text-[28px] leading-none text-white">
                  <Counter value={50} suffix="+" />
                </p>
                <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.15em] text-[#A5C232]">
                  {isEn ? 'Export markets' : 'سوق تصدير'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45"
          >
            <FiChevronDown className="h-4 w-4" /> {page.heroScroll}
          </motion.span>
        </div>
      </section>

      {/* 2. CERTIFICATION MARQUEE */}
      <section className="border-y border-white/10 bg-[#0A0F0E] py-6">
        <div className="marquee-mask overflow-hidden">
          <div className="animate-marquee flex w-max items-center">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center">
                {page.standards.map((item) => (
                  <span
                    key={`${dup}-${item}`}
                    className="mx-8 inline-flex items-center gap-3 whitespace-nowrap font-display text-[15px] font-semibold uppercase tracking-[0.2em] text-white/45"
                  >
                    <FiShield className="h-4 w-4 text-[#A5C232]" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STATS */}
      <section className="relative overflow-hidden bg-[#0A0F0E]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A5C232]/40 to-transparent" />
        <div className="container grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 0.08} className="text-center">
              <p className="stat-number text-[#A5C232]">
                <Counter value={metric.value} suffix={metric.suffix} />
              </p>
              <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
                {metric.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3.5 WHO WE ARE, OUR VISION & WHAT WE EXPORT */}
      <section className="section-shell border-b border-[#EAE6DF] bg-[#FAF8F5] dark:border-white/5 dark:bg-[#0B100E]">
        <div className="container">
          {/* Top header & Vision Statement */}
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-2">
                <img src="/images/organic/sub-img.png" alt="" className="h-5 w-auto" />
                {isEn ? 'Who We Are & Our Vision' : 'من نحن ورؤيتنا'}
              </span>
              <h2 className="section-title mt-3">
                {isEn
                  ? 'Connecting Egypt’s Agricultural Wealth with Global Markets'
                  : 'ربط الثروة الزراعية المصرية بالأسواق الدولية'}
              </h2>
            </Reveal>

            {/* Vision Quote Card */}
            <Reveal delay={0.1}>
              <div className="relative mt-6 rounded-[20px] border border-[#A5C232]/30 bg-white p-7 shadow-[0_12px_36px_rgba(165,194,50,0.08)] sm:p-9 dark:bg-[#121B17]">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#A5C232]">
                  {isEn ? 'Our Vision' : 'رؤيتنا الاستراتيجية'}
                </span>
                <p className="font-display text-[17px] font-medium italic leading-[1.8] text-[#1D2B24] sm:text-[19px] dark:text-white/90">
                  &ldquo;
                  {isEn
                    ? 'To become a trusted global supplier of premium Egyptian botanicals, connecting Egypt’s agricultural wealth with international markets through consistent quality, sustainable sourcing, and long-term partnerships.'
                    : 'أن نصبح مورداً عالمياً موثوقاً للنباتات والمحاصيل المصرية الفاخرة، ونربط الثروة الزراعية في مصر بالأسواق الدولية من خلال الجودة الثابتة والتوريد المستدام والشراكات طويلة الأمد.'}
                  &rdquo;
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#65766A] dark:text-white/60">
                  <FiCheckCircle className="h-4 w-4 text-[#A5C232]" />
                  <span>
                    {isEn
                      ? 'Herbiva Egypt • Leading Herbs Suppliers & Exporters in Egypt'
                      : 'Herbiva مصر • كبرى شركات توريد وتصدير الأعشاب الطبية والعطرية في مصر'}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 3 Pillars: إحنا مين | بنصدر إيه | إيه اللي يميزنا */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {/* 1. إحنا مين - Who We Are */}
            <Reveal delay={0.15}>
              <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#E7E3DC] bg-white p-7 transition-colors hover:border-[#A5C232] dark:border-white/10 dark:bg-[#121A17]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#A5C232]/15 text-[#A5C232]">
                      <FiGlobe className="h-6 w-6" />
                    </span>
                    <span className="font-stat text-[13px] font-bold uppercase tracking-[0.2em] text-[#A5C232]">
                      01 / {isEn ? 'Identity' : 'إحنا مين'}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[22px] font-bold text-[#0D1615] dark:text-white">
                    {isEn ? 'Who We Are' : 'إحنا مين؟'}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.85] text-[#55695D] dark:text-white/70">
                    {isEn
                      ? 'A premier Egyptian agricultural export company operating from the heart of Egypt’s herbal belt (Beni Suef & Fayoum). We work directly with certified local growers, overseeing the full agricultural cycle from rich Nile soil to container stuffing.'
                      : 'شركة مصرية متخصصة في تجهيز وتصدير الحاصلات الزراعية والنباتات العطرية والطبية من قلب بني سويف والفيوم. ندير الدورة الزراعية مباشرة من الحقل حتى التحميل في الحاويات بمعايير دولية صارمة.'}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 border-t border-[#EFECE6] pt-4 text-[13px] font-semibold text-[#0D1615] dark:border-white/10 dark:text-white/80">
                  <FiCheckCircle className="text-[#A5C232]" />
                  <span>{isEn ? '100% Traceable Nile Basin Origin' : 'مصدر مصري أصيل وموثوق 100%'}</span>
                </div>
              </div>
            </Reveal>

            {/* 2. بنصدر إيه - What We Export */}
            <Reveal delay={0.25}>
              <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#E7E3DC] bg-white p-7 transition-colors hover:border-[#A5C232] dark:border-white/10 dark:bg-[#121A17]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#A5C232]/15 text-[#A5C232]">
                      <FiPackage className="h-6 w-6" />
                    </span>
                    <span className="font-stat text-[13px] font-bold uppercase tracking-[0.2em] text-[#A5C232]">
                      02 / {isEn ? 'Portfolio' : 'بنصدر إيه'}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[22px] font-bold text-[#0D1615] dark:text-white">
                    {isEn ? 'What We Export' : 'بنصدر إيه؟'}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.85] text-[#55695D] dark:text-white/70">
                    {isEn
                      ? 'Leading coriander exporters in Egypt and premier fennel exporters. Our bulk portfolio includes Sortex coriander seeds, fennel seeds, chamomile flowers & TBC, rubbed basil, dried hibiscus calyces, marjoram, spearmint, anise, and cumin.'
                      : 'أكبر مصدري بذور الكزبرة والشمر والأعشاب في مصر. نوفر كزبرة فرز ليزر، بذور شمر عالية الزيت، زهور ومجروش بابونج، أوراق ريحان، كركديه مجفف، بردقوش، نعناع فلفلي، ينسون وكمون بأحجام وقصّات تصديرية مختلفة.'}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 border-t border-[#EFECE6] pt-4 text-[13px] font-semibold text-[#0D1615] dark:border-white/10 dark:text-white/80">
                  <FiCheckCircle className="text-[#A5C232]" />
                  <span>{isEn ? 'FCL & LCL Bulk Worldwide' : 'حاويات كاملة وجزئية جاهزة للشحن'}</span>
                </div>
              </div>
            </Reveal>

            {/* 3. إيه اللي يميزنا - What Distinguishes Us */}
            <Reveal delay={0.35}>
              <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#E7E3DC] bg-white p-7 transition-colors hover:border-[#A5C232] dark:border-white/10 dark:bg-[#121A17]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#A5C232]/15 text-[#A5C232]">
                      <FiAward className="h-6 w-6" />
                    </span>
                    <span className="font-stat text-[13px] font-bold uppercase tracking-[0.2em] text-[#A5C232]">
                      03 / {isEn ? 'Advantage' : 'إيه اللي يميزنا'}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[22px] font-bold text-[#0D1615] dark:text-white">
                    {isEn ? 'What Sets Us Apart' : 'إيه اللي يميزنا؟'}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.85] text-[#55695D] dark:text-white/70">
                    {isEn
                      ? 'Optical Sortex laser grading for ≥99% purity, certified EU/USDA pesticide compliance, custom seaworthy packaging (kraft paper bags, woven PP, cartons, jumbo bags), and comprehensive phytosanitary, COA & origin documentation.'
                      : 'نقاء فائق عبر الفرز الضوئي بالليزر (Sortex)، مطابقة نسب المبيدات للمواصفات الأوروبية والأمريكية، تعبئة بحرية مخصصة للعميل، واستخراج كامل مستندات الفحص الحجري وشهادات المنشأ والتحليل COA.'}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 border-t border-[#EFECE6] pt-4 text-[13px] font-semibold text-[#0D1615] dark:border-white/10 dark:text-white/80">
                  <FiCheckCircle className="text-[#A5C232]" />
                  <span>{isEn ? 'Guaranteed Specs & Zero Port Delay' : 'ضمان المواصفات وتخليص جمركي سلس'}</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Direct Quotation Request Banner */}
          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[22px] bg-gradient-to-r from-[#0D1615] to-[#162720] p-8 text-white shadow-xl sm:p-10 md:flex-row">
            <div className="text-center md:text-start">
              <span className="block text-[12px] font-bold uppercase tracking-[0.2em] text-[#D1F349]">
                {isEn ? 'B2B Importers & Spice Packers' : 'لكبار المستوردين ومصانع الأغذية والأعشاب'}
              </span>
              <h3 className="mt-2 font-display text-[22px] font-bold !text-white sm:text-[26px]">
                {isEn ? 'Ready to request competitive wholesale pricing?' : 'جاهز لاستلام عرض سعر رسمي وتنافسي لشحنتك؟'}
              </h3>
              <p className="mt-2 max-w-xl text-[14px] text-white/70">
                {isEn
                  ? 'Request full proforma invoice (FOB/CIF) with harvest purity reports, container configurations, and lead times within 24 hours.'
                  : 'احصل على تسعير فوري (FOB / CIF) مع تفاصيل المواصفات ونسب النقاوة وتقارير المحصول وخيارات الشحن خلال 24 ساعة.'}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <Link href="/contact" className="btn-primary shadow-lg shadow-[#A5C232]/30">
                {isEn ? 'Request Instant Quotation' : 'اطلب عرض سعر الآن'} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <a
                href="https://wa.me/966582848394"
                target="_blank"
                rel="noreferrer"
                className="btn-white inline-flex items-center gap-2"
              >
                <span>WhatsApp: +966 58 284 8394</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY US */}
      <section className="section-shell bg-white">
        <div className="container grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <span className="eyebrow">
                <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
                {isEn ? 'Why Us' : 'لماذا نحن'}
              </span>
              <h2 className="section-title">{t.home.whyChooseUs}</h2>
              <p className="section-lead mt-5">{page.formulaDescription}</p>
              <ul className="mt-8 space-y-3">
                {page.standards.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] font-semibold text-[#0D1615] dark:text-white">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#A5C232]/15 text-[#A5C232]">
                      <FiCheckCircle className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn-ghost mt-9">
                {page.discoverMore} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Reveal>
          </div>

          <StaggerScroll className="space-y-6">
            {whyUsCards.map((card, index) => (
              <StaggerItem key={card.title}>
                <article className="card-organic flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
                  <div className="img-frame h-[190px] w-full shrink-0 rounded-[16px] sm:h-[160px] sm:w-[200px]">
                    <img src={card.image} alt={card.title} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-[#A5C232]/12 text-[#A5C232]">
                        <card.icon className="h-5 w-5" />
                      </span>
                      <span className="font-stat text-[15px] font-semibold tracking-[0.2em] text-[#A5C232]">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-[20px] font-bold capitalize text-[#0D1615] dark:text-white">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.85] text-[#5E5E5E] dark:text-white/60">
                      {card.description}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerScroll>
        </div>
      </section>

      {/* 5. CATEGORIES */}
      <section className="section-shell bg-[#F8F8F8]">
        <div className="container">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="eyebrow">
                  <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
                  {page.featuredBadge}
                </span>
                <h2 className="section-title">{t.products.title}</h2>
              </div>
              <Link href="/products" className="btn-primary">
                {t.common.viewAll} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>

          <StaggerScroll className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, index) => (
              <StaggerItem key={cat.link} className="h-full">
                <Link href={cat.link} className="group block h-full">
                  <div className="relative h-[320px] overflow-hidden rounded-[20px]">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1615]/90 via-[#0D1615]/25 to-transparent" />
                    <span className="absolute right-5 top-5 font-stat text-[13px] font-semibold tracking-[0.2em] text-white/50">
                      0{index + 1}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-display text-[22px] font-bold capitalize text-white">{cat.title}</h3>
                      <span className="mt-2 inline-flex items-center gap-2 text-[14px] font-semibold text-[#D1F349] transition-all group-hover:gap-3">
                        {t.common.viewAll} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerScroll>
        </div>
      </section>

      {/* 6. FEATURED PRODUCTS */}
      <section className="section-shell bg-white">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow justify-center">
              <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
              {isEn ? 'Products' : 'المنتجات'}
            </span>
            <h2 className="section-title">{t.home.featuredProducts}</h2>
            <p className="section-lead mt-5">{page.featuredDescription}</p>
          </Reveal>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-block m-3 h-[220px] rounded-[16px]" />
                  <div className="px-6 pb-6 pt-2">
                    <div className="skeleton-line h-3 w-1/3" />
                    <div className="skeleton-line mt-3 h-5 w-3/4" />
                    <div className="skeleton-line mt-3 h-3 w-full" />
                    <div className="skeleton-line mt-2 h-3 w-2/3" />
                    <div className="skeleton-block mt-4 h-9 w-32 rounded-[10px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <StaggerScroll className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayProducts.map((product) => (
                <StaggerItem key={product.id} className="h-full">
                  <ProductCard
                    id={product.id}
                    name={isEn ? product.name_en : product.name_ar}
                    category={isEn ? product.category?.name_en || '' : product.category?.name_ar || ''}
                    description={isEn ? product.short_description_en : product.short_description_ar}
                    image={product.image || null}
                  />
                </StaggerItem>
              ))}
            </StaggerScroll>
          )}

          <div className="mt-12 text-center">
            <Link href="/products" className="btn-dark">
              {t.common.viewAll} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. PROCESSING JOURNEY */}
      <section className="section-dark">
        <img
          src="/images/organic/weat-bg.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 hidden w-[420px] opacity-20 lg:block"
        />
        <div className="container relative grid items-center gap-12 py-[70px] lg:grid-cols-2 lg:py-[110px]">
          <Reveal>
            <div className="img-frame h-[420px] rounded-[20px] lg:h-[520px]">
              <img src="/images/lab.jpg" alt={page.infoTitle} />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="eyebrow text-[#D1F349]">{page.infoBadge}</span>
              <h2 className="section-title text-white">{page.infoTitle}</h2>
              <p className="section-lead mt-5">{page.infoDescription}</p>
            </Reveal>

            <StaggerScroll className="mt-9 space-y-5">
              {page.progressItems.map((item, index) => {
                const percent = [100, 98, 100][index] ?? 100;
                return (
                  <StaggerItem key={item.title}>
                    <div className="rounded-[16px] border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span className="font-stat text-[15px] font-semibold tracking-[0.2em] text-[#A5C232]">
                            0{index + 1}
                          </span>
                          <div>
                            <h3 className="font-display text-[17px] font-bold text-white">{item.title}</h3>
                            <p className="mt-1 text-[14px] leading-[1.8] text-white/60">{item.description}</p>
                          </div>
                        </div>
                        <span className="stat-number shrink-0 text-[#A5C232]">{percent}%</span>
                      </div>
                      <ProgressBarLine percent={percent} delay={index * 0.12} />
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerScroll>
          </div>
        </div>
      </section>

      {/* 8. SERVICES */}
      <section className="section-shell bg-[#F6F4EC]">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow justify-center">
              <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
              {page.servicesBadge}
            </span>
            <h2 className="section-title">{page.servicesTitle}</h2>
            <p className="section-lead mt-5">{page.servicesDescription}</p>
          </Reveal>

          <StaggerScroll className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.servicesItems.map((service, index) => {
              const Icon = serviceIcons[index] ?? FiPackage;
              return (
                <StaggerItem key={service.title} className="h-full">
                  <article className="card-organic h-full p-8">
                    <span className="grid h-14 w-14 place-items-center rounded-[14px] bg-[#A5C232]/12 text-[#A5C232]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-6 font-display text-[20px] font-bold text-[#0D1615] dark:text-white">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.85] text-[#5E5E5E] dark:text-white/60">
                      {service.description}
                    </p>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerScroll>
        </div>
      </section>

      {/* 9. EXPORT CTA */}
      <section className="section-lime">
        <img
          src="/images/organic/body-illutions01.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 left-0 hidden w-72 opacity-40 lg:block"
        />
        <div className="container relative grid items-center gap-10 py-[70px] lg:grid-cols-[1.1fr_0.9fr] lg:py-[110px]">
          <Reveal>
            <span className="eyebrow text-white/90">
              {page.promoTitleBefore} {page.promoTitleHighlight} {page.promoTitleAfter}
            </span>
            <h2 className="section-title text-white">{page.promoDescription}</h2>
            <p className="section-lead mt-5 text-white/85">{page.formulaBadge}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-dark">
                {page.ctaPrimary} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link href="/export" className="btn-white">
                {t.nav.export}
              </Link>
            </div>
          </Reveal>

          <StaggerScroll className="grid grid-cols-2 gap-4">
            {[
              { icon: FiGlobe, value: '50+', label: isEn ? 'Countries' : 'دولة' },
              { icon: FiPackage, value: '20ft', label: isEn ? 'FCL & LCL' : 'حاويات كاملة' },
              { icon: FiShield, value: 'HACCP', label: isEn ? 'Certified' : 'معتمد' },
              { icon: FiAward, value: 'ISO', label: '22000' },
            ].map((item) => (
              <StaggerItem key={item.label} className="h-full">
                <div className="h-full rounded-[20px] bg-white/15 p-6 text-white backdrop-blur-sm transition-colors duration-500 hover:bg-white/25">
                  <item.icon className="h-6 w-6 text-white/80" />
                  <p className="stat-number mt-3 text-white">{item.value}</p>
                  <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    {item.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerScroll>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="section-shell bg-[#F6F4EC]">
        <div className="container">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow justify-center">
              <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
              {page.testimonialsBadge}
            </span>
            <h2 className="section-title">{page.testimonialsTitle}</h2>
            <p className="section-lead mt-5">{page.testimonialsDescription}</p>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -26 }}
                  transition={{ duration: 0.45, ease }}
                  className="card-organic p-9"
                >
                  <div className="star-row">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 text-[19px] font-semibold leading-[1.85] text-[#272320] dark:text-white/85">
                    &ldquo;{activeTestimonialItem.text}&rdquo;
                  </p>
                  <div className="mt-7 flex items-center gap-4 border-t border-[#E2E2E2] pt-5 dark:border-white/10">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#A5C232] font-display text-[16px] font-bold text-white">
                      {activeTestimonialItem.name
                        .split(' ')
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <div>
                      <p className="font-display text-[16px] font-bold text-[#0D1615] dark:text-white">
                        {activeTestimonialItem.name}
                      </p>
                      <p className="mt-0.5 text-[13px] text-[#5E5E5E] dark:text-white/55">
                        {activeTestimonialItem.role}
                      </p>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>

              <div className="mt-6 flex gap-2">
                {page.testimonialsItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`${isEn ? 'Show testimonial from' : 'اعرض رأي'} ${item.name}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === activeTestimonial ? 'w-10 bg-[#A5C232]' : 'w-4 bg-[#0D1615]/20 dark:bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Reveal delay={0.1} className="flex min-h-[320px] flex-col justify-between rounded-[20px] bg-[#0D1615] p-8 text-white">
              <FiGlobe className="h-11 w-11 text-[#A5C232]" />
              <div>
                <p className="stat-number text-[40px] text-[#A5C232]">
                  <Counter value={50} suffix="+" />
                </p>
                <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  {isEn ? 'Export markets served' : 'سوق تصدير مخدوم'}
                </p>
                <div className="mt-7 border-t border-white/10 pt-6">
                  <p className="font-display text-[26px] font-bold leading-none">Herbiva</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C6A15B]">
                    {t.brand.tagline}
                  </p>
                  <p className="mt-4 text-[14px] leading-relaxed text-white/60">{page.trustLabel}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="section-shell bg-white">
        <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <span className="eyebrow">
              <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
              {page.faqBadge}
            </span>
            <h2 className="section-title">{page.faqTitle}</h2>
            <p className="section-lead mt-5">{page.faqDescription}</p>

            <div className="relative mt-8 overflow-hidden rounded-[20px] bg-[#0D1615] p-7 text-white">
              <span className="animate-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/10" />
              <h3 className="font-display text-[22px] font-bold !text-white">{page.faqCardTitle}</h3>
              <p className="mt-3 text-[15px] leading-[1.85] text-white/60">{page.faqCardDescription}</p>
              <Link href="/contact" className="btn-primary mt-6">
                {page.faqCardCta.replace(/->/g, '').trim()} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>

          <StaggerScroll className="space-y-4">
            {page.faqs.map((faq, index) => (
              <StaggerItem key={faq.question}>
                <div
                  className={`overflow-hidden rounded-[16px] border bg-[#F8F8F8] transition dark:bg-[#0F1613] ${
                    faqOpen === index
                      ? 'border-[#A5C232] shadow-[10px_20px_40px_rgba(0,0,0,0.08)]'
                      : 'border-[#E2E2E2] dark:border-white/10'
                  }`}
                >
                  <button
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-start font-display font-bold text-[#0D1615] dark:text-white"
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                    aria-expanded={faqOpen === index}
                  >
                    <span>{faq.question}</span>
                    <motion.span animate={{ rotate: faqOpen === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      {faqOpen === index ? (
                        <FiChevronUp className="h-5 w-5 text-[#A5C232]" />
                      ) : (
                        <FiChevronDown className="h-5 w-5 text-[#5E5E5E]" />
                      )}
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {faqOpen === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-[15px] leading-[1.9] text-[#5E5E5E] dark:text-white/60">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            ))}
          </StaggerScroll>
        </div>
      </section>


      {/* 13. GET IN TOUCH */}
      <section className="section-lime">
        <div className="container relative grid items-center gap-10 py-[70px] lg:grid-cols-[1.05fr_0.95fr] lg:py-[110px]">
          <Reveal>
            <span className="eyebrow text-white/90">{page.ctaBadge}</span>
            <h2 className="section-title text-white">{page.ctaTitle}</h2>
            <p className="section-lead mt-5 text-white/85">{page.ctaDescription}</p>
            <ul className="mt-7 space-y-3">
              {page.standards.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-semibold text-white">
                  <FiCheckCircle className="h-5 w-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-dark">
                {page.ctaPrimary} <FiSend className="h-4 w-4" />
              </Link>
              <Link href="/about" className="btn-white">
                {page.ctaSecondary}
              </Link>
            </div>
          </Reveal>

          <StaggerScroll className="grid gap-4 sm:grid-cols-2">
            {contactCards.map((card) => (
              <StaggerItem key={card.label} className="h-full">
                <a
                  href={card.href}
                  className="flex h-full flex-col gap-3 rounded-[20px] bg-white p-6 shadow-[10px_30px_60px_rgba(0,0,0,0.14)] transition-transform duration-500 hover:-translate-y-1.5 dark:bg-[#0F1613]"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[#A5C232]/12 text-[#A5C232]">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#5E5E5E] dark:text-white/50">
                    {card.label}
                  </span>
                  <span className="font-display text-[16px] font-bold text-[#0D1615] dark:text-white">
                    {card.value}
                  </span>
                </a>
              </StaggerItem>
            ))}
          </StaggerScroll>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
