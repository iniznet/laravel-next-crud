/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            ]
        },
        {
            label: 'Service',
            items:
            [{
                label: 'Sparepart',
                icon: 'pi pi-fw pi-server',
                to: '/pages/sparepart'
            },
            {
                label: 'Jasa',
                icon: 'pi pi-fw pi-wrench',
                to: '/pages/service'},
            ]
        },
        {
            label: 'Pembayaran',
            items:
            [{
                label: 'Nota Service',
                icon: 'pi pi-fw pi-inbox',
                to: '/pages/nota'
            },
            {
                label: 'Pembayaran',
                icon: 'pi pi-fw pi-wallet',
                to: '/pages/pembayaran'
            },
            {
                label: 'Tagihan',
                icon: 'pi pi-fw pi-print',
                to: '/pages/invoice'
            },
        ]
        },
        {
            label: 'Antrian',
            items:
            [{
                label: 'Antrian Admin',
                icon: 'pi pi-fw pi-users',
                to: '/pages/queue-admin'
            },
            {
                label: 'Antrian Klien',
                icon: 'pi pi-fw pi-users',
                to: '/pages/queue-visitor'
            },
            ]
            },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
