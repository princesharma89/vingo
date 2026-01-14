import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";

import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import FoodCard from "./FoodCard";


function UserDashboard() {
  const {currentCity,shopInMyCity,itemsInMyCity}= useSelector((state)=>state.user);
  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (!element) return;

    setLeftButton(element.scrollLeft > 0);
    setRightButton(
      element.scrollLeft + element.clientWidth < element.scrollWidth
    );
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const element1 = cateScrollRef.current;
    const element2 = shopScrollRef.current;
    if (!element1 || !element2) return;
    updateButton(
      cateScrollRef,
      setShowLeftCateButton,
      setShowRightCateButton
    );
    updateButton(
      shopScrollRef,
      setShowLeftShopButton,
      setShowRightShopButton
    );


    const handleScrollCate = () => {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton
      );
    };
    const handleScrollShop = () => {
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      );
    }

    element1.addEventListener("scroll", handleScrollCate);
    element2.addEventListener("scroll", handleScrollShop);
    return () => {
      element1.removeEventListener("scroll", handleScrollCate);
      element2.removeEventListener("scroll", handleScrollShop);
    };
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />
    {/* categories scroll */}
      <div className="w-full max-w-4xl flex flex-col gap-5 items-start p-[10px] left-0">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>

        <div className="w-full relative">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e6452h-8] z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={cateScrollRef}
          >
            {categories.map((cat, index) => (
              <CategoryCard key={index} name={cat.category} image={cat.image} />
            ))}
          </div>

          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e6452h-8] z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>
      {/* shop in my city scroll */}
      <div className="w-full max-w-4xl flex flex-col gap-5 items-start p-[10px] left-0">
          <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {currentCity}
        </h1>
         <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e6452h-8] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={shopScrollRef}
          >
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard key={index} name={shop.name} image={shop.image} />
            ))}
          </div>

          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e6452h-8] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>
      <div className="w-full max-w-4xl flex flex-col gap-5 items-start p-[10px] left-0">
           <h1 className="text-gray-800 text-2xl sm:text-3xl">
              Suggested Food Items
            </h1>
            <div className="w-full flex flex-wrap gap-4  justify-center">
              {itemsInMyCity?.map((item, index) => (
                <FoodCard key={index} data={item}/>
              ))}
            </div>
      </div>
    </div>
  );
}

export default UserDashboard;
