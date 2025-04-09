import React from "react";
// import CustomerNavbar from "../CustomerNavbar/CustomerNavbar.jsx";
import CustomerFooter from "../CustomerFooter/CustomerFooter.jsx";

const Homepage = () => {
  return (
    // <div>
    //   {/* <div><CustomerNavbar /></div> */}
    //   <div className="font-sans">
    //     <section className="relative text-center bg-[url('/img/landing.png')] bg-cover bg-center py-40">
    //       <h1 className="text-6xl" style={{ fontFamily: 'Kaoly Demo, sans-serif', color: '#1C3A41' }}>

    //         The<br></br>
    //         <span className="text-green-600">Coffee</span>
    //         <br></br>Bug
    //       </h1>



    //       <button className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg">Order Now</button>
    //     </section>
    //   </div>

    //   <section className="flex px-10 py-16 items-center">
    //     <div className="w-1/2">
    //       <h2 className="text-3xl font-bold">Customization</h2>
    //       <p className="mt-4 text-gray-600">
    //         <strong>Coffee Bug</strong> believes every coffee lover deserves a cup made their way! Customize your drink with a wide range of options.
    //       </p>
    //       <button className="mt-4 px-6 py-3 bg-blue-400 text-white rounded-lg">Customize</button>
    //     </div>
    //     <div className="w-1/2">
    //       <img src="/img/Customization.png" alt="Customization" className="rounded-lg shadow-md w-full" />
    //     </div>
    //   </section>
    //   <section className="py-16 bg-gray-100 text-center">
    //     <h2 className="text-4xl font-bold text-gray-900 mb-8">Special Offers</h2>
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">

    //       {/* Offer 1 */}
    //       <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
    //         <img src="/img/CoffeeBeans.png" alt="Offer 1" className="w-full h-48 object-cover rounded-xl" />
    //         <h3 className="text-2xl font-semibold mt-4">Buy 1 Get 1 Free</h3>
    //         <p className="text-gray-600 mt-2">Enjoy our special BOGO offer on selected drinks.</p>
    //         <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition duration-300">
    //           Claim Offer
    //         </button>
    //       </div>

    //       {/* Offer 2 */}
    //       <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
    //         <img src="/img/Bakery.png" alt="Offer 2" className="w-full h-48 object-cover rounded-xl" />
    //         <h3 className="text-2xl font-semibold mt-4">20% Off All Custom Drinks</h3>
    //         <p className="text-gray-600 mt-2">Personalize your coffee and get a 20% discount!</p>
    //         <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-300">
    //           Grab Now
    //         </button>
    //       </div>

    //       {/* Offer 3 */}
    //       <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
    //         <img src="/img/Purpledrink.png" alt="Offer 3" className="w-full h-48 object-cover rounded-xl" />
    //         <h3 className="text-2xl font-semibold mt-4">Free Pastry with Large Coffee</h3>
    //         <p className="text-gray-600 mt-2">Order any large coffee and get a free pastry of your choice.</p>
    //         <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition duration-300">
    //           Order Now
    //         </button>
    //       </div>

    //     </div>
    //   </section>

    //   <CustomerFooter />

      
    // </div>
    <div className="font-sans">
      {/* Navbar */}
      {/* <header className="bg-orange-500 text-white px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Logo</div>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#" className="hover:underline">HOME</a>
          <a href="#" className="hover:underline">PRODUCT</a>
          <a href="#" className="hover:underline">CUSTOMIZATION</a>
          <a href="#" className="hover:underline">CART</a>
          <a href="#" className="hover:underline">ORDER</a>
        </nav>
      </header> */}

      {/* Hero Section */}
      <section className="relative h-[80vh] bg-cover bg-center" style={{ backgroundImage: "url('/img/landing2.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-12 text-white">
          <h1 className="text-6xl font-light leading-snug">
            The Coffee <br /> <span className="font-bold">Bug</span>
          </h1>
          <p className="mt-4 text-lg max-w-lg">
            Customize your own drink with our wide range of options and create a coffee that matches your unique taste.
          </p>
          <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded">
            Order Item
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 text-center bg-[#fdf5ee]">
        <h2 className="text-3xl text-orange-600 mb-8">Categories</h2>
        <div className="flex justify-center gap-12">
          {["Hot Coffee", "Cold Coffee", "Bakery"].map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={`../../../public/img/image/-${index + 1}.png`}
                className="w-24 h-24 rounded-full border-4 border-orange-200 mb-4"
                alt={label}
              />
              <p className="text-lg font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offer Section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl text-orange-600 mb-2">Offer</h2>
        <p className="mb-8 text-gray-700">
          We Offer up to 50% from coffee to bakery Items.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {[
            { label: "Iced Latte", discount: "50%", img: "/latte.jpg" },
            { label: "Matcha", discount: "40%", img: "/matcha.jpg" },
            { label: "Mojito", discount: "40%", img: "/mojito.jpg" },
            { label: "Pancake", discount: "10%", img: "/pancake.jpg" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <img
                src={item.img}
                className="w-full h-36 object-cover rounded-md mb-2"
                alt={item.label}
              />
              <p className="text-sm font-semibold text-orange-600">
                {item.discount} OFF
              </p>
              <p className="text-sm italic">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customize Your Own Drink Section */}
      <section className="py-16 bg-[#fdf5ee] text-center">
        <h2 className="text-2xl text-orange-600 mb-4">Customize your Own Drink</h2>
        <button className="mb-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">
          Customize
        </button>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6">
          {["/c1.jpg", "/c2.jpg", "/c3.jpg", "/c4.jpg"].map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full h-48 object-cover rounded-md"
              alt="Custom Drink"
            />
          ))}
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="py-16 text-center bg-white">
        <h2 className="text-3xl text-orange-600 mb-8">Best Seller</h2>
        <div className="flex justify-center flex-wrap gap-6 px-6">
          {["/b1.jpg", "/b2.jpg", "/b3.jpg", "/b4.jpg"].map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-40 h-40 object-cover rounded-lg shadow"
              alt="Best Seller"
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-500 text-white text-center py-4">
        © {new Date().getFullYear()} The Coffee Bug. All rights reserved.
      </footer>
    </div>
  )
}

export default Homepage;
