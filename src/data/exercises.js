/**
 * Exercise Database
 * All exercises organized by muscle groups and training days
 */

export const MUSCLE_GROUPS = {
  CHEST: 'chest',
  BACK: 'back',
  SHOULDERS: 'shoulders',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  LEGS: 'legs',
  CORE: 'core',
  CARDIO: 'cardio'
};

export const EXERCISE_TYPES = {
  COMPOUND: 'compound',
  ISOLATION: 'isolation',
  BODYWEIGHT: 'bodyweight',
  MACHINE: 'machine',
  CABLE: 'cable',
  DUMBBELL: 'dumbbell',
  BARBELL: 'barbell'
};

/**
 * Training days configuration
 */
export const TRAINING_DAYS = {
  push: {
    id: 'push',
    name: 'PUSH',
    shortName: 'PUSH',
    focus: 'Chest, Shoulders, Triceps',
    color: '#C4956A', // Bronze
    heroImage: 'push-hero.jpg',
    exercises: [
      {
        id: 'bench-press',
        name: 'Bench Press',
        muscleGroup: MUSCLE_GROUPS.CHEST,
        type: EXERCISE_TYPES.BARBELL,
        sets: '4×8-10',
        tip: 'Squeeze your shoulder blades together. Drive through your feet.',
        restSeconds: 120
      },
      {
        id: 'incline-db-press',
        name: 'Incline Dumbbell Press',
        muscleGroup: MUSCLE_GROUPS.CHEST,
        type: EXERCISE_TYPES.DUMBBELL,
        sets: '3×10-12',
        tip: 'Control the negative. Feel the stretch at the bottom.',
        restSeconds: 90
      },
      {
        id: 'ohp',
        name: 'Overhead Press',
        muscleGroup: MUSCLE_GROUPS.SHOULDERS,
        type: EXERCISE_TYPES.BARBELL,
        sets: '4×8-10',
        tip: 'Brace your core. Drive straight up.',
        restSeconds: 120
      },
      {
        id: 'lateral-raises',
        name: 'Lateral Raises',
        muscleGroup: MUSCLE_GROUPS.SHOULDERS,
        type: EXERCISE_TYPES.DUMBBELL,
        sets: '4×12-15',
        tip: 'Lead with your elbows. Control the movement.',
        restSeconds: 60
      },
      {
        id: 'tricep-pushdown',
        name: 'Tricep Pushdown',
        muscleGroup: MUSCLE_GROUPS.TRICEPS,
        type: EXERCISE_TYPES.CABLE,
        sets: '3×12-15',
        tip: 'Keep elbows pinned. Squeeze at the bottom.',
        restSeconds: 60
      },
      {
        id: 'overhead-extension',
        name: 'Overhead Tricep Extension',
        muscleGroup: MUSCLE_GROUPS.TRICEPS,
        type: EXERCISE_TYPES.CABLE,
        sets: '3×12-15',
        tip: 'Full stretch at bottom. Full contraction at top.',
        restSeconds: 60
      }
    ]
  },

  pull: {
    id: 'pull',
    name: 'PULL',
    shortName: 'PULL',
    focus: 'Back, Biceps, Rear Delts',
    color: '#5C7A5C', // Sage
    heroImage: 'pull-hero.jpg',
    exercises: [
      {
        id: 'deadlift',
        name: 'Deadlift',
        muscleGroup: MUSCLE_GROUPS.BACK,
        type: EXERCISE_TYPES.BARBELL,
        sets: '4×5-6',
        tip: 'Hinge at hips. Keep the bar close. Neutral spine.',
        restSeconds: 180
      },
      {
        id: 'pullups',
        name: 'Pull-Ups',
        muscleGroup: MUSCLE_GROUPS.BACK,
        type: EXERCISE_TYPES.BODYWEIGHT,
        sets: '4×8-12',
        tip: 'Full extension at bottom. Chin over bar.',
        restSeconds: 120
      },
      {
        id: 'barbell-row',
        name: 'Barbell Row',
        muscleGroup: MUSCLE_GROUPS.BACK,
        type: EXERCISE_TYPES.BARBELL,
        sets: '4×8-10',
        tip: 'Row to your belly button. Squeeze your back.',
        restSeconds: 90
      },
      {
        id: 'face-pulls',
        name: 'Face Pulls',
        muscleGroup: MUSCLE_GROUPS.SHOULDERS,
        type: EXERCISE_TYPES.CABLE,
        sets: '3×15-20',
        tip: 'Pull to your face. External rotate at peak.',
        restSeconds: 60
      },
      {
        id: 'barbell-curl',
        name: 'Barbell Curl',
        muscleGroup: MUSCLE_GROUPS.BICEPS,
        type: EXERCISE_TYPES.BARBELL,
        sets: '3×10-12',
        tip: 'No swinging. Squeeze at the top.',
        restSeconds: 60
      },
      {
        id: 'hammer-curl',
        name: 'Hammer Curl',
        muscleGroup: MUSCLE_GROUPS.BICEPS,
        type: EXERCISE_TYPES.DUMBBELL,
        sets: '3×10-12',
        tip: 'Neutral grip. Control both directions.',
        restSeconds: 60
      }
    ]
  },

  legs: {
    id: 'legs',
    name: 'LEGS',
    shortName: 'LEGS',
    focus: 'Quads, Hamstrings, Glutes, Calves',
    color: '#8B3A3A', // Red
    heroImage: 'legs-hero.jpg',
    exercises: [
      {
        id: 'squat',
        name: 'Squat',
        muscleGroup: MUSCLE_GROUPS.LEGS,
        type: EXERCISE_TYPES.BARBELL,
        sets: '4×6-8',
        tip: 'Break at hips and knees. Drive through heels.',
        restSeconds: 180
      },
      {
        id: 'rdl',
        name: 'Romanian Deadlift',
        muscleGroup: MUSCLE_GROUPS.LEGS,
        type: EXERCISE_TYPES.BARBELL,
        sets: '3×10-12',
        tip: 'Soft knees. Feel the hamstring stretch.',
        restSeconds: 120
      },
      {
        id: 'leg-press',
        name: 'Leg Press',
        muscleGroup: MUSCLE_GROUPS.LEGS,
        type: EXERCISE_TYPES.MACHINE,
        sets: '3×12-15',
        tip: 'Full range. Don\'t lock out knees.',
        restSeconds: 90
      },
      {
        id: 'leg-curl',
        name: 'Leg Curl',
        muscleGroup: MUSCLE_GROUPS.LEGS,
        type: EXERCISE_TYPES.MACHINE,
        sets: '3×12-15',
        tip: 'Squeeze at peak contraction.',
        restSeconds: 60
      },
      {
        id: 'leg-extension',
        name: 'Leg Extension',
        muscleGroup: MUSCLE_GROUPS.LEGS,
        type: EXERCISE_TYPES.MACHINE,
        sets: '3×12-15',
        tip: 'Pause at the top. Control the negative.',
        restSeconds: 60
      },
      {
        id: 'calf-raise',
        name: 'Standing Calf Raise',
        muscleGroup: MUSCLE_GROUPS.LEGS,
        type: EXERCISE_TYPES.MACHINE,
        sets: '4×15-20',
        tip: 'Full stretch. Full contraction. Pause at top.',
        restSeconds: 45
      }
    ]
  },

  upper: {
    id: 'upper',
    name: 'UPPER',
    shortName: 'UPPER',
    focus: 'Full Upper Body',
    color: '#7A6B8A', // Lavender
    heroImage: 'upper-hero.jpg',
    exercises: [
      {
        id: 'bench-press-upper',
        name: 'Bench Press',
        muscleGroup: MUSCLE_GROUPS.CHEST,
        type: EXERCISE_TYPES.BARBELL,
        sets: '4×6-8',
        tip: 'Controlled descent. Explosive press.',
        restSeconds: 120
      },
      {
        id: 'row-upper',
        name: 'Cable Row',
        muscleGroup: MUSCLE_GROUPS.BACK,
        type: EXERCISE_TYPES.CABLE,
        sets: '4×10-12',
        tip: 'Pull to your belly. Squeeze the back.',
        restSeconds: 90
      },
      {
        id: 'ohp-upper',
        name: 'Dumbbell Shoulder Press',
        muscleGroup: MUSCLE_GROUPS.SHOULDERS,
        type: EXERCISE_TYPES.DUMBBELL,
        sets: '3×10-12',
        tip: 'Press straight up. Control the descent.',
        restSeconds: 90
      },
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        muscleGroup: MUSCLE_GROUPS.BACK,
        type: EXERCISE_TYPES.CABLE,
        sets: '3×10-12',
        tip: 'Drive elbows down. Feel the lats.',
        restSeconds: 60
      },
      {
        id: 'curl-upper',
        name: 'Dumbbell Curl',
        muscleGroup: MUSCLE_GROUPS.BICEPS,
        type: EXERCISE_TYPES.DUMBBELL,
        sets: '3×12',
        tip: 'Supinate at the top.',
        restSeconds: 45
      },
      {
        id: 'tricep-dip',
        name: 'Tricep Dips',
        muscleGroup: MUSCLE_GROUPS.TRICEPS,
        type: EXERCISE_TYPES.BODYWEIGHT,
        sets: '3×12-15',
        tip: 'Lean forward slightly. Full range.',
        restSeconds: 60
      }
    ]
  },

  rest: {
    id: 'rest',
    name: 'REST',
    shortName: 'REST',
    focus: 'Recovery & Mobility',
    color: '#404040',
    isRestDay: true,
    activities: [
      'Light stretching',
      'Foam rolling',
      'Walking',
      'Mobility work',
      'Sleep well'
    ]
  }
};

/**
 * Weekly schedule template
 */
export const WEEKLY_SCHEDULE = [
  { dayIndex: 0, dayName: 'Mo', training: 'push' },
  { dayIndex: 1, dayName: 'Di', training: 'pull' },
  { dayIndex: 2, dayName: 'Mi', training: 'legs' },
  { dayIndex: 3, dayName: 'Do', training: 'rest' },
  { dayIndex: 4, dayName: 'Fr', training: 'upper' },
  { dayIndex: 5, dayName: 'Sa', training: 'push' },
  { dayIndex: 6, dayName: 'So', training: 'rest' }
];

/**
 * Daily challenges for motivation
 */
export const DAILY_CHALLENGES = [
  { id: 'water', title: '3L Wasser trinken', icon: '💧' },
  { id: 'sleep', title: '8h Schlaf', icon: '🌙' },
  { id: 'protein', title: '150g+ Protein', icon: '🥩' },
  { id: 'steps', title: '10.000 Schritte', icon: '🚶' },
  { id: 'stretch', title: '10min Stretching', icon: '🧘' },
  { id: 'nosugar', title: 'Kein Zucker', icon: '🍬' },
  { id: 'coldshower', title: 'Kalte Dusche', icon: '🚿' }
];

/**
 * Motivational quotes
 */
export const QUOTES = [
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "No pain, no gain. Shut up and train.", author: "Unknown" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Discipline is doing what needs to be done, even when you don't want to.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "The iron never lies. 200 pounds is 200 pounds.", author: "Henry Rollins" },
  { text: "Champions aren't made in gyms. Champions are made from something deep inside.", author: "Muhammad Ali" }
];

export default {
  MUSCLE_GROUPS,
  EXERCISE_TYPES,
  TRAINING_DAYS,
  WEEKLY_SCHEDULE,
  DAILY_CHALLENGES,
  QUOTES
};
