import { Service } from "./service";

export interface NotaService {
    STATUS: number;
    FAKTUR: string;
    KODE: string;
    TGL: string;
    TGLBAYAR: string;
    PEMILIK: string;
    NOTELEPON: string;
    ESTIMASISELESAI: string;
    ESTIMASIHARGA: number;
    HARGA: number;
    NOMINALBAYAR: number;
    DP: number;
    PENERIMA: string;
    selectedServices?: Service[];
    barangList?: BarangService[];
}

export interface Pembayaran {
    FAKTUR: string;
    KODE: string;
    PEMILIK: string;
    TGLBAYAR: string;
    ESTIMASISELESAI: string;
    DP: number;
    NOMINALBAYAR: number;
    ESTIMASIHARGA: number;
    HARGA: number;
    barangList?: BarangService[];
}

export interface BarangService {
    KODE: string;
    NAMA: string;
    KETERANGAN: string;
    STATUSAMBIL: string;
}