import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function RoomMap ({ listing }) {
    if (!listing?.geometry?.coordinates) return null;
    const lat = listing.geometry.coordinates[ 1 ];
    const lng = listing.geometry.coordinates[ 0 ];
    return (
        <div className='h-125 p-5 rounded-2xl w-full overflow-hidden'>
            <MapContainer center={ [ lat, lng ] } zoom={ 12 } scrollWheelZoom={ true } className='h-full w-full'>
                <TileLayer attribution='&copy; OpenStreetMap contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                <Marker position={ [ lat, lng ] }>
                    <Popup>
                        { listing.name }
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default RoomMap;