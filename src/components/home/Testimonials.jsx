import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Customer",
    image: "https://i.pravatar.cc/150?img=32",
    review:
      "Luxora completely exceeded my expectations. The product quality is exceptional, shipping was incredibly fast, and the customer service was outstanding.",
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "Tech Enthusiast",
    image: "https://i.pravatar.cc/150?img=12",
    review:
      "I've purchased electronics from many online stores, but Luxora stands out. Premium products, beautiful packaging, and a flawless shopping experience.",
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Premium Member",
    image: "https://i.pravatar.cc/150?img=48",
    review:
      "Everything feels premium—from the website to the delivery. I highly recommend Luxora to anyone looking for quality electronics.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="text-center mb-16"
        >

          <span className="inline-block px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            Testimonials
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Loved by Thousands of Customers
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-500">
            Our customers trust Luxora for premium quality, outstanding
            service, and an unforgettable shopping experience.
          </p>

        </motion.div>

        {/* Cards */}

        <div className="grid gap-8 lg:grid-cols-3">

          {testimonials.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              viewport={{ once: true }}
              transition={{
                duration: .5,
                delay: index * .15,
              }}
              className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8"
            >

              {/* Quote */}

              <div className="absolute top-6 right-8 text-7xl font-black text-indigo-100">
                "
              </div>

              {/* Stars */}

              <div className="flex gap-1 mb-6">

                {[...Array(5)].map((_, i) => (

                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                ))}

              </div>

              {/* Review */}

              <p className="text-slate-600 leading-8 text-lg relative z-10">
                {item.review}
              </p>

              {/* Customer */}

              <div className="flex items-center mt-8">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-indigo-100"
                />

                <div className="ml-4">

                  <h4 className="text-lg font-bold text-slate-900">
                    {item.name}
                  </h4>

                  <p className="text-slate-500">
                    {item.role}
                  </p>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}