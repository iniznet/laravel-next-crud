"use client";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { NotaServiceAPI } from '@/apis/NotaServiceApi';
import { PembayaranAPI } from '@/apis/PembayaranApi';
import { ServiceAPI } from '@/apis/ServiceApi';
import { Menu } from 'primereact/menu';
import { LayoutContext } from '@/layout/context/layoutcontext';
import Link from 'next/link';
import { AuthAPI } from '@/apis/AuthApi';
import { useRouter } from 'next/navigation';
const Dashboard = () => {
    const [notaServices, setNotaServices] = useState([]);
    const [pembayaran, setPembayaran] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const auth = await AuthAPI.authenticated();
                if (!auth || auth.role !== 'admin') {
                    router.push('/auth');
                }
            }
            catch (error) {
                router.push('/auth');
                console.log('You are not authenticated');
            }
            try {
                const [notaServicesData, pembayaranData, servicesData] = await Promise.all([
                    NotaServiceAPI.getAll(),
                    PembayaranAPI.getAll(),
                    ServiceAPI.getAll(),
                ]);
                setNotaServices(notaServicesData);
                setPembayaran(pembayaranData);
                setServices(servicesData);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const formatCurrency = (value) => {
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };
    const lineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Revenue',
                data: pembayaran.length ? pembayaran.slice(0, 7).map(p => p.NOMINALBAYAR) : [],
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            },
            {
                label: 'Estimated Revenue',
                data: pembayaran.length ? pembayaran.slice(0, 7).map(p => p.ESTIMASIHARGA) : [],
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e',
                tension: 0.4
            }
        ]
    };
    useEffect(() => {
        const applyTheme = () => {
            const lineOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: layoutConfig.colorScheme === 'light' ? '#495057' : '#ebedef'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: layoutConfig.colorScheme === 'light' ? '#495057' : '#ebedef'
                        },
                        grid: {
                            color: layoutConfig.colorScheme === 'light' ? '#ebedef' : 'rgba(160, 167, 181, .3)'
                        }
                    },
                    y: {
                        ticks: {
                            color: layoutConfig.colorScheme === 'light' ? '#495057' : '#ebedef'
                        },
                        grid: {
                            color: layoutConfig.colorScheme === 'light' ? '#ebedef' : 'rgba(160, 167, 181, .3)'
                        }
                    }
                }
            };
            setLineOptions(lineOptions);
        };
        applyTheme();
    }, [layoutConfig.colorScheme]);
    return (<div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Orders</span>
                            <div className="text-900 font-medium text-xl">{notaServices.length}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{notaServices.filter(ns => ns.STATUS === 0).length} pending </span>
                    <span className="text-500">since last visit</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Revenue</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(pembayaran.reduce((sum, p) => sum + p.NOMINALBAYAR, 0))}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">+52% </span>
                    <span className="text-500">since last week</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Customers</span>
                            <div className="text-900 font-medium text-xl">{new Set(notaServices.map(ns => ns.PEMILIK)).size}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">520 </span>
                    <span className="text-500">newly registered</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Services</span>
                            <div className="text-900 font-medium text-xl">{services.length} Available</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl"/>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{services.length} </span>
                    <span className="text-500">responded</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Recent Sales</h5>
                    <DataTable value={notaServices.length ? notaServices.slice(0, 5) : []} rows={5} paginator responsiveLayout="scroll">
                        <Column field="PEMILIK" header="Customer" sortable style={{ width: '15%' }}/>
                        <Column field="FAKTUR" header="Invoice" sortable style={{ width: '15%' }}/>
                        <Column field="HARGA" header="Price" sortable style={{ width: '35%' }} body={(data) => formatCurrency(data.HARGA)}/>
                        <Column header="View" style={{ width: '15%' }} body={() => (<Button icon="pi pi-search" text/>)}/>
                    </DataTable>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Best Selling Services</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu1.current?.toggle(event)}/>
                            <Menu ref={menu1} popup model={[
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ]}/>
                        </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                        {(services.length ? services.slice(0, 5) : []).map((service, i) => (<li key={service.KODE} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{service.KETERANGAN}</span>
                                    <div className="mt-1 text-600">{service.KODE}</div>
                                </div>
                                <div className="mt-2 md:mt-0 flex align-items-center">
                                    <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                        <div className={`bg-${['orange', 'cyan', 'pink', 'green', 'purple'][i]}-500 h-full`} style={{ width: `${100 - i * 10}%` }}/>
                                    </div>
                                    <span className={`text-${['orange', 'cyan', 'pink', 'green', 'purple'][i]}-500 ml-3 font-medium`}>{100 - i * 10}%</span>
                                </div>
                            </li>))}
                    </ul>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Overview</h5>
                    <Chart type="line" data={lineData} options={lineOptions}/>
                </div>

                <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Notifications</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu2.current?.toggle(event)}/>
                            <Menu ref={menu2} popup model={[
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ]}/>
                        </div>
                    </div>

                    <span className="block text-600 font-medium mb-3">TODAY</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-dollar text-xl text-blue-500"/>
                            </div>
                            <span className="text-900 line-height-3">
                                {notaServices[0]?.PEMILIK}
                                <span className="text-700">
                                    {' '}
                                    has ordered {notaServices[0]?.KODE} for <span className="text-blue-500">{formatCurrency(notaServices[0]?.HARGA || 0)}</span>
                                </span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-download text-xl text-orange-500"/>
                            </div>
                            <span className="text-700 line-height-3">
                                Your request for order <span className="text-blue-500 font-medium">#{notaServices[1]?.KODE}</span> has been completed.
                            </span>
                        </li>
                    </ul>

                    <span className="block text-600 font-medium mb-3">YESTERDAY</span>
                    <ul className="p-0 m-0 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-dollar text-xl text-blue-500"/>
                            </div>
                            <span className="text-900 line-height-3">
                                {notaServices[2]?.PEMILIK}
                                <span className="text-700">
                                    {' '}
                                    has ordered {notaServices[2]?.KODE} for <span className="text-blue-500">{formatCurrency(notaServices[2]?.HARGA || 0)}</span>
                                </span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-question text-xl text-pink-500"/>
                            </div>
                            <span className="text-900 line-height-3">
                                {notaServices[3]?.PEMILIK}
                                <span className="text-700"> has requested more information about service {services[0]?.KETERANGAN}.</span>
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3" style={{
            borderRadius: '1rem',
            background: 'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)'
        }}>
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">TAKE THE NEXT STEP</div>
                        <div className="text-white font-medium text-5xl">Try Our Services</div>
                    </div>
                    <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                        <Link href="/services" className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>);
};
export default Dashboard;
