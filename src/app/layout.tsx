import type { Metadata, Viewport } from "next";
import { Sora, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Three faces, three speakers: the product, the mentor, the machine. */
const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevTutor Bot — Mentor IA de Angular y TypeScript",
  description:
    "Pregunta sobre signals de Angular 18, rutas standalone, interoperabilidad con RxJS y genéricos de TypeScript. Cada respuesta se fundamenta en el corpus markdown indexado.",
};

export const viewport: Viewport = {
  themeColor: "#070b0f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
