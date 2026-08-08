'use client';

import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { isAnalyticsEnabled } from '@/config/analytics';
import { crashlyticsService } from '@/lib/analytics/crashlytics.service';

export function CrashlyticsTestPanel() {
  const [message, setMessage] = useState('');
  const debugApp = process.env.NEXT_PUBLIC_TEST_MODE !== 'false';

  if (!debugApp || !Capacitor.isNativePlatform() || !isAnalyticsEnabled()) {
    return null;
  }

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <section className="space-y-3 rounded-2xl border border-rose-900/60 bg-rose-950/20 p-5">
      <div>
        <h2 className="text-sm font-medium text-rose-100">Crashlytics</h2>
        <p className="mt-1 text-xs text-slate-400">
          Test mode only — verify Crashlytics in Firebase Console. The fatal test
          will close the app immediately.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-medium text-white hover:bg-rose-600"
          onClick={() => {
            showMessage('Sending fatal test crash…');
            crashlyticsService.testCrash();
          }}
        >
          Test fatal crash
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
          onClick={() => {
            void crashlyticsService.testNonFatalError().then(() => {
              showMessage('Non-fatal error recorded.');
            });
          }}
        >
          Test non-fatal error
        </button>
      </div>

      {message ? <p className="text-xs text-amber-300">{message}</p> : null}
    </section>
  );
}
