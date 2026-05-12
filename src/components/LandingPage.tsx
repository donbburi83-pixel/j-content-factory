import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Instagram, Youtube, MessageCircle, ArrowRight, Play, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PortfolioItem {
  id: string;
  order: number;
  label: string;
  title: string;
  imageUrl: string;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const xLeft = useTransform(scrollY, [0, 2000], [0, -1000]);
  const xRight = useTransform(scrollY, [0, 4000], [0, 800]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioSettings, setPortfolioSettings] = useState({
    title: 'Selected Works.',
    subtitle: 'The Portfolio'
  });
  const [contactSettings, setContactSettings] = useState({
    title: 'J Content Factory',
    description: '제이콘팩은 단순한 영상 제작을 넘어, 배우의 고유한 아우라를 가장 돋보이게 하는 시네마틱 포트폴리오를 설계합니다.',
    email: 'contact@jcf.art',
    instagram: '#',
    youtube: '#',
    kakao: '#',
    copyright: '© 2024 J Content Factory. PRODUCED IN SEOUL.'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPortfolioSettings({
            title: data.portfolioTitle || 'Selected Works.',
            subtitle: data.portfolioSubtitle || 'The Portfolio'
          });
          setContactSettings({
            title: data.contactTitle || 'J Content Factory',
            description: data.contactDescription || '제이콘팩은 단순한 영상 제작을 넘어, 배우의 고유한 아우라를 가장 돋보이게 하는 시네마틱 포트폴리오를 설계합니다.',
            email: data.contactEmail || 'contact@jcf.art',
            instagram: data.instagramUrl || '#',
            youtube: data.youtubeUrl || '#',
            kakao: data.kakaoUrl || '#',
            copyright: data.footerCopyright || '© 2024 J Content Factory. PRODUCED IN SEOUL.'
          });
        }
      } catch (err) {
        console.error("Error fetching portfolio settings:", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
        const q = query(collection(db, 'portfolio'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (items.length > 0) {
          setPortfolioItems(items);
        } else {
          // Default fallback if Firestore is empty
          setPortfolioItems([
            { id: '1', order: 1, label: 'Vision', title: "배우는 '말'이 아닌 '영상'으로 증명됩니다.", imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800' },
            { id: '2', order: 2, label: 'Curriculum', title: '1년 프로젝트: 포트폴리오 빌드업', imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800' },
            { id: '3', order: 3, label: 'Production', title: '스마트 프로덕션 3단계 시스템', imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800' }
          ]);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };
    fetchPortfolio();
  }, []);

  const slides = [
    {
      id: 0,
      content: (
        <div className="relative">
          <h3 className="text-3xl md:text-4xl font-sans font-light leading-tight text-white mb-8">
            배우는 '말'이 아닌<br />
            <span className="text-gold font-bold italic font-serif">'영상'</span>으로 증명됩니다.
          </h3>
          <div className="w-16 h-px bg-white/20 mb-8"></div>
          <p className="text-sm md:text-base text-white/50 leading-relaxed font-light mb-12">
            제이 콘텐츠 팩토리는 고비용의 화려한 연출보다,<br />
            배우의 본질이 돋보이는 가장 효율적이고 합리적인<br />
            영상 제작 솔루션을 제안합니다.
          </p>
          <div className="flex items-center gap-4">
            <div className="bg-gold p-2">
              <Play className="w-4 h-4 text-black fill-current" />
            </div>
            <span className="text-xs uppercase tracking-[0.4em] font-bold text-gold">J CONTENT FACTORY</span>
          </div>
        </div>
      )
    },
    {
      id: 1,
      content: (
        <div className="relative">
          <h3 className="text-3xl font-sans font-light leading-tight text-white mb-4">
            1년 <span className="text-gold italic font-serif">프로젝트</span>
          </h3>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-8">Step-by-Step Portfolio Build-up</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <CurriculumItem q="1Q" title="기초 다지기" desc="자기소개 + 베이직 자유 연기" />
            <CurriculumItem q="2Q" title="캐릭터 구축" desc="1인 연기 영상 (컨셉 A)" />
            <CurriculumItem q="3Q" title="이미지 확장" desc="1인 연기 영상 (컨셉 B)" />
            <CurriculumItem q="4Q" title="실전 앙상블" desc="2인 연기 영상" />
          </div>
          
          <p className="text-[10px] text-white/30 italic">배우의 성장 서사를 1년에 걸쳐 전략적으로 완성합니다.</p>
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div className="relative">
          <h3 className="text-3xl font-sans font-light leading-tight text-white mb-8">
            스마트 <span className="text-gold italic font-serif">프로덕션</span>
          </h3>
          
          <div className="space-y-6">
            <div className="border border-white/10 p-5 bg-white/[0.02]">
              <span className="text-gold text-[9px] font-bold tracking-widest uppercase mb-2 block">1단계: PRE-PRODUCTION</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                비주얼 컨셉 컨설팅 • 맞춤형 대본 선정 • 로케이션 소품 최적화
              </p>
            </div>
            <div className="border border-white/10 p-5 bg-white/[0.02]">
              <span className="text-gold text-[9px] font-bold tracking-widest uppercase mb-2 block">2단계: PRODUCTION</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                군더더기 없는 현장 운영 • 배우 중심 라이팅&촬영 • 실시간 모니터링
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      content: (
        <div className="relative">
          <h3 className="text-3xl font-sans font-light leading-tight text-white mb-6">
            3단계 : <span className="text-gold italic font-serif">POST-PRODUCTION</span>
          </h3>
          <p className="text-xs text-white/40 mb-8 italic">"담백함이 곧 전문성입니다."</p>
          
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-4 text-[11px] text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
              <span>핵심 위주의 컷 편집</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
              <span>배우 톤 맞춤형 색보정</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-white/70">
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
              <span>데이터 최적화</span>
            </div>
          </div>

          <div className="p-6 border-t border-gold/20">
            <p className="text-sm font-serif italic text-gold opacity-90 leading-relaxed">
              "우리는 영화를 찍지 않습니다. <br />당신이라는 '배우'를 찍습니다."
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="immersive-bg text-white min-h-screen relative overflow-hidden">
      {/* Top Parallax Ticker */}
      <div className="fixed top-24 left-0 w-full overflow-hidden pointer-events-none z-10 select-none hidden md:block">
        <motion.div 
          style={{ x: xRight }}
          className="whitespace-nowrap flex items-center gap-20 opacity-[0.25]"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-12">
              <div className="flex items-center justify-center p-4 bg-gold/10 border border-gold/30">
                <Play className="w-12 h-12 text-gold fill-current" />
              </div>
              <span className="text-[160px] font-serif font-[950] italic uppercase tracking-tighter text-gold/90 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                J CONTENT FACTORY • IMAGINATION • PRODUCTION •
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 py-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif tracking-[0.3em] uppercase cursor-pointer text-gold gold-glow" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            J Content Factory
          </h1>
          <span className="text-[9px] tracking-[0.4em] opacity-40 uppercase mt-1">Acting Directing & Media Production</span>
        </div>
        <div className="hidden md:flex space-x-12 uppercase tracking-[0.3em] text-[10px] items-center">
          <NavLink label="About" href="#vision" />
          <NavLink label="Service" href="#services" />
          <NavLink label="Portfolio" href="#portfolio" />
          <NavLink label="Contact" href="#contact" />
          <button 
            onClick={() => navigate('/admin/login')}
            className="uppercase tracking-[0.2em] text-[10px] border border-gold/40 px-6 py-2.5 hover:bg-gold hover:text-black transition-all duration-500 font-bold"
          >
            Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="vision" className="relative min-h-screen flex flex-col md:flex-row items-center justify-between pt-32 pb-20 px-12 max-w-7xl mx-auto gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex-1 text-center md:text-left"
        >
          <span className="text-gold font-serif italic text-xl mb-6 block gold-glow text-balance">Artistry in Every Frame</span>
          <h2 className="text-6xl md:text-8xl font-light mb-10 leading-[1.1] tracking-tight text-balance">
            연기를 넘어,<br /> 
            <span className="font-serif italic text-gold gold-glow">감동</span>을 창조하다
          </h2>
          <p className="max-w-xl text-white/50 text-sm md:text-base leading-relaxed mb-12 font-light text-balance">
            우리는 단순한 영상 제작을 넘어, 배우의 깊은 내면을 끌어내는 전문적인 연기 디렉팅과 감각적인 시각 연출을 통해 브랜드와 인물의 정체성을 완성합니다.
          </p>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <button className="bg-gold text-black px-12 py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-gold-light transition-all flex items-center group shadow-2xl shadow-gold/20">
              View Reel <Play className="ml-3 w-3 h-3 fill-current" />
            </button>
            <button className="text-gold border border-gold/30 px-12 py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-gold/10 transition-all">
              상담/문의
            </button>
          </div>
        </motion.div>

        {/* PDF Slideshow Reconstruction */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex-1 w-full max-w-xl"
        >
          <div className="bg-black/60 backdrop-blur-xl border border-white/5 p-12 relative overflow-hidden group min-h-[500px] flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-[100px] group-hover:bg-gold/10 transition-all duration-1000"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {slides[currentSlide].content}
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation */}
            <div className="absolute bottom-8 right-8 flex items-center gap-6">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 transition-all duration-500 ${i === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={prevSlide}
                  className="p-2 border border-white/10 hover:border-gold hover:text-gold transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="p-2 border border-white/10 hover:border-gold hover:text-gold transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="absolute top-8 right-8 text-[10px] text-white/20 font-bold tracking-[0.3em] uppercase">
              0{currentSlide + 1} / 0{slides.length}
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 opacity-30 hidden md:block"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Quick Showcase (Inspired by Immersive Bottom Showcase) */}
      <section id="portfolio" className="relative z-10 px-12 pb-32">
        <div className="max-w-7xl mx-auto mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-gold uppercase tracking-[0.5em] text-[10px] mb-6 font-bold gold-glow">{portfolioSettings.subtitle}</span>
            <h3 className="text-4xl md:text-6xl font-serif italic mb-10 tracking-tight">{portfolioSettings.title}</h3>
            <div className="w-24 h-px bg-gold/30"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <ShowcaseCard 
              key={item.id}
              id={item.order.toString().padStart(2, '0')} 
              title={item.title} 
              img={item.imageUrl}
              label={item.label}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div>
              <span className="text-gold uppercase tracking-[0.4em] text-[10px] mb-4 block">Capabilities</span>
              <h3 className="text-4xl md:text-5xl font-serif italic mb-8 underline-offset-8 underline decoration-gold/20">The Directing.</h3>
              <p className="text-white/50 leading-relaxed font-light text-lg">
                단순한 영상 제작을 넘어, 배우의 깊이 있는 감정 표현과 
                현장감 있는 디렉팅을 통해 강력한 서사를 구축합니다.
              </p>
            </div>
            
            <div className="space-y-8">
              <ServiceItem title="Acting Directing" desc="캐릭터 분석부터 현장 감정 디렉팅까지 전문적인 가이드를 제공합니다." />
              <ServiceItem title="Visual Production" desc="배우(인물) 중심의 감각적인 미장센으로 영상의 가치를 극대화합니다." />
              <ServiceItem title="Casting Direction" desc="작품에 최적화된 새로운 얼굴과 재능을 발굴합니다." />
            </div>
          </div>
          
          <div className="relative aspect-[3/4] bg-zinc-800 rounded-none overflow-hidden group">
            <div className="absolute inset-0 bg-gold/5 group-hover:bg-transparent transition-colors z-10" />
            <img 
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000" 
              alt="Acting Class" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-24 px-8 border-t border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start space-y-16 md:space-y-0">
          <div className="max-w-md">
            <h2 className="text-3xl font-serif italic text-gold mb-8">{contactSettings.title}</h2>
            <p className="text-white/40 leading-relaxed text-sm">
              {contactSettings.description}
            </p>
            <div className="flex space-x-6 mt-12">
              <SocialLink icon={<Instagram />} href={contactSettings.instagram} />
              <SocialLink icon={<Youtube />} href={contactSettings.youtube} />
              <SocialLink icon={<MessageCircle />} href={contactSettings.kakao} />
            </div>
          </div>
          
          <div className="space-y-12 text-right">
            <div>
              <p className="uppercase tracking-[0.4em] text-[10px] text-white/40 mb-4 font-bold">Contact Us</p>
              <a href={`mailto:${contactSettings.email}`} className="text-2xl font-serif italic hover:text-gold transition-colors">{contactSettings.email}</a>
            </div>
            <div>
              <p className="uppercase tracking-[0.4em] text-[10px] text-white/40 mb-4 font-bold">Follow Our Story</p>
              <p className="text-sm text-white/40">Keep up with our latest productions and acting insights.</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/20 font-bold">
          <p>{contactSettings.copyright}</p>
          <div className="space-x-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ShowcaseCard({ id, title, img, label }: { id: string, title: string, img: string, label: string, key?: React.Key }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative aspect-video bg-neutral-900 border border-white/5 overflow-hidden cursor-pointer"
    >
      <div 
        className="absolute inset-0 bg-cover grayscale group-hover:grayscale-0 transition-all duration-700 bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all duration-500 p-6 flex flex-col justify-end">
        <span className="text-[10px] text-gold tracking-widest uppercase mb-1">{label} {id}</span>
        <p className="text-xs md:text-sm font-medium tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 italic font-serif text-white/90">
          {title}
        </p>
      </div>
    </motion.div>
  );
}

function NavLink({ label, href }: { label: string, href: string }) {
  return (
    <a href={href} className="hover:text-gold transition-colors">
      {label}
    </a>
  );
}

function ServiceItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="border-l border-gold/40 pl-6 group">
      <h4 className="text-lg font-serif italic mb-2 group-hover:text-gold transition-colors">{title}</h4>
      <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a href={href} className="p-3 border border-white/10 rounded-full hover:bg-gold hover:text-black hover:border-gold transition-all duration-300">
      {React.cloneElement(icon as React.ReactElement, { size: 18 })}
    </a>
  );
}

function CurriculumItem({ q, title, desc }: { q: string, title: string, desc: string }) {
  return (
    <div className="border border-white/5 p-4 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
      <span className="text-[9px] text-gold font-bold tracking-widest mb-1 block">{q}</span>
      <h4 className="text-[11px] font-bold text-white/90 mb-1">{title}</h4>
      <p className="text-[9px] text-white/40 leading-snug">{desc}</p>
    </div>
  );
}
