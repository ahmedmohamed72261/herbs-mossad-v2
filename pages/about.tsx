import Link from 'next/link';
import Layout from '@/components/Layout';
import PageBanner from '@/components/PageBanner';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { FiArrowRight, FiCheckCircle, FiEye, FiHeart, FiTarget } from 'react-icons/fi';

const About = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.aboutPage;
  const stats = page.stats;
  const isEn = language === 'en';

  const values = [
    { icon: FiTarget, title: t.about.mission, description: page.missionDescription },
    { icon: FiEye, title: t.about.vision, description: page.visionDescription },
    { icon: FiHeart, title: page.valuesTitle, description: page.valuesDescription },
  ];

  return (
    <Layout title={t.about.title} description={page.heroBadge}>
      <PageBanner
        title={t.about.title}
        subtitle={t.about.subtitle}
        breadcrumb={[{ label: t.nav.about }]}
      />

      {/* STORY */}
      <section className="section-shell bg-white">
        <div className="container grid items-center gap-14 lg:grid-cols-2">
          <FadeIn className="img-frame h-[420px] rounded-[20px] lg:h-[520px]">
            <img src="/images/about.jpg" alt={page.storyTitle} />
          </FadeIn>

          <FadeIn delay={0.1}>
            <span className="eyebrow">
              <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
              {page.storyBadge}
            </span>
            <h2 className="section-title">{page.storyTitle}</h2>
            <p className="section-lead mt-6">{page.storyDescriptionOne}</p>
            <p className="section-lead mt-4">{page.storyDescriptionTwo}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="btn-primary">
                {isEn ? 'Our Products' : 'منتجاتنا'} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link href="/contact" className="btn-ghost">
                {t.nav.contact}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="section-shell bg-[#F6F4EC]">
        <div className="container">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">
              <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
              {page.philosophyBadge}
            </span>
            <h2 className="section-title">{page.philosophyTitle}</h2>
          </FadeIn>

          <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title} className="h-full">
                <article className="card-organic p-8">
                  <span className="icon-badge mb-6">
                    <value.icon className="h-8 w-8" />
                  </span>
                  <h3 className="font-display text-[21px] font-bold text-[#0D1615] dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.85] text-[#5E5E5E] dark:text-white/60">
                    {value.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* VIDEO */}
      <section className="section-shell bg-white">
        <div className="container">
          <FadeIn className="text-center">
            <span className="eyebrow justify-center">
              <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
              {isEn ? 'Video' : 'فيديو'}
            </span>
            <h2 className="section-title">{isEn ? 'See Who We Are' : 'تعرّف علينا'}</h2>
          </FadeIn>

          <FadeIn delay={0.1} className="mx-auto mt-12 max-w-5xl">
            <div className="relative overflow-hidden rounded-[20px] bg-black shadow-[10px_20px_30px_rgba(0,0,0,0.2)] ring-1 ring-[#E2E2E2] dark:ring-white/10">
              <video
                autoPlay
                loop
                muted
                playsInline
                controls
                className="aspect-video w-full object-cover"
              >
                <source src="/images/about.mp4" type="video/mp4" />
              </video>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS */}
      <section className="section-dark">
        <div className="container grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="stat-number text-[#A5C232]">{stat.number}</p>
              <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-shell bg-[#F8F8F8]">
        <div className="container max-w-4xl">
          <FadeIn className="text-center">
            <span className="eyebrow justify-center">
              <img src="/images/organic/sub-img.png" alt="" className="h-6 w-auto" />
              {isEn ? 'Why Us' : 'لماذا نحن'}
            </span>
            <h2 className="section-title">{page.whyChooseUsTitle}</h2>
          </FadeIn>

          <p className="section-lead mt-8 whitespace-pre-line">{page.whyChooseUsIntro}</p>

          {page.whyChooseUsSections.map((section, i) => (
            <div key={section.title} className="mt-12">
              <h3 className="flex items-center gap-3 font-display text-[22px] font-bold text-[#0D1615] dark:text-white">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#A5C232]/15 text-[15px] font-bold text-[#A5C232]">
                  {i + 1}
                </span>
                {section.title}
              </h3>
              <p className="section-lead mt-4 whitespace-pre-line">{section.body}</p>

              {i === 1 && (
                <ul className="mt-6 space-y-3">
                  {page.certifications.map((cert) => (
                    <li key={cert} className="flex items-start gap-3 text-[15px] text-[#5E5E5E] dark:text-white/70">
                      <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-[#A5C232]" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              )}

              {i === 4 && (
                <ul className="mt-6 space-y-3">
                  {page.customizedSolutions.map((sol) => (
                    <li key={sol} className="flex items-start gap-3 text-[15px] text-[#5E5E5E] dark:text-white/70">
                      <FiArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#A5C232] rtl:rotate-180" />
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="mt-14 rounded-[20px] bg-[#0D1615] p-9 text-center text-white">
            <p className="text-[18px] font-medium leading-[1.85]">{page.whyChooseUsCta}</p>
            <p className="mt-5 font-display text-[15px] font-bold uppercase tracking-[0.22em] text-[#A5C232]">
              {t.brand.name}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-lime">
        <div className="container relative flex flex-col items-center justify-between gap-6 py-[60px] text-center lg:flex-row lg:py-[80px] lg:text-start">
          <h2 className="section-title mt-0 max-w-2xl text-white">
            {isEn ? 'Partner with Herbiva for reliable bulk supply' : 'تعاون مع Herbiva لتوريد بالجملة موثوق'}
          </h2>
          <Link href="/contact" className="btn-dark shrink-0">
            {isEn ? 'Start a Conversation' : 'ابدأ محادثة'} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
