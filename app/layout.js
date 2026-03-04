export const metadata = {
  title: "Orbyx Dashboard",
  description: "Dashboard SaaS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
