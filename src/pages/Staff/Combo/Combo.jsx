import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllCombos } from "../../../api/comboApi";

const Combo = () => {

  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    const fetchCombos = async () => {
      setLoading(true);
      try {
        const response = await getAllCombos();
        if (response?.isSuccess) {
          setCombos(response.result);
        } else {
          message.error("Failed to fetch combos.");
        }
      } catch (error) {
        message.error("Error fetching combos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  return (
    <div>
      <h1>Combos</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {combos.map((combo) => (
            <li key={combo.id}>{combo.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Combo;
