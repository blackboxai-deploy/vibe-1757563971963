export interface Obat {
  id: string;
  nama: string;
  satuan: 'strip' | 'botol' | 'box';
  stok: number;
  hargaBeliRataRata: number;
}

export interface Pembelian {
  id: string;
  obatId: string;
  namaObat: string;
  jumlah: number;
  hargaBeliTotal: number;
  biayaKirim: number;
  tanggal: string;
}

export interface Penjualan {
  id: string;
  obatId: string;
  namaObat: string;
  jumlah: number;
  tanggal: string;
}
