import "./globals.css";

export const metadata = {
  title: "काठkuni OS",
  description: "Hospitality dashboard for Kath Kuni Cafe & Stay, Shangarh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream-50 text-walnut-700 antialiased">
        {children}
      </body>
    </html>
  );
}
