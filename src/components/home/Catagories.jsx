import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import catagoriesImage from "../../assets/images/catagories/catagory.png";
import Lightbox from "../ui/Lightbox.jsx";

const catagories = [
  {
    id: 1,
    name: "Laptops",
    image: catagoriesImage,
    products: "120+ Products",
    link: "/products?catagory=laptops",
  },
  {
    id: 2,
    name: "Smartphones",
    image: catagoriesImage,
    products: "95+ Products",
    link: "/products?catagory=phones",
  },
  {
    id: 3,
    name: "Smart Watches",
    image: catagoriesImage,
    products: "80+ Products",
    link: "/products?catagory=watches",
  },
  {
    id: 4,
    name: "Headphones",
    image: catagoriesImage,
    products: "150+ Products",
    link: "/products?catagory=headphones",
  },
];

export default function Catagories() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="py-24 bg-white">
      <Lightbox
        image={selectedImage}
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            Shop by Category
          </span>
          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Explore Our Collections
          </h2>
          <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
            Browse carefully curated collections designed for professionals,
            creators, gamers, and everyday technology lovers.
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {catagories.map((catagory, index) => (
            <motion.div
              key={catagory.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="relative rounded-3xl overflow-hidden group shadow-lg"
            >
              <img
                src={catagory.image}
                alt={catagory.name}
                className="w-full h-[420px] object-cover transition duration-700 group-hover:scale-110 cursor-pointer"
                onClick={() => setSelectedImage(catagory.image)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-indigo-300 font-medium">
                  {catagory.products}
                </p>
                <h3 className="text-3xl font-black text-white mt-2">
                  {catagory.name}
                </h3>
                <Link
                  to={catagory.link}
                  className="inline-block mt-6 px-6 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-indigo-600 hover:text-white transition"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}