interface MapConfigRoot {
  dts: string;
  version: string;
  map: MapConfigMap[];
  models: MapConfigModels[];
  menuConfig?: Array<MenuConfigItem>;
  menus: MapConfigMenus[];
  layers: MapConfigLayers[];
  labels: MapConfigLayers[];
}

interface MenuConfigItem {
    "name": string,
    "type": string,
    "key": string
}

interface MapConfigLayers {
  type: string;
  name: string;
  children: MapConfigChildren_2[];
}

interface MapConfigChildren_2 {
  name: string;
  visible: boolean;
  type: string;
  url: string;
  enableCluster: boolean;
  enableAnimation: boolean;
  ui: MapConfigUi;
  data: object;
  style: MapConfigStyle_2;
}

interface MapConfigStyle_2 {
  label: MapConfigLabel;
  icon: MapConfigIcon;
  tip: string;
}

interface MapConfigIcon {
  src: string;
  width: number;
  height: number;
}

interface MapConfigLabel {
  text: string;
  font: string;
  offset: number[];
  color: string;
  "background-color": string;
  background: boolean;
  visible: boolean;
  "scale-distance": number[];
  "visible-range": number[];
}

interface MapConfigUi {
  menu: boolean;
  bind: string[];
}

interface MapConfigMenus {
  type: string;
  name: string;
  children: MapConfigChildren_1[];
}

interface MapConfigChildren_1 {
  name: string;
  visible: boolean;
  type: string;
  url: string;
  enableCluster: boolean;
  enableAnimation: boolean;
  ui: MapConfigUi;
  data: object;
  style: MapConfigStyle_1;
  id?: string;
}

interface MapConfigStyle_1 {
  label: MapConfigLabel;
  icon: MapConfigIcon;
  tip: string;
}

interface MapConfigModels {
  type: string;
  name: string;
  children: any[];
}

interface MapConfigMap {
  type: string;
  name: string;
  children: MapConfigChildren[];
}

interface MapConfigChildren {
  name: string;
  type: string;
  visible?: boolean;
  url: string;
  style: MapConfigStyle;
}

interface MapConfigStyle {
  "map-type": string;
  subdomains: string;
  scheme: string;
  "map-type1"?: string;
}
