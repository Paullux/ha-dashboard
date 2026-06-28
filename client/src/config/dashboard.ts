export const ENTITIES = {
  ambient: {
    tempIndoor:  "sensor.temperature_interieure",
    tempOutdoor: "sensor.temperature_exterieure",
    humidity:    "sensor.sonde_salon_humidity",
    season:      "sensor.saison_appartement",
    modeApt:     "input_select.mode_appartement",
  },

  weather: {
    entity: "weather.forecast_maison",
  },

  energy: {
    currentPower: "sensor.elec_reference_6_kva_peak_offpeak_consommation_actuelle",
    yesterdayKwh: "sensor.linky_09756439941653_consumption",
    unit:         "kW",
  },

  climate: {
    entity: "climate.climatisation",
    modes: [
      { label: "Froid",  value: "cool", color: "#3b82f6" },
      { label: "Chaud",  value: "heat", color: "#f97316" },
      { label: "Sec",    value: "dry",  color: "#22c55e" },
      { label: "Auto",   value: "auto", color: "#8b5cf6" },
      { label: "Éteint", value: "off",  color: "#475569" },
    ],
    fanModes:   ["1", "2", "3"],
    fanLabels:  ["Faible", "Moyen", "Fort"],
    swingModes:    ["off", "on"],
    swingSwitch:   "switch.oscillation_climatisation",
    swingSensor:   "sensor.swing_mode_climatisation",
    sleepSwitch:   "switch.sleep_climatisation",
    sleepSensor:   "sensor.sleep_mode_climatisation",
  },

  heating: {
    rooms: [
      { label: "Salon TV",       entity: "climate.salon_tv",        offScript: "script.salon_tv_off" },
      { label: "Chambre",        entity: "climate.chambre",         offScript: "script.chambre_off" },
      { label: "Cuisine",        entity: "climate.cuisine",         offScript: "script.cuisine_off" },
      { label: "Salle de bain",  entity: "climate.salle_de_bain",  offScript: "script.salle_de_bain_off" },
      { label: "Salle à manger", entity: "climate.salle_a_manger", offScript: "script.salle_a_manger_off" },
    ],
    globalOffScript: "script.voltalis_global_off",
    modes: [
      { label: "Hors-gel", value: "heat_cool", color: "#3b82f6" },
      { label: "Éco",      value: "cool",      color: "#22c55e" },
      { label: "Confort",  value: "heat",      color: "#f97316" },
      { label: "Boost",    value: "auto",      color: "#ef4444" },
      { label: "Éteint",   value: "off",       color: "#475569" },
    ],
    minTemp: 10,
    maxTemp: 30,
  },

  // Le climatiseur couvre le salon + salle à manger (un seul appareil)
  rooms: [
    {
      id: "salon", label: "Salon", icon: "🛋️",
      tempEntity: "climate.climatisation", lightEntity: "light.lumieres_sejour",
      devices: [
        { label: "Lumières Séjour",  entity: "light.lumieres_sejour",  type: "light" as const },
        { label: "Climatiseur",      entity: "climate.climatisation",  type: "climate" as const },
        { label: "Radiateur",        entity: "climate.salon_tv",       type: "climate" as const },
      ],
    },
    {
      id: "cuisine", label: "Cuisine", icon: "🍳",
      tempEntity: "climate.cuisine", lightEntity: "light.cuisine",
      devices: [
        { label: "Lumière Cuisine",  entity: "light.cuisine",          type: "light" as const },
        { label: "Radiateur",        entity: "climate.cuisine",        type: "climate" as const },
      ],
    },
    {
      id: "chambre", label: "Chambre", icon: "🛏️",
      tempEntity: "climate.chambre", lightEntity: "light.lampe_chambre",
      devices: [
        { label: "Lampe Chambre",    entity: "light.lampe_chambre",   type: "light" as const },
        { label: "Radiateur",        entity: "climate.chambre",       type: "climate" as const },
      ],
    },
    {
      id: "sdb", label: "Salle de bain", icon: "🛁",
      tempEntity: "climate.salle_de_bain", lightEntity: null,
      devices: [
        { label: "Radiateur",        entity: "climate.salle_de_bain", type: "climate" as const },
      ],
    },
    {
      id: "bureau", label: "Bureau", icon: "🖥️",
      tempEntity: null, lightEntity: "light.bureau",
      devices: [
        { label: "Lampe Bureau",     entity: "light.bureau",          type: "light" as const },
      ],
    },
    {
      id: "couloir", label: "Couloir", icon: "🚪",
      tempEntity: null, lightEntity: "light.couloir",
      devices: [
        { label: "Lampe Couloir",    entity: "light.couloir",         type: "light" as const },
      ],
    },
    {
      id: "salle_manger", label: "Salle à manger", icon: "🍽️",
      tempEntity: "climate.climatisation", lightEntity: null,
      devices: [
        { label: "Climatiseur",      entity: "climate.climatisation",  type: "climate" as const },
        { label: "Radiateur",        entity: "climate.salle_a_manger", type: "climate" as const },
      ],
    },
  ],

  lights: {
    favorites: [
      { label: "Séjour",   entity: "light.lumieres_sejour" },
      { label: "Cuisine",  entity: "light.cuisine" },
      { label: "Chambre",  entity: "light.lampe_chambre" },
      { label: "Bureau",   entity: "light.bureau" },
      { label: "Couloir",  entity: "light.couloir" },
    ],
    rooms: [
      {
        label: "Séjour",  entity: "light.lumieres_sejour",
        colorPresets: [
          { label: "Blanc", color: "#ffffff", kelvin: 4000 },
          { label: "Chaud", color: "#ffb347", kelvin: 2700 },
          { label: "Rouge", color: "#ef4444", rgb: [255, 50,  50]  as [number,number,number] },
          { label: "Vert",  color: "#22c55e", rgb: [50,  255, 100] as [number,number,number] },
          { label: "Bleu",  color: "#3b82f6", rgb: [50,  100, 255] as [number,number,number] },
        ],
      },
      {
        label: "Chambre", entity: "light.lampe_chambre",
        colorPresets: [
          { label: "Blanc", color: "#ffffff", kelvin: 4000 },
          { label: "Chaud", color: "#ffb347", kelvin: 2700 },
          { label: "Rouge", color: "#ef4444", rgb: [255, 50,  50]  as [number,number,number] },
          { label: "Vert",  color: "#22c55e", rgb: [50,  255, 100] as [number,number,number] },
          { label: "Bleu",  color: "#3b82f6", rgb: [50,  100, 255] as [number,number,number] },
        ],
      },
      {
        label: "Bureau",  entity: "light.bureau",
        colorPresets: [
          { label: "Blanc", color: "#ffffff", kelvin: 4000 },
          { label: "Chaud", color: "#ffb347", kelvin: 2700 },
          { label: "Rouge", color: "#ef4444", rgb: [255, 50,  50]  as [number,number,number] },
          { label: "Vert",  color: "#22c55e", rgb: [50,  255, 100] as [number,number,number] },
          { label: "Bleu",  color: "#3b82f6", rgb: [50,  100, 255] as [number,number,number] },
        ],
      },
      {
        label: "Couloir", entity: "light.couloir",
        colorPresets: [
          { label: "Blanc", color: "#ffffff", kelvin: 4000 },
          { label: "Chaud", color: "#ffb347", kelvin: 2700 },
          { label: "Rouge", color: "#ef4444", rgb: [255, 50,  50]  as [number,number,number] },
          { label: "Vert",  color: "#22c55e", rgb: [50,  255, 100] as [number,number,number] },
          { label: "Bleu",  color: "#3b82f6", rgb: [50,  100, 255] as [number,number,number] },
        ],
      },
      {
        label: "Cuisine", entity: "light.cuisine",
        colorPresets: [
          { label: "Blanc", color: "#ffffff", kelvin: 4000 },
          { label: "Chaud", color: "#ffb347", kelvin: 2700 },
          { label: "Rouge", color: "#ef4444", rgb: [255, 50,  50]  as [number,number,number] },
          { label: "Vert",  color: "#22c55e", rgb: [50,  255, 100] as [number,number,number] },
          { label: "Bleu",  color: "#3b82f6", rgb: [50,  100, 255] as [number,number,number] },
        ],
      },
    ],
  },

  // Scènes à créer dans HA : soiree_cinema, diner, lecture, reveil, nuit, depart
  scenes: [
    { label: "Soirée cinéma", entity: "scene.soiree_cinema", icon: "🎬" },
    { label: "Dîner",         entity: "scene.diner",         icon: "🍽️" },
    { label: "Lecture",       entity: "scene.lecture",       icon: "📖" },
    { label: "Réveil",        entity: "scene.reveil",        icon: "🌅" },
    { label: "Nuit",          entity: "scene.nuit",          icon: "🌙" },
    { label: "Départ",        entity: "script.depart",       icon: "🚗" },
  ],

  quickActions: [
    { label: "Tout éteindre", entity: "script.a_demain",              icon: "⏻", color: "#ef4444" },
    { label: "Mode Nuit",     entity: "scene.nuit",                   icon: "🌙", color: "#8b5cf6" },
    { label: "Mode Absence",  entity: "script.voltalis_global_away",   icon: "🔒", color: "#f97316" },
    { label: "Mode Confort",  entity: "script.voltalis_global_comfort", icon: "🌿", color: "#22c55e" },
    { label: "Mode Éco",      entity: "script.voltalis_global_eco",    icon: "🍃", color: "#16a34a" },
  ],

  automations: [
    { label: "Présence couloir",  entity: "automation.presence_couloir_allumage",                    description: "Détecteur de mouvement" },
    { label: "Présence cuisine",  entity: "automation.presence_cuisine_allumage",                    description: "Détecteur de mouvement" },
    { label: "Présence séjour",   entity: "automation.presence_sejour_allumage",                     description: "Détecteur de mouvement" },
    { label: "Coucher du soleil", entity: "automation.coucher_du_soleil_fallback_sejour",            description: "Fallback séjour" },
    { label: "Lever du soleil",   entity: "automation.lever_du_soleil_extinction_lumieres",          description: "Extinction lumières" },
    { label: "Retour maison",     entity: "automation.retour_maison_demarrage_clim",                 description: "Démarrage clim" },
    { label: "Chauffage auto",    entity: "automation.chauffage_demarrage_automatique_si_tdeg_basse", description: "Si T° basse" },
    { label: "Mode appartement",  entity: "automation.mode_appartement_automatique_selon_saison",    description: "Selon saison" },
  ],
} as const;

export type RoomConfig    = typeof ENTITIES.rooms[number];
export type RoomLight     = typeof ENTITIES.lights.rooms[number];
export type RoomHeating   = typeof ENTITIES.heating.rooms[number];
export type SceneConfig   = typeof ENTITIES.scenes[number];
export type QuickAction   = typeof ENTITIES.quickActions[number];
export type AutomationCfg = typeof ENTITIES.automations[number];
