"use client";

import Image from "next/image";

export default function AnotherDesign({ data }) {
  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col lg:flex-row items-center lg:gap-20 gap-5">
        {/* Left - Image with decorations */}
        <div className="relative w-full max-w-xl">
          <div className="relative z-10 rounded-lg overflow-hidden">
            <Image
              src={data.mainImage}
              alt="Main visual"
              width={600}
              height={800}
              className="rounded-xl lg:h-140 md:h-100 h-80 w-full lg:pl-10 object-cover"
            />
          </div>
        </div>

        {/* Right - Text */}
        <div className="w-full max-w-5xl text-center lg:text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {data.title}
          </h2>
          <p className="text-gray-600 mb-6">{data.description}</p>

          <div className="card-container mb-6">
            <div className="animated-border"></div>
            <div className="card-content flex flex-col items-center lg:flex-row lg:items-start md:flex-row md:items-start gap-4">
              {data.cardImage && (
                <Image
                  src={data.cardImage}
                  alt="Card visual"
                  width={150}
                  height={150}
                  className="hidden lg:block md:block rounded-md object-cover"
                />
              )}
              <p className="text-sm text-white">{data.cardText}</p>
            </div>
          </div>
           <style jsx>
            {`
            .card-container {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
}
.animated-border {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(360deg, #669933, #669933);
  transform: translate(-50%, -50%) rotate(0deg);
  animation: rotBGimg 6s linear infinite;
  will-change: transform;
  z-index: 0;
  border-radius: 50%;
}

.card-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 5px;
  border-radius: 8px;
  background: #07182E;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  padding: 20px;
  gap: 10px;
}

.card-content h2 {
  color: white;
  font-size: 2em;
  text-align: center;
}`}
          </style>

          {/* Bullet points */}
          <ul className="space-y-2 text-gray-800 font-semibold lg:mb-6">
            {data.bullets?.map((item, index) => (
              <li key={index} className="flex items-center gap-2 md:justify-center">
                <span className="text-[#669933]">✔</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
