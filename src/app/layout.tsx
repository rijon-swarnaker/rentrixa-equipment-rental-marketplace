import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import FooTerPage from "@/components/shared/FooTer";
import { NavBerPage } from "@/components/shared/NavBer";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rentrixа | Rent Heavy Equipment & Machinery",
  description:
    "Rentrixа is a rental platform for heavy equipment — excavators, bulldozers, cranes and more, from trusted suppliers.",
};

// Applies the stored/system theme before hydration to prevent a flash of the wrong theme.
const themeInitScript = `(function(){try{var t=localStorage.getItem("rentrixa-theme")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.dataset.theme=d?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NavBerPage />
          <main>
            {children}
          </main>
          <FooTerPage />
        </ThemeProvider>
      </body>
    </html>
  );
}
