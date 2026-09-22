import Hero from "../components/home/Hero";
import Catagories from "../components/home/Catagories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Features from "../components/home/Features";
import Statistics from "../components/home/Statistics";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Catagories />
      <FeaturedProducts />
      <Features />
      <Statistics />
      <Testimonials />
      <Newsletter />
    </>
  );
}