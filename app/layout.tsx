import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthSessionProvider from "@/lib/auth/session-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shagun Khare - Journalist & Writer",
  description: "Writer and editor covering home, design, lifestyle, and culture.",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/site.webmanifest',
};

async function getProfileData() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  try {
    const profileResponse = await fetch(`${baseUrl}/api/profile`, { 
      next: { revalidate: 300 } 
    })
    
    if (profileResponse.ok) {
      const data = await profileResponse.json()
      return data.profile
    }
    
    return null
  } catch (error) {
    console.error('Error fetching profile data for layout:', error)
    return null
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfileData()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#606C38" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />
        
        {/* Preload headshot image directly (bypassing Next.js optimization) */}
        {profile?.headshotImage && (() => {
          try {
            // Parse JSON format or use as-is for legacy URLs
            const imageUrls = JSON.parse(profile.headshotImage)
            const mobileUrl = imageUrls.mobile
            const desktopUrl = imageUrls.desktop || imageUrls.fallback
            
            return (
              <>
                {mobileUrl && (
                  <link 
                    rel="preload" 
                    as="image" 
                    href={mobileUrl}
                    media="(max-width: 768px)"
                  />
                )}
                {desktopUrl && (
                  <link 
                    rel="preload" 
                    as="image" 
                    href={desktopUrl}
                    media="(min-width: 769px)"
                  />
                )}
              </>
            )
          } catch {
            // Legacy single URL format
            return (
              <link 
                rel="preload" 
                as="image" 
                href={profile.headshotImage}
              />
            )
          }
        })()}
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <AuthSessionProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer profile={profile} />
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
