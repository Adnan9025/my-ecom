import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import heroImage from "../../assets/images/hero/hero.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-100">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-indigo-300 blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-300 blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >

            <span className="inline-block px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold mb-6">
              ✨ Welcome to Luxora
            </span>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-slate-900">
              Premium
              <br />
              Shopping
              <br />
              Experience
            </h1>

            <p className="mt-8 text-lg text-slate-600 max-w-xl leading-8">
              Discover luxury electronics and premium accessories designed
              for people who appreciate exceptional quality,
              innovation, and timeless style.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                to="/products"
                className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition"
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="px-8 py-4 rounded-full border border-slate-300 bg-white hover:bg-slate-50 font-semibold transition"
              >
                Explore Collection
              </Link>

            </div>

            {/* Statistics */}

            <div className="grid grid-cols-3 gap-8 mt-16">

              <div>
                <h2 className="text-3xl font-bold text-indigo-600">
                  10K+
                </h2>

                <p className="text-sm mt-2">
                  Products
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-indigo-600">
                  5K+
                </h2>

                <p className="text-sm mt-2">
                  Happy Customers
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-indigo-600">
                  99%
                </h2>

                <p className="text-sm mt-2">
                  Satisfaction
                </p>
              </div>

            </div>

          </motion.div>

    {/* RIGHT CONTENT */}

<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1 }}
  className="relative flex justify-center items-center"
>

  <motion.img
    src={heroImage}
    alt="Premium Electronics"
    className="w-full max-w-xl drop-shadow-2xl"
    animate={{ y: [0, -15, 0] }}
    transition={{
      repeat: Infinity,
      duration: 4,
    }}
  />

</motion.div>

        </div>

      </div>

    </section>
  );
}