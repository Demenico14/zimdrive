export type Category =
  | 'road-signs'
  | 'rules-of-the-road'
  | 'safety'
  | 'controls'
  | 'intersections'
  | 'parking';

export interface Question {
  id: number;
  category: Category;
  question: string;
  image?: string;
  options: { A: string; B: string; C: string; };
  correctAnswer: 'A' | 'B' | 'C' ;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; description: string; color: string }
> = {
  'road-signs': {
    label: 'Road Signs',
    icon: 'warning',
    description: 'Warning, regulatory, and information signs',
    color: '#DC2626',
  },
  'rules-of-the-road': {
    label: 'Rules of the Road',
    icon: 'menu-book',
    description: 'Traffic laws and driving regulations',
    color: '#2563EB',
  },
  safety: {
    label: 'Safety',
    icon: 'shield',
    description: 'Defensive driving and road safety',
    color: '#0E8A3E',
  },
  controls: {
    label: 'Vehicle Controls',
    icon: 'settings',
    description: 'Dashboard, pedals, and vehicle operations',
    color: '#7C3AED',
  },
  intersections: {
    label: 'Intersections',
    icon: 'call-split',
    description: 'Roundabouts, junctions, and right of way',
    color: '#EA580C',
  },
  parking: {
    label: 'Parking',
    icon: 'local-parking',
    description: 'Parking rules and manoeuvres',
    color: '#0891B2',
  },
};

export const QUESTIONS: Question[] = [
  // ── Road Signs ──
  {
    id: 1,
    category: 'road-signs',
    question: 'The sign indicates: ',
    image: 'assets/images/Class_C/de-restriction.png',
    options: {
      A: 'Hospital ahead',
      B: 'End of speed restriction',
      C: 'Broken down Vehicles ahead',
      
    },
    correctAnswer: 'B',
    explanation:
      'The previously imposed driving restrictions (such as vehicle class, speed, or license limitations) have ended, allowing motorists to resume normal driving conditions beyond that point.',
    difficulty: 'easy',
    tags: ['regulatory', 'prohibition'],
  },
  {
    id: 2,
    category: 'road-signs',
    question: 'When approaching this sign, I should: ',
    image: 'assets/images/Class_A/steep-descent-ahead.png',
    options: {
      A: 'Disengage Gears',
      B: 'Engage a lower gear',
      C: 'Apply Hand Break',
     
    },
    correctAnswer: 'B',
    explanation:
      'I should slow down, select a lower gear, and maintain controlled braking to safely descend the hill.',
    difficulty: 'easy',
    tags: ['warning', 'shape'],
  },
  {
    id: 3,
    category: 'road-signs',
    question: 'The sign indicates I am: ',
    image: 'assets/images/Class_B/about-turn-prohibited.png',
    options: {
      A: 'Permitted to make a U Turn',
      B: 'Prohibited from making a U Turn',
      C: 'Prohibited from turning right',
      
    },
    correctAnswer: 'B',
    explanation:
      'This sign indicates that making a U-turn at this location is prohibited. Drivers must continue straight or turn left if allowed, but cannot reverse direction here.',
    difficulty: 'easy',
    tags: ['mandatory', 'direction'],
  },
  {
    id: 4,
    category: 'road-signs',
    question: 'This sign indicates: ',
    image: 'assets/images/Class_A/vehicles-greater-width.png',
    options: {
      A: 'Width Restriction Ahead',
      B: 'Height Restriction Ahead',
      C: 'Flash your lights and proceed',
      
    },
    correctAnswer: 'A',
    explanation:
      'This sign indicates a width restriction ahead, warning drivers that vehicles wider than the specified limit cannot pass',
    difficulty: 'easy',
    tags: ['regulatory', 'stop'],
  },
  {
    id: 5,
    category: 'road-signs',
    question: 'At this sign I should: ',
    image: 'assets/images/Class_B/stop-line.png',
    options: {
      A: 'Stop, and only procceed when the road is clear on both sides',
      B: 'Stop, and only procceed when the road is clear on the left',
      C: 'Stop, and only procceed when the road is clear on the right',
      
    },
    correctAnswer: 'A',
    explanation:
      'You must come to a complete stop at the line and only proceed when the road is clear in both directions.',
    difficulty: 'medium',
    tags: ['priority', 'information'],
  },
  {
    id: 6,
    category: 'road-signs',
    question: 'This sign indicates that I :',
    image: 'assets/images/Class_B/parking.png',
    options: {
      A: 'May not park my vehicle ',
      B: 'May park my vehicle',
      C: 'Expect Lay-by ahead',
      
    },
    correctAnswer: 'A',
    explanation:
      'It indicates parking is not allowed at that location.',
    difficulty: 'medium',
    tags: ['warning', 'bends'],
  },
  {
    id: 7,
    category: 'road-signs',
    question: 'This sign indicates? ',
    image: 'assets/images/Class_B/railroad-crossing.png',
    options: {
      A: 'Railway Station',
      B: 'Rail-road level crossing',
      C: 'An Intersection ',
      
    },
    correctAnswer: 'B',
    explanation:
      'It indicates a rail-road level crossing where a railway line crosses the road.',
    difficulty: 'easy',
    tags: ['regulatory', 'parking'],
  },
  {
    id: 8,
    category: 'road-signs',
    question: 'This sign indicates? ',
    image: 'assets/images/Class_A/animals-on-road-ahead.png',
    options: {
      A: 'Danger of stray animals',
      B: 'Danger of wild Animals',
      C: 'Danger of farm Animals',
      
    },
    correctAnswer: 'C',
    explanation:
      'It warns drivers that farm animals may cross the road ahead, so extra caution is required.',
    difficulty: 'easy',
    tags: ['regulatory', 'speed'],
  },
  {
    id: 9,
    category: 'road-signs',
    question: 'This sign indicates? ',
    image: 'assets/images/Class_A/Ridge.png',
    options: {
      A: 'Hump Ahead',
      B: 'Dip of Ridge Ahead',
      C: 'Mountains Ahead',
      
    },
    correctAnswer: 'B',
    explanation:
      'This sign indicates a dip or ridge in the road ahead, warning drivers to slow down and be prepared for a sudden change in the road surface.',
    difficulty: 'medium',
    tags: ['information', 'tourism'],
  },
  {
    id: 10,
    category: 'road-signs',
    question:
      'This sign means that:',
    image: 'assets/images/Class_A/No_Traffic_Lights.png',
    options: {
      A: 'Rail road level crossing ahead',
      B: 'Traffic lights and rail road crossing ahead',
      C: 'Traffic lights out of order',
      
    },
    correctAnswer: 'C',
    explanation:
      'It indicates that the traffic lights ahead are out of order, so drivers must proceed with caution.',
    difficulty: 'easy',
    tags: ['regulatory', 'prohibition'],
  },

  // ── Rules of the Road ──
  {
    id: 11,
    category: 'rules-of-the-road',
    question: 'In Zimbabwe, vehicles drive on the:',
    options: {
      A: 'Right side of the road',
      B: 'Left side of the road',
      C: 'Centre of the road',
      
    },
    correctAnswer: 'B',
    explanation:
      'Zimbabwe follows the left-hand traffic system. All vehicles must drive on the left side of the road and overtake on the right.',
    difficulty: 'easy',
    tags: ['basic', 'driving-side'],
  },
  {
    id: 12,
    category: 'rules-of-the-road',
    question: 'The speed limit in a built-up area (urban) in Zimbabwe is:',
    options: {
      A: '40 km/h',
      B: '60 km/h',
      C: '80 km/h',
      
    },
    correctAnswer: 'B',
    explanation:
      'The general speed limit within built-up areas in Zimbabwe is 60 km/h unless otherwise indicated by road signs.',
    difficulty: 'easy',
    tags: ['speed', 'urban'],
  },
  {
    id: 13,
    category: 'rules-of-the-road',
    question: 'The national speed limit on open roads (outside built-up areas) in Zimbabwe is:',
    options: {
      A: '80 km/h',
      B: '100 km/h',
      C: '120 km/h',
     
    },
    correctAnswer: 'C',
    explanation:
      'The speed limit on open roads outside built-up areas in Zimbabwe is 120 km/h unless otherwise posted.',
    difficulty: 'easy',
    tags: ['speed', 'rural'],
  },
  {
    id: 14,
    category: 'rules-of-the-road',
    question: 'When approaching a roundabout, you should give way to traffic:',
    options: {
      A: 'Coming from the left',
      B: 'Coming from the right',
      C: 'Already in the roundabout from the right',
      
    },
    correctAnswer: 'C',
    explanation:
      'In Zimbabwe (left-hand traffic), you must give way to vehicles already in the roundabout approaching from your right.',
    difficulty: 'medium',
    tags: ['roundabout', 'priority'],
  },
  {
    id: 15,
    category: 'rules-of-the-road',
    question:
      'What is the minimum following distance at 60 km/h in dry conditions?',
    options: {
      A: 'One car length',
      B: 'Two seconds gap',
      C: 'Three car lengths',
      
    },
    correctAnswer: 'B',
    explanation:
      'The two-second rule is recommended for following distance. Choose a fixed point and ensure at least two seconds pass between the car ahead and yours.',
    difficulty: 'medium',
    tags: ['following-distance', 'safety'],
  },
  {
    id: 16,
    category: 'rules-of-the-road',
    question: 'What should you do when an emergency vehicle approaches with sirens on?',
    options: {
      A: 'Speed up to get out of the way',
      B: 'Stop immediately wherever you are',
      C: 'Pull over to the left and stop if safe to do so',
      
    },
    correctAnswer: 'C',
    explanation:
      'When an emergency vehicle approaches with sirens or flashing lights, pull over to the left side of the road and stop to allow it to pass safely.',
    difficulty: 'easy',
    tags: ['emergency', 'yield'],
  },
  {
    id: 17,
    category: 'rules-of-the-road',
    question: 'It is illegal to drive in Zimbabwe if your blood alcohol level exceeds:',
    options: {
      A: '0.00 mg/100ml',
      B: '0.05 mg/100ml',
      C: '0.08 mg/100ml (80mg per 100ml of blood)',
      
    },
    correctAnswer: 'C',
    explanation:
      'The legal blood alcohol limit in Zimbabwe is 80mg of alcohol per 100ml of blood (0.08%). Driving above this limit is a criminal offence.',
    difficulty: 'medium',
    tags: ['alcohol', 'legal'],
  },
  {
    id: 18,
    category: 'rules-of-the-road',
    question: 'When may you cross a solid white line on the road?',
    options: {
      A: 'When overtaking a slow vehicle',
      B: 'When the road is clear',
      C: 'Never, unless directed by a traffic officer or to avoid an obstruction',
      
    },
    correctAnswer: 'C',
    explanation:
      'A solid white line (barrier line) must not be crossed or straddled except when directed by a traffic officer or to pass a stationary obstruction.',
    difficulty: 'medium',
    tags: ['road-markings', 'overtaking'],
  },
  {
    id: 19,
    category: 'rules-of-the-road',
    question: 'Headlights must be used from:',
    options: {
      A: 'Sunrise to sunset',
      B: 'Sunset to sunrise or when visibility is less than 100m',
      C: 'Only when it is completely dark',
      
    },
    correctAnswer: 'B',
    explanation:
      'Headlights must be used from sunset to sunrise and whenever visibility is reduced to less than 100 metres due to weather or other conditions.',
    difficulty: 'easy',
    tags: ['lights', 'visibility'],
  },
  {
    id: 20,
    category: 'rules-of-the-road',
    question: 'A learner driver must always be accompanied by:',
    options: {
      A: 'Any licensed driver',
      B: 'A driver with a valid full licence for that class of vehicle',
      C: 'A driving instructor only',
      
    },
    correctAnswer: 'B',
    explanation:
      'A learner driver in Zimbabwe must be accompanied by a person who holds a valid full driving licence for the class of vehicle being driven.',
    difficulty: 'easy',
    tags: ['learner', 'licence'],
  },

  // ── Safety ──
  {
    id: 21,
    category: 'safety',
    question: 'What is the first thing you should do if your vehicle breaks down on a highway?',
    options: {
      A: 'Open the bonnet immediately',
      B: 'Move the vehicle off the road and place a warning triangle',
      C: 'Wave at other traffic for help',
      
    },
    correctAnswer: 'B',
    explanation:
      'If your vehicle breaks down, move it off the road if possible and place a warning triangle at least 45 metres behind the vehicle to alert other drivers.',
    difficulty: 'easy',
    tags: ['breakdown', 'warning-triangle'],
  },
  {
    id: 22,
    category: 'safety',
    question: 'The main purpose of wearing a seatbelt is to:',
    options: {
      A: 'Avoid a fine',
      B: 'Keep you in your seat during a collision and reduce injury',
      C: 'Prevent you from falling asleep',
      
    },
    correctAnswer: 'B',
    explanation:
      'Seatbelts keep occupants secured during a collision, preventing them from being thrown forward or out of the vehicle, significantly reducing injury severity.',
    difficulty: 'easy',
    tags: ['seatbelt', 'protection'],
  },
  {
    id: 23,
    category: 'safety',
    question: 'When driving in heavy rain, you should:',
    options: {
      A: 'Drive at normal speed with hazard lights on',
      B: 'Reduce speed, increase following distance, and use dipped headlights',
      C: 'Drive on the shoulder for better grip',
      
    },
    correctAnswer: 'B',
    explanation:
      'In heavy rain, reduce speed to prevent aquaplaning, increase your following distance (double it), and use dipped headlights so other drivers can see you.',
    difficulty: 'easy',
    tags: ['weather', 'rain'],
  },
  {
    id: 24,
    category: 'safety',
    question: 'What is "aquaplaning"?',
    options: {
      A: 'Driving through a flooded road',
      B: 'When tyres lose contact with the road due to a layer of water',
      C: 'Skidding on a muddy road',
      
    },
    correctAnswer: 'B',
    explanation:
      'Aquaplaning (hydroplaning) occurs when a layer of water builds up between the tyres and the road surface, causing loss of traction and steering control.',
    difficulty: 'medium',
    tags: ['aquaplaning', 'wet-road'],
  },
  {
    id: 25,
    category: 'safety',
    question: 'When driving at night behind another vehicle, you should use:',
    options: {
      A: 'High beam (bright) headlights',
      B: 'Dipped (low beam) headlights',
      C: 'Parking lights only',
      
    },
    correctAnswer: 'B',
    explanation:
      'When following another vehicle at night, use dipped (low beam) headlights to avoid blinding the driver ahead through their mirrors.',
    difficulty: 'easy',
    tags: ['night-driving', 'headlights'],
  },
  {
    id: 26,
    category: 'safety',
    question: 'What is the correct action if you experience a tyre blowout at speed?',
    options: {
      A: 'Brake hard immediately',
      B: 'Keep a firm grip on the steering, ease off the accelerator, and brake gently',
      C: 'Turn off the engine immediately',
      
    },
    correctAnswer: 'B',
    explanation:
      'During a blowout, hold the steering firmly, ease off the accelerator gradually, and apply gentle brakes. Hard braking or sudden steering can cause a rollover.',
    difficulty: 'medium',
    tags: ['tyre', 'emergency'],
  },
  {
    id: 27,
    category: 'safety',
    question: 'The minimum legal tyre tread depth is:',
    options: {
      A: '0.5 mm',
      B: '1.0 mm',
      C: '1.6 mm',
      
    },
    correctAnswer: 'C',
    explanation:
      'The legal minimum tyre tread depth is 1.6 mm. Tyres with less tread than this are unsafe and illegal as they have significantly reduced grip.',
    difficulty: 'medium',
    tags: ['tyre', 'legal'],
  },
  {
    id: 28,
    category: 'safety',
    question: 'Children under 3 years old must travel in:',
    options: {
      A: 'The front seat with a seatbelt',
      B: 'An approved child restraint in the rear seat',
      C: 'On an adults lap in the back seat',
      
    },
    correctAnswer: 'B',
    explanation:
      'Young children must travel in an approved child restraint (car seat) in the rear of the vehicle for maximum safety in the event of a collision.',
    difficulty: 'easy',
    tags: ['children', 'restraint'],
  },
  {
    id: 29,
    category: 'safety',
    question: 'Defensive driving means:',
    options: {
      A: 'Driving aggressively to protect your position',
      B: 'Anticipating hazards and driving to prevent accidents regardless of others actions',
      C: 'Driving very slowly at all times',
      
    },
    correctAnswer: 'B',
    explanation:
      'Defensive driving involves being aware of potential hazards, anticipating the actions of other road users, and adjusting your driving to avoid accidents.',
    difficulty: 'easy',
    tags: ['defensive-driving'],
  },
  {
    id: 30,
    category: 'safety',
    question: 'If your vehicle catches fire, you should:',
    options: {
      A: 'Open the windows to let the smoke out',
      B: 'Pull over, turn off the engine, evacuate, and call emergency services',
      C: 'Drive to the nearest fire station',
      
    },
    correctAnswer: 'B',
    explanation:
      'Stop the vehicle safely, turn off the engine, evacuate all passengers, move a safe distance away, and call emergency services. Never open the bonnet as oxygen feeds fire.',
    difficulty: 'easy',
    tags: ['fire', 'emergency'],
  },

  // ── Controls ──
  {
    id: 31,
    category: 'controls',
    question: 'The clutch pedal is found in:',
    options: {
      A: 'Automatic vehicles only',
      B: 'Manual vehicles only',
      C: 'All vehicles',
      
    },
    correctAnswer: 'B',
    explanation:
      'The clutch pedal is found only in manual (stick shift) vehicles. It is used to engage and disengage the engine from the gearbox when changing gears.',
    difficulty: 'easy',
    tags: ['pedals', 'manual'],
  },
  {
    id: 32,
    category: 'controls',
    question: 'The order of pedals from left to right in a manual vehicle is:',
    options: {
      A: 'Brake, Clutch, Accelerator',
      B: 'Clutch, Brake, Accelerator',
      C: 'Accelerator, Brake, Clutch',
      
    },
    correctAnswer: 'B',
    explanation:
      'In a manual vehicle, the pedals from left to right are: Clutch (left foot), Brake (right foot), Accelerator (right foot).',
    difficulty: 'easy',
    tags: ['pedals', 'layout'],
  },
  {
    id: 33,
    category: 'controls',
    question: 'A red warning light shaped like a battery on the dashboard indicates:',
    options: {
      A: 'Low fuel',
      B: 'Engine overheating',
      C: 'Charging system malfunction (alternator/battery)',
      
    },
    correctAnswer: 'C',
    explanation:
      'The battery-shaped red warning light indicates a problem with the charging system. The alternator may not be charging the battery, which can lead to the vehicle stalling.',
    difficulty: 'medium',
    tags: ['dashboard', 'warning-light'],
  },
  {
    id: 34,
    category: 'controls',
    question: 'The handbrake (parking brake) should be used:',
    options: {
      A: 'Only when parking on a hill',
      B: 'Every time you park the vehicle',
      C: 'Only in manual vehicles',
      
    },
    correctAnswer: 'B',
    explanation:
      'The handbrake should be applied every time you park the vehicle, regardless of the terrain, to prevent the vehicle from rolling.',
    difficulty: 'easy',
    tags: ['parking-brake', 'parking'],
  },
  {
    id: 35,
    category: 'controls',
    question: 'What does the temperature gauge on your dashboard show?',
    options: {
      A: 'Outside air temperature',
      B: 'Engine coolant temperature',
      C: 'Oil temperature',
      
    },
    correctAnswer: 'B',
    explanation:
      'The temperature gauge shows the engine coolant temperature. If it moves into the red zone, the engine is overheating and you should stop immediately.',
    difficulty: 'easy',
    tags: ['dashboard', 'temperature'],
  },
  {
    id: 36,
    category: 'controls',
    question: 'What is the purpose of the rear-view mirror?',
    options: {
      A: 'To check your appearance',
      B: 'To see traffic behind and beside your vehicle',
      C: 'To see the road ahead',
      
    },
    correctAnswer: 'B',
    explanation:
      'The rear-view mirror allows you to observe traffic behind and to the sides of your vehicle, which is essential before changing lanes, turning, or stopping.',
    difficulty: 'easy',
    tags: ['mirrors', 'observation'],
  },
  {
    id: 37,
    category: 'controls',
    question: 'When should you check your mirrors?',
    options: {
      A: 'Only before reversing',
      B: 'Before signalling, changing lanes, turning, slowing, or stopping',
      C: 'Only at intersections',
      
    },
    correctAnswer: 'B',
    explanation:
      'Mirrors should be checked frequently: before signalling, changing direction, overtaking, slowing down, or stopping. This ensures you are aware of your surroundings.',
    difficulty: 'easy',
    tags: ['mirrors', 'observation'],
  },
  {
    id: 38,
    category: 'controls',
    question: 'The ABS warning light indicates:',
    options: {
      A: 'The air conditioning is on',
      B: 'A malfunction in the Anti-lock Braking System',
      C: 'The airbag system is active',
      
    },
    correctAnswer: 'B',
    explanation:
      'The ABS warning light signals a fault in the Anti-lock Braking System. Normal braking still works, but the ABS may not assist during hard braking.',
    difficulty: 'medium',
    tags: ['dashboard', 'abs'],
  },
  {
    id: 39,
    category: 'controls',
    question: 'What does the oil pressure warning light (shaped like an oil can) indicate?',
    options: {
      A: 'Time for an oil change',
      B: 'Low engine oil pressure - stop driving immediately',
      C: 'The oil filter needs replacing',
      
    },
    correctAnswer: 'B',
    explanation:
      'The oil pressure light means oil pressure is dangerously low. Stop the vehicle safely and check the oil level. Continuing to drive can destroy the engine.',
    difficulty: 'medium',
    tags: ['dashboard', 'oil'],
  },
  {
    id: 40,
    category: 'controls',
    question: 'The turn signal indicator is operated by:',
    options: {
      A: 'A stalk on the left side of the steering column',
      B: 'A button on the dashboard',
      C: 'The horn',
      
    },
    correctAnswer: 'A',
    explanation:
      'In left-hand drive vehicles common in Zimbabwe, the indicator stalk is typically on the left side of the steering column. Push down for left, up for right.',
    difficulty: 'easy',
    tags: ['indicators', 'signals'],
  },

  // ── Intersections ──
  {
    id: 41,
    category: 'intersections',
    question: 'At an uncontrolled intersection (no signs or signals), you must:',
    options: {
      A: 'Speed up to get through first',
      B: 'Yield to traffic approaching from the right',
      C: 'Always stop completely',
      
    },
    correctAnswer: 'B',
    explanation:
      'At an uncontrolled intersection in Zimbabwe, you must yield to vehicles approaching from your right unless otherwise indicated.',
    difficulty: 'medium',
    tags: ['right-of-way', 'uncontrolled'],
  },
  {
    id: 42,
    category: 'intersections',
    question: 'A flashing amber traffic light means:',
    options: {
      A: 'Stop and wait for green',
      B: 'Proceed with caution, yielding to pedestrians and other traffic',
      C: 'Speed up before it turns red',
      
    },
    correctAnswer: 'B',
    explanation:
      'A flashing amber light means the traffic light is in caution mode. Proceed carefully, yielding to any traffic or pedestrians in the intersection.',
    difficulty: 'medium',
    tags: ['traffic-light', 'amber'],
  },
  {
    id: 43,
    category: 'intersections',
    question: 'When turning right at a traffic light, you should:',
    options: {
      A: 'Turn immediately when the light turns green',
      B: 'Yield to oncoming traffic and pedestrians before turning',
      C: 'Wait for the light to turn red, then turn',
      
    },
    correctAnswer: 'B',
    explanation:
      'When turning right (across oncoming traffic in left-hand drive countries), you must yield to all oncoming vehicles and check for pedestrians before completing the turn.',
    difficulty: 'medium',
    tags: ['turning', 'right-turn'],
  },
  {
    id: 44,
    category: 'intersections',
    question: 'At a four-way stop, who has the right of way?',
    options: {
      A: 'The largest vehicle',
      B: 'The vehicle that arrived first',
      C: 'The vehicle on the right',
      
    },
    correctAnswer: 'B',
    explanation:
      'At a four-way stop, the vehicle that arrived first has right of way. If two vehicles arrive simultaneously, the vehicle on the right proceeds first.',
    difficulty: 'medium',
    tags: ['four-way-stop', 'priority'],
  },
  {
    id: 45,
    category: 'intersections',
    question: 'When entering a roundabout in Zimbabwe, you should:',
    options: {
      A: 'Turn right into the roundabout',
      B: 'Turn left into the roundabout (clockwise direction)',
      C: 'Stop in the middle and choose a lane',
      
    },
    correctAnswer: 'B',
    explanation:
      'In Zimbabwe (left-hand traffic), you enter a roundabout by turning left and travelling in a clockwise direction. Give way to traffic already in the roundabout from your right.',
    difficulty: 'easy',
    tags: ['roundabout', 'direction'],
  },
  {
    id: 46,
    category: 'intersections',
    question: 'A green arrow on a traffic light means:',
    options: {
      A: 'You may proceed only in the direction of the arrow',
      B: 'You may proceed in any direction',
      C: 'Caution, the light is about to change',
      
    },
    correctAnswer: 'A',
    explanation:
      'A green arrow indicates you may proceed only in the direction the arrow points. Traffic from other directions should be stopped.',
    difficulty: 'easy',
    tags: ['traffic-light', 'arrow'],
  },
  {
    id: 47,
    category: 'intersections',
    question: 'When should you use your indicators at an intersection?',
    options: {
      A: 'Only when other cars are present',
      B: 'Always, well before you turn or change lanes',
      C: 'Only at night',
      
    },
    correctAnswer: 'B',
    explanation:
      'Indicators must always be used well in advance of turning or changing lanes to give other road users time to react to your intentions.',
    difficulty: 'easy',
    tags: ['signals', 'indicators'],
  },
  {
    id: 48,
    category: 'intersections',
    question: 'A "Yield" sign at an intersection means:',
    options: {
      A: 'You must stop completely',
      B: 'Slow down, and give way to traffic on the road you are entering',
      C: 'You have right of way',
      
    },
    correctAnswer: 'B',
    explanation:
      'A yield (give way) sign means you must slow down and be prepared to stop if necessary to give way to traffic on the road you are joining.',
    difficulty: 'easy',
    tags: ['yield', 'give-way'],
  },
  {
    id: 49,
    category: 'intersections',
    question:
      'What should you do if you are in the wrong lane approaching an intersection?',
    options: {
      A: 'Quickly change lanes at the last moment',
      B: 'Continue in your lane and find an alternative route',
      C: 'Stop and reverse into the correct lane',
      
    },
    correctAnswer: 'B',
    explanation:
      'If you realise you are in the wrong lane, continue safely in your current lane and find an alternative route. Sudden lane changes at intersections are dangerous.',
    difficulty: 'medium',
    tags: ['lane-discipline', 'safety'],
  },
  {
    id: 50,
    category: 'intersections',
    question:
      'When traffic lights are not working, the intersection should be treated as:',
    options: {
      A: 'A green light for all',
      B: 'A four-way stop',
      C: 'An uncontrolled intersection where you may proceed freely',
      
    },
    correctAnswer: 'B',
    explanation:
      'When traffic lights are out of order, treat the intersection as a four-way stop. Each driver must stop and proceed in order of arrival.',
    difficulty: 'medium',
    tags: ['traffic-light', 'malfunction'],
  },

  // ── Parking ──
  {
    id: 51,
    category: 'parking',
    question: 'How far from a fire hydrant must you park?',
    options: {
      A: 'At least 1 metre',
      B: 'At least 1.5 metres',
      C: 'At least 3 metres',
      
    },
    correctAnswer: 'C',
    explanation:
      'You must park at least 5 metres away from a fire hydrant to ensure emergency vehicles can access it.',
    difficulty: 'medium',
    tags: ['distance', 'fire-hydrant'],
  },
  {
    id: 52,
    category: 'parking',
    question: 'When parking uphill with a kerb, you should turn your front wheels:',
    options: {
      A: 'Away from the kerb (towards the road)',
      B: 'Towards the kerb',
      C: 'Straight ahead',
      
    },
    correctAnswer: 'A',
    explanation:
      'When parking uphill with a kerb, turn wheels away from the kerb. If the vehicle rolls backward, the back of the front wheels will catch on the kerb.',
    difficulty: 'medium',
    tags: ['uphill', 'kerb'],
  },
  {
    id: 53,
    category: 'parking',
    question: 'You must NOT park within how many metres of an intersection?',
    options: {
      A: '3 metres',
      B: '5 metres',
      C: '6 metres',
      
    },
    correctAnswer: 'C',
    explanation:
      'You must not park within 6 metres of an intersection as it obstructs the view for other drivers and creates a hazard.',
    difficulty: 'medium',
    tags: ['intersection', 'distance'],
  },
  {
    id: 54,
    category: 'parking',
    question: 'Double yellow lines painted on the kerb mean:',
    options: {
      A: 'Parking allowed for 30 minutes',
      B: 'Loading zone',
      C: 'No stopping or parking at any time',
      
    },
    correctAnswer: 'C',
    explanation:
      'Double yellow lines on the kerb indicate a no stopping and no parking zone at all times. Even momentary stopping is prohibited.',
    difficulty: 'easy',
    tags: ['road-markings', 'restriction'],
  },
  {
    id: 55,
    category: 'parking',
    question: 'When parallel parking, you should park no more than:',
    options: {
      A: '150 mm from the kerb',
      B: '300 mm from the kerb',
      C: '450 mm (approximately 45 cm) from the kerb',
      
    },
    correctAnswer: 'C',
    explanation:
      'When parallel parking, your vehicle should be no more than 450 mm (about 45 cm) from the kerb to keep the road clear for passing traffic.',
    difficulty: 'medium',
    tags: ['parallel-parking', 'distance'],
  },
  {
    id: 56,
    category: 'parking',
    question: 'When parking downhill with a kerb, you should turn your front wheels:',
    options: {
      A: 'Away from the kerb',
      B: 'Towards the kerb',
      C: 'Straight ahead',
      
    },
    correctAnswer: 'B',
    explanation:
      'When parking downhill with a kerb, turn wheels towards the kerb. If the vehicle rolls forward, the wheels will turn into the kerb and stop the vehicle.',
    difficulty: 'medium',
    tags: ['downhill', 'kerb'],
  },
  {
    id: 57,
    category: 'parking',
    question: 'Parking on a pavement (sidewalk) is:',
    options: {
      A: 'Allowed if there is no other space',
      B: 'Allowed on weekends',
      C: 'Not allowed unless a sign specifically permits it',
      
    },
    correctAnswer: 'C',
    explanation:
      'Parking on the pavement (sidewalk) is generally prohibited as it obstructs pedestrians. It is only allowed where signs specifically permit it.',
    difficulty: 'easy',
    tags: ['pavement', 'restriction'],
  },
  {
    id: 58,
    category: 'parking',
    question: 'After parking, before opening your door you should:',
    options: {
      A: 'Open it quickly to avoid traffic',
      B: 'Check mirrors and look behind for cyclists, pedestrians, or vehicles',
      C: 'Hoot to alert others',
      
    },
    correctAnswer: 'B',
    explanation:
      'Always check your mirrors and look behind before opening your door to avoid hitting cyclists, pedestrians, or oncoming traffic (the Dutch Reach method is recommended).',
    difficulty: 'easy',
    tags: ['door', 'safety'],
  },
  {
    id: 59,
    category: 'parking',
    question: 'When leaving a parking space, you must:',
    options: {
      A: 'Reverse out quickly',
      B: 'Signal, check mirrors and blind spots, then proceed when safe',
      C: 'Hoot before reversing',
      
    },
    correctAnswer: 'B',
    explanation:
      'When leaving a parking space, indicate your intention, check mirrors and blind spots thoroughly, and proceed only when it is safe to do so.',
    difficulty: 'easy',
    tags: ['leaving', 'observation'],
  },
  {
    id: 60,
    category: 'parking',
    question: 'Parking is NOT permitted:',
    options: {
      A: 'On a bridge or within a tunnel',
      B: 'On a quiet residential street',
      C: 'In a designated parking bay',
      
    },
    correctAnswer: 'A',
    explanation:
      'Parking is prohibited on bridges, inside tunnels, on pedestrian crossings, near fire hydrants, and at bus stops as these create serious safety hazards.',
    difficulty: 'easy',
    tags: ['restriction', 'prohibited-areas'],
  },
];

export function getQuestionsByCategory(category: Category): Question[] {
  return QUESTIONS.filter((q) => q.category === category);
}

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getAllCategories(): Category[] {
  return Object.keys(CATEGORY_META) as Category[];
}
