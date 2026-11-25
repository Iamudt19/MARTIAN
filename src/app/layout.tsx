import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MARTIAN 1.0 | 24-Hour Hackathon Mission Control',
  description:
    'MARTIAN 1.0: Mars — Agentic AI for a Smarter Campus Hackathon by BMSITM & CSE Division 4. Universal 24-hour countdown, Event Flow & Rulebook.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#FBF4EC] text-[#2E140B] antialiased selection:bg-[#C84B1E]/20 selection:text-[#2E140B]">
        {children}
      </body>
    </html>
  );
}
