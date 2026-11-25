import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { Sparkles, X } from 'lucide-react';

export const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    settingsService.getSettings().then(settings => {
      if (settings?.announcementActive !== false && settings?.announcementMessage) {
        setAnnouncement(settings.announcementMessage);
      } else {
        setAnnouncement('✨ Complimentary Luxury Perfume Sampler on all orders above ₹2,499 | Free Express Shipping across India');
      }
    });
  }, []);

  if (!visible || !announcement) return null;

  return (
    <aside aria-label="Store Announcement" className="bg-[#050811] text-slate-200 border-b border-blue-900/40 py-2 px-4 text-xs transition-all relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse hidden sm:inline" />
          <span className="text-slate-300">{announcement}</span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 transition ml-2 shrink-0"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
