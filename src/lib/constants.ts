import { Milestone, RuleItem } from '@/types/timer';

export const DEFAULT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours

export const EVENT_METADATA = {
  name: 'MARTIAN 1.0',
  subtitle: 'Mars — Agentic AI for a Smarter Campus Hackathon',
  organizer: 'BMSITM & CSE Division 4',
  launchLabel: '10:30 AM · Day 1',
  judgingLabel: 'Two checkpoints',
  splashdownLabel: '9:30 AM · Day 2',
  missionNote:
    'All participants must remain within the designated MARTIAN 1.0 premises. Timings may be updated by BMSITM and CSE Division 4 when necessary.',
  strictVenueRule:
    'All participants must remain within the designated MARTIAN 1.0 premises. No participant may leave the premises without prior permission from an authorized volunteer or member of BMSITM and CSE Division 4. Unauthorized exit may lead to strict disciplinary action, including disqualification.',
};

// Exact 12-Step Event Flow & Mission Schedule from MARTIAN 1.0 PDF
export const HACKATHON_MILESTONES: Milestone[] = [
  {
    id: 'm-01',
    stepNumber: '01',
    day: 'DAY 1',
    hoursOffset: 0,
    timeLabel: '10:30 AM',
    title: 'IGNITION',
    description: 'Hackathon starts and crews are welcomed.',
    deliverable: 'Check-in complete, workspaces assigned, mission kickoff.',
    iconName: 'Rocket',
  },
  {
    id: 'm-02',
    stepNumber: '02',
    day: 'DAY 1',
    hoursOffset: 0.33,
    timeLabel: '10:50 AM',
    title: 'MISSION BRIEFING',
    description: 'Problem statements are revealed and building begins.',
    deliverable: 'Select problem statement, lock tech stack, initialize repository.',
    iconName: 'Cpu',
  },
  {
    id: 'm-03',
    stepNumber: '03',
    day: 'DAY 1',
    hoursOffset: 2,
    timeLabel: '12:30 – 1:30 PM',
    title: 'FUEL STOP 1',
    description: 'Lunch break for all crews.',
    deliverable: 'Refuel and align team roles for afternoon sprint.',
    iconName: 'Utensils',
  },
  {
    id: 'm-04',
    stepNumber: '04',
    day: 'DAY 1',
    hoursOffset: 3,
    timeLabel: '1:30 – 2:30 PM',
    title: 'FLIGHT PREP',
    description: 'Crews prepare for Round 1 (slot to be confirmed).',
    deliverable: 'Finalize architecture diagram, prototype plan & pitch outline.',
    iconName: 'Compass',
  },
  {
    id: 'm-05',
    stepNumber: '05',
    day: 'DAY 1',
    hoursOffset: 4,
    timeLabel: '2:30 – 4:00 PM',
    title: 'CHECKPOINT ALPHA',
    description: 'Round 1 judging.',
    deliverable: 'Present initial architecture, problem approach & early progress.',
    iconName: 'ShieldAlert',
  },
  {
    id: 'm-06',
    stepNumber: '06',
    day: 'DAY 1',
    hoursOffset: 5.5,
    timeLabel: '4:00 PM onward',
    title: 'BUILD ORBIT',
    description: 'Shortlisted teams will start building their prototypes.',
    deliverable: 'Core Agentic AI / hardware integration & end-to-end prototype.',
    iconName: 'Code2',
  },
  {
    id: 'm-07',
    stepNumber: '07',
    day: 'DAY 1',
    hoursOffset: 7,
    timeLabel: '5:30 PM',
    title: 'FUEL STOP 2',
    description: 'Evening snacks.',
    deliverable: 'Quick recharge before evening deep-work block.',
    iconName: 'Coffee',
  },
  {
    id: 'm-08',
    stepNumber: '08',
    day: 'DAY 1',
    hoursOffset: 10,
    timeLabel: '8:30 PM',
    title: 'FUEL STOP 3',
    description: 'Dinner.',
    deliverable: 'Refuel and review core MVP milestones before night sprint.',
    iconName: 'Utensils',
  },
  {
    id: 'm-09',
    stepNumber: '09',
    day: 'DAY 2',
    hoursOffset: 15,
    timeLabel: '1:30 AM',
    title: 'FUEL STOP 4',
    description: 'Midnight snacks.',
    deliverable: 'Midnight energy boost — keep shipping & debugging.',
    iconName: 'Flame',
  },
  {
    id: 'm-10',
    stepNumber: '10',
    day: 'DAY 2',
    hoursOffset: 20.5,
    timeLabel: '7:00 AM',
    title: 'FUEL STOP 5',
    description: 'Breakfast.',
    deliverable: 'Morning fuel — begin final polish, testing & deck prep.',
    iconName: 'Coffee',
  },
  {
    id: 'm-11',
    stepNumber: '11',
    day: 'DAY 2',
    hoursOffset: 22,
    timeLabel: '8:30 AM',
    title: 'CHECKPOINT BETA',
    description: 'Round 2 judging.',
    deliverable: 'Demonstrate working prototype, code & impact to judges.',
    iconName: 'FileCheck',
  },
  {
    id: 'm-12',
    stepNumber: '12',
    day: 'DAY 2',
    hoursOffset: 23,
    timeLabel: '9:30 AM',
    title: 'SPLASHDOWN',
    description: 'Wrap-up and prize distribution, closing the mission.',
    deliverable: 'Final awards, closing ceremony & crew showcase.',
    iconName: 'Trophy',
  },
];

export const MOTIVATIONAL_MESSAGES = [
  {
    range: [0, 3],
    phase: 'Day 1 • Ignition & Mission Briefing',
    tagline: 'Welcome to Mars. Lock your problem statement and architect your Agentic AI.',
    advice: 'Keep your scope razor-sharp. A working end-to-end agentic loop beats ten unfinished ideas.',
  },
  {
    range: [3, 5.5],
    phase: 'Day 1 • Flight Prep & Checkpoint Alpha',
    tagline: 'Round 1 judging is here. Communicate your vision clearly and concisely.',
    advice: 'Highlight the campus problem, your agentic architecture, and how your prototype solves it.',
  },
  {
    range: [5.5, 10],
    phase: 'Day 1 • Build Orbit',
    tagline: 'Orbit achieved. Heads down, build fast, and connect your core systems.',
    advice: 'Integrate frontend, backend, and AI tools early. Test with real campus scenarios.',
  },
  {
    range: [10, 15],
    phase: 'Night Sprint • Deep Space',
    tagline: 'The campus sleeps while Martian crews build the future.',
    advice: 'Commit frequently to Git. Keep hardware/API integrations stable before adding polish.',
  },
  {
    range: [15, 20.5],
    phase: 'Day 2 • Final Approach',
    tagline: 'Dawn is near. Freeze new features and harden your working prototype.',
    advice: 'Eliminate crashes, prepare seed data for demos, and verify every edge case.',
  },
  {
    range: [20.5, 22],
    phase: 'Day 2 • Pre-Checkpoint Beta Polish',
    tagline: 'Final submission prep! Polish your presentation and rehearse your live demo.',
    advice: 'Record a quick backup screen-recording of your working demo just in case.',
  },
  {
    range: [22, 24],
    phase: 'Day 2 • Checkpoint Beta & Splashdown',
    tagline: 'ROUND 2 JUDGING & SPLASHDOWN! Present with pride and precision.',
    advice: 'Lead with the live prototype, explain your design decisions clearly, and own the stage!',
  },
  {
    range: [24, 999],
    phase: 'MISSION COMPLETE • Splashdown',
    tagline: 'Mission accomplished! You built something extraordinary in 24 hours on Mars.',
    advice: 'Congratulations to all crews! Proceed to wrap-up and prize distribution.',
  },
];

// Complete 19-Rule Official Rulebook from MARTIAN 1.0 PDF
export const MARTIAN_RULEBOOK: RuleItem[] = [
  {
    number: '01',
    title: 'GENERAL & ACCEPTANCE',
    points: [
      'Participation constitutes acceptance of all rules, regulations and official instructions.',
      'BMSITM and CSE Division 4 may modify schedules, procedures or venue arrangements when necessary.',
      'Organizer decisions concerning safety, discipline and eligibility are final.',
    ],
  },
  {
    number: '02',
    title: 'TEAM & ELIGIBILITY',
    points: [
      'Only officially registered participants and teams are eligible.',
      'A participant may not participate in more than one team.',
      'Team changes require prior approval.',
      'Participants must carry valid college/event identification.',
    ],
  },
  {
    number: '03',
    title: '24-HOUR ATTENDANCE',
    points: [
      'The hackathon will run continuously for 24 hours according to the official schedule.',
      'Participants are expected to remain present throughout the event.',
      'Follow all official attendance and check-in/check-out procedures.',
      'Unauthorized absence may result in penalty or disqualification.',
    ],
  },
  {
    number: '04',
    title: 'LEAVING THE PREMISES',
    points: [
      'Prior permission must be obtained from an authorized volunteer/organizer before leaving.',
      'Participants must follow the prescribed exit and return procedure.',
      'Leaving without permission is a rule violation.',
      'Movement may be restricted during critical submission/evaluation periods.',
    ],
  },
  {
    number: '05',
    title: 'PROJECT ORIGINALITY',
    points: [
      "Projects must represent the team's own work and development during MARTIAN 1.0.",
      'Complete or substantially pre-built solutions are prohibited.',
      'Previously submitted, copied or misrepresented projects may be rejected or disqualified.',
      'Commercially available components/modules may be used unless prohibited.',
    ],
  },
  {
    number: '06',
    title: 'INTELLECTUAL PROPERTY',
    points: [
      "Do not plagiarize, copy or misrepresent another person's/team's work.",
      'Respect copyrights, patents, trademarks, licenses, privacy and ownership rights.',
      'Open-source software, APIs, datasets and third-party resources must follow applicable licenses.',
      'Provide attribution where required.',
    ],
  },
  {
    number: '07',
    title: 'PROJECT SCOPE & DEVELOPMENT',
    points: [
      'Teams must work on the officially assigned/approved problem statement.',
      'Core hardware integration, implementation and testing must be performed during the hackathon.',
      'Any change of problem statement requires organizer approval.',
      'All team members should make meaningful contributions.',
    ],
  },
  {
    number: '08',
    title: 'AI & DIGITAL TOOLS',
    points: [
      'AI tools may be used as assistive resources unless specifically prohibited.',
      'Teams remain responsible for accuracy, originality, safety and legality.',
      'Participants must understand and explain their hardware, code and design decisions.',
      'Misrepresentation of third-party or AI-generated work may lead to disqualification.',
    ],
  },
  {
    number: '09',
    title: 'SUBMISSION RULES',
    points: [
      'All required deliverables must be submitted before the official deadline.',
      'Submission may include the working prototype, source code, documentation, diagrams and presentation.',
      'Late submissions will not be accepted unless expressly permitted.',
      'False or misleading project information is prohibited.',
    ],
  },
  {
    number: '10',
    title: 'DEMONSTRATION & EVALUATION',
    points: [
      'Teams must demonstrate the actual working prototype when requested.',
      'Judges may ask technical, design, safety and implementation questions.',
      'Evaluation will follow the officially published MARTIAN 1.0 rubric.',
      'Participants must not improperly influence or interfere with judging.',
    ],
  },
  {
    number: '11',
    title: 'CODE OF CONDUCT',
    points: [
      'Treat organizers, volunteers, judges, mentors and participants with respect.',
      'Harassment, bullying, discrimination, threats, violence and abusive behavior are prohibited.',
      'Cheating, sabotage, theft, intimidation and deliberate disruption are prohibited.',
      'Report violations and safety concerns promptly.',
    ],
  },
  {
    number: '12',
    title: 'VENUE DISCIPLINE',
    points: [
      'Remain in designated areas and follow volunteer instructions.',
      'Keep workspaces clean and maintain reasonable noise levels.',
      'Do not enter restricted areas without authorization.',
      'Do not tamper with emergency exits, fire-safety equipment, electrical infrastructure or venue property.',
    ],
  },
  {
    number: '13',
    title: 'NETWORK & SECURITY',
    points: [
      'Use event internet/network resources responsibly.',
      'Unauthorized access, malicious activity, attacks or interference are prohibited.',
      "Do not interfere with another team's devices, network or data.",
      'Security testing is permitted only on explicitly authorized systems and within approved scope.',
    ],
  },
  {
    number: '14',
    title: 'PERSONAL BELONGINGS',
    points: [
      'Every participant is solely responsible for laptops, phones, bags, tools and valuables.',
      'Keep belongings secure and do not leave valuable items unattended.',
      'BMSITM and CSE Division 4 are not responsible for loss, theft or damage to personal belongings.',
    ],
  },
  {
    number: '15',
    title: 'ACCOMMODATION & TRANSPORTATION',
    points: [
      'No accommodation will be provided or arranged by BMSITM and CSE Division 4 unless officially announced.',
      'No transportation to or from the venue will be provided unless officially announced.',
      'Participants are responsible for arranging and bearing the cost of their own accommodation and transportation.',
      'Participants must make their own travel arrangements before and after the event.',
    ],
  },
  {
    number: '16',
    title: 'PHOTOGRAPHY & DOCUMENTATION',
    points: [
      'Participants may be photographed or recorded for event documentation, reports and promotional purposes.',
      'Teams with legitimate confidentiality concerns should inform organizers before public demonstration.',
    ],
  },
  {
    number: '17',
    title: 'DISQUALIFICATION',
    points: [
      'Grounds include plagiarism, copied/pre-built projects, cheating, false claims, IP violations, sabotage, theft, serious misconduct, unauthorized assistance, serious safety violations and unauthorized exit.',
      'BMSITM and CSE Division 4 may disqualify a participant/team based on the severity of the violation.',
    ],
  },
  {
    number: '18',
    title: 'STRICT DISCIPLINARY ACTION',
    points: [
      'Strict action will be taken against participants or teams who violate the rules, regulations, safety requirements or code of conduct.',
      "Action may include warning, penalty, removal from an activity, removal from the venue, disqualification or escalation to the participant's institution/relevant authorities.",
      'Immediate action may be taken in serious cases to protect participants, organizers, property and event integrity.',
    ],
  },
  {
    number: '19',
    title: 'PARTICIPANT DECLARATION',
    points: [
      'By participating, each participant confirms that they have read, understood and agreed to this rulebook.',
      'Participants agree to comply with all safety, attendance, venue, conduct and organizer instructions.',
      'Violation of these rules may result in strict disciplinary action, including disqualification.',
    ],
  },
];
