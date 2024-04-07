
import React from 'react';
import { useTranslation } from 'react-i18next';


export default function CustomDomainFunction() {
    const { t } = useTranslation();
    return (
        <div className='domain-info'>
            <p className='domain-info-header'>{t('custom-domain-instruct')}</p>
            <table className='domain-info-table'>
                <tr className='domain-info-subheader'>
                    <th>{t('type')}</th>
                    <th>{t('name')}</th>
                    <th>{t('value')}</th>
                </tr>
                <tr className='domain-info-one'>
                    <td>A</td>
                    <td>@</td>
                    <td>76.76.21.21</td>
                </tr>
                <tr className='domain-info-one'>
                    <td>CNAME</td>
                    <td>www</td>
                    <td>cname.vercel-dns.com</td>
                </tr>
            </table>
            <p className='domain-info-header'>{t('custom-domain-instruct2')}</p>
        </div>
    );
}