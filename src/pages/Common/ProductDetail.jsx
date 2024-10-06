import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ProductDetail = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-7xl mx-auto p-4">
            <nav className="text-sm text-gray-600 mb-4">
                <a className="hover:underline cursor-pointer" onClick={() => navigate(-1)}>
                    Máy ảnh
                </a>  &gt;
                <a className="hover:underline" href="#"> Chi tiết</a>
            </nav>

            <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                <div className="lg:col-span-2 bg-white p-4 rounded shadow">
                    <h1 className="text-2xl font-bold">Canon EOS R5</h1>

                    <div className="flex items-center mb-4">
                        <div className="flex items-center text-yellow-500">
                            {[...Array(4)].map((_, i) => (
                                <i key={i} className="fas fa-star"></i>
                            ))}
                            <i className="fas fa-star-half-alt"></i>
                        </div>
                        <a className="text-blue-500 ml-2 hover:underline" href="#">400 Reviews</a>
                    </div>

                    <div className="flex flex-col sm:flex-row mb-4">
                        <img
                            alt="Canon EOS R5 camera"
                            className="w-48 h-48 object-cover mr-4 mb-4 sm:mb-0"
                            src="https://placehold.co/150x150"
                        />
                        <div>
                            <p>The Canon EOS R5 is a professional-grade full-frame mirrorless camera...</p>
                            <ul className="list-disc list-inside">
                                <li>45MP full-frame CMOS sensor</li>
                                <li>8K30 RAW and 4K120 video capture</li>
                                <li>12 fps continuous stills with a mechanical shutter</li>
                                <li>5-axis image stabilization</li>
                            </ul>
                            <a className="text-orange-500 hover:underline" href="#">Read More</a>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">Q &amp; A</h2>
                    <ul className="list-disc list-inside mb-4">
                        <li>Can D-tap power adapters be used with this camera?</li>
                        <li>Can I use my Canon EF-M mirrorless lenses on this camera?</li>
                        <li>Can I use my Canon EF mount lenses on this camera?</li>
                    </ul>

                    <h2 className="text-xl font-bold mb-2">Specifications</h2>
                    <table className="w-full mb-4">
                        <tbody>
                            <tr>
                                <td className="font-medium">Aspect Ratio</td>
                                <td>1:1, 3:2, 4:3, 16:9</td>
                            </tr>
                            <tr>
                                <td className="font-medium">Audio File Formats</td>
                                <td>AAC, Linear PCM</td>
                            </tr>
                            <tr>
                                <td className="font-medium">Audio Recording</td>
                                <td>Built-In Microphone (Stereo), External Mic Input</td>
                            </tr>
                            <tr>
                                <td className="font-medium">Autofocus Points</td>
                                <td>Phase Detection: 1053</td>
                            </tr>
                            {/* More rows... */}
                        </tbody>
                    </table>
                    <a className="text-orange-500 hover:underline" href="#">See All</a>

                    <h2 className="text-xl font-bold mt-4">Reviews</h2>
                    <a className="text-orange-500 hover:underline" href="#">See Reviews</a>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold">$175.00</span>
                        <span className="text-sm text-gray-500">/ 7 Day Rental</span>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600">Arrival Date</label>
                        <input className="w-full border rounded p-2" type="date" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600">Return Date</label>
                        <input className="w-full border rounded p-2" type="date" />
                    </div>
                    <button className="w-full bg-green-500 text-white py-2 rounded">Add To Cart</button>

                    <div className="mt-4">
                        <a className="block text-blue-500 hover:underline" href="#">Pricing Chart</a>
                        <a className="block text-blue-500 hover:underline" href="#">Shipping Rates</a>
                    </div>

                    <div className="mt-4 p-4 bg-gray-100 rounded">
                        <h3 className="text-lg font-bold mb-2">Interested in purchasing?</h3>
                        <button className="w-full bg-blue-500 text-white py-2 rounded">Learn More</button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Includes</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                            <li>Canon EOS R5</li>
                            <li>Body cap</li>
                            <li>Strap</li>
                            <li>LP-E6NH battery</li>
                            <li>LC-E6 charger</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Recommended:</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <img alt="SanDisk CFexpress 256GB" className="w-12 h-12 object-cover mr-2" src="https://placehold.co/50x50" />
                            <div>
                                <p className="text-sm">SanDisk CFexpress 256GB Extreme Pro</p>
                                <p className="text-sm text-gray-500">$21.00 / FOR 7 DAYS</p>
                            </div>
                            <button className="ml-auto bg-green-500 text-white py-1 px-2 rounded text-sm">ADD TO CART</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
