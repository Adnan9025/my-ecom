import { motion } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headphones,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: Truck,
    title: "Free Worldwide Shipping",
    description:
      "Fast and secure delivery on all qualifying orders with real-time tracking.",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Protected checkout using trusted payment gateways with advanced encryption.",
  },
  {
    id: 3,
    icon: RefreshCcw,
    title: "30-Day Returns",
    description:
      "Easy returns and hassle-free exchanges because customer satisfaction comes first.",
  },
  {
    id: 4,
    icon: Headphones,
    title: "24/7 Premium Support",
    description:
      "Our support specialists are always available whenever you need assistance.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            Why Choose Luxora
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Shopping Made Better
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-500">
            We combine premium products, trusted service, and exceptional customer
            care to create an effortless shopping experience.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{
                  duration: .5,
                  delay: index * .1,
                }}
                className="group bg-slate-50 hover:bg-indigo-600 rounded-3xl p-8 transition-all duration-300 shadow-sm hover:shadow-2xl"
              >

                <div className="w-16 h-16 rounded-2xl bg-indigo-100 group-hover:bg-white flex items-center justify-center transition">

                  <Icon
                    size={30}
                    className="text-indigo-600"
                  />

                </div>

                <h3 className="mt-8 text-2xl font-bold text-slate-900 group-hover:text-white transition">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-500 group-hover:text-indigo-100 transition">
                  {feature.description}
                </p>

              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}