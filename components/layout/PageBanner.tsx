'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

interface PageBannerProps {
  title: string;
  subtitle: string;
  badge?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageBanner({
  title,
  subtitle,
  badge,
  breadcrumbs = [],
}: PageBannerProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Navigation Breadcrumbs + Return Home Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link
              href="/"
              className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 dark:text-white font-bold">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Prominent Return to Homepage button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Badge & Title */}
        <div className="space-y-2 pt-2 text-left">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
