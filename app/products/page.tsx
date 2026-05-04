import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

const Products = () => {
  return (
    <Suspense fallback={<p>Loading products...</p>}>
      <ProductsClient />
    </Suspense>
  );
};

export default Products;
