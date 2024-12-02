import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, DatePicker } from "antd";
import moment from "moment";
import Highlighter from "react-highlight-words";
import React from "react";

export const getColumnSearchProps = (
  dataIndex,
  searchText,
  setSearchText,
  searchedColumn,
  setSearchedColumn
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() =>
          handleSearch(
            selectedKeys,
            confirm,
            dataIndex,
            setSearchText,
            setSearchedColumn
          )
        }
        style={{ marginBottom: 8, display: "block" }}
      />
      <Button
        type="primary"
        onClick={() =>
          handleSearch(
            selectedKeys,
            confirm,
            dataIndex,
            setSearchText,
            setSearchedColumn
          )
        }
        icon={<SearchOutlined />}
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button
        onClick={() => handleReset(clearFilters, setSearchText)}
        size="small"
        style={{ width: 90 }}
      >
        Reset
      </Button>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : "",
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => document.getElementById("search-input").select(), 100);
    }
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ) : (
      text
    ),
});

export const getColumnDateSearchProps = (
  dataIndex,
  searchText,
  setSearchText,
  searchedColumn,
  setSearchedColumn
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <DatePicker
        onChange={(date, dateString) =>
          setSelectedKeys(dateString ? [dateString] : [])
        }
        style={{ marginBottom: 8, display: "block" }}
      />
      <Button
        type="primary"
        onClick={() =>
          handleSearch(
            selectedKeys,
            confirm,
            dataIndex,
            setSearchText,
            setSearchedColumn
          )
        }
        icon={<SearchOutlined />}
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button
        onClick={() => handleReset(clearFilters, setSearchText)}
        size="small"
        style={{ width: 90 }}
      >
        Reset
      </Button>
    </div>
  ),
  filterIcon: (filtered) => (
    <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      ? moment(record[dataIndex]).format("DD-MM-YYYY") === value
      : "",
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ) : (
      text
    ),
});

const handleSearch = (
  selectedKeys,
  confirm,
  dataIndex,
  setSearchText,
  setSearchedColumn
) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

const handleReset = (clearFilters, setSearchText) => {
  clearFilters();
  setSearchText("");
};
