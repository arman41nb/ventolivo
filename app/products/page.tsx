import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      <section className="px-[2.5rem] py-[4rem]">
        <div className="mb-[2.5rem]">
          <p className="text-[11px] tracking-[2px] uppercase text-olive mb-[0.8rem]">
            Full Range
          </p>
          <h1 className="font-serif text-[48px] text-dark leading-[1.1]">
            All Products
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
