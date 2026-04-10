import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/auth/auth-provider";
import { AppFrame } from "@/components/app-frame";
import { I18nProvider } from "@/i18n/i18n-provider";
import { NotesProvider } from "@/notes/notes-provider";
import { ThemeProvider } from "@/theme/theme-provider";
import "./globals.css";

const themeInitScript = `
  (function () {
    try {
      var savedTheme = localStorage.getItem("need-to-buy-theme");
      var theme = savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = "light";
      document.documentElement.style.colorScheme = "light";
    }
  })();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Need to Buy",
  description: "Simple shared shopping notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <NotesProvider>
                <AppFrame>{children}</AppFrame>
              </NotesProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
