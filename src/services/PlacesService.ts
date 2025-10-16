export type PlaceType = 'veterinary_care' | 'pet_store' | 'spa' | 'groomer'

export interface NearbyPlace {
  id: string
  name: string
  address: string
  distanceMeters: number
  phone?: string
  website?: string
}

class PlacesService {
  async findNearby(_type: PlaceType, _lat: number, _lng: number): Promise<NearbyPlace[]> {
    // TODO: Integrate Google Places or OpenStreetMap Nominatim here.
    // Stubbed data.
    return [
      { id: '1', name: 'Happy Paws Vet Clinic', address: '123 Main St', distanceMeters: 850 },
      { id: '2', name: 'Purrfect Groomers', address: '456 Oak Ave', distanceMeters: 1200 },
    ]
  }
}

export default new PlacesService()

