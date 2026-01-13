'use client'

interface OfficeLocation {
  name: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  lat?: number
  lng?: number
}

interface MapProps {
  locations?: OfficeLocation[]
}

export default function Map({ locations }: MapProps) {
  const defaultLocations: OfficeLocation[] = [
    {
      name: 'Dubai Headquarters',
      address: '123 Logistics Street',
      city: 'Dubai',
      country: 'UAE',
      phone: '+971 4 873692',
      email: 'dubai@albarid.com',
      lat: 25.2048,
      lng: 55.2708,
    },
    {
      name: 'Riyadh Office',
      address: '456 Business District',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      phone: '+966 11 XXX XXXX',
      email: 'riyadh@albarid.com',
      lat: 24.7136,
      lng: 46.6753,
    },
    {
      name: 'Kuwait Branch',
      address: '789 Trade Center',
      city: 'Kuwait City',
      country: 'Kuwait',
      phone: '+965 XXXX XXXX',
      email: 'kuwait@albarid.com',
      lat: 29.3759,
      lng: 47.9774,
    },
  ]

  const offices = locations || defaultLocations

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Office Locations</h3>
        <p className="text-gray-600">Visit us at one of our locations across the Middle East</p>
      </div>
      
      {/* Map Container */}
      <div className="relative w-full h-96 bg-gray-200">
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <iframe
            src={`https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=25.2048,55.2708&zoom=6`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p>Map view requires Google Maps API key</p>
              <p className="text-sm mt-2">Office locations listed below</p>
            </div>
          </div>
        )}
      </div>

      {/* Office Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offices.map((office, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 mb-2">{office.name}</h4>
              <p className="text-sm text-gray-600 mb-2">
                {office.address}
                <br />
                {office.city}, {office.country}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Phone:</span> {office.phone}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Email:</span>{' '}
                <a href={`mailto:${office.email}`} className="text-primary hover:underline">
                  {office.email}
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}