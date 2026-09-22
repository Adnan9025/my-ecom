import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Globe2,
  Award,
} from "lucide-react";

const stats = [
  {
    id: 1,
    icon: ShoppingBag,
    value: "10K+",
    title: "Premium Products",
    description:
      "Luxury electronics and accessories from trusted brands.",
  },
  {
    id: 2,
    icon: Users,
    value: "50K+",
    title: "Happy Customers",
    description:
      "Customers who trust Luxora for quality and reliability.",
  },
  {
    id: 3,
    icon: Globe2,
    value: "120+",
    title: "Countries Served",
    description:
      "Fast worldwide delivery with secure international shipping.",
  },
  {
    id: 4,
    icon: Award,
    value: "99%",
    title: "Customer Satisfaction",
    description:
      "Exceptional shopping experience backed by premium support.",
  },
];

export default function Statistics() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">

      {/* Background Glow */}

      <div className="absolute -top-32 left-0 w-96 h-96 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-white/10 text-indigo-200 font-semibold">
            Our Achievement
          </span>

          <h2 className="mt-6 text-5xl font-black text-white">
            Trusted Around The World
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
            Luxora continues to grow by delivering premium products,
            exceptional customer service, and an unforgettable shopping
            experience.
          </p>
        </motion.div>

        {/* Statistics */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: .5,
                  delay: index * .1,
                }}
                className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl p-8 shadow-2xl"
              >

                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">

                  <Icon
                    size={30}
                    className="text-white"
                  />

                </div>

                <h3 className="mt-8 text-5xl font-black text-white">
                  {item.value}
                </h3>

                <h4 className="mt-4 text-xl font-bold text-white">
                  {item.title}
                </h4>

                <p className="mt-4 leading-7 text-slate-300">
                  {item.description}
                </p>

              </motion.div>

            );

          })}

        </div>

      </div>

    </section>
  );
}