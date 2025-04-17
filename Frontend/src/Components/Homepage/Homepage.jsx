import React from 'react';
import { Link } from 'react-router-dom';
// import { ShoppingBag } from 'lucide-react';

const Homepage = () => {
  return (
    <div className="bg-[#f8f3e3] text-[#3c2a21] font-sans min-h-screen">
      {/* Header */}
      {/* <header className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="w-16">
            <img src="/img/logo.png" alt="Coffee Bug Logo" className="w-full" />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#3c3c3c] font-medium">Home</Link>
            <Link to="/product" className="text-[#3c3c3c] font-medium">Product</Link>
            <Link to="/customization" className="text-[#3c3c3c] font-medium">Customization</Link>
            <Link to="/order" className="text-[#3c3c3c] font-medium">Order</Link>
            <Link to="/cart" className="text-[#3c3c3c] font-medium">Cart</Link>
          </nav>
          <div className="w-8 h-8 relative">
            <ShoppingBag className="text-[#3c3c3c]" />
            <span className="absolute -top-1 -right-1 bg-[#cd7f32] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 flex flex-col justify-center">
            <h1 className="text-8xl md:text-8xl font-bold text-[#3c2a21] mb-6">
              The Coffee <br /> Bug
            </h1>
            <p className="text-[#5c5c5c] mb-10 max-w-md">
              Customize your own drink with our wide range of options and create a coffee that matches your unique taste.
            </p>
            <div>
              <button className="bg-[#cd7f32] text-white px-6 py-3 rounded hover:bg-[#b26e2a] transition-colors">
                ORDER ITEM
              </button>
            </div>
            <div className="mt-12">
              <img src="/img/leaf.png" alt="Coffee Leaf Illustration" className="w-36" />
            </div>
          </div>
          <div className="md:w-1/2 relative mt-8 md:mt-0">
            {/* Fixed positioning of the barista illustration */}
            <div className="absolute -top-10 right-0 z-14">
              <img src="/img/herogirl.png" alt="Barista Illustration" className="w-50" />
            </div>
            <div className="mt-60">
              <img 
                src="/img/image.png" 
                alt="Coffee Shop Interior" 
                className="rounded-md object-cover w-full h-[250px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Customization Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-[#f9d5a7] rounded-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[#f5f5f5] p-8 flex flex-col justify-center items-center">
              <div className="flex items-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M19 12H5" stroke="#3c3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="#3c3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm text-[#3c3c3c] uppercase tracking-wider">CUSTOMIZE YOUR OWN DRINK</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                  <path d="M5 12H19" stroke="#3c3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="#3c3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#3c2a21] mb-4 text-center">
                Quick and Easy Customization
              </h2>
              <p className="text-[#5c5c5c] text-center mb-6 max-w-sm">
                Why wait in a line when you can secure your spot ahead of time? Customize your Drink with just a few clicks and enjoy a seamless Coffee.
              </p>
              <Link 
                to="/customization" 
                className="bg-[#cd7f32] text-white px-6 py-2 rounded flex items-center hover:bg-[#b26e2a] transition-colors"
              >
                CUSTOMIZE
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                  <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div>
              <img 
                src="/img/coffee-customization.jpg" 
                alt="Coffee Customization" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#3c2a21] uppercase tracking-wider">CATEGORIES</h2>
          <div className="h-px bg-[#3c2a21] mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="mb-4 h-48 overflow-hidden rounded-md">
              <img 
                src="/img/hot-coffee.jpg" 
                alt="Hot Coffee" 
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-[#3c2a21] mb-2">Hot Coffee</h3>
            <p className="text-sm text-[#5c5c5c]">
              Prepared from roasted beans that have been ground up.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="mb-4 h-48 overflow-hidden rounded-md">
              <img 
                src="/img/cold-coffee.jpg" 
                alt="Cold Coffee" 
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-[#3c2a21] mb-2">Cold Coffee</h3>
            <p className="text-sm text-[#5c5c5c]">
              Made using cold water, cold brew coffee has a flavor unlike any other kind of coffee.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="mb-4 h-48 overflow-hidden rounded-md">
              <img 
                src="/img/bakery.jpg" 
                alt="Bakery" 
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-[#3c2a21] mb-2">Bakery</h3>
            <p className="text-sm text-[#5c5c5c]">
              Flour-based baked goods made in an oven such as bread, cookies, cakes, doughnuts, bagels, pastries, and pies.
            </p>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#3c2a21] uppercase tracking-wider">BEST SELLERS</h2>
          <div className="h-px bg-[#3c2a21] mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="overflow-hidden rounded-md h-32 md:h-40">
            <img 
              src="/img/seller1.jpg" 
              alt="Iced Coffee" 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="overflow-hidden rounded-md h-32 md:h-40">
            <img 
              src="/img/seller2.jpg" 
              alt="Matcha Latte" 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="overflow-hidden rounded-md h-32 md:h-40">
            <img 
              src="/img/seller3.jpg" 
              alt="Cake" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#e8dbc5] py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center md:justify-start">
              <div className="w-24 h-24 bg-[#f8f3e3] rounded-full flex items-center justify-center">
                <img 
                  src="/img/logo.png" 
                  alt="Coffee Bug Logo" 
                  className="w-14"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#3c2a21] mb-4">Your very own taste of Coffee Bug</h3>
              <p className="text-[#5c5c5c] mb-4">
                Hello, we are ABC, trying to make an effort to put the right people for you to get the best results. Just enjoy!
              </p>
              <p className="text-[#5c5c5c] mb-1">(123) 456-7890</p>
              <p className="text-[#5c5c5c]">ABC@email.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;