import React from 'react';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ProductList = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-1/4 pr-4 filter-section">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">
              Filters:
            </h2>
            <div className="mb-4">
              <h3 className="font-semibold">
                Refine By
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Hide out of stock
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                For Rent
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Yes (48)
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                For Sale
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Yes (20)
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                Recommended For
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Staff Picks (1)
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                Brand
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Canon (148)
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                Item Type
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Camera (148)
                </li>
                <li>
                  <input type="checkbox" />
                  Packages (1)
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                Mount
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Canon EF (37)
                </li>
                <li>
                  <input type="checkbox" />
                  Canon EF-M (2)
                </li>
                <li>
                  <input type="checkbox" />
                  Canon RF (24)
                </li>
                <li>
                  <input type="checkbox" />
                  Fixed Lens (7)
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                Camcorder Type
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Cinema (1)
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                Camera Mount
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Canon EF (14)
                </li>
                <li>
                  <input type="checkbox" />
                  Canon EF-M (3)
                </li>
                <li>
                  <input type="checkbox" />
                  Canon RF (1)
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">
                Camera Type
              </h3>
              <ul>
                <li>
                  <input type="checkbox" />
                  Cinema (1)
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-3/4 grid grid-cols-3 gap-4">
          <div className="product-card">
            <img alt="Canon EOS R6" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
                Canon EOS R6
              </Link>
            </h3>
            <p>
              $119.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>

          <div className="product-card">
            <img alt="Canon EOS R5 C Mirrorless Cinema Camera" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
              Canon EOS R5 C Mirrorless
              </Link>
            </h3>
            <p>
              $216.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>

          <div className="product-card">
            <img alt="Canon 6D Mark II" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
              Canon 6D Mark II
              </Link>
            </h3>
            <p>
              $62.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>

          <div className="product-card">
            <img alt="Canon EOS R7" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
              Canon EOS R7
              </Link>
            </h3>
            <p>
              $81.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>

          <div className="product-card">
            <img alt="Canon PowerShot G7 X Mark III (Black)" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
              Canon PowerShot G7 X Mark III
              </Link>
            </h3>
            <p>
              $74.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>

          <div className="product-card">
            <img alt="Canon EOS R" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
                Canon EOS R
              </Link>
            </h3>
            <p>
              $85.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>

          <div className="product-card">
            <img alt="Canon EOS R7" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
                Canon EOS R
              </Link>
            </h3>
            <p>
              $81.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>

          <div className="product-card">
            <img alt="Canon PowerShot G7 X Mark III (Black)" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
                Canon EOS R
              </Link>
            </h3>
            <p>
              $74.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>

          <div className="product-card">
            <img alt="Canon EOS R" src="https://placehold.co/150x150" />
            <h3 className="font-semibold">
              <Link to="/product-detail" className="text-blue-500 hover:underline">
                Canon EOS R
              </Link>
            </h3>
            <p>
              $85.00 for 7 days
            </p>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
