import React from "react";
import { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import "tailwindcss/tailwind.css";
import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = "http://202.157.176.100:3000";

const FormComponent = () => {
  const [countries, setCountries] = useState([]);
  const [ports, setPorts] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPort, setSelectedPort] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingPorts, setLoadingPorts] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${baseUrl}/negaras`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch countries");
        }
        setCountries(response.data);
        setLoadingCountries(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchPorts = async () => {
      if (!selectedCountry) {
        return;
      }
      setLoadingPorts(true);
      try {
        const response = await axios.get(`${baseUrl}/pelabuhans?filter={"where":{"id_negara":${selectedCountry}}}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch ports");
        }
        setPorts(response.data);
        setLoadingPorts(false);
      } catch (error) {
        console.error("Error fetching ports:", error);
        setLoadingPorts(false);
      }
    };

    fetchPorts();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedPort) {
        return;
      }
      setLoadingItems(true);
      try {
        const response = await axios.get(`${baseUrl}/barangs?filter={"where":{"id_pelabuhan":${selectedPort}}}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch items");
        }
        setItems(response.data);
        setLoadingItems(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, [selectedPort]);

  const handleCountryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCountry(selectedValue);
    setSelectedPort("");
    setSelectedItem("");
  };

  const handlePortChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedPort(selectedValue);
    setSelectedItem("");
  };

  const handleItemChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedItem(selectedValue);
    const selectedItem = items.find((item) => item.id_barang.toString() === selectedValue);
    setSelectedItem(selectedItem ? selectedItem : "");
  };

  useEffect(() => {
    const calculateTotal = () => {
      const discountedPrice = selectedItem.harga * (1 - selectedItem.diskon / 100);
      setTotal(discountedPrice);
    };

    calculateTotal();
  }, [selectedItem.harga, selectedItem.diskon]);

  const formatToRupiah = (number) => {
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);

    return formattedPrice.replace(",00", "");
  };

  const handleReset = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "This action will reset all selections. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPorts([]);
        setItems([]);
        setSelectedCountry("");
        setSelectedPort("");
        setSelectedItem("");
        setTotal(0);

        Swal.fire("Reset!", "Your selections have been reset.", "success");
      }
    });
  };

  return (
    <React.Fragment>
      <div className="wrapper min-h-screen flex items-center justify-center">
        <div className="form p-8 rounded-lg shadow-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 mt-2 mb-2">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Search Item</h2>
          <form>
            <div className="mb-2">
              <label htmlFor="country" className="block text-white text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                name="country"
                className="text-white bg-transparent mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleCountryChange}
                value={selectedCountry}
              >
                <option value="">Select Country</option>
                {loadingCountries ? (
                  <option key="loadingCountries" value="" disabled>
                    Loading...
                  </option>
                ) : (
                  countries.map((country) => (
                    <option className="text-black" key={country.id_negara} value={country.id_negara}>
                      {country.nama_negara}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="port" className="text-white block text-sm font-medium text-gray-700">
                Port
              </label>
              <select
                id="port"
                name="port"
                className="text-white bg-transparent mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handlePortChange}
                value={selectedPort}
                disabled={!selectedCountry}
              >
                <option value="">Select Port</option>
                {loadingPorts ? (
                  <option key="loadingPorts" value="" disabled>
                    Loading...
                  </option>
                ) : (
                  ports.map((port) => (
                    <option className="text-black" key={port.id_pelabuhan} value={port.id_pelabuhan}>
                      {port.nama_pelabuhan}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="port" className="text-white block text-sm font-medium">
                Items
              </label>
              <select
                id="port"
                name="port"
                className="text-white bg-transparent mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={handleItemChange}
                value={selectedItem ? selectedItem.id_barang.toString() : ""}
                disabled={!selectedPort}
              >
                <option value="">Select Item</option>
                {loadingItems ? (
                  <option key="loadingItems" value="" disabled>
                    Loading...
                  </option>
                ) : (
                  items.map((item) => (
                    <option className="text-black" key={item.id_barang} value={item.id_barang}>
                      {item.nama_barang}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="mb-2">
              <label className="text-white block text-sm font-medium text-gray-700">Description</label>
              <div className="bg-transparent mt-1 border border-gray-300 bg-white p-3 rounded-xl shadow-sm">
                <span className="text-white block">
                  {selectedItem ? selectedItem.description : <span className="text-gray-400">No item selected</span>}
                </span>
              </div>
            </div>
            <div className="mb-2">
              <span htmlFor="discount" className="text-white block text-sm font-medium">
                Discount : {!selectedItem.diskon ? "" : selectedItem.diskon + "%"}
              </span>
            </div>
            <div className="mb-2">
              <span htmlFor="price" className="text-white block text-sm font-medium text-gray-700">
                Price : {!selectedItem.harga ? "" : formatToRupiah(selectedItem.harga)}
              </span>
            </div>
            <div className="mb-2">
              <span htmlFor="total" className="text-white block text-sm font-medium text-gray-700">
                Total : {!total ? "" : formatToRupiah(total)}
              </span>
            </div>
            <div className="text-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handleReset}
                disabled={!selectedCountry}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FormComponent;
