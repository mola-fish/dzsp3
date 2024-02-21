// 表站点结构
export interface SitesData {
  aerological_station_check_level: string
  atmospheric_composition_station_name: string
  other_station_name: string
  county: string
  new_generation_manage_level: string
  ellipsoid_height: string
  type: string
  MET_check_level: string
  MET_manage_level: string
  province: string
  ground_station_check_level: string
  new_generation_code: string
  ground_station_name: string
  MET_code: string
  id: number
  soil_moisture_station_name: string
  lat: string
  height: string
  ground_station_code: string
  MET_name: string
  f62: string
  lng: string
  wind_profile_radar_name: string
  level: string
  atmospheric_composition_station_code: string
  thunder_observing_station_code: string
  soil_moisture_station_manage_level: string
  wind_profile_manage_level: string
  soil_moisture_station_check_level: string
  origin_type: string
  labels: string
  build_date: string
  lng_base: string
  new_generation_name: string
  aerological_station_code: string
  belongs: string
  name: string
  other_station_manage_level: string
  thunder_observing_station_check_level: string
  code: string
  build_state: string
  city: string
  origin: string
  plan_date: string
  soil_moisture_station_type: string
  ground_station_manage_level: string
  other_station_check_level: string
  atmospheric_composition_station_level: string
  wind_profile_radar_code: string
  thunder_observing_station_manage_level: string
  wind_profile_check_level: string
  aerological_station_manage_level: string
  address: string
  ground_station_type: string
  other_station_code: string
  lat_base: string
  aerological_station_name: string
  atmospheric_composition_station_type: string
  plan_time: string
  soil_moisture_station_code: string
  thunder_observing_station_name: string
  new_generation_check_level: string
  [key: string]: any; //动态添加属性
}

export interface Pointcg{
      name: string,
      visible: boolean,
      type: string,
      enableCluster: boolean,
      enableAnimation: boolean,
      data: {
        data: SitesData[],
        meta: {
          //epsg: 'type',
          x: string,
          y: string,
          z: string,
        },
      },
      style: {
        label: {
          text: string,
          font: string,
          offset: number[],
          color: string,
          backgroundColor: string,
          backgroundBouderColor: string,
          backgroundBorderWidth: number,
          backgroundBorderRadius: number,
          background: boolean,
          visible: boolean,
          visibleRange: number[],
          depthDistance: number,
        },
        icon: {
          src: string,
          width: number,
          height: number,
          offset: number[],
          visibleRange: number[],
          scaleDistance: number[],
          depthDistance: number,
        },
      },
}


