import { BarChart3, Landmark, TrendingUp, Wallet } from "lucide-react";

const services = [
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "PMS",
    description: "Professional Portfolio Management Services tailored to your investment goals.",
  },
  {
    icon: <Landmark className="w-8 h-8" />,
    title: "AIF",
    description: "Alternative Investment Funds for diversified portfolio exposure.",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Mutual Funds",
    description: "Expert guidance on mutual fund investments across diverse schemes.",
  },
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Equity",
    description: "Strategic equity research and investment opportunities.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-amber-500">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body items-center text-center">
                <div className="text-primary mb-4">{service.icon}</div>
                <h3 className="card-title text-xl">{service.title}</h3>
                <p className="text-base-content/70">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
