// Static image map for road sign assets.
// React Native requires static strings in require(), so every image must be
// listed explicitly. The keys match the "image" field in road-signs.json.
//
// When you add new images to the asset folders, add a matching entry here.

import { ImageSourcePropType } from 'react-native';

const SIGN_IMAGES: Record<string, ImageSourcePropType> = {
  /* ── DANGER (Class A) ──────────────────────────────────── */
  'assets/images/Class_A/danger_warning_sign.png': require('../assets/images/Class_A/danger_warning_sign.png'),
  'assets/images/Class_A/t-junction.png': require('../assets/images/Class_A/t-junction.png'),
  'assets/images/Class_A/road_junction_ahead _Y.png': require('../assets/images/Class_A/road_junction_ahead _Y.png'),
  'assets/images/Class_A/curve-ahead.png': require('../assets/images/Class_A/curve-ahead.png'),
  'assets/images/Class_A/sharp-curve-ahead.png': require('../assets/images/Class_A/sharp-curve-ahead.png'),
  'assets/images/Class_A/double-curve-ahead.png': require('../assets/images/Class_A/double-curve-ahead.png'),
  'assets/images/Class_A/well_left.png': require('../assets/images/Class_A/well_left.png'),
  'assets/images/Class_A/rock-falls-ahead.png': require('../assets/images/Class_A/rock-falls-ahead.png'),
  'assets/images/Class_A/road-narrows-right.png': require('../assets/images/Class_A/road-narrows-right.png'),
  'assets/images/Class_A/road-narrows-centrally.png': require('../assets/images/Class_A/road-narrows-centrally.png'),
  'assets/images/Class_A/road-narrows-left.png': require('../assets/images/Class_A/road-narrows-left.png'),
  'assets/images/Class_A/two-way-traffic-ahead.png': require('../assets/images/Class_A/two-way-traffic-ahead.png'),
  'assets/images/Class_A/narrow-bridge-ahead.png': require('../assets/images/Class_A/narrow-bridge-ahead.png'),
  'assets/images/Class_A/narrow-grid-ahead.png': require('../assets/images/Class_A/narrow-grid-ahead.png'),
  'assets/images/Class_A/grid-ahead.png': require('../assets/images/Class_A/grid-ahead.png'),
  'assets/images/Class_A/side-road-ahead.png': require('../assets/images/Class_A/side-road-ahead.png'),
  'assets/images/Class_A/cross-road-ahead.png': require('../assets/images/Class_A/cross-road-ahead.png'),
  'assets/images/Class_A/steep-descent-ahead.png': require('../assets/images/Class_A/steep-descent-ahead.png'),
  'assets/images/Class_A/steep-ascent-ahead.png': require('../assets/images/Class_A/steep-ascent-ahead.png'),
  'assets/images/Class_A/dip-in-road-ahead.png': require('../assets/images/Class_A/dip-in-road-ahead.png'),
  'assets/images/Class_A/hump-in-road-ahead.png': require('../assets/images/Class_A/hump-in-road-ahead.png'),
  'assets/images/Class_A/look-out-for-children-ahead.png': require('../assets/images/Class_A/look-out-for-children-ahead.png'),
  'assets/images/Class_A/look-out-for-pedestrians-ahead.png': require('../assets/images/Class_A/look-out-for-pedestrians-ahead.png'),
  'assets/images/Class_A/pedestrian-crossing-ahead.png': require('../assets/images/Class_A/pedestrian-crossing-ahead.png'),
  'assets/images/Class_A/vehicles-greater-width.png': require('../assets/images/Class_A/vehicles-greater-width.png'),
  'assets/images/Class_A/vehicles-greater-height.png': require('../assets/images/Class_A/vehicles-greater-height.png'),
  'assets/images/Class_A/animals-on-road-ahead.png': require('../assets/images/Class_A/animals-on-road-ahead.png'),
  'assets/images/Class_A/animal-crossing-ahead.png': require('../assets/images/Class_A/animal-crossing-ahead.png'),
  'assets/images/Class_A/elephants-crossing-ahead.png': require('../assets/images/Class_A/elephants-crossing-ahead.png'),
  'assets/images/Class_A/antelopes-crossing-ahead.png': require('../assets/images/Class_A/antelopes-crossing-ahead.png'),
  'assets/images/Class_A/slippery-road-ahead.png': require('../assets/images/Class_A/slippery-road-ahead.png'),
  'assets/images/Class_A/gravel-road-ahead.png': require('../assets/images/Class_A/gravel-road-ahead.png'),
  'assets/images/Class_A/detour-ahead.png': require('../assets/images/Class_A/detour-ahead.png'),
  'assets/images/Class_A/slow-down-ahead.png': require('../assets/images/Class_A/slow-down-ahead.png'),
  'assets/images/Class_A/road-workers-ahead.png': require('../assets/images/Class_A/road-workers-ahead.png'),
  'assets/images/Class_A/rail-road-level-crossing-ahead.png': require('../assets/images/Class_A/rail-road-level-crossing-ahead.png'),
  'assets/images/Class_A/physical-barrier-ahead.png': require('../assets/images/Class_A/physical-barrier-ahead.png'),
  'assets/images/Class_A/stop-or-give-way-sign-ahead.png': require('../assets/images/Class_A/stop-or-give-way-sign-ahead.png'),
  'assets/images/Class_A/robot-ahead.png': require('../assets/images/Class_A/robot-ahead.png'),
  'assets/images/Class_A/roundabout-ahead.png': require('../assets/images/Class_A/roundabout-ahead.png'),




  /* ── REGULATORY (Class B) ──────────────────────────────── */
  'assets/images/Class_B/passage-prohibited-arrow.png': require('../assets/images/Class_B/passage-prohibited-arrow.png'),
  'assets/images/Class_B/direction-arrow.png': require('../assets/images/Class_B/direction-arrow.png'),
  'assets/images/Class_B/about-turn-prohibited.png': require('../assets/images/Class_B/about-turn-prohibited.png'),
  'assets/images/Class_B/turn-left-prohibited.png': require('../assets/images/Class_B/turn-left-prohibited.png'),
  'assets/images/Class_B/turn-right-prohibited.png': require('../assets/images/Class_B/turn-right-prohibited.png'),
  'assets/images/Class_B/railroad-crossing.png': require('../assets/images/Class_B/railroad-crossing.png'),
  'assets/images/Class_B/robot-turn-right-prohibited.png': require('../assets/images/Class_B/robot-turn-right-prohibited.png'),
  'assets/images/Class_B/parking-prohibited-arrow.png': require('../assets/images/Class_B/parking-prohibited-arrow.png'),
  'assets/images/Class_B/parking-period-arrow.png': require('../assets/images/Class_B/parking-period-arrow.png'),
  'assets/images/Class_B/parking-period.png': require('../assets/images/Class_B/parking-period.png'),
  'assets/images/Class_B/parking-class.png': require('../assets/images/Class_B/parking-class.png'),
  'assets/images/Class_B/stopping-prohibited-arrow.png': require('../assets/images/Class_B/stopping-prohibited-arrow.png'),
  'assets/images/Class_B/cyclists-prohibited.png': require('../assets/images/Class_B/cyclists-prohibited.png'),
  'assets/images/Class_B/stop-customs.png': require('../assets/images/Class_B/stop-customs.png'),
  'assets/images/Class_B/overtaking-prohibited.png': require('../assets/images/Class_B/overtaking-prohibited.png'),
  'assets/images/Class_B/no-stop-wait-parking.png': require('../assets/images/Class_B/no-stop-wait-parking.png'),
  'assets/images/Class_B/parking-special.png': require('../assets/images/Class_B/parking-special.png'),
  'assets/images/Class_B/speed-limit-general.png': require('../assets/images/Class_B/speed-limit-general.png'),
  'assets/images/Class_B/speed-limit-different.png': require('../assets/images/Class_B/speed-limit-different.png'),
  'assets/images/Class_B/speed-limit.png': require('../assets/images/Class_B/speed-limit.png'),
  'assets/images/Class_B/gross-mass-prohibited.png': require('../assets/images/Class_B/gross-mass-prohibited.png'),
  'assets/images/Class_B/width-prohibited.png': require('../assets/images/Class_B/width-prohibited.png'),
  'assets/images/Class_B/height-prohibited.png': require('../assets/images/Class_B/height-prohibited.png'),
  'assets/images/Class_B/no-entry.png': require('../assets/images/Class_B/no-entry.png'),
  'assets/images/Class_B/give-way-all.png': require('../assets/images/Class_B/give-way-all.png'),
  'assets/images/Class_B/parking-loading.png': require('../assets/images/Class_B/parking-loading.png'),
  'assets/images/Class_B/stopping-bus.png': require('../assets/images/Class_B/stopping-bus.png'),
  'assets/images/Class_B/stop-line.png': require('../assets/images/Class_B/stop-line.png'),
  'assets/images/Class_B/give-way-cross.png': require('../assets/images/Class_B/give-way-cross.png'),
  'assets/images/Class_B/cyclists-stop-give-way.png': require('../assets/images/Class_B/cyclists-stop-give-way.png'),
  'assets/images/Class_B/cyclists-give-way-cross.png': require('../assets/images/Class_B/cyclists-give-way-cross.png'),
  'assets/images/Class_B/temp-traffic-control_GO.png': require('../assets/images/Class_B/temp-traffic-control_GO.png'),
  'assets/images/Class_B/temp-traffic-control_STOP.png': require('../assets/images/Class_B/temp-traffic-control_STOP.png'),

  
  /* ── INFORMATIVE (Class C) ─────────────────────────────── */
'assets/images/Class_C/advance-direction.png': require('../assets/images/Class_C/advance-direction.png'),
  'assets/images/Class_C/advance-information.png': require('../assets/images/Class_C/advance-information.png'),
  'assets/images/Class_C/place-name.png': require('../assets/images/Class_C/place-name.png'),
  'assets/images/Class_C/distance-sign.png': require('../assets/images/Class_C/distance-sign.png'),
  'assets/images/Class_C/detour-direction.png': require('../assets/images/Class_C/detour-direction.png'),
  'assets/images/Class_C/police-control.png': require('../assets/images/Class_C/police-control.png'),
  'assets/images/Class_C/dual-carriageway.png': require('../assets/images/Class_C/dual-carriageway.png'),
  'assets/images/Class_C/direction-sign.png': require('../assets/images/Class_C/direction-sign.png'),
  'assets/images/Class_C/direction-hospital.png': require('../assets/images/Class_C/direction-hospital.png'),
  'assets/images/Class_C/direction-first-aid.png': require('../assets/images/Class_C/direction-first-aid.png'),
  'assets/images/Class_C/de-restriction.png': require('../assets/images/Class_C/de-restriction.png'),
  'assets/images/Class_C/cycle-track.png': require('../assets/images/Class_C/cycle-track.png'),
  'assets/images/Class_C/no-through-road.png': require('../assets/images/Class_C/no-through-road.png'),
  'assets/images/Class_C/taxi-rank.png': require('../assets/images/Class_C/taxi-rank.png'),
  'assets/images/Class_C/bus-stop.png': require('../assets/images/Class_C/bus-stop.png'),
  'assets/images/Class_C/parking-area.png': require('../assets/images/Class_C/parking-area.png'),
  'assets/images/Class_C/direction-parking.png': require('../assets/images/Class_C/direction-parking.png'),
  'assets/images/Class_C/lay-by.png': require('../assets/images/Class_C/lay-by.png'),
  'assets/images/Class_C/rest-place.png': require('../assets/images/Class_C/rest-place.png'),
  'assets/images/Class_C/one-way-direction.png': require('../assets/images/Class_C/one-way-direction.png'),

  /* ── TRAFFIC_LIGHT (Class D) ───────────────────────────── */
  'assets/images/Class_D/stop.png': require('../assets/images/Class_D/stop.png'),
  'assets/images/Class_D/warning-stop.png': require('../assets/images/Class_D/warning-stop.png'),
  'assets/images/Class_D/proceed-caution.png': require('../assets/images/Class_D/proceed-caution.png'),
  'assets/images/Class_D/right-turn-clear.png': require('../assets/images/Class_D/right-turn-clear.png'),
  'assets/images/Class_D/rail-crossing-flashing.png': require('../assets/images/Class_D/rail-crossing-flashing.png'),
  'assets/images/Class_D/flashing-signal.png': require('../assets/images/Class_D/flashing-signal.png'),
  'assets/images/Class_D/straight-only.png': require('../assets/images/Class_D/straight-only.png'),
  'assets/images/Class_D/left-turn-clear.png': require('../assets/images/Class_D/left-turn-clear.png'),
  'assets/images/Class_D/proceed-green-arrow.png': require('../assets/images/Class_D/proceed-green-arrow.png'),
  'assets/images/Class_D/caution-yield-right.png': require('../assets/images/Class_D/caution-yield-right.png'),



  /* ── CARRIAGEWAY (Class E) ─────────────────────────────── */
 'assets/images/Class_E/vehicle-left-ab-ba.png': require('../assets/images/Class_E/vehicle-left-ab-ba.png'),
  'assets/images/Class_E/vehicle-left-ad-bc-cross.png': require('../assets/images/Class_E/vehicle-left-ad-bc-cross.png'),
  'assets/images/Class_E/double-prohibition-line.png': require('../assets/images/Class_E/double-prohibition-line.png'),
  'assets/images/Class_E/pedestrian-crossing.png': require('../assets/images/Class_E/pedestrian-crossing.png'),
  'assets/images/Class_E/direction-arrows-prohibition.png': require('../assets/images/Class_E/direction-arrows-prohibition.png'),
  'assets/images/Class_E/edge-carriageway.png': require('../assets/images/Class_E/edge-carriageway.png')

};

/**
 * Look up the static require() source for a road-sign image path.
 * Returns undefined when the image hasn't been added to the map yet.
 */
export function getSignImage(imagePath?: string): ImageSourcePropType | undefined {
  if (!imagePath) return undefined;
  return SIGN_IMAGES[imagePath];
}

export default SIGN_IMAGES;
