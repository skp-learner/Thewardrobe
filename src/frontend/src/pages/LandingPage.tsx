import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronRight, Leaf, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import Footer from "../components/Footer";

interface LandingPageProps {
  navigate: (page: Page) => void;
}

const features = [
  {
    title: "Your Digital Closet",
    description:
      "Catalog every item with AI-powered image recognition. Tag by color, season, and style. Your entire wardrobe, beautifully organized.",
    image: "/assets/generated/feature-closet.dim_600x400.jpg",
    cta: "Explore Wardrobe",
    page: "wardrobe" as Page,
    icon: Sparkles,
  },
  {
    title: "Outfit of the Day",
    description:
      "Get personalized outfit suggestions powered by real-time weather data and your calendar events. Always dress right for the moment.",
    image: "/assets/generated/feature-outfit.dim_600x400.jpg",
    cta: "Plan My Outfit",
    page: "outfit" as Page,
    icon: Star,
  },
  {
    title: "Sustainability Tracker",
    description:
      "Discover which items are gathering dust and make smarter choices. Track your fashion footprint and build a capsule wardrobe you actually wear.",
    image: "/assets/generated/feature-sustainability.dim_600x400.jpg",
    cta: "Track Impact",
    page: "sustainability" as Page,
    icon: Leaf,
  },
];

const testimonials = [
  {
    quote:
      "SmartWardrobe completely changed how I think about getting dressed. The outfit suggestions are spot-on every single morning.",
    name: "Priya Sharma",
    title: "Fashion Blogger",
    initials: "PS",
  },
  {
    quote:
      "I had no idea 40% of my wardrobe was barely touched. The Sustainability Tracker helped me donate smarter and shop better.",
    name: "James O'Brien",
    title: "Minimalist Living Coach",
    initials: "JO",
  },
  {
    quote:
      "Finally an app that connects my outfit choice to the weather AND my work calendar. Game changer for busy professionals.",
    name: "Mei Lin Zhang",
    title: "Product Designer",
    initials: "MZ",
  },
];

export default function LandingPage({ navigate }: LandingPageProps) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[560px] overflow-hidden">
        <img
          src="/assets/generated/hero-wardrobe.dim_1600x900.jpg"
          alt="SmartWardrobe hero"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 bg-mint-highlight/20 text-mint-highlight border border-mint-highlight/30 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-5">
                <Sparkles className="w-3 h-3" /> AI-Powered Style
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-5">
                Your Smart
                <br />
                Wardrobe Awaits
              </h1>
              <p className="text-white/75 text-lg mb-8 leading-relaxed">
                AI-powered outfit planning that knows your clothes, your
                calendar, and your climate. Get dressed with purpose — every
                day.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("wardrobe")}
                  className="bg-mint-highlight text-foreground hover:bg-mint-highlight/80 rounded-full px-7 py-5 font-semibold text-base shadow-lg"
                  data-ocid="hero.primary_button"
                >
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("outfit")}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full px-7 py-5 font-semibold text-base backdrop-blur-sm"
                  data-ocid="hero.secondary_button"
                >
                  Today&apos;s Outfit
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              Everything You Need
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground mt-2">
              Dress Smarter, Not Harder
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full rounded-3xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden bg-muted border-0">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={feat.image}
                      alt={feat.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <feat.icon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        {feat.title}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">
                      {feat.description}
                    </p>
                    <Button
                      onClick={() => navigate(feat.page)}
                      className="w-full bg-btn-dark text-white hover:bg-btn-dark/90 rounded-full font-semibold"
                      data-ocid={`feature.${feat.page}.primary_button`}
                    >
                      {feat.cta} <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-testimonials-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Elevate Your Style, Ethically
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Thousands of conscious fashionistas are rethinking their
              relationship with clothing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full rounded-2xl shadow-xs hover:shadow-card transition-shadow bg-card border-0 p-6">
                  <CardContent className="p-0">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-4 h-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed mb-5 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-xs">
                          {t.initials}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === 0 ? "w-6 bg-primary" : "w-2 bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
