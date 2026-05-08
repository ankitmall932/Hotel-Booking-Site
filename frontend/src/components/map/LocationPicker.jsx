/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
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

function LocationMarker ({ location, setLocation }) {
    useMapEvents({
        click (e) {
            setLocation([
                e.latlng.lat,
                e.latlng.lng
            ]);
        }
    });
    return (
        <Marker draggable={ true } position={ location } eventHandlers={ {
            dragend: (e) => {
                const marker = e.target;
                const latlng = marker.getLatLng();
                setLocation([
                    latlng.lat,
                    latlng.lng
                ]);
            }
        } } >
            <Popup>
                Exact Hotel Location
            </Popup>
        </Marker>
    );
}
function ChangeMapView ({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center)
        {
            map.flyTo(center, 15);
        }
    }, [ center ]);
    return null;
}

function LocationPicker ({ location, setLocation }) {
    const [ position, setPosition ] = useState([
        28.7041,
        77.1025
    ]);
    //for getting current location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (success) => {
                const { latitude, longitude } = success.coords;
                setPosition([
                    latitude,
                    longitude
                ]);
                setLocation(prev => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude
                }));
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);
    // update form data whenever we move the marker of the map
    useEffect(() => {
        if (position?.length === 2)
        {
            setLocation(prev => ({
                ...prev,
                lat: Number(position[ 0 ]),
                lng: Number(position[ 1 ])
            }));
        }
    }, [ position ]);
    //for searching manual address 
    const handleSearch = async () => {
        if (!location.location) return;
        try
        {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${ location.location }`);
            const data = await response.json();
            if (data.length > 0)
            {
                const lat = parseFloat(data[ 0 ].lat);
                const lng = parseFloat(data[ 0 ].lon);
                setPosition([ lat, lng ]);
            }
        } catch (error)
        {
            console.log(error);
        }
    };
    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-2">
                <input type="text" placeholder='Search Location' name='location' value={ location.location } onChange={ (e) => setLocation({ ...location, location: e.target.value }) } className='border p-3 rounded-lg w-full' />
                <button type='button' onClick={ handleSearch } className='bg-black text-white px-4 rounded-lg'> Search </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input type="text" value={ location.lat } readOnly className='border p-3 rounded-lg ' placeholder='Latitude' />
                <input type="text" value={ location.lng } readOnly className='border p-3 rounded-lg ' placeholder='Longitude' />
            </div>
            <div className="overflow-hidden h-125 rounded-2xl">
                <MapContainer center={ position } zoom={ 15 } scrollWheelZoom={ true } className='h-120 w-full'>
                    <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    <LocationMarker
                        location={ position }
                        setLocation={ setPosition }
                    />
                    <ChangeMapView center={ location } />
                </MapContainer>
            </div>
        </div>
    );
}

export default LocationPicker;