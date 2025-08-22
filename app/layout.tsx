import './globals.css'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Fun_Provider } from './Store/Context';
import ClientWrapper from './ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuizWiz',
  description: 'Online Quiz App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Fun_Provider>
          <ClientWrapper>{children}</ClientWrapper>
        </Fun_Provider>
      </body>
    </html>
  );
}
