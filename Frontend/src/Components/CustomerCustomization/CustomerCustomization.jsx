import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CustomerCustomization = () => {
  const [categories, setCategories] = useState([]);
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [temperatures, setTemperatures] = useState([]);
  const [selectedTemperature, setSelectedTemperature] = useState({ id: null, name: "" });
  const [customProductName, setCustomProductName] = useState("");


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authData"))?.token;
        if (!token) return toast.error("Unauthorized! Please log in.");

        const response = await axios.get("http://localhost:5000/api/customize/categories", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        setCategories(response.data);
        response.data.forEach(category => fetchIngredients(category.CategoryID));
      } catch (err) {
        toast.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const fetchIngredients = async (categoryId) => {
    try {
      const token = JSON.parse(localStorage.getItem("authData"))?.token;
      const response = await axios.get(
        `http://localhost:5000/api/customize/customerIngredients?categoryId=${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      setIngredientsByCategory((prev) => ({
        ...prev,
        [categoryId]: response.data
      }));
    } catch (error) {
      toast.error("Failed to load ingredients.");
    }
  };

  const handleSelectIngredient = async (ingredientId) => {
    const token = JSON.parse(localStorage.getItem("authData"))?.token;
    if (!token) return toast.error("Unauthorized! Please log in.");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/customize/sizes/ingredient/${ingredientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const size = response.data[0]; // default size
      const price = size.PricePerStep;

      if (selectedIngredients[ingredientId]) return;

      const ingredient = Object.values(ingredientsByCategory)
        .flat()
        .find((item) => item.IngredientID === ingredientId);

      const updated = {
        ...selectedIngredients,
        [ingredientId]: {
          ingredientId,
          ingredientName: ingredient?.IngredientName || "Unknown",
          size,
          quantity: 1,
          pricePerStep: price,
        },
      };

      setSelectedIngredients(updated);
      calculateTotal(updated);
    } catch (error) {
      toast.error("Failed to fetch ingredient size.");
    }
  };

  const incrementQuantity = (ingredientId) => {
    const updated = { ...selectedIngredients };
    updated[ingredientId].quantity += 1;
    setSelectedIngredients(updated);
    calculateTotal(updated);
  };

  const decrementQuantity = (ingredientId) => {
    const updated = { ...selectedIngredients };
    if (updated[ingredientId].quantity > 1) {
      updated[ingredientId].quantity -= 1;
    } else {
      delete updated[ingredientId];
    }
    setSelectedIngredients(updated);
    calculateTotal(updated);
  };

  const calculateTotal = (ingredients) => {
    const total = Object.values(ingredients).reduce(
      (acc, item) => acc + item.quantity * item.pricePerStep,
      0
    );
    setTotalPrice(total);
  };

  useEffect(() => {
    const fetchTemperatures = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authData"))?.token;
        const res = await axios.get("http://localhost:5000/api/customProduct/temperature", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setTemperatures(res.data);
      } catch (err) {
        toast.error("Failed to load temperatures.");
      }
    };
    fetchTemperatures();
  }, []);

  // const handleSubmit = async () => {
  //   console.log("Submit button clicked!"); 
  //   const authData = localStorage.getItem("authData");
  //     const parsedData = JSON.parse(authData);
  //     const token = parsedData?.token;
  //     const userId = parsedData?.userId;
  //   console.log(userId,token)
  //   if (!token || !userId) return toast.error("User not authenticated.");
  //   if (!selectedTemperature.id) return toast.error("Please select a temperature.");
  //   if (!Object.keys(selectedIngredients).length) return toast.error("No ingredients selected.");

  //   const payload = {
  //     UserID: userId,
  //     ProductName: "Custom Drink", // You can replace this with a dynamic name input if needed
  //     TemperatureID: selectedTemperature.id,
  //     Details: Object.values(selectedIngredients).map((item) => ({
  //       IngredientID: item.ingredientId,
  //       SizeID: item.size.SizeID,
  //       Quantity: item.quantity
  //     }))
  //   };
  //   console.log("hey",payload)
  //   try {
  //     await axios.post("http://localhost:5000/api/customProduct/customProducts", payload, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       withCredentials: true
  //     });

  //     toast.success("Custom drink submitted successfully!");
  //     setSelectedIngredients({});
  //     setSelectedTemperature({ id: null, name: "" });
  //     setTotalPrice(0);
  //   } catch (error) {
  //     toast.error("Failed to submit custom drink.");
  //     console.error(error);
  //   }
  // };
  const handleSubmit = async () => {
    const authData = localStorage.getItem("authData");
    const parsedData = JSON.parse(authData);
    const token = parsedData?.token;
    const userId = parsedData?.userId;
  
    if (!token || !userId) return toast.error("User not authenticated.");
    if (!selectedTemperature.id) return toast.error("Please select a temperature.");
    if (!Object.keys(selectedIngredients).length) return toast.error("No ingredients selected.");
  
    const payload = {
      UserID: userId,
      ProductName: customProductName ,
      TemperatureID: selectedTemperature.id,
      TotalPrice: totalPrice,
      Details: Object.values(selectedIngredients).map((item) => ({
        IngredientID: item.ingredientId,
        SizeID: item.size.SizeID,
        Quantity: item.quantity
      }))
    };
  
    try {
      const res = await axios.post("http://localhost:5000/api/customProduct/customProducts", payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
  
      const customProductId = res.data?.CustomProductID;
  
      toast.success("Custom drink added to cart!");
      setSelectedIngredients({});
      setSelectedTemperature({ id: null, name: "" });
      setTotalPrice(0);
    } catch (error) {
      toast.error("Failed to submit custom drink.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customize Your Drink</h1>
      <div className="mb-4">
  <label className="block font-semibold mb-1">Name Your Custom Drink</label>
  <input
    type="text"
    value={customProductName}
    onChange={(e) => setCustomProductName(e.target.value)}
    placeholder="Enter a custom name..."
    className="w-full border p-2 rounded"
  />
</div>


      {categories.map((category) => (
        <div key={category.CategoryID} className="mb-6">
          <label className="block font-semibold mb-1">{category.CategoryName}</label>
          <select
            onChange={(e) => {
              const ingredientId = parseInt(e.target.value);
              if (ingredientId) handleSelectIngredient(ingredientId);
            }}
            className="w-full border p-2 rounded"
            defaultValue=""
          >
            <option value="" disabled>Select {category.CategoryName}...</option>
            {ingredientsByCategory[category.CategoryID]?.map((ingredient) => (
              <option key={ingredient.IngredientID} value={ingredient.IngredientID}>
                {ingredient.IngredientName}
              </option>
            ))}
          </select>

          {ingredientsByCategory[category.CategoryID]?.map((ingredient) => {
            const selected = selectedIngredients[ingredient.IngredientID];
            if (!selected) return null;

            return (
              <div
                key={ingredient.IngredientID}
                className="mt-2 bg-gray-100 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{ingredient.IngredientName}</div>
                  <div className="text-sm text-gray-600">
                    Size: {selected.size.StepQuantity}{selected.size.Unit} | Price per unit: Rs{selected.pricePerStep}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="bg-blue-500 text-white rounded px-2 py-1"
                    onClick={() => decrementQuantity(ingredient.IngredientID)}
                  >
                    -
                  </button>
                  <span className="font-semibold">{selected.quantity}</span>
                  <button
                    className="bg-green-500 text-white rounded px-2 py-1"
                    onClick={() => incrementQuantity(ingredient.IngredientID)}
                  >
                    +
                  </button>
                  <span className="ml-4 font-semibold">
                    Rs{(selected.quantity * selected.pricePerStep).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="mb-6">
        <label className="block font-semibold mb-1">Select Temperature</label>
        <select
          onChange={(e) => {
            const selectedId = parseInt(e.target.value);
            const temp = temperatures.find((t) => t.TemperatureID === selectedId);
            setSelectedTemperature({ id: selectedId, name: temp?.TemperatureName || "" });
          }}
          className="w-full border p-2 rounded"
          defaultValue=""
        >
          <option value="" disabled>Select Temperature...</option>
          {temperatures.map((temp) => (
            <option key={temp.TemperatureID} value={temp.TemperatureID}>
              {temp.TemperatureName}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(selectedIngredients).length > 0 && (
        <>
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Custom Drink Summary</h2>

            {selectedTemperature.name && (
              <div className="mb-4 text-gray-700">
                <span className="font-medium">Temperature:</span> {selectedTemperature.name}
              </div>
            )}

            <div className="space-y-3">
              {Object.values(selectedIngredients).map((item) => (
                <div
                  key={item.ingredientId}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded shadow-sm"
                >
                  <div>
                    <div className="font-medium">{item.ingredientName}</div>
                    <div className="text-sm text-gray-600">
                      Quantity: {item.size.StepQuantity * item.quantity} {item.size.Unit}
                    </div>
                  </div>
                  <div className="text-right font-semibold text-green-600">
                    Rs{(item.pricePerStep * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold mb-4">Total: Rs{totalPrice.toFixed(2)}</h2>
            <button
              onClick={handleSubmit}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            >
              Submit Custom Drink
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerCustomization;
