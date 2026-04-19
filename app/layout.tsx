import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'EthoScan AI | Ethical UX Audit for the Future',
  description: 'Stop Losing User Trust. Audit Your UI for Dark Patterns in seconds with the world’s first AI-powered ethical auditor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="bg-black text-white font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
