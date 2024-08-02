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
}