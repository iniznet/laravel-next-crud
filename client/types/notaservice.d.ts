import { Service, ServiceRelation } from "./service";

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
    QUEUE_NUMBER: number;
    selectedServices?: Service[];
    barangList?: BarangWithServices[];
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

export interface BarangWithServices extends BarangService {
    services: ServiceRelation[];
    ESTIMASIHARGA: number;
}