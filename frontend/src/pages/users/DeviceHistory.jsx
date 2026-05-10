import React, { useEffect, useState } from 'react';
import { deviceHistory } from '../../api/auth.api';
import { toast } from 'react-toastify';

function DeviceHistory () {
    const [ device, setDevice ] = useState([]);
    useEffect(() => {
        const fetchDevice = async () => {
            const { data, error } = await deviceHistory();
            if (error)
            {
                toast.error(error.message);
                return;
            }
            setDevice(data.updateDevices);
        };
        fetchDevice();
    }, []);

    const getUniqueDevices = () => {
        const browserMap = new Map();

        device.forEach((dev) => {
            const key = `${ dev.browser }-${ dev.os }`;

            if (!browserMap.has(key))
            {
                browserMap.set(key, dev);
            } else
            {
                const existing = browserMap.get(key);
                if (new Date(dev.lastActive) > new Date(existing.lastActive))
                {
                    browserMap.set(key, dev);
                }
            }
        });

        return Array.from(browserMap.values()).sort((a, b) =>
            new Date(b.lastActive) - new Date(a.lastActive)
        );
    };

    const uniqueDevices = getUniqueDevices();

    return (
        <div className='p-5 flex flex-col border-2'>
            <h1 className='flex text-2xl font-semibold'>Device history</h1>
            <p className='text-gray-600 text-sm mt-2'>Showing latest activity per browser</p>
            { uniqueDevices.length === 0 ? (
                <p className='text-gray-500 mt-4'>No devices found</p>
            ) : (
                uniqueDevices.map((dev) => (
                    <div key={ dev._id } className='flex flex-col border-2 p-5 mt-5 gap-2 rounded-lg hover:shadow-lg transition'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <h2 className='text-lg font-semibold'>{ dev.browser }</h2>
                                <h3 className='text-gray-600'>{ dev.os }</h3>
                                <p className='text-sm text-gray-500'>{ dev.device }</p>
                            </div>
                            { dev.currentDevice && (
                                <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold'>
                                    Current
                                </span>
                            ) }
                        </div>
                        <p className='text-sm text-gray-500 mt-2'>
                            Last active: { new Date(dev.lastActive).toLocaleString() }
                        </p>
                    </div>
                ))
            ) }
        </div>
    );
}

export default DeviceHistory;