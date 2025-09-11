"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format, startOfDay, endOfDay } from "date-fns";
import { getObat, getPembelian, getPenjualan } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface HPPResult {
  persediaanAwal: number;
  pembelianPeriode: number;
  persediaanAkhir: number;
  hpp: number;
}

export default function HomePage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -29),
    to: new Date(),
  });
  const [result, setResult] = useState<HPPResult | null>(null);

  const handleCalculateHPP = () => {
    if (!date || !date.from || !date.to) return;

    const startDate = startOfDay(date.from);
    const endDate = endOfDay(date.to);
    
    const allObat = getObat();
    const allPembelian = getPembelian();
    const allPenjualan = getPenjualan();

    // 1. Calculate historical stock and value up to the start date
    let persediaanAwalValue = 0;
    const inventoryAtStart = new Map<string, {stok: number, harga: number}>();

    allObat.forEach(obat => {
        inventoryAtStart.set(obat.id, {stok: 0, harga: 0});
    });

    // Process purchases before start date to establish initial HPP
    allPembelian.filter(p => new Date(p.tanggal) < startDate).forEach(p => {
        const item = inventoryAtStart.get(p.obatId);
        if(item) {
            const nilaiStokLama = item.stok * item.harga;
            const nilaiPembelianBaru = p.hargaBeliTotal + p.biayaKirim;
            const stokTotalBaru = item.stok + p.jumlah;
            item.stok = stokTotalBaru;
            item.harga = stokTotalBaru > 0 ? (nilaiStokLama + nilaiPembelianBaru) / stokTotalBaru : 0;
        }
    });

    // Process sales before start date to adjust stock
    allPenjualan.filter(s => new Date(s.tanggal) < startDate).forEach(s => {
        const item = inventoryAtStart.get(s.obatId);
        if(item) {
            item.stok -= s.jumlah;
        }
    });

    inventoryAtStart.forEach(item => {
        persediaanAwalValue += item.stok * item.harga;
    });

    // 2. Calculate purchases within the period
    const pembelianPeriodeValue = allPembelian
        .filter(p => new Date(p.tanggal) >= startDate && new Date(p.tanggal) <= endDate)
        .reduce((acc, p) => acc + p.hargaBeliTotal + p.biayaKirim, 0);

    // 3. Calculate ending inventory value
    let persediaanAkhirValue = 0;
    const inventoryAtEnd = new Map<string, {stok: number, harga: number}>();
    inventoryAtStart.forEach((value, key) => {
        inventoryAtEnd.set(key, {stok: value.stok, harga: value.harga});
    });

    allPembelian.filter(p => new Date(p.tanggal) >= startDate && new Date(p.tanggal) <= endDate).forEach(p => {
         const item = inventoryAtEnd.get(p.obatId);
         if (item) {
            const nilaiStokLama = item.stok * item.harga;
            const nilaiPembelianBaru = p.hargaBeliTotal + p.biayaKirim;
            const stokTotalBaru = item.stok + p.jumlah;
            item.stok = stokTotalBaru;
            item.harga = stokTotalBaru > 0 ? (nilaiStokLama + nilaiPembelianBaru) / stokTotalBaru : 0;
         }
    });

    allPenjualan.filter(s => new Date(s.tanggal) >= startDate && new Date(s.tanggal) <= endDate).forEach(s => {
        const item = inventoryAtEnd.get(s.obatId);
        if(item) {
            item.stok -= s.jumlah;
        }
    });

    inventoryAtEnd.forEach(item => {
        persediaanAkhirValue += item.stok * item.harga;
    });

    // 4. Calculate HPP
    const hpp = persediaanAwalValue + pembelianPeriodeValue - persediaanAkhirValue;

    setResult({
      persediaanAwal: persediaanAwalValue,
      pembelianPeriode: pembelianPeriodeValue,
      persediaanAkhir: persediaanAkhirValue,
      hpp,
    });
  };

  return (
    <div className="space-y-6">
        <Card>
        <CardHeader>
            <CardTitle>Kalkulator Harga Pokok Penjualan (HPP)</CardTitle>
            <CardDescription>Pilih rentang tanggal untuk menghitung HPP.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <div className={cn("grid gap-2 flex-grow")}>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    {date?.from ? (
                    date.to ? (
                        <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pilih tanggal</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
            </div>
            <Button onClick={handleCalculateHPP} className="w-full sm:w-auto">Hitung HPP</Button>
        </CardContent>
        </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Perhitungan HPP</CardTitle>
            <CardDescription>
                Periode: {date?.from ? format(date.from, "d MMM yyyy") : ""} - {date?.to ? format(date.to, "d MMM yyyy") : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Nilai Persediaan Awal</p>
                <p className="text-2xl font-bold">Rp {result.persediaanAwal.toLocaleString('id-ID')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Pembelian</p>
                <p className="text-2xl font-bold">Rp {result.pembelianPeriode.toLocaleString('id-ID')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Nilai Persediaan Akhir</p>
                <p className="text-2xl font-bold">Rp {result.persediaanAkhir.toLocaleString('id-ID')}</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-500">Harga Pokok Penjualan (HPP)</p>
                <p className="text-2xl font-bold text-blue-700">Rp {result.hpp.toLocaleString('id-ID')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
