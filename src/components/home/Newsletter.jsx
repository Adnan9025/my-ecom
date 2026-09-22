import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // TODO:
    // Connect to backend API later

    setSubscribed(true);
    setEmail("");

    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <section
  id="contact"
  className="relative overflow-hidden py-28 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700"
>

      {/* Background Blur */}

      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-pink-400 opacity-20 blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-10 md:p-16 shadow-2xl text-center"
        >

          {/* Icon */}

          <div className="w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center">

            <Mail
              className="text-indigo-600"
              size={38}
            />

          </div>

          {/* Heading */}

          <h2 className="mt-8 text-5xl font-black text-white">
            Join the Luxora Community
          </h2>

          <p className="mt-6 text-lg leading-8 text-indigo-100 max-w-3xl mx-auto">
            Subscribe to receive exclusive offers, early access to new
            collections, product launches, special discounts, and premium
            technology insights delivered directly to your inbox.
          </p>

          {/* Form */}

          {!subscribed ? (

            <form
              onSubmit={handleSubmit}
              className="mt-12 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto"
            >

              <div className="relative flex-1">

                <Mail
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 rounded-full outline-none text-slate-800 text-lg shadow-lg"
                />

              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-full font-bold transition duration-300 shadow-xl"
              >
                Subscribe
                <Send size={18} />
              </button>

            </form>

          ) : (

            <motion.div
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 inline-flex items-center gap-4 bg-green-500 text-white px-8 py-5 rounded-full text-lg font-semibold shadow-xl"
            >

              <CheckCircle size={26} />

              Thank you for subscribing!

            </motion.div>

          )}

          {/* Benefits */}

          <div className="grid md:grid-cols-3 gap-8 mt-16">

            <div>

              <h3 className="text-3xl font-black text-white">
                Weekly Deals
              </h3>

              <p className="mt-2 text-indigo-100">
                Exclusive discounts every week.
              </p>

            </div>

            <div>

              <h3 className="text-3xl font-black text-white">
                Early Access
              </h3>

              <p className="mt-2 text-indigo-100">
                Be first to discover new collections.
              </p>

            </div>

            <div>

              <h3 className="text-3xl font-black text-white">
                VIP Offers
              </h3>

              <p className="mt-2 text-indigo-100">
                Members-only promotions and rewards.
              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}