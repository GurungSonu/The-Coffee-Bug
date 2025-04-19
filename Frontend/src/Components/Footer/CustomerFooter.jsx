import React from "react";

const CustomerFooter = () => {
    return (
        <footer className="w-full bg-[#e8e2c9] py-12 px-6 relative overflow-hidden">
            <div className="container mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-24">
                {/* Logo - moved more toward center */}
                <div className="w-32 h-32 rounded-full bg-[#f5f0dc] flex items-center justify-center flex-shrink-0 md:ml-16 my-4">
                    <div className="relative w-24 h-24">
                        <img src="./img/logo.svg" alt="Coffee Bug Logo" width={160} height={160} className="object-contain" />
                    </div>
                </div>

                {/* Content - moved more to the right */}
                <div className="flex flex-col max-w-md text-center md:text-left md:ml-8">
  <h2 className="text-[#4a3520] text-4xl font-medium mb-4 whitespace-nowrap">
    Your very own taste of Coffee Bug
  </h2>
  <p className="text-[#4a3520] mb-8">
    Hello, we are ABC. trying to make an effort to put the right people for you to get the best results. Just insight
  </p>
  <div className="flex flex-col gap-2">
    <a href="tel:(123) 456-7890" className="text-[#4a3520] hover:underline">
      (123) 456-7890
    </a>
    <a href="mailto:ABC@gmail.com" className="text-[#4a3520] hover:underline">
      ABC@gmail.com
    </a>
  </div>
</div>
</div>


            {/* Decorative leaf - positioned lower */}
            <div className="absolute right-0 bottom-[-96px] w-96 h-96 opacity-90">
  <img
    src="./img/leaf.svg"
    alt=""
    width={370}
    height={370}
    className="object-contain"
    aria-hidden="true"
  />
</div>



        </footer>
    )
}

export default CustomerFooter
