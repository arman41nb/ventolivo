import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import Badge from "@/components/ui/Badge";
import { getAllProducts } from "@/services/products";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "All Products",
  description:
    "Browse our full range of handcrafted artisan soaps made with natural ingredients.",
  path: "/products",
});

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <>
      <Navbar />

      <section className="px-[2.5rem] py-[4rem]">
        <div className="mb-[2.5rem]">
          <Badge className="mb-[0.8rem] block">Full Range</Badge>
          <h1 className="font-serif text-[48px] text-dark leading-[1.1]">
            All Products
          </h1>
        </div>
        <ProductGrid products={products} />
      </section>

      <Footer />
    </>
  );
}
