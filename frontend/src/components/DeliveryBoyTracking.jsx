import React from 'react'
import { MapContainer, Marker, Polyline, Popup } from 'react-leaflet';
import { TileLayer } from 'react-leaflet';
import L from 'leaflet';

import "leaflet/dist/leaflet.css";

import scooter from '../assets/scooter.png';
import home from '../assets/home.png';

const deliveryBoyIcon = new L.icon({
    iconUrl: scooter,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});
const customerIcon = new L.icon({
    iconUrl: home,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

function DeliveryBoyTracking({ data }) {

    const deliveryBoyLat = data?.deliveryBoyLocation?.lat;
    const deliveryBoyLng = data?.deliveryBoyLocation?.lng;
    const customerLat = data?.customerLocation?.lat;
    const customerLng = data?.customerLocation?.lng;

    // Don't render map if coordinates are missing
    if (!deliveryBoyLat || !deliveryBoyLng || !customerLat || !customerLng) {
        return (
            <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md flex items-center justify-center bg-gray-100'>
                <p className='text-gray-500'>Loading map...</p>
            </div>
        );
    }

    const path = [
        [deliveryBoyLat, deliveryBoyLng],
        [customerLat, customerLng],
    ];

    const center = [deliveryBoyLat, deliveryBoyLng];

    return (
        <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md'>
            <MapContainer
                className="h-full w-full"
                center={center}
                zoom={16}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[deliveryBoyLat, deliveryBoyLng]} icon={deliveryBoyIcon} >
                <Popup>Delivery Boy</Popup>
                </Marker>
                <Marker position={[customerLat, customerLng]} icon={customerIcon} >
                <Popup>Customer</Popup>
                </Marker>
                <Polyline positions={path} color="blue" weight={4} />
            </MapContainer>
        </div>
    )
}

export default DeliveryBoyTracking