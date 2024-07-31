import { Service } from "./service";

export interface NotaService {
    STATUS: number;
    FAKTUR: string;
    KODE: string;
    TGL: string;
    PEMILIK: string;
    NOTELEPON: string;
    ESTIMASISELESAI: string;
    ESTIMASIHARGA: number;
    DP: number;
    PENERIMA: string;
    selectedServices?: Service[]; // Add this line
    barangList?: BarangService[]; // Add this line
}

export interface BarangService {
    KODE: string;
    NAMA: string;
    KETERANGAN: string;
    STATUSAMBIL: string;
}