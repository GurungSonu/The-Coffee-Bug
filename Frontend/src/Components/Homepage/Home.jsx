import React from "react";
import CustomerFooter from "../Footer/CustomerFooter";

export const Home = () => {
    return (
       
            <div className="bg-[#f5f3e6] flex flex-row justify-center w-full">
              <div className="bg-[#f5f3e6] overflow-hidden w-full max-w-[1440px] relative">
                {/* Hero Section */}
                <div className="px-12 py-16 md:py-24 flex flex-col md:flex-row items-start justify-between relative">
                  {/* Text Content */}
                  <div className="md:w-1/2 z-10">
                    <h1 className="font-['Vastago_Grotesk'] font-bold text-[#3f3329] text-6xl md:text-7xl leading-tight mb-6 whitespace-nowrap">
                      The Coffee Bug
                    </h1>
        
                    <p className="font-['Satoshi'] text-xl md:text-2xl text-[#3f3329] leading-relaxed max-w-[500px] mb-8">
                      Customize your own drink with our wide range of options and create a coffee that matches your unique
                      taste.
                    </p>
        
                    <button className="bg-[#c49456] text-white font-['Satoshi'] px-8 py-3 rounded hover:bg-[#b38346] transition-colors">
                      ORDER ITEM
                    </button>
                  </div>
        
                  {/* Hero Image */}
                  <div className="md:w-1/2 relative">
                    <img
                      className="w-full max-w-[450px] h-auto object-contain"
                      alt="Barista with coffee"
                      src="./img/herogirl.png"
                    />
                  </div>
        
                  {/* Decorative Leaf */}
                  <img className="absolute bottom-0 left-0 w-[300px] h-auto z-0" alt="" src="./img/leaf.png" />
                </div>
        
                {/* Cafe Image Section */}
                <div className="px-12 py-16 flex justify-end">
                  <div className="relative">
                    <div className="absolute right-0 bottom-0 w-full h-[90%] bg-[#c49456] -z-10"></div>
                    <img
                      className="w-full max-w-[500px] h-auto object-cover relative z-10"
                      alt="Coffee shop interior"
                      src="./img/image.png"
                    />
                  </div>
                </div>
        
                {/* Customization Section */}
                <div className="px-12 py-16">
                  <div className="relative w-full bg-[#fbd197] flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-12 bg-[#f5f3e6] m-8">
                      <div className="flex items-center mb-6">
                        <img className="w-10 h-3 mr-4" alt="" src="/placeholder.svg" />
                        <span className="font-['Satoshi'] text-sm text-[#3f3329] uppercase tracking-wider">
                          Customize your own drink
                        </span>
                        <img className="w-10 h-3 ml-4" alt="" src="/placeholder.svg" />
                      </div>
        
                      <h2 className="font-['Vastago_Grotesk'] font-bold text-[#3f3329] text-2xl md:text-3xl mb-6">
                        Quick and Easy Customization
                      </h2>
        
                      <p className="font-['Satoshi'] text-lg text-[#3f3329] mb-10">
                        Why wait in a line when you can secure your spot ahead of time? Customize your Drink with just a few
                        clicks and enjoy a seamless Coffee.
                      </p>
        
                      <button className="bg-[#c49456] text-white font-['Satoshi'] px-8 py-3 flex items-center hover:bg-[#b38346] transition-colors">
                        CUSTOMIZE
                        <svg className="ml-2 w-6 h-3" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M23.5303 6.53033C23.8232 6.23744 23.8232 5.76256 23.5303 5.46967L18.7574 0.696699C18.4645 0.403806 17.9896 0.403806 17.6967 0.696699C17.4038 0.989593 17.4038 1.46447 17.6967 1.75736L21.9393 6L17.6967 10.2426C17.4038 10.5355 17.4038 11.0104 17.6967 11.3033C17.9896 11.5962 18.4645 11.5962 18.7574 11.3033L23.5303 6.53033ZM0 6.75H23V5.25H0V6.75Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
        
                    <div className="md:w-1/2">
                      <img className="w-full h-full object-cover" alt="Coffee customization" src="./img/image.png" />
                    </div>
                  </div>
                </div>
        
                {/* Categories Section */}
                <div className="px-12 py-8">
                  <div className="flex items-center mb-12">
                    <h2 className="font-['Vastago_Grotesk'] font-bold text-[#3f3329] text-3xl">CATEGORIES</h2>
                    <div className="h-[1px] bg-[#3f3329] opacity-50 flex-grow ml-6"></div>
                  </div>
        
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Hot Coffee */}
                    <div className="border border-[#3f3329] border-opacity-50">
                      <img className="w-full h-[300px] object-cover" alt="Hot Coffee" src="./img/hot.png" />
                      <div className="p-6">
                        <h3 className="font-['Satoshi'] font-bold text-2xl mb-2">Hot Coffee</h3>
                        <p className="font-['Satoshi'] text-base">Prepared from roasted beans that have been ground up.</p>
                      </div>
                    </div>
        
                    {/* Cold Coffee */}
                    <div className="border border-[#3f3329] border-opacity-50">
                      <img className="w-full h-[300px] object-cover" alt="Cold Coffee" src="./img/cold.png" />
                      <div className="p-6">
                        <h3 className="font-['Satoshi'] font-bold text-2xl mb-2">Cold Coffee</h3>
                        <p className="font-['Satoshi'] text-base">
                          Made using cold water, cold brew coffee has a flavor unlike any other kind of coffee
                        </p>
                      </div>
                    </div>
        
                    {/* Bakery */}
                    <div className="border border-[#3f3329] border-opacity-50">
                      <img className="w-full h-[300px] object-cover" alt="Bakery" src="./img/Bakery.png" />
                      <div className="p-6">
                        <h3 className="font-['Satoshi'] font-bold text-2xl mb-2">Bakery</h3>
                        <p className="font-['Satoshi'] text-base">
                          Flour-based baked goods made in an oven such as bread, cookies, cakes, doughnuts, bagels, pastries,
                          and pies
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Best Sellers Section */}
                <div className="px-12 py-8 mb-16">
                  <div className="flex items-center mb-12">
                    <h2 className="font-['Vastago_Grotesk'] font-bold text-[#3f3329] text-3xl">BEST SELLERS</h2>
                    <div className="h-[1px] bg-[#3f3329] opacity-50 flex-grow ml-6"></div>
                  </div>
        
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Best Seller 1 */}
                    <div className="relative">
                      <div className="absolute w-full h-[95%] bottom-0 bg-[#c49456] z-0"></div>
                      <img className="w-full h-[300px] object-cover relative z-10" alt="Best Seller 1" src="./img/1.png" />
                    </div>
        
                    {/* Best Seller 2 */}
                    <div className="relative">
                      <div className="absolute w-full h-[95%] bottom-0 bg-[#c49456] z-0"></div>
                      <img className="w-full h-[300px] object-cover relative z-10" alt="Best Seller 2" src="./img/2.png" />
                    </div>
        
                    {/* Best Seller 3 */}
                    <div className="relative">
                      <div className="absolute w-full h-[95%] bottom-0 bg-[#c49456] z-0"></div>
                      <img className="w-full h-[300px] object-cover relative z-10" alt="Best Seller 3" src="./img/3.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        
       
        
        
    