import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Audit OS",
  description: "Outbound lead generation and local business audit platform for salons, med spas, and aesthetic clinics."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div>
              <p className="eyebrow">Lead Audit OS</p>
              <h1>Local business research, audits, and outreach in one workflow</h1>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
