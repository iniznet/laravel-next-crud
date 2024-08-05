export interface Service {
    KODE: string;
    KETERANGAN: string;
    ESTIMASIHARGA: number;
}

export interface ServiceRelation {
    KODE_SERVICE: string;
    KODE_BARANG: string;
    KODE: string;
    HARGA: number;
    TYPE: 'service' | 'stock';
    QTY?: number;
    NAMA?: string;
    SATUAN?: string;
}

export interface Stock {
    ID: number;
    KODE: string;
    NAMA: string;
    HJ: number;
    SATUAN: string;
}

export interface ServiceOrStock extends Service, Partial<Stock> {
    TYPE: 'service' | 'stock';
}

export interface ServiceOrStockRelation extends ServiceRelation {
    TYPE: 'service' | 'stock';
    NAMA?: string;
    SATUAN?: string;
}

export interface BarangWithServices extends BarangService {
    services: ServiceRelation[];
    ESTIMASIHARGA: number;
}