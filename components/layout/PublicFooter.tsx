'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Mail,
  MapPin,
  CheckCircle2,
  Trash2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { PLAY_STORE_URL } from './PublicHeader';
import { OPERATOR } from '@/lib/legal';

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center shrink-0">
                <Image
                  src="/chahat-logo.png"
                  alt="Chahat"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Chahat
                </span>
                <span className="text-xs text-rose-400 font-semibold tracking-wide">
                  Real People &bull; Real Connections
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Chahat is an Indian social platform built exclusively for adults (18+) to connect through respectful text messaging and voice messages.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 text-rose-400 border border-slate-800">
                <Shield className="w-3.5 h-3.5" />
                18+ Adult Community Only
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                Adults Only (18+)
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Chahat
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Core Features
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition-colors">
                  Trust &amp; Safety
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Help Desk &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Legal &amp; Compliance
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies Policy
                </Link>
              </li>
              <li><Link href="/community-guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              <li><Link href="/child-safety" className="hover:text-white transition-colors">Child Safety Standards</Link></li>
              <li><Link href="/delete-account" className="hover:text-white transition-colors">Delete Account</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li>
                <Link href="/community-guidelines" className="hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/delete-account"
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5 text-rose-400 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Safety, Grievance & Office Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Safety &amp; Grievance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designated desk under Information Technology Rules 2021 for user inquiries and formal regulatory notices.
            </p>
            <div className="pt-1 text-xs text-slate-400 space-y-2">
              <p>
                <strong className="text-slate-300">Grievance Email:</strong>{' '}
                <a href="mailto:milodating2026@gmail.com" className="text-rose-400 hover:underline">
                  milodating2026@gmail.com
                </a>
              </p>
              <p><strong className="text-slate-300">Acknowledgement target:</strong> {OPERATOR.grievanceAcknowledge}</p>
              <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  Postal Address:
                </span>
                <p className="leading-relaxed text-slate-400">
                  Bodhi Chhapra A.D.O Tola, Gaithihaw Mus. Ghithihaw Aht., PO: Gethihawa, Dist: Kushinagar, Uttar Pradesh, 274802, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Chahat Online Friendship App. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <span>&bull;</span>
            <Link href="/community-guidelines" className="hover:text-slate-300 transition-colors">
              Guidelines
            </Link>
            <span>&bull;</span>
            <Link href="/admin-login" className="hover:text-slate-300 text-slate-600 font-normal transition-colors" title="Administrative Access">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
