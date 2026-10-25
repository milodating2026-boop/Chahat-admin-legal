'use client';

import { SUPPORT_EMAIL } from '@/lib/contact';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PageBanner } from '@/components/layout/PageBanner';

export default function SupportPage() {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'moderation',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.message.trim()) return;
    // There is no ticketing backend: open the visitor's mail app with the message pre-filled instead of pretending to submit it.
    const body = `${formData.message}\n\nFrom: ${formData.name} <${formData.email}>\nCategory: ${formData.category}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(formData.subject || 'Chahat support request')}&body=${encodeURIComponent(body)}`;
    setTicketSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      <PublicHeader />

      <PageBanner
        badge="Help &amp; Assistance"
        title="Support &amp; User Inquiries"
        subtitle="Have a question about moderation, safety, or your account? Our team is here to assist you."
        breadcrumbs={[{ label: 'Support & Help' }]}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <Mail className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">General Support</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">For account queries, bug reports &amp; feedback.</p>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 pt-1">{SUPPORT_EMAIL}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Trust &amp; Safety Desk</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Report serious violations, scams, or abuse.</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-1">{SUPPORT_EMAIL}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 transition-colors">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Grievance Redressal</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Legal escalation &amp; regulatory notice desk.</p>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 pt-1">
              <a href="mailto:milodating2026@gmail.com" className="hover:underline">milodating2026@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Support ticket submission form */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send an Inquiry or Incident Report</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fill in the details below and our team will get back to you within 24 hours.</p>
          </div>

          {!ticketSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rohit Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Inquiry Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="moderation">Profile &amp; Account Moderation</option>
                    <option value="report">Report an Abusive Profile</option>
                    <option value="billing">Coins / Subscription Query</option>
                    <option value="technical">Audio / Video Call Technical Glitch</option>
                    <option value="account">Account Access &amp; Password</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide all relevant details, profile usernames, or timestamps..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          ) : (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">Inquiry Received</h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Thank you for contacting us. A confirmation email has been logged, and our team will review your message shortly.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Registered Address Card */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-base font-bold text-white">Registered Physical Office &amp; Regulatory Node</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            For official legal correspondence, notices under the Information Technology (Intermediary Guidelines) Rules, or postal inquiries:
          </p>
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-rose-300">Chahat Operations India &bull; Grievance Desk</p>
            <p>Bodhi Chhapra A.D.O Tola, Gaithihaw Mus. Ghithihaw Aht., PO: Gethihawa, Dist: Kushinagar, Uttar Pradesh, 274802, India</p>
            <p className="text-slate-400 pt-1">Electronic inquiries: milodating2026@gmail.com (Acknowledgment within 24 hours)</p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
