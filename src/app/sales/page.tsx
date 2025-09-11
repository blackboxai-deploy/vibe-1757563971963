"use client";

import { useState, useEffect } from "react";
import { Obat, Penjualan } from "@/lib/types";
import { getObat, setObat, getPenjualan, setPenjualan } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function SalesPage() {
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [form, setForm] = useState({ obatId: "", jumlah: "", tanggal: new Date() });

  useEffect(() => {
    setObatList(getObat());
    setPenjualanList(getPenjualan());
  }, []);

  const handleAddPenjualan = (e: React.FormEvent) => {
    e.preventDefault();
    const { obatId, jumlah, tanggal } = form;
    if (!obatId || !jumlah) return;

    const obat = obatList.find(o => o.id === obatId);
    if (!obat) return;

    const jumlahNum = parseInt(jumlah, 10);
    if (jumlahNum > obat.stok) {
      alert("Stok tidak mencukupi!");
      return;
    }

    const updatedObat: Obat = {
      ...obat,
      stok: obat.stok - jumlahNum,
    };

    const newPenjualan: Penjualan = {
      id: new Date().toISOString(),
      obatId,
      namaObat: obat.nama,
      jumlah: jumlahNum,
      tanggal: tanggal.toISOString(),
    };

    const updatedObatList = obatList.map(o => (o.id === obatId ? updatedObat : o));
    setObat(updatedObatList);
    setObatList(updatedObatList);

    const updatedPenjualanList = [...penjualanList, newPenjualan];
    setPenjualan(updatedPenjualanList);
    setPenjualanList(updatedPenjualanList);

    setForm({ obatId: "", jumlah: "", tanggal: new Date() });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Catat Penjualan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPenjualan} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select onValueChange={value => setForm({ ...form, obatId: value })} value={form.obatId}>
              <SelectTrigger><SelectValue placeholder="Pilih Obat" /></SelectTrigger>
              <SelectContent>
                {obatList.map(obat => <SelectItem key={obat.id} value={obat.id} disabled={obat.stok === 0}>{obat.nama} (Stok: {obat.stok})</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Jumlah" value={form.jumlah} onChange={e => setForm({ ...form, jumlah: e.target.value })} />
            <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !form.tanggal && "text-muted-foreground"
                    )}
                  >
                    {form.tanggal ? format(form.tanggal, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.tanggal}
                    onSelect={date => date && setForm({ ...form, tanggal: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            <Button type="submit" className="lg:col-span-4">Catat Penjualan</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Penjualan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Obat</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penjualanList.length > 0 ? (
                penjualanList.sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.tanggal).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{p.namaObat}</TableCell>
                    <TableCell className="text-right">{p.jumlah}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Belum ada riwayat penjualan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
