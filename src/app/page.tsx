'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; generatedImageUrl?: string; message?: string } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Product data for POD section with Printful integration
  const products = [
    {
      id: 1,
      name: "Canvas Print",
      description: "High-quality canvas print",
      price: "$29.99",
      mockupType: "canvas",
      printfulProductId: "71", // Canvas Print product ID
      printfulVariantId: "1001" // 16x20 canvas variant
    },
    {
      id: 2,
      name: "Ceramic Mug",
      description: "Dishwasher safe ceramic mug",
      price: "$14.99",
      mockupType: "mug",
      printfulProductId: "1", // Mug product ID
      printfulVariantId: "4011" // 11oz ceramic mug
    },
    {
      id: 3,
      name: "Throw Cushion",
      description: "Soft cotton cushion cover",
      price: "$19.99",
      mockupType: "cushion",
      printfulProductId: "18", // Cushion product ID
      printfulVariantId: "2001" // 18x18 cushion
    },
    {
      id: 4,
      name: "Photo Frame",
      description: "Elegant wooden frame",
      price: "$24.99",
      mockupType: "frame",
      printfulProductId: "71", // Photo frame product ID
      printfulVariantId: "1002" // 8x10 frame
    },
    {
      id: 5,
      name: "T-Shirt",
      description: "100% cotton t-shirt",
      price: "$22.99",
      mockupType: "tshirt",
      printfulProductId: "71", // T-shirt product ID
      printfulVariantId: "1003" // Unisex t-shirt
    },
    {
      id: 6,
      name: "Phone Case",
      description: "Protective phone case",
      price: "$16.99",
      mockupType: "phone",
      printfulProductId: "71", // Phone case product ID
      printfulVariantId: "1004" // iPhone case
    },
    {
      id: 7,
      name: "Poster Print",
      description: "High-quality poster print",
      price: "$12.99",
      mockupType: "poster",
      printfulProductId: "71", // Poster product ID
      printfulVariantId: "1005" // 12x18 poster
    },
    {
      id: 8,
      name: "Throw Blanket",
      description: "Soft fleece blanket",
      price: "$34.99",
      mockupType: "blanket",
      printfulProductId: "71", // Blanket product ID
      printfulVariantId: "1006" // 50x60 blanket
    }
  ];

  const totalSlides = Math.ceil(products.length / 3);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleOrder = async (product: { printfulProductId: string; printfulVariantId: string; name: string; price: string }) => {
    if (!result?.generatedImageUrl) return;
    
    try {
      const response = await fetch('/api/printful', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.printfulProductId,
          variantId: product.printfulVariantId,
          imageUrl: result.generatedImageUrl,
          quantity: 1
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        alert(`Order created successfully! Order ID: ${data.order.id}`);
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to create order. Please try again.');
    }
  };

  const renderMockup = (mockupType: string, imageUrl: string) => {
    switch (mockupType) {
      case 'mug':
        return (
          <div className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center">
            <div className="w-24 h-32 bg-gray-200 rounded-lg relative overflow-hidden">
              <Image
                src={imageUrl}
                alt="Mug mockup"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        );
      case 'tshirt':
        return (
          <div className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center">
            <div className="w-20 h-24 bg-gray-200 rounded-lg relative overflow-hidden">
              <Image
                src={imageUrl}
                alt="T-shirt mockup"
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        );
      case 'phone':
        return (
          <div className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center">
            <div className="w-16 h-28 bg-gray-200 rounded-lg relative overflow-hidden">
              <Image
                src={imageUrl}
                alt="Phone case mockup"
                width={60}
                height={60}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        );
      case 'frame':
        return (
          <div className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden">
            <Image
              src={imageUrl}
              alt="Photo frame mockup"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-2 border-4 border-white rounded-lg shadow-inner"></div>
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-gray-100 rounded-lg relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={`${mockupType} mockup`}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 border-2 border-gray-300 rounded-lg"></div>
          </div>
        );
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photo1 || !photo2 || !prompt.trim()) {
      alert('Please upload both photos and enter a prompt');
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Scroll to the output section
    setTimeout(() => {
      const outputSection = document.getElementById('output-section');
      if (outputSection) {
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    const formData = new FormData();
    formData.append('photo1', photo1);
    formData.append('photo2', photo2);
    formData.append('prompt', prompt);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        status: 'error',
        message: 'Failed to generate image. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-gradient">
      {/* Header */}
      <header className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Memory Merge AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column - Form */}
            <div className="space-y-8">
              {/* Headlines */}
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  Bring Your Memories to Life
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Upload two photos and instantly create a natural, photorealistic image with your loved one.
                </p>
              </div>

              {/* Form */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Upload Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Your Photo */}
                  <div>
                    <label htmlFor="photo1" className="block text-sm font-semibold text-gray-700 mb-4">
                      Upload Photo of Yourself
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, setPhoto1)}
                        className="hidden"
                        id="photo1"
                        name="photo1"
                      />
                      <label htmlFor="photo1" className="cursor-pointer block">
                        {photo1 ? (
                          <div className="space-y-3">
                            <Image
                              src={URL.createObjectURL(photo1)}
                              alt="Your photo preview"
                              width={80}
                              height={80}
                              className="mx-auto rounded-lg object-cover"
                            />
                            <p className="text-sm text-gray-600 truncate">{photo1.name}</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="text-4xl text-gray-400">📷</div>
                            <p className="text-gray-500 text-sm">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Relative's Photo */}
                  <div>
                    <label htmlFor="photo2" className="block text-sm font-semibold text-gray-700 mb-4">
                      Upload Photo of Relative
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, setPhoto2)}
                        className="hidden"
                        id="photo2"
                        name="photo2"
                      />
                      <label htmlFor="photo2" className="cursor-pointer block">
                        {photo2 ? (
                          <div className="space-y-3">
        <Image
                              src={URL.createObjectURL(photo2)}
                              alt="Relative's photo preview"
                              width={80}
                              height={80}
                              className="mx-auto rounded-lg object-cover"
                            />
                            <p className="text-sm text-gray-600 truncate">{photo2.name}</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="text-4xl text-gray-400">👤</div>
                            <p className="text-gray-500 text-sm">Click to upload</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  </div>

                  {/* Text Input */}
                  <div>
                    <label htmlFor="scene-description" className="block text-sm font-semibold text-gray-700 mb-4">
                      Describe your scene
                    </label>
                    <input
                      id="scene-description"
                      name="scene-description"
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your scene (location, time period, activity, weather)"
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700 placeholder-gray-400 hover:border-orange-300 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !photo1 || !photo2 || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    {isLoading ? 'Generating Memory...' : 'Generate My Memory'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Simple Preview */}
            <div className="flex justify-end items-start">
              <div className="w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="relative">
                    <div className="w-full h-[600px] bg-gray-200 relative overflow-hidden rounded-2xl">
                        <Image
                          src="/assets/images/Preview%201.jpeg"
                          alt="Example family portrait"
                          width={400}
                          height={600}
                          className="w-full h-full object-cover"
                        />
                      <div className="absolute top-4 right-4">
                        <div className="bg-white bg-opacity-90 rounded-full px-3 py-1">
                          <p className="text-xs text-gray-700 font-medium">Example</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Output Section - Below the main fold */}
      {(isLoading || result) && (
        <section id="output-section" className="px-6 py-12 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Generated Memory</h2>
              <p className="text-gray-600">Here&apos;s your AI-generated family memory</p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                {isLoading ? (
                  // Loading State
                  <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                    <div className="space-y-6">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
                      <h3 className="text-xl font-semibold text-gray-900">Generating your memory...</h3>
                      <p className="text-gray-600">This may take a few moments</p>
                    </div>
                  </div>
                ) : result && result.status === 'success' && result.generatedImageUrl ? (
                  // Generated Result
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="relative">
                      <div 
                        className="w-full h-[70vh] md:h-[80vh] lg:h-[85vh] flex items-center justify-center bg-gray-100 select-none"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      >
                        <Image
                          src={result.generatedImageUrl}
                          alt="Generated memory"
                          width={1200}
                          height={900}
                          className="w-full h-full object-contain select-none pointer-events-none"
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-black bg-opacity-60 rounded-lg px-4 py-2">
                          <p className="text-white text-sm font-medium">Your Generated Memory</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-0">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(result.generatedImageUrl!);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'memory-photo.jpg';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error('Download failed:', error);
                            // Fallback to direct link
                            const link = document.createElement('a');
                            link.href = result.generatedImageUrl!;
                            link.download = 'memory-photo.jpg';
                            link.target = '_blank';
                            link.click();
                          }
                        }}
                        className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 px-6 rounded-b-2xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
                      >
                        Download Your Memory
                      </button>
                    </div>
                  </div>
                ) : result && result.status === 'error' ? (
                  // Error State
                  <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                    <div className="space-y-6">
                      <div className="text-red-500 text-6xl">❌</div>
                      <h3 className="text-2xl font-semibold text-gray-900">Generation Failed</h3>
                      <p className="text-gray-600">{result.message}</p>
                      <button
                        onClick={() => setResult(null)}
                        className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Print-on-Demand Section */}
      {result && result.status === 'success' && result.generatedImageUrl && (
        <section className="px-6 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Turn Your Memory Into Art</h2>
              <p className="text-xl text-gray-600">Get your family memory printed on beautiful products</p>
            </div>
            
            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
                disabled={totalSlides <= 1}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
                disabled={totalSlides <= 1}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel Content */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {products.slice(slideIndex * 3, (slideIndex + 1) * 3).map((product) => (
                          <div key={product.id} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                              {renderMockup(product.mockupType, result.generatedImageUrl!)}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                            <button 
                              onClick={() => handleOrder(product)}
                              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                              Order Now - {product.price}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              {totalSlides > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}