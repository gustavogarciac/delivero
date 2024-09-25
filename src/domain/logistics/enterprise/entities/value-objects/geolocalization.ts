type GeolocalizationProps = {
  latitude: number
  longitude: number
}

export class Geolocalization {
  private props: GeolocalizationProps

  constructor(props: GeolocalizationProps) {
    this.props = props
  }
  
  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  static create(props: GeolocalizationProps): Geolocalization {
    return new Geolocalization(props)
  }
}