"use client";

import { Obat, Pembelian, Penjualan } from "./types";

const isBrowser = typeof window !== 'undefined';

function createStorage<T>(key: string, defaultValue: T): [() => T, (value: T) => void] {
  const getItem = (): T => {
    if (!isBrowser) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  };

  const setItem = (value: T) => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [getItem, setItem];
}

export const [getObat, setObat] = createStorage<Obat[]>("obat", []);
export const [getPembelian, setPembelian] = createStorage<Pembelian[]>("pembelian", []);
export const [getPenjualan, setPenjualan] = createStorage<Penjualan[]>("penjualan", []);
