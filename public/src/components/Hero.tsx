import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="hero min-h-screen bg-base-200" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1565514020176-db71f6772b7d?w=1920&q=80)' }}>
      <div className="hero-overlay bg-opacity-70 bg-black"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold text-white drop-shadow-lg">
            Expertise You Trust. Wealth You Deserve.
          </h1>
          <p className="mb-8 text-xl text-gray-200">
            Building lasting wealth through expert financial guidance and personalized investment strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary bg-amber-600 border-amber-600 hover:bg-amber-700 hover:border-amber-700 text-white">
              Take Investor DNA Quiz
              <ArrowRight className="ml-2" size={18} />
            </button>
            <button className="btn btn-outline text-white border-white hover:bg-white hover:text-black">
              Client Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
