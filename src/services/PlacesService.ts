export type PlaceType = 'veterinary_care' | 'pet_store' | 'spa' | 'groomer'

export interface NearbyPlace {
  id: string
  name: string
  address: string
  distanceMeters: number
  phone?: string
  website?: string
}

function toQuery(type: PlaceType): string {
  switch (type) {
    case 'veterinary_care': return 'veterinary clinic';
    case 'groomer': return 'pet groomer';
    case 'pet_store': return 'pet store';
    case 'spa': return 'pet spa';
  }
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000
  const toRad = (x: number) => x * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

class PlacesService {
  private async getCoords(): Promise<{ lat: number; lng: number } | null> {
    if (!('geolocation' in navigator)) return null
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 }
      )
    })
  }

  async findNearby(type: PlaceType, _lat?: number, _lng?: number): Promise<NearbyPlace[]> {
    const coords = (typeof _lat === 'number' && typeof _lng === 'number') ? { lat: _lat, lng: _lng } : await this.getCoords()
    const q = toQuery(type)
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', q)
    if (coords) {
      url.searchParams.set('viewbox', `${coords.lng-0.1},${coords.lat+0.1},${coords.lng+0.1},${coords.lat-0.1}`)
      url.searchParams.set('bounded', '1')
    }
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('limit', '10')

    const resp = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
    const data = await resp.json()
    const results: NearbyPlace[] = (data || []).map((d: any) => {
      const lat = parseFloat(d.lat)
      const lon = parseFloat(d.lon)
      const dist = coords ? Math.round(haversineMeters(coords.lat, coords.lng, lat, lon)) : 0
      return {
        id: d.place_id?.toString() ?? `${lat},${lon}`,
        name: d.display_name?.split(',')[0] ?? 'Unknown',
        address: d.display_name ?? '',
        distanceMeters: dist,
        phone: undefined,
        website: undefined,
      }
    })
    return results
  }
}

export default new PlacesService()

