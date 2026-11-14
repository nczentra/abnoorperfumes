import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-ivory text-brand-charcoal">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
