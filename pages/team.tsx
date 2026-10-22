import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PageBanner from '@/components/PageBanner';
import { StaggerGrid, StaggerItem, FadeIn } from '@/components/Motion';
import { useAppStore } from '@/store';
import { translations } from '@/lib/translations';
import { getAssetUrl } from '@/lib/api';
import { FiLinkedin, FiMail, FiRefreshCw, FiUsers, FiArrowRight, FiShield } from 'react-icons/fi';
import { useApi, TeamMember } from '@/hooks/useApi';

const Team = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const page = t.teamPage;

  const { teamMembers, loading: apiLoading, errors, fetchTeamMembers } = useApi();
  const loading = apiLoading.teamMembers;
  const error = errors.teamMembers;

  useEffect(() => {
    if (teamMembers.length === 0) {
      fetchTeamMembers();
    }
  }, [teamMembers.length]);

  return (
    <Layout title={t.team.title}>
      <PageBanner
        title={t.team.title}
        subtitle={t.team.subtitle}
        breadcrumb={[{ label: t.team.title }]}
      />

      {/* Team Grid */}
      <section className="section-shell bg-white">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card p-8">
                  <div className="skeleton-block mx-auto mb-6 h-36 w-36 rounded-full" />
                  <div className="skeleton-line mx-auto mb-3 h-6 w-2/3" />
                  <div className="skeleton-line mx-auto mb-6 h-4 w-1/2" />
                  <div className="skeleton-line mb-2 h-4 w-full" />
                  <div className="skeleton-line mx-auto h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-panel mx-auto max-w-lg p-12 text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#A5C232]/10 text-[#A5C232]">
                <FiUsers className="h-7 w-7" />
              </div>
              <p className="mb-2 font-display text-xl font-bold text-[#0D1615] dark:text-white">{t.common.error}</p>
              <p className="mb-8 leading-relaxed text-[#5E5E5E] dark:text-white/60">
                {language === 'en' ? 'Unable to load team members. Please try again.' : 'تعذر تحميل أعضاء الفريق. يرجى المحاولة مرة أخرى.'}
              </p>
              <button onClick={fetchTeamMembers} className="btn-primary">
                <FiRefreshCw className="h-4 w-4" />
                {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
              </button>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="glass-panel mx-auto max-w-lg p-12 text-center">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#0D1615]/5 text-[#5E5E5E] dark:bg-white/10 dark:text-white/60">
                <FiUsers className="h-7 w-7" />
              </div>
              <p className="font-display text-xl font-bold text-[#0D1615] dark:text-white">{t.common.noData}</p>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <StaggerItem key={member.id} className="h-full">
                  <article className="card-organic group p-8 text-center">
                    {/* Avatar */}
                    <div className="relative mx-auto mb-6 h-36 w-36">
                      <div className="img-frame h-full w-full rounded-full ring-4 ring-[#A5C232]/20 transition-all duration-500 group-hover:ring-[#A5C232]/40">
                        {member.image ? (
                          <img
                            src={getAssetUrl(member.image)}
                            alt={language === 'en' ? member.name_en : member.name_ar}
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-[#F8F8F8] text-5xl opacity-60">
                            👤
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-[22px] font-bold text-[#0D1615] dark:text-white">
                      {language === 'en' ? member.name_en : member.name_ar}
                    </h3>

                    {/* Position */}
                    <div className="mb-5 mt-3 flex justify-center">
                      <span className="tag-chip">
                        {language === 'en' ? member.position_en : member.position_ar}
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="section-lead mb-7 min-h-[48px]">
                      {language === 'en' ? member.bio_en : member.bio_ar}
                    </p>

                    {/* Social Links */}
                    <div className="mt-auto flex items-center justify-center gap-3 border-t border-[#E2E2E2]/70 pt-5 dark:border-white/10">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="grid h-11 w-11 place-items-center rounded-full bg-[#0D1615]/5 text-[#5E5E5E] transition-all duration-300 hover:bg-[#A5C232] hover:text-white dark:bg-white/10 dark:text-white/70"
                        >
                          <FiMail className="h-5 w-5" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid h-11 w-11 place-items-center rounded-full bg-[#0D1615]/5 text-[#5E5E5E] transition-all duration-300 hover:bg-[#A5C232] hover:text-white dark:bg-white/10 dark:text-white/70"
                        >
                          <FiLinkedin className="h-5 w-5" />
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

      {/* Team Expertise & Consultation Banner */}
      <section className="section-shell section-dim border-t border-[#E2E2E2]/70 dark:border-white/10">
        <div className="container">
          <FadeIn className="mx-auto max-w-4xl text-center">
            <span className="eyebrow justify-center">
              <FiShield className="h-4 w-4 text-[#A5C232]" />
              {language === 'en' ? 'Direct Consultation' : 'استشارة مباشرة'}
            </span>
            <h2 className="section-title">
              {language === 'en' ? 'Connect with Our Agricultural Specialists' : 'تواصل مع خبرائنا الزراعيين'}
            </h2>
            <p className="section-lead mx-auto mt-4 max-w-2xl">
              {language === 'en'
                ? 'Our experienced agronomists, quality controllers, and logistics managers ensure seamless contract execution from planting season to destination port.'
                : 'يضمن مهندسونا الزراعيون ومسؤولو الجودة ومديرو الخدمات اللوجستية تنفيذ العقود بسلاسة من موسم الزراعة حتى ميناء الوصول.'}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                {language === 'en' ? 'Get in Touch with Our Team' : 'تواصل مع فريقنا'} <FiArrowRight className="h-4 w-4 rtl:rotate-180" />
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

export default Team;
