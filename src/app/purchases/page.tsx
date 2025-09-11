"use client";

import { useState, useEffect } from "react";
import { Obat, Pembelian } from "@/lib/types";
import { getObat, setObat, getPembelian, setPembelian } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function PurchasesPage() {
  const [obatList, setObatList] = useState<Obat[]>([]);
  const [pembelianList, setPembelianList] = useState<Pembelian[]>([]);
  const [form, setForm] = useState({ obatId: "", jumlah: "", hargaBeliTotal: "", biayaKirim: "", tanggal: new Date() });

  useEffect(() => {
    setObatList(getObat());
    setPembelianList(getPembelian());
  }, []);

  const handleAddPembelian = (e: React.FormEvent) => {
    e.preventDefault();
    const { obatId, jumlah, hargaBeliTotal, biayaKirim, tanggal } = form;
    if (!obatId || !jumlah || !hargaBeliTotal) return;

    const obat = obatList.find(o => o.id === obatId);
    if (!obat) return;

    const jumlahNum = parseInt(jumlah, 10);
    const hargaBeliTotalNum = parseInt(hargaBeliTotal, 10);
    const biayaKirimNum = biayaKirim ? parseInt(biayaKirim, 10) : 0;

    // Weighted Average Calculation
    const nilaiStokLama = obat.stok * obat.hargaBeliRataRata;
    const nilaiPembelianBaru = hargaBeliTotalNum + biayaKirimNum;
    const stokTotalBaru = obat.stok + jumlahNum;
    const hargaRataRataBaru = (nilaiStokLama + nilaiPembelianBaru) / stokTotalBaru;

    const updatedObat: Obat = {
      ...obat,
      stok: stokTotalBaru,
      hargaBeliRataRata: hargaRataRataBaru,
    };

    const newPembelian: Pembelian = {
      id: new Date().toISOString(),
      obatId,
      namaObat: obat.nama,
      jumlah: jumlahNum,
      hargaBeliTotal: hargaBeliTotalNum,
      biayaKirim: biayaKirimNum,
      tanggal: tanggal.toISOString(),
    };

    const updatedObatList = obatList.map(o => (o.id === obatId ? updatedObat : o));
    setObat(updatedObatList);
    setObatList(updatedObatList);

    const updatedPembelianList = [...pembelianList, newPembelian];
    setPembelian(updatedPembelianList);
    setPembelianList(updatedPembelianList);

    setForm({ obatId: "", jumlah: "", hargaBeliTotal: "", biayaKirim: "", tanggal: new Date() });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Catat Pembelian Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPembelian} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select onValueChange={value => setForm({ ...form, obatId: value })} value={form.obatId}>
              <SelectTrigger><SelectValue placeholder="Pilih Obat" /></SelectTrigger>
              <SelectContent>
                {obatList.map(obat => <SelectItem key={obat.id} value={obat.id}>{obat.nama}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Jumlah" value={form.jumlah} onChange={e => setForm({ ...form, jumlah: e.target.value })} />
            <Input type="number" placeholder="Total Harga Beli (Rp)" value={form.hargaBeliTotal} onChange={e => setForm({ ...form, hargaBeliTotal: e.target.value })} />
            <Input type="number" placeholder="Biaya Kirim (Rp)" value={form.biayaKirim} onChange={e => setForm({ ...form, biayaKirim: e.target.value })} />
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
            <Button type="submit" className="lg:col-span-5">Catat Pembelian</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembelian</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Obat</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Total Harga (Rp)</TableHead>
                <TableHead className="text-right">Biaya Kirim (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pembelianList.length > 0 ? (
                pembelianList.sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.tanggal).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{p.namaObat}</TableCell>
                    <TableCell className="text-right">{p.jumlah}</TableCell>
                    <TableCell className="text-right">{p.hargaBeliTotal.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">{p.biayaKirim.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Belum ada riwayat pembelian.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
