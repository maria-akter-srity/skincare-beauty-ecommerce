import React from "react";
import Banner from "../components/Banner";
import ShopBySkinType from "../components/ShopBySkinType";
import FeaturedProducts from "../components/FeaturedProducts";
import CategoryList from "../components/CategoryList";
import Benefits from "../components/Benefits";
import Newsletter from "../components/Newsletter";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <ShopBySkinType />
      <FeaturedProducts />
      <CategoryList />
      <Benefits />
      
    </div>
  );
};

export default HomePage;
