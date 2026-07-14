/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../store';
import { FAQ_ITEMS } from '../constants';
import { Mail, Phone, MapPin, MessageCircle, AlertCircle, HelpCircle, Shield, FileText, Send, ArrowRight, ArrowLeft } from 'lucide-react';

// FAQ View Component
export const FAQView: React.FC = () => {
  const { language, t } = useStore();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 dark:text-zinc-100" id="faq-view">
      <div className="text-center mb-12">
        <div className="inline-flex rounded-full bg-yellow-50 p-3.5 text-yellow-600 dark:bg-yellow-950/20 mb-4">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">{t('faq')}</h1>
        <p className="text-xs text-zinc-400 mt-2">
          {language === 'ar' ? 'أجوبة تفصيلية وموثوقة على أكثر الأسئلة شيوعاً حول الشحن والدفع والأصالة.' : 'All your answers regarding shipping, payments, and product authenticity.'}
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full py-5 px-6 flex justify-between items-center text-left rtl:text-right font-bold text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none"
              >
                <span>{language === 'ar' ? item.qAr : item.qEn}</span>
                <span className="text-lg text-yellow-600 font-bold ml-2">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-5 pt-1 text-xs text-zinc-500 leading-relaxed dark:text-zinc-400 border-t border-zinc-50 dark:border-zinc-800/50">
                  {language === 'ar' ? item.aAr : item.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// CONTACT US VIEW
export const ContactView: React.FC = () => {
  const { language, t, settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMsg('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 dark:text-zinc-100" id="contact-view">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-black uppercase tracking-wider text-zinc-900 dark:text-white">{t('contact')}</h1>
        <p className="text-xs text-zinc-400 mt-2">
          {language === 'ar' ? 'فريق الدعم الفني لدينا جاهز لمساعدتكم والرد على طلباتكم على مدار الساعة.' : 'Our styling and customer care team is delighted to assist you 24/7.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Contact Info details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="rounded-3xl border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-6">
            
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100 pb-3 border-b border-zinc-50 dark:border-zinc-800">
              Corporate Office
            </h3>

            <div className="space-y-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              
              <div className="flex gap-4">
                <div className="rounded-xl bg-zinc-50 p-2.5 text-yellow-600 dark:bg-zinc-850">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Location</span>
                  <span className="text-zinc-800 dark:text-zinc-200 mt-0.5 block leading-relaxed">
                    Tagamoa El-Khames, G-Zone Offices, Cairo, Egypt
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-xl bg-zinc-50 p-2.5 text-yellow-600 dark:bg-zinc-850">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Call Center</span>
                  <span className="text-zinc-800 dark:text-zinc-200 mt-0.5 block">{settings.contactPhone}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-xl bg-zinc-50 p-2.5 text-yellow-600 dark:bg-zinc-850">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Support Email</span>
                  <span className="text-zinc-800 dark:text-zinc-200 mt-0.5 block">{settings.contactEmail}</span>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp banner */}
            <div className="border-t border-zinc-55 dark:border-zinc-800 pt-5">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-green-550/10 hover:bg-green-550/20 text-green-600 dark:text-green-400 font-bold py-4 px-4 text-xs transition"
              >
                <MessageCircle className="h-5 w-5 text-green-500" />
                <span>{t('whatsappSupport')}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Contact form inputs */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-4">
            
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-100 pb-3 border-b border-zinc-50 dark:border-zinc-800">
              Send an Inquiry
            </h3>

            {sent && (
              <div className="rounded-xl bg-green-50 p-3 text-xs text-green-600 font-semibold dark:bg-green-950/20 dark:text-green-400">
                ✔️ Thank you! Your message was sent successfully. We will follow up.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider">Inquiry Message</label>
                <textarea
                  rows={4}
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 px-3 text-xs focus:outline-none focus:border-yellow-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-zinc-950 hover:bg-zinc-850 text-white font-bold py-3 px-6 rounded-xl text-xs transition flex items-center gap-1.5 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            >
              <Send className="h-4 w-4" />
              <span>Submit Form</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

// ABOUT US VIEW
export const AboutView: React.FC = () => {
  const { language, t } = useStore();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 dark:text-zinc-100" id="about-view">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black tracking-widest text-zinc-900 dark:text-white uppercase">AtoM Heritage</h1>
        <p className="text-xs text-yellow-600 font-mono mt-2 tracking-widest uppercase">ESTABLISHED 2026 • CAIRO</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800"
          alt="AtoM footwear boutique exhibition"
          className="rounded-3xl shadow-xl aspect-square object-cover"
        />

        <div className="space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            {language === 'ar' ? 'عراقة الصناعة وفخامة التصميم العصري' : 'Modern Luxury, Boundless Heritage'}
          </h2>
          <p>
            {language === 'ar'
              ? 'تأسست دار أتوم للأحذية الفاخرة لتكون الرابط الفريد بين عراقة الفنون والمواد المصرية الفخمة وبين الحداثة الأوروبية والراحة الارتدادية المبتكرة. نختار خامات جلودنا الطبيعية الفاخرة بعناية بالغة، ونصنع كل حذاء يدوياً بأيدي أمهر الحرفيين في مصر لنضمن لك جودة لا تضاهى وتفاصيل تدوم طويلاً.'
              : 'AtoM was founded to bridge the rich heritage of Egyptian leatherwork with modern ergonomics and European style. We select the finest genuine full-grain leather, crafting each shoe manually with extreme precision to ensure lifetime durability and peerless wearability.'}
          </p>
          <p>
            {language === 'ar'
              ? 'نهدف إلى إعادة ابتكار تجربة ارتدائك للأحذية، حيث تلتقي الراحة المطلقة في الحركة والمظهر المهيب المميز، مما يمنح خطواتك الثقة والفخامة التي تستحقها.'
              : 'Our objective is to redefine footwear experiences, combining premium shock-absorbing comfort with executive-class designs, elevating your steps with confidence and daily luxury.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// PRIVACY POLICY VIEW
export const PrivacyView: React.FC = () => {
  const { language, t } = useStore();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 dark:text-zinc-100" id="privacy-policy-view">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <Shield className="h-6 w-6 text-yellow-600" />
        <h1 className="text-2xl font-black uppercase tracking-wider">{t('privacyPolicy')}</h1>
      </div>

      <div className="space-y-6 text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
        <p>Last updated: July 13, 2026</p>
        <p>
          At AtoM, we deeply care about your privacy and the protection of your personal information. This Privacy Policy details how we collect, use, and secure data from our Egyptian shoppers.
        </p>

        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase mt-4">1. Information We Collect</h3>
        <p>
          We only gather essential invoice data to process Cash on Delivery shipments: full name, active Egyptian mobile telephone number, governorate and street delivery addresses, and optional delivery notes.
        </p>

        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase mt-4">2. Sharing with Couriers</h3>
        <p>
          We coordinate with leading shipping couriers (Bosta and Aramex) to deliver orders across Egypt safely. They receive only the necessary contact details and delivery location references to ensure smooth transport.
        </p>

        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase mt-4">3. Security</h3>
        <p>
          Your session and addresses are saved securely using your local browser cache and authenticated connections. We never distribute your personal metadata to external marketing entities.
        </p>
      </div>
    </div>
  );
};

// TERMS OF SERVICE VIEW
export const TermsView: React.FC = () => {
  const { language, t } = useStore();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 dark:text-zinc-100" id="terms-of-service-view">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <FileText className="h-6 w-6 text-yellow-600" />
        <h1 className="text-2xl font-black uppercase tracking-wider">{t('terms')}</h1>
      </div>

      <div className="space-y-6 text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
        <p>Last updated: July 13, 2026</p>
        <p>
          Welcome to AtoM. By accessing our premium boutique, you agree to respect and follow these Terms of Service.
        </p>

        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase mt-4">1. Order Confirmations</h3>
        <p>
          Each order placed represents an agreement for Cash on Delivery in Egypt. Our support representatives will call or contact you via WhatsApp within 24 hours to verify stock and confirm shipping parameters.
        </p>

        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase mt-4">2. Returns & Exchanges</h3>
        <p>
          Under Egyptian Consumer protection, clients are granted a 14-day window to request returns or size exchanges, provided products are unused, unwashed, and retained in their genuine retail boxes.
        </p>

        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase mt-4">3. Intellectual Property</h3>
        <p>
          All assets, branding logos, Arabic/English content copy, and fine product media showcased are sole properties of AtoM Luxury Egypt. Any unauthorized reproduction is prohibited.
        </p>
      </div>
    </div>
  );
};

// 404 ERROR PAGE
export const NotFoundView: React.FC = () => {
  const { language, t, navigateTo } = useStore();

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center dark:text-zinc-100" id="404-view">
      <div className="inline-flex rounded-full bg-yellow-50 p-6 text-yellow-600 dark:bg-yellow-950/20 mb-6">
        <AlertCircle className="h-14 w-14" />
      </div>
      <h1 className="text-4xl font-black font-mono">404</h1>
      <h2 className="text-xl font-bold mt-4 text-zinc-800 dark:text-zinc-100">{t('error404Title')}</h2>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2 max-w-xs mx-auto">
        {t('error404Desc')}
      </p>
      <button
        onClick={() => navigateTo('home')}
        className="mt-8 rounded-xl bg-yellow-600 py-3.5 px-6 text-xs font-bold text-zinc-950 hover:bg-yellow-505 transition"
      >
        {t('backToHome')}
      </button>
    </div>
  );
};
