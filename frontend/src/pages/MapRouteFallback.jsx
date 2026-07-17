import React from "react";

const MapRouteFallback = ({ origin, destination }) => {
  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-3xl p-4 text-sm text-gray-600">
      <div className="font-bold text-gray-900 mb-2">Map is not available</div>
      <div className="text-xs leading-relaxed">
        Google Maps API key was not provided (missing <span className="font-semibold">VITE_GOOGLE_MAPS_API_KEY</span>).
        <br />
        Showing placeholder route panel.
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-3">
          <div className="text-[10px] uppercase font-bold text-gray-400">Origin</div>
          <div className="font-semibold text-gray-800">{origin?.label || "Patient Location"}</div>
          <div className="text-xs text-gray-500">{origin?.lat}, {origin?.lng}</div>
        </div>
        <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-3">
          <div className="text-[10px] uppercase font-bold text-gray-400">Destination</div>
          <div className="font-semibold text-gray-800">{destination?.label || "Recommended Hospital"}</div>
          <div className="text-xs text-gray-500">{destination?.lat}, {destination?.lng}</div>
        </div>
      </div>
    </div>
  );
};

export default MapRouteFallback;

