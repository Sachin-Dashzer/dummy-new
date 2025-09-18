import "./globals.css";  // 👈 this line is missing in your code

export const metadata = { title: "Clinic CRM" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
