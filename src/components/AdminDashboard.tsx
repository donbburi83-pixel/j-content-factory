import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogOut, LayoutDashboard, FileVideo, Settings, Image as ImageIcon, Loader2, Save } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = "donbburi83@gmail.com";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [portfolioTitle, setPortfolioTitle] = useState('Selected Works.');
  const [portfolioSubtitle, setPortfolioSubtitle] = useState('The Portfolio');
  const [contactTitle, setContactTitle] = useState('J Content Factory');
  const [contactDescription, setContactDescription] = useState('제이콘팩은 단순한 영상 제작을 넘어, 배우의 고유한 아우라를 가장 돋보이게 하는 시네마틱 포트폴리오를 설계합니다.');
  const [contactEmail, setContactEmail] = useState('contact@jcf.art');
  const [instagramUrl, setInstagramUrl] = useState('#');
  const [youtubeUrl, setYoutubeUrl] = useState('#');
  const [kakaoUrl, setKakaoUrl] = useState('#');
  const [footerCopyright, setFooterCopyright] = useState('© 2024 J Content Factory. PRODUCED IN SEOUL.');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPortfolioTitle(data.portfolioTitle || 'Selected Works.');
          setPortfolioSubtitle(data.portfolioSubtitle || 'The Portfolio');
          setContactTitle(data.contactTitle || 'J Content Factory');
          setContactDescription(data.contactDescription || '제이콘팩은 단순한 영상 제작을 넘어, 배우의 고유한 아우라를 가장 돋보이게 하는 시네마틱 포트폴리오를 설계합니다.');
          setContactEmail(data.contactEmail || 'contact@jcf.art');
          setInstagramUrl(data.instagramUrl || '#');
          setYoutubeUrl(data.youtubeUrl || '#');
          setKakaoUrl(data.kakaoUrl || '#');
          setFooterCopyright(data.footerCopyright || '© 2024 J Content Factory. PRODUCED IN SEOUL.');
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);

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
          // Default data
          const defaults = [
            { id: '1', order: 1, label: 'Vision', title: "배우는 '말'이 아닌 '영상'으로 증명됩니다.", imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800' },
            { id: '2', order: 2, label: 'Curriculum', title: '1년 프로젝트: 포트폴리오 빌드업', imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800' },
            { id: '3', order: 3, label: 'Production', title: '스마트 프로덕션 3단계 시스템', imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800' }
          ];
          setPortfolioItems(defaults);
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };
    fetchPortfolio();
  }, []);

  const handleUpdatePortfolioItem = async (id: string, field: string, value: string) => {
    const updated = portfolioItems.map(item => item.id === id ? { ...item, [field]: value } : item);
    setPortfolioItems(updated);
  };

  const handleSavePortfolioItem = async (item: any) => {
    setSaveStatus('saving');
    try {
      const { order, label, title, imageUrl } = item;
      await setDoc(doc(db, 'portfolio', item.id), {
        order, label, title, imageUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        portfolioTitle,
        portfolioSubtitle,
        contactTitle,
        contactDescription,
        contactEmail,
        instagramUrl,
        youtubeUrl,
        kakaoUrl,
        footerCopyright,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email
      }, { merge: true });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen immersive-bg text-white font-sans flex relative overflow-hidden">
      {/* Sidebar - Immersive Admin Overlay Style */}
      <aside className="w-72 admin-overlay flex flex-col p-8 relative z-20">
        <div className="flex items-center gap-3 mb-16 px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_10px_rgba(172,169,156,0.5)]"></div>
          <h3 className="text-xs font-bold tracking-[0.4em] text-gold gold-glow uppercase">CMS Control</h3>
        </div>

        <nav className="flex-1 space-y-8">
          <div>
            <h4 className="text-[9px] opacity-40 hover:opacity-100 transition-opacity uppercase tracking-[0.3em] mb-5 font-bold">Navigation</h4>
            <div className="space-y-1">
              <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active />
              <NavItem icon={<FileVideo className="w-4 h-4" />} label="Portfolio" />
              <NavItem icon={<ImageIcon className="w-4 h-4" />} label="Gallery" />
            </div>
          </div>
          
          <div>
            <h4 className="text-[9px] opacity-40 uppercase tracking-[0.3em] mb-5 font-bold">Site Customization</h4>
            <div className="space-y-4 px-2">
              <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2 cursor-pointer hover:border-gold/30 transition-colors">
                <span className="text-white/60">Main Theme Color</span>
                <div className="w-4 h-4 bg-gold rounded-sm shadow-inner"></div>
              </div>
              <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2 cursor-pointer hover:border-gold/30 transition-colors">
                <span className="text-white/60">Typography</span>
                <span className="text-gold font-serif italic">Cormorant</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[9px] opacity-40 uppercase tracking-[0.3em] mb-5 font-bold">Content Manager</h4>
            <button className="w-full text-left p-4 border border-white/5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white/5 hover:border-gold/20 transition-all group flex items-center justify-between">
              New Content
              <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
            </button>
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-12 flex items-center text-white/40 hover:text-gold transition-colors uppercase tracking-[0.3em] text-[9px] font-bold group pt-8 border-t border-white/5"
        >
          <LogOut className="w-3.5 h-3.5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16 overflow-y-auto relative z-10">
        <header className="mb-20 flex justify-between items-start">
          <div className="max-w-md">
            <h1 className="text-5xl font-serif mb-4 leading-tight italic gold-glow">
              Welcome back,<br />
              <span className="text-gold font-light">{user.displayName?.split(' ')[0] || 'Admin'}</span>.
            </h1>
            <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase font-medium">System Operator & Director</p>
          </div>
          
          <div className="bg-white/[0.03] border border-white/10 px-8 py-5 text-right backdrop-blur-sm">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-1 gold-glow">System: Online</p>
            <p className="text-white/20 text-[9px] uppercase tracking-widest">Protocol v4.2.1 Stable</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <StatCard title="Portfolio Reach" value="28" label="Productions Listed" />
          <StatCard title="Active Directing" value="06" label="In-Progress Sessions" />
          <StatCard title="Network Traffic" value="1.4k" label="Unique Visualizers" />
        </div>

        {/* Portfolio Title Editor Section */}
        <section className="mt-24 max-w-2xl bg-white/[0.02] border border-white/5 p-10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gold/50 group-hover:bg-gold transition-colors"></div>
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-serif italic text-gold gold-glow font-light">Portfolio Branding</h2>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">Section Identity Editor</p>
            </div>
            
            <button 
              onClick={handleSaveSettings}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-3 bg-gold/10 border border-gold/30 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-black transition-all disabled:opacity-50 group/btn"
            >
              {saveStatus === 'saving' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saveStatus === 'success' ? (
                'Updated'
              ) : (
                <>
                  Save Changes
                  <Save className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold block ml-1">Main Display Title</label>
              <input 
                type="text" 
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-xl font-serif italic text-white focus:outline-none focus:border-gold/30 transition-all"
                placeholder="e.g. Selected Works."
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold block ml-1">Upper Text Label</label>
              <input 
                type="text" 
                value={portfolioSubtitle}
                onChange={(e) => setPortfolioSubtitle(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-xs uppercase tracking-[0.4em] font-bold text-gold focus:outline-none focus:border-gold/30 transition-all font-sans"
                placeholder="e.g. THE PORTFOLIO"
              />
            </div>
          </div>

          {saveStatus === 'success' && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-10 text-[9px] text-gold uppercase tracking-widest italic"
            >
              • Persistent data updated successfully.
            </motion.p>
          )}
        </section>

        {/* Contact & Footer Editor Section */}
        <section className="mt-20 max-w-4xl bg-white/[0.02] border border-white/5 p-10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gold/50 group-hover:bg-gold transition-colors"></div>
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-serif italic text-gold gold-glow font-light">Contact & Footer Settings</h2>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">Editorial Content & Links</p>
            </div>
            
            <button 
              onClick={handleSaveSettings}
              className="flex items-center gap-3 bg-gold/10 border border-gold/30 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-black transition-all group/btn"
            >
              Save All Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold block ml-1">Contact Section Title</label>
                <input 
                  type="text" 
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 px-6 py-3 text-sm font-serif italic text-white focus:outline-none focus:border-gold/30 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold block ml-1">Contact Description</label>
                <textarea 
                  value={contactDescription}
                  onChange={(e) => setContactDescription(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-xs text-white/60 focus:outline-none focus:border-gold/30 transition-all min-h-[100px] leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold block ml-1">Footer Copyright</label>
                <input 
                  type="text" 
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 px-6 py-3 text-[10px] font-sans text-white/40 focus:outline-none focus:border-gold/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold block ml-1">Contact Email</label>
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 px-6 py-3 text-sm text-gold focus:outline-none focus:border-gold/30 transition-all"
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Instagram URL</label>
                  <input type="text" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2 text-[10px] text-white/50 focus:border-gold/30 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/20 uppercase tracking-widest font-bold">YouTube URL</label>
                  <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2 text-[10px] text-white/50 focus:border-gold/30 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Kakao/Message URL</label>
                  <input type="text" value={kakaoUrl} onChange={(e) => setKakaoUrl(e.target.value)} className="w-full bg-black/40 border border-white/5 px-4 py-2 text-[10px] text-white/50 focus:border-gold/30 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Items Editor Section */}
        <section className="mt-24 max-w-5xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-serif italic text-gold gold-glow font-light">Featured Work</h2>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">Portfolio Item Manager</p>
            </div>
            <div className="h-px flex-1 mx-12 bg-gold/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <div key={item.id} className="bg-white/[0.02] border border-white/5 p-6 backdrop-blur-sm group relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gold/30 group-hover:bg-gold transition-colors"></div>
                
                <div className="aspect-video bg-zinc-900 border border-white/10 mb-6 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-white/30 uppercase tracking-widest font-bold block">Label</label>
                    <input 
                      type="text" 
                      value={item.label}
                      onChange={(e) => handleUpdatePortfolioItem(item.id, 'label', e.target.value)}
                      className="w-full bg-black/40 border border-white/5 px-3 py-2 text-[10px] uppercase tracking-widest text-gold focus:outline-none focus:border-gold/30 transition-all font-bold"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-white/30 uppercase tracking-widest font-bold block">Title Content</label>
                    <textarea 
                      value={item.title}
                      onChange={(e) => handleUpdatePortfolioItem(item.id, 'title', e.target.value)}
                      className="w-full bg-black/40 border border-white/5 px-3 py-2 text-[11px] text-white/80 focus:outline-none focus:border-gold/30 transition-all font-serif italic min-h-[60px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-white/30 uppercase tracking-widest font-bold block">Image Link</label>
                    <input 
                      type="text" 
                      value={item.imageUrl}
                      onChange={(e) => handleUpdatePortfolioItem(item.id, 'imageUrl', e.target.value)}
                      className="w-full bg-black/40 border border-white/5 px-3 py-2 text-[9px] text-white/30 focus:outline-none focus:border-gold/30 transition-all font-mono"
                    />
                  </div>

                  <button 
                    onClick={() => handleSavePortfolioItem(item)}
                    className="w-full mt-4 bg-gold/5 border border-gold/20 py-2.5 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    Update Project {item.order}
                    <Save className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 max-w-4xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-serif italic text-gold gold-glow">Audit Logs</h2>
            <div className="h-px flex-1 mx-12 bg-gold/10"></div>
          </div>
          <div className="space-y-6">
            <ActivityItem title="Content Push" detail="Acting_Masterclass_V2.mp4 deployed" time="1h" />
            <ActivityItem title="SEO Re-indexing" detail="Production keywords updated" time="4h" />
            <ActivityItem title="System Alert" detail="New inquiry received via portal" time="1d" />
          </div>
        </section>

        {/* SEO Meta Snippet Preview */}
        <section className="mt-20 max-w-md">
          <h4 className="text-[9px] opacity-40 uppercase tracking-[0.3em] mb-4 font-bold">SEO Snapshot</h4>
          <div className="p-6 border border-white/5 bg-zinc-900/40 backdrop-blur-sm text-[10px] font-mono leading-relaxed text-gold/80 rounded-sm">
            <div className="flex gap-4 mb-1"><span className="text-white/30">title:</span> "J Content Factory"</div>
            <div className="flex gap-4"><span className="text-white/30">desc:</span> "연기 디렉팅 및 영상 제작 전문"</div>
          </div>
        </section>
      </main>

      {/* Subtle Marquee (Similar to Landing) */}
      <div className="absolute bottom-10 right-10 rotate-90 origin-bottom-right whitespace-nowrap opacity-[0.02] font-serif italic text-[100px] pointer-events-none select-none z-0 uppercase tracking-tighter">
        CMS INTERFACE • OPERATIONAL DATA • 
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`group flex items-center space-x-3 cursor-pointer py-2.5 transition-all ${active ? 'text-gold' : 'text-white/30 hover:text-white'}`}>
      <div className={`p-1.5 rounded-sm transition-colors ${active ? 'bg-gold/10 ring-1 ring-gold/20' : 'group-hover:bg-white/5'}`}>
        {icon}
      </div>
      <span className="uppercase tracking-[0.3em] text-[10px] font-bold">{label}</span>
      {active && <motion.div layoutId="activeNav" className="ml-auto w-1 h-3 bg-gold shadow-[0_0_8px_rgba(172,169,156,0.6)]" />}
    </div>
  );
}

function StatCard({ title, value, label }: { title: string, value: string, label: string }) {
  return (
    <div className="border border-white/5 p-10 bg-white/[0.01] hover:bg-white/[0.03] transition-all hover:border-gold/20 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent group-hover:via-gold/30 transition-all"></div>
      <h3 className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-6 font-bold">{title}</h3>
      <p className="text-5xl font-serif text-white group-hover:text-gold transition-colors mb-3 gold-glow">{value}</p>
      <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-medium">{label}</p>
    </div>
  );
}

function ActivityItem({ title, detail, time }: { title: string, detail: string, time: string }) {
  return (
    <div className="flex items-center px-1 py-4 border-b border-white/5 group hover:pl-4 transition-all">
      <div className="w-1.5 h-1.5 rounded-full bg-gold/30 mr-6 group-hover:scale-125 group-hover:bg-gold transition-all"></div>
      <div className="flex-1">
        <h4 className="text-[11px] font-bold tracking-[0.1em] text-white group-hover:text-gold transition-colors">{title}</h4>
        <p className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">{detail}</p>
      </div>
      <div className="text-[9px] text-white/10 uppercase tracking-[0.3em] font-bold">{time}</div>
    </div>
  );
}
