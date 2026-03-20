import { Github, Instagram, Shirt, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-footer-bg text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-accent/20 flex items-center justify-center">
                <Shirt className="w-5 h-5 text-teal-accent" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                SmartWardrobe
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              AI-powered wardrobe management for the conscious fashionista.
              Dress smarter. Live sustainably.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://twitter.com"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Careers", "Press", "Blog"].map((item) => (
                <li key={item}>
                  <span className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Help Center",
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
              ].map((item) => (
                <li key={item}>
                  <span className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2 text-sm">
              {["Twitter / X", "Instagram", "Pinterest", "Newsletter"].map(
                (item) => (
                  <li key={item}>
                    <span className="cursor-pointer hover:text-white transition-colors">
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>
            © {year}. Built with ❤️ using{" "}
            <a
              href={utmLink}
              className="underline hover:text-white/70 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p>SmartWardrobe — Dress for the planet.</p>
        </div>
      </div>
    </footer>
  );
}
