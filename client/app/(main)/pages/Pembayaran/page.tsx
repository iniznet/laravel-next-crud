"use client";

import React, { useState } from 'react';
import './page.css';

const Pembayaran = () => {
  interface Item {
    noBarang: number;
    namaBarang: string;
    qty: number;
    harga: number;
  }

  const [items, setItems] = useState<Item[]>([]);

  const [faktur, setFaktur] = useState('');
  const [noServis, setNoServis] = useState('');
  const [pemilik, setPemilik] = useState('');
  const [tanggalPembayaran, setTanggalPembayaran] = useState('');
  const [dp, setDp] = useState(0);
  const [pembayaran, setPembayaran] = useState(0);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.qty * item.harga, 0);
  };

  const calculateSisa = () => {
    return pembayaran - calculateTotal(); // Corrected calculation for sisa
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case 'faktur':
        setFaktur(value);
        filterItems(value);
        break;
      case 'noServis':
        setNoServis(value);
        filterItems(value);
        break;
      case 'pemilik':
        setPemilik(value);
        filterItems(value);
        break;
      case 'tanggalPembayaran':
        setTanggalPembayaran(value);
        filterItems(value);
        break;
      case 'dp':
        setDp(parseFloat(value));
        break;
      case 'pembayaran':
        setPembayaran(parseFloat(value));
        break;
      default:
        break;
    }
  };

  const filterItems = (searchTerm: string) => {
    const filtered = items.filter((item) => {
      return (
        item.noBarang.toString().includes(searchTerm) ||
        item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.qty.toString().includes(searchTerm) ||
        item.harga.toString().includes(searchTerm)
      );
    });
    setFilteredItems(filtered);
  };

  const handleAddItem = () => {
    const newItem = {
      noBarang: items.length + 1,
      namaBarang: '',
      qty: 1,
      harga: 0,
    };

    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index].qty = parseFloat(value);
    setItems(updatedItems);
  };

  const handleHargaChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index].harga = parseFloat(value);
    setItems(updatedItems);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">PEMBAYARAN</div>
      </div>

      <div className="content">
        <div className="left">
          <div className="section">
            <label htmlFor="faktur">Faktur</label>
            <input
              type="text"
              id="faktur"
              name="faktur"
              value={faktur}
              onChange={handleInputChange}
            />
          </div>
          <div className="section">
            <label htmlFor="noServis">No. Servis</label>
            <input
              type="text"
              id="noServis"
              name="noServis"
              value={noServis}
              onChange={handleInputChange}
            />
          </div>
          <div className="section">
            <label htmlFor="pemilik">Pemilik</label>
            <input
              type="text"
              id="pemilik"
              name="pemilik"
              value={pemilik}
              onChange={handleInputChange}
            />
          </div>
          <div className="section">
            <label htmlFor="tanggalPembayaran">Tanggal Pembayaran</label>
            <input
              type="date"
              id="tanggalPembayaran"
              name="tanggalPembayaran"
              value={tanggalPembayaran}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="right">
          <table>
            <thead>
              <tr>
                <th>NO. BARANG</th>
                <th>NAMA BARANG</th>
                <th>QTY</th>
                <th>HARGA</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.noBarang}</td>
                    <td>
                      <input
                        type="text"
                        name="namaBarang"
                        value={item.namaBarang}
                        onChange={(event) => {
                          const updatedItems = [...items];
                          updatedItems[index].namaBarang = event.target.value;
                          setItems(updatedItems);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(event) =>
                          handleQuantityChange(index, event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.harga}
                        onChange={(event) =>
                          handleHargaChange(index, event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button onClick={() => handleRemoveItem(index)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No content in table</td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={handleAddItem}>Add Item</button>
        </div>
      </div>

      <div className="footer">
        <div className="section">
          <label htmlFor="totalHarga">Total Harga</label>
          <input
            type="text"
            id="totalHarga"
            name="totalHarga"
            value={calculateTotal().toLocaleString()}
            readOnly
          />
        </div>
        <div className="section">
          <label htmlFor="dp">DP</label>
          <input
            type="number"
            id="dp"
            name="dp"
            value={dp}
            onChange={handleInputChange}
          />
        </div>
        <div className="section">
          <label htmlFor="pembayaran">Pembayaran</label>
          <input
            type="number"
            id="pembayaran"
            name="pembayaran"
            value={pembayaran}
            onChange={handleInputChange}
          />
        </div>
        <div className="section">
          <label htmlFor="sisa">Sisa</label>
          <input
            type="text"
            id="sisa"
            name="sisa"
            value={calculateSisa().toLocaleString()}
            readOnly
          />
        </div>
      </div>

      <div className="actions">
        <button onClick={() => {}}>BAYAR</button>
        <button onClick={() => {}}>CANCEL</button>
      </div>
    </div>
  );
};

export default Pembayaran;