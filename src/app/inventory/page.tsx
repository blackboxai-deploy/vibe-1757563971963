"use client";

import { useState, useEffect } from "react";
import { Obat } from "@/lib/types";
import { getObat, setObat } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InventoryPage() {
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [newObat, setNewObat] = useState({ nama: "", satuan: "strip" as Obat["satuan"] });

  useEffect(() => {
    setObatList(getObat());
  }, []);

  const handleAddObat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObat.nama) return;

    const newObatItem: Obat = {
      id: new Date().toISOString(),
      ...newObat,
      stok: 0,
      hargaBeliRataRata: 0,
    };

    const updatedList = [...obatList, newObatItem];
    setObat(updatedList);
    setObatList(updatedList);
    setNewObat({ nama: "", satuan: "strip" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Obat Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddObat} className="flex items-end space-x-4">
            <div className="flex-grow">
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Obat</label>
              <Input
                id="nama"
                value={newObat.nama}
                onChange={(e) => setNewObat({ ...newObat, nama: e.target.value })}
                placeholder="Contoh: Paracetamol 500mg"
              />
            </div>
            <div>
              <label htmlFor="satuan" className="block text-sm font-medium text-gray-700">Satuan</label>
              <Select
                value={newObat.satuan}
                onValueChange={(value: Obat["satuan"]) => setNewObat({ ...newObat, satuan: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strip">Strip</SelectItem>
                  <SelectItem value="botol">Botol</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Tambah</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Inventaris Obat</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Obat</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead className="text-right">Harga Beli Rata-Rata (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {obatList.length > 0 ? (
                obatList.map((obat) => (
                  <TableRow key={obat.id}>
                    <TableCell className="font-medium">{obat.nama}</TableCell>
                    <TableCell>{obat.satuan}</TableCell>
                    <TableCell className="text-right">{obat.stok}</TableCell>
                    <TableCell className="text-right">{obat.hargaBeliRataRata.toLocaleString("id-ID")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Belum ada obat di inventaris.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
