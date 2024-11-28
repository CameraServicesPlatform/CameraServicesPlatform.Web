import React, { useEffect, useState } from "react";
import {
  getAllCombosOfSupplier,
  getComboOfSupplierById,
  updateComboOfSupplier,
} from "../../../api/comboApi";

const ComboSupplierList = ({ refresh }) => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [newCombo, setNewCombo] = useState({
    comboId: "",
    supplierID: "",
    startTime: "",
    endTime: "",
    isDisable: false,
  });

  useEffect(() => {
    const fetchCombos = async () => {
      setLoading(true);
      const response = await getAllCombosOfSupplier();
      if (response.isSuccess) {
        setCombos(response.result);
      } else {
        console.error(response.messages);
      }
      setLoading(false);
    };

    fetchCombos();
  }, [refresh]);

  const handleDelete = async (comboOfSupplierId) => {
    const response = await deleteComboOfSupplier(comboOfSupplierId);
    if (response.isSuccess) {
      setCombos(
        combos.filter((combo) => combo.comboOfSupplierId !== comboOfSupplierId)
      );
    } else {
      console.error(response.messages);
    }
  };

  const handleViewDetails = async (comboId) => {
    const response = await getComboOfSupplierById(comboId);
    if (response.isSuccess) {
      setSelectedCombo(response.result);
    } else {
      console.error(response.messages);
    }
  };

  const handleCreateCombo = async () => {
    const response = await createComboOfSupplier(newCombo);
    if (response.isSuccess) {
      setCombos([...combos, response.result]);
      setNewCombo({
        comboId: "",
        supplierID: "",
        startTime: "",
        endTime: "",
        isDisable: false,
      });
    } else {
      console.error(response.messages);
    }
  };

  const handleUpdateCombo = async () => {
    const response = await updateComboOfSupplier(selectedCombo);
    if (response.isSuccess) {
      setCombos(
        combos.map((combo) =>
          combo.comboOfSupplierId === selectedCombo.comboOfSupplierId
            ? response.result
            : combo
        )
      );
      setSelectedCombo(null);
    } else {
      console.error(response.messages);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Danh sách combo của nhà cung cấp
      </h2>
      <ul>
        {combos.map((combo) => (
          <li key={combo.comboOfSupplierId} className="mb-2">
            <div
              className="p-4 bg-white rounded shadow"
              onDoubleClick={() => handleViewDetails(combo.comboId)}
            >
              <h3 className="text-xl font-semibold">{combo.comboId}</h3>
              <p>Supplier ID: {combo.supplierID}</p>
              <p>Start Time: {new Date(combo.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(combo.endTime).toLocaleString()}</p>
              <p>Is Disabled: {combo.isDisable ? "Yes" : "No"}</p>
              <button
                onClick={() => handleDelete(combo.comboOfSupplierId)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedCombo && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-xl font-semibold">Update Combo of Supplier</h3>
          <input
            type="text"
            value={selectedCombo.comboId}
            onChange={(e) =>
              setSelectedCombo({ ...selectedCombo, comboId: e.target.value })
            }
            placeholder="Combo ID"
            className="mb-2 p-2 border rounded"
          />
          <input
            type="text"
            value={selectedCombo.supplierID}
            onChange={(e) =>
              setSelectedCombo({ ...selectedCombo, supplierID: e.target.value })
            }
            placeholder="Supplier ID"
            className="mb-2 p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={selectedCombo.startTime}
            onChange={(e) =>
              setSelectedCombo({ ...selectedCombo, startTime: e.target.value })
            }
            placeholder="Start Time"
            className="mb-2 p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={selectedCombo.endTime}
            onChange={(e) =>
              setSelectedCombo({ ...selectedCombo, endTime: e.target.value })
            }
            placeholder="End Time"
            className="mb-2 p-2 border rounded"
          />
          <label>
            <input
              type="checkbox"
              checked={selectedCombo.isDisable}
              onChange={(e) =>
                setSelectedCombo({
                  ...selectedCombo,
                  isDisable: e.target.checked,
                })
              }
            />
            Is Disabled
          </label>
          <button
            onClick={handleUpdateCombo}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Update Combo
          </button>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-100 rounded shadow">
        <h3 className="text-xl font-semibold">Create New Combo of Supplier</h3>
        <input
          type="text"
          value={newCombo.comboId}
          onChange={(e) =>
            setNewCombo({ ...newCombo, comboId: e.target.value })
          }
          placeholder="Combo ID"
          className="mb-2 p-2 border rounded"
        />
        <input
          type="text"
          value={newCombo.supplierID}
          onChange={(e) =>
            setNewCombo({ ...newCombo, supplierID: e.target.value })
          }
          placeholder="Supplier ID"
          className="mb-2 p-2 border rounded"
        />
        <input
          type="datetime-local"
          value={newCombo.startTime}
          onChange={(e) =>
            setNewCombo({ ...newCombo, startTime: e.target.value })
          }
          placeholder="Start Time"
          className="mb-2 p-2 border rounded"
        />
        <input
          type="datetime-local"
          value={newCombo.endTime}
          onChange={(e) =>
            setNewCombo({ ...newCombo, endTime: e.target.value })
          }
          placeholder="End Time"
          className="mb-2 p-2 border rounded"
        />
        <label>
          <input
            type="checkbox"
            checked={newCombo.isDisable}
            onChange={(e) =>
              setNewCombo({ ...newCombo, isDisable: e.target.checked })
            }
          />
          Is Disabled
        </label>
        <button
          onClick={handleCreateCombo}
          className="bg-green-500 text-white p-2 rounded"
        >
          Create Combo
        </button>
      </div>
    </div>
  );
};

export default ComboSupplierList;
