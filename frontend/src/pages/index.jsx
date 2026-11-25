import Head from 'next/head';
import UserLayout from '@/layout/userLayout';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { clientServer } from '@/config';
import { BrandLogo, Button } from '@/Components/Common';

const DOMAINS = [
  'Software Engineering',
  'Frontend Development',
  'Backend & APIs',
  'Full Stack',
  'UI/UX Design',
  'Data & Analytics',
  'DevOps & Cloud',
  'Mobile Development',
  'Product & Strategy',
  'Students & Graduates',
];

export default function Home() {
  const router = useRouter();
  const [quickInput, setQuickInput] = useState('');
  const [activeDomain, setActiveDomain] = useState('Software Engineering');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigateWithAuth = (targetPath = '/login') => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/dashboard');
    } else {
      router.push(targetPath);
    }
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    const trimmed = quickInput.trim();
    const target = trimmed
      ? `/login?mode=signup&email=${encodeURIComponent(trimmed)}`
      : '/login?mode=signup';
    navigateWithAuth(target);
  };

  useEffect(() => {
    clientServer.get('/').catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>ConnectIn: Log In or Sign Up</title>
        <meta
          name="description"
          content="Connect with peers, share updates, and showcase your experience on ConnectIn."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <UserLayout>
        <main className={styles.pageWrapper}>
          <section className={styles.heroSection}>
            <div className={styles.heroContainer}>
              <div className={styles.heroLeft}>
                <h1 className={styles.heroHeadline}>Welcome to your professional community</h1>

                <div className={styles.authCard}>
                  <form onSubmit={handleQuickSubmit} className={styles.quickForm}>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="Email or username"
                        value={quickInput}
                        onChange={(e) => setQuickInput(e.target.value)}
                        className={styles.emailInput}
                        autoComplete="username"
                        aria-label="Email or username"
                      />
                    </div>
                    <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
                      Get Started
                    </Button>
                  </form>

                  <p className={styles.agreementText}>
                    By clicking Get Started, you agree to ConnectIn’s User Agreement, Privacy Policy,
                    and Community Guidelines.
                  </p>

                  <div className={styles.joinPrompt}>
                    <span>Already on ConnectIn?</span>
                    <button
                      type="button"
                      className={styles.joinLinkButton}
                      onClick={() => navigateWithAuth('/login?mode=signin')}
                    >
                      Sign in
                    </button>
                  </div>

                  <div className={styles.quickPillsScroll}>
                    <div className={styles.quickPillsRow}>
                      <button
                        type="button"
                        className={styles.quickPill}
                        onClick={() => navigateWithAuth('/dashboard')}
                      >
                        Explore Feed
                      </button>
                      <button
                        type="button"
                        className={styles.quickPill}
                        onClick={() => router.push('/discover')}
                      >
                        Discover People
                      </button>
                      <button
                        type="button"
                        className={styles.quickPill}
                        onClick={() => navigateWithAuth('/profile')}
                      >
                        Build Resume
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.heroRight}>
                <div className={styles.illustrationCanvas}>
                  <div className={styles.heroBackdrop} />

                  <div className={styles.showcaseCard}>
                    <div className={styles.showcaseHeader}>
                      <div className={styles.userAvatarContainer}>
                        <div className={styles.userAvatarImg}>AS</div>
                        <span className={styles.activeDot} />
                      </div>
                      <div className={styles.showcaseUserInfo}>
                        <div className={styles.userNameLine}>
                          <span className={styles.userNameText}>Aman Sharma</span>
                          <span className={styles.connectionDegree}>• 1st</span>
                        </div>
                        <p className={styles.userRoleText}>Software Engineer • ConnectIn Community</p>
                        <p className={styles.postTimestamp}>2h • 🌐</p>
                      </div>
                      <div className={styles.moreOptionsIcon} title="Options">
                        •••
                      </div>
                    </div>

                    <p className={styles.showcaseBodyText}>
                      Thrilled to be building my professional presence on ConnectIn! Sharing project
                      updates, networking with talented peers, and exporting my profile resume with
                      one click. 🚀
                    </p>

                    <div className={styles.showcaseTags}>
                      <span className={styles.hashtag}>#SoftwareEngineering</span>
                      <span className={styles.hashtag}>#ConnectIn</span>
                      <span className={styles.hashtag}>#Networking</span>
                    </div>

                    <div className={styles.embeddedMediaBox}>
                      <div className={styles.mediaThumbnail}>
                        <svg className={styles.mediaSvg} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM8 17h8v-2H8v2zm0-4h8v-2H8v2zm0-4h8V7H8v2z" />
                        </svg>
                      </div>
                      <div className={styles.mediaMeta}>
                        <p className={styles.mediaTitle}>Career Profile & Resume Ready</p>
                        <p className={styles.mediaDomain}>connectin.app • 1 min read</p>
                      </div>
                    </div>

                    <div className={styles.showcaseEngagement}>
                      <div className={styles.reactionsCount}>
                        <span className={styles.reactionCircleLike}>
                          <svg viewBox="0 0 16 16" width="10" height="10" fill="#ffffff">
                            <path d="M14.5 6.5h-3.6l.6-2.8c.2-.9-.4-1.7-1.3-1.7-.5 0-1 .2-1.3.6L6 6H2C.9 6 0 6.9 0 8v6c0 1.1.9 2 2 2h9.5c.9 0 1.6-.6 1.8-1.5l1.6-6.4c.2-.9-.4-1.6-1.4-1.6z" />
                          </svg>
                        </span>
                        <span className={styles.reactionCircleHeart}>❤️</span>
                        <span className={styles.reactionCircleLightbulb}>💡</span>
                        <span className={styles.reactionsNumber}>52 • 14 comments</span>
                      </div>

                      <div className={styles.actionRow}>
                        <button
                          type="button"
                          className={styles.actionItem}
                          onClick={() => navigateWithAuth('/dashboard')}
                        >
                          <svg className={styles.actionSvg} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.46 11l-3.91-3.91a1 1 0 00-.7-.29H3a1 1 0 00-1 1v10a1 1 0 001 1h11.85a1 1 0 00.7-.29l3.91-3.91a1 1 0 000-1.41l-.01-.01c-.01-.08 0-.1.01-.18zM4 17V9h10.42l3 3-3 3H4z" />
                          </svg>
                          <span>Like</span>
                        </button>
                        <button
                          type="button"
                          className={styles.actionItem}
                          onClick={() => navigateWithAuth('/dashboard')}
                        >
                          <svg className={styles.actionSvg} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                          </svg>
                          <span>Comment</span>
                        </button>
                        <button
                          type="button"
                          className={styles.actionItem}
                          onClick={() => navigateWithAuth('/dashboard')}
                        >
                          <svg className={styles.actionSvg} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
                          </svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.floatingBadgeOpenToWork}>
                    <div className={styles.badgeRing}>
                      <span className={styles.badgeEmoji}>💼</span>
                    </div>
                    <div>
                      <p className={styles.badgeTitle}>#OpenToWork</p>
                      <p className={styles.badgeDesc}>Visible to community</p>
                    </div>
                  </div>

                  <div className={styles.floatingBadgeConnections}>
                    <div className={styles.connectionIcon}>🤝</div>
                    <div>
                      <p className={styles.badgeTitle}>5 Connection Requests</p>
                      <p className={styles.badgeDesc}>Manage your network</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.discoverSection}>
            <div className={styles.sectionContainerSplit}>
              <div className={styles.discoverLeftText}>
                <h2 className={styles.sectionTitleLarge}>
                  Find and connect with peers across domains
                </h2>
                <p className={styles.sectionSubtitle}>
                  Search member profiles in the community, send connection requests, and stay updated
                  with people in your network.
                </p>
                <Button variant="outline" size="md" onClick={() => router.push('/discover')}>
                  Discover Members
                </Button>
              </div>

              <div className={styles.discoverRightChips}>
                <p className={styles.chipsLabel}>EXPLORE MEMBER DOMAINS</p>
                <div className={styles.chipsGrid}>
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      className={`${styles.domainChip} ${activeDomain === domain ? styles.activeDomainChip : ''}`}
                      onClick={() => {
                        setActiveDomain(domain);
                        router.push('/discover');
                      }}
                    >
                      <span>{domain}</span>
                      <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.resumeBannerSection}>
            <div className={styles.resumeBannerContent}>
              <div className={styles.resumeBannerText}>
                <h2 className={styles.resumeBannerTitle}>
                  Build your career profile and export a PDF resume
                </h2>
                <p className={styles.resumeBannerDesc}>
                  Highlight your education, work experience, and personal bio. Export an
                  industry-standard PDF resume with one click.
                </p>
              </div>
              <Button variant="outline" size="md" onClick={() => navigateWithAuth('/profile')}>
                Build Your Profile
              </Button>
            </div>
          </section>

          <section className={styles.featuresSection}>
            <div className={styles.sectionContainer}>
              <div className={styles.featureCardsGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIllustration}>
                    <svg viewBox="0 0 100 100" className={styles.featureSvg}>
                      <circle cx="50" cy="50" r="45" fill="#EBF4FD" />
                      <circle cx="50" cy="38" r="16" fill="#0A66C2" />
                      <path d="M26 76c0-13.25 10.75-24 24-24s24 10.75 24 24" fill="#0A66C2" />
                      <circle cx="74" cy="30" r="10" fill="#057642" />
                      <path d="M70 30l3 3 6-6" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className={styles.featureCardTitle}>
                    Grow and nurture your professional network
                  </h3>
                  <p className={styles.featureCardDesc}>
                    Send and accept connection requests, discover colleagues, and build a trusted
                    professional circle.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWithAuth('/my_connections')}
                  >
                    View Network
                  </Button>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIllustration}>
                    <svg viewBox="0 0 100 100" className={styles.featureSvg}>
                      <circle cx="50" cy="50" r="45" fill="#F1ECE5" />
                      <rect x="25" y="32" width="50" height="36" rx="6" fill="#8F5849" />
                      <circle cx="38" cy="50" r="4" fill="#FFFFFF" />
                      <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
                      <circle cx="62" cy="50" r="4" fill="#FFFFFF" />
                    </svg>
                  </div>
                  <h3 className={styles.featureCardTitle}>
                    Share updates and media on community feed
                  </h3>
                  <p className={styles.featureCardDesc}>
                    Publish posts with pictures, share insights, and discuss tech developments
                    through comments and likes.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWithAuth('/dashboard')}
                  >
                    Explore Feed
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.ctaPreFooter}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaHeadline}>
                Join your colleagues and classmates on ConnectIn.
              </h2>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigateWithAuth('/login?mode=signup')}
              >
                Get Started
              </Button>
            </div>
          </section>

          <footer className={styles.footerWrapper}>
            <div className={styles.footerContainer}>
              <div className={styles.footerBrandRow}>
                <BrandLogo className={styles.footerBrandSvg} />
              </div>

              <div className={styles.footerLinksGrid}>
                <div className={styles.footerColumn}>
                  <h4 className={styles.footerColumnTitle}>Navigation</h4>
                  <span onClick={() => navigateWithAuth('/dashboard')} className={styles.footerLink}>
                    Feed
                  </span>
                  <span onClick={() => router.push('/discover')} className={styles.footerLink}>
                    Discover Members
                  </span>
                  <span
                    onClick={() => navigateWithAuth('/my_connections')}
                    className={styles.footerLink}
                  >
                    My Network
                  </span>
                  <span onClick={() => navigateWithAuth('/profile')} className={styles.footerLink}>
                    My Profile
                  </span>
                </div>

                <div className={styles.footerColumn}>
                  <h4 className={styles.footerColumnTitle}>Features</h4>
                  <span onClick={() => navigateWithAuth('/dashboard')} className={styles.footerLink}>
                    Media Posts & Feed
                  </span>
                  <span
                    onClick={() => navigateWithAuth('/my_connections')}
                    className={styles.footerLink}
                  >
                    Connection Requests
                  </span>
                  <span onClick={() => navigateWithAuth('/profile')} className={styles.footerLink}>
                    Profile Builder
                  </span>
                  <span onClick={() => navigateWithAuth('/profile')} className={styles.footerLink}>
                    PDF Resume Export
                  </span>
                </div>

                <div className={styles.footerColumn}>
                  <h4 className={styles.footerColumnTitle}>Account</h4>
                  <span
                    onClick={() => router.push('/login?mode=signin')}
                    className={styles.footerLink}
                  >
                    Sign In
                  </span>
                  <span
                    onClick={() => router.push('/login?mode=signup')}
                    className={styles.footerLink}
                  >
                    Create Account
                  </span>
                  <span onClick={() => router.push('/')} className={styles.footerLink}>
                    Homepage
                  </span>
                </div>
              </div>

              <div className={styles.footerLegalBar}>
                <span className={styles.copyrightText}>
                  ConnectIn © {new Date().getFullYear()}. All rights reserved.
                </span>
                <div className={styles.legalLinks}>
                  <span className={styles.legalItem}>Community Guidelines</span>
                  <span className={styles.legalItem}>Privacy Policy</span>
                  <span className={styles.legalItem}>User Agreement</span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </UserLayout>
    </>
  );
}
