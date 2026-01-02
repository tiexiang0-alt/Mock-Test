import { Module, TestSegment } from './types';

// --- RAW SEGMENTS ---

const INTRO_SEGMENT: TestSegment = {
  id: "intro",
  title: "Toefl Listening Practice Test 2026",
  type: "intro",
  transcriptText: "Welcome. This practice test follows the new 2026 Adaptive format. You will start with Module 1 (Routing). Based on your score, you will advance to either the Hard or Easy Module 2. The questions in this test correspond to the provided listening material starting at timestamp 01:18. Click 'Begin Module 1' to start.",
  speakerType: "male",
  questions: []
};

// --- MODULE 1 CONTENT (ROUTING) ---
// Includes 8 Discrete items + 2 Conversations + 2 Announcements + 1 Talk
// Matches the first half of the transcript provided.

const M1_SEGMENTS: TestSegment[] = [
  INTRO_SEGMENT,
  {
    id: "m1-q1",
    title: "Listen and Choose (Item 1)",
    type: "discrete",
    transcriptText: "The deadline's coming up sooner than I expected.",
    speakerType: "female",
    questions: [{
      id: 1,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "The printer should be fixed by tomorrow." },
        { label: "B", text: "The new manager is waiting." },
        { label: "C", text: "I haven't seen the agenda yet." },
        { label: "D", text: "Then we'd better get started tonight." }
      ],
      correctAnswerIndex: 3,
      explanation: "The speaker is expressing urgency about a deadline. Option D suggests an action to meet that urgent deadline."
    }]
  },
  {
    id: "m1-q2",
    title: "Listen and Choose (Item 2)",
    type: "discrete",
    transcriptText: "Looks like the meeting's running late.",
    speakerType: "male",
    questions: [{
      id: 2,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "I didn't see the meeting notes." },
        { label: "B", text: "Want to grab a quick coffee while we wait?" },
        { label: "C", text: "It's every Tuesday afternoon." },
        { label: "D", text: "The conference room is upstairs." }
      ],
      correctAnswerIndex: 1,
      explanation: "Since the meeting is delayed, suggesting a quick activity (coffee) to pass the time is a logical response."
    }]
  },
  {
    id: "m1-q3",
    title: "Listen and Choose (Item 3)",
    type: "discrete",
    transcriptText: "Would you remind me to call my sister later?",
    speakerType: "female",
    questions: [{
      id: 3,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "She called me yesterday." },
        { label: "B", text: "I'll text you this evening." },
        { label: "C", text: "The call was about ten minutes." },
        { label: "D", text: "I think he's traveling now." }
      ],
      correctAnswerIndex: 1,
      explanation: "Option B confirms the request for a reminder ('I'll text you')."
    }]
  },
  {
    id: "m1-q4",
    title: "Listen and Choose (Item 4)",
    type: "discrete",
    transcriptText: "Could you water my plants while I'm away?",
    speakerType: "male",
    questions: [{
      id: 4,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "The plants look really healthy right now." },
        { label: "B", text: "I'll stop by every morning on my way to work." },
        { label: "C", text: "It hasn't rained much this week." },
        { label: "D", text: "Here would be great because this window gets plenty of light." }
      ],
      correctAnswerIndex: 1,
      explanation: "Option B accepts the request and specifies when the action will be done."
    }]
  },
  {
    id: "m1-q5",
    title: "Listen and Choose (Item 5)",
    type: "discrete",
    transcriptText: "Did you find your wallet?",
    speakerType: "female",
    questions: [{
      id: 5,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "The couch looks comfortable." },
        { label: "B", text: "No, I canceled my cards." },
        { label: "C", text: "Yes, it was under the couch." },
        { label: "D", text: "I left it at home." }
      ],
      correctAnswerIndex: 2,
      explanation: "Option C answers the specific question (Yes/No) and provides the location."
    }]
  },
  {
    id: "m1-q6",
    title: "Listen and Choose (Item 6)",
    type: "discrete",
    transcriptText: "Have you told your parents about the trip?",
    speakerType: "male",
    questions: [{
      id: 6,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "They're planning a trip this summer." },
        { label: "B", text: "Yes, I told my friend yesterday." },
        { label: "C", text: "I'll call them after dinner." },
        { label: "D", text: "The flight leaves tomorrow." }
      ],
      correctAnswerIndex: 2,
      explanation: "Option C addresses the question about informing the parents."
    }]
  },
  {
    id: "m1-q7",
    title: "Listen and Choose (Item 7)",
    type: "discrete",
    transcriptText: "I forgot to reply to her message.",
    speakerType: "female",
    questions: [{
      id: 7,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "I'll text her later." },
        { label: "B", text: "The message was long." },
        { label: "C", text: "She's on vacation now." },
        { label: "D", text: "It happens to everyone." }
      ],
      correctAnswerIndex: 3,
      explanation: "Option D offers consolation for a common mistake."
    }]
  },
  {
    id: "m1-q8",
    title: "Listen and Choose (Item 8)",
    type: "discrete",
    transcriptText: "Where did you put the extra copies of the report?",
    speakerType: "male",
    questions: [{
      id: 8,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "Yes, I printed them all this morning." },
        { label: "B", text: "On your desk, right next to the printer." },
        { label: "C", text: "The copies were longer than expected." },
        { label: "D", text: "I've already read the report twice." }
      ],
      correctAnswerIndex: 1,
      explanation: "Option B answers the specific 'Where' question."
    }]
  },
  {
    id: "conv-1",
    title: "Conversation: Laundry",
    type: "conversation",
    transcriptText: "The laundry basket's overflowing again. Didn't you say you'd do it yesterday? I did, but I ran out of detergent halfway through the first load. You could have told me; I passed the store on my way home. I figured I'd go this morning, but then I got caught up finishing that report for work. I'll grab some detergent after lunch and do a double load this afternoon. Please do, otherwise we'll have nothing to wear tomorrow.",
    speakerType: "duo",
    imageUrl: "https://picsum.photos/seed/laundry/800/400",
    questions: [
      {
        id: 9,
        questionText: "What reason does the man give for not finishing the laundry?",
        options: [
          { label: "A", text: "The washing machine stopped working." },
          { label: "B", text: "He ran out of detergent." },
          { label: "C", text: "He forgot to start it." },
          { label: "D", text: "He was waiting for clothes to dry." }
        ],
        correctAnswerIndex: 1,
        explanation: "He states explicitly: 'I ran out of detergent'."
      },
      {
        id: 10,
        questionText: "Why does the man mention his report for work?",
        options: [
          { label: "A", text: "It explains why he didn't go to the store earlier." },
          { label: "B", text: "He wants to show that he was being productive." },
          { label: "C", text: "He needs to print it before doing chores." },
          { label: "D", text: "He hopes the woman will help with the laundry." }
        ],
        correctAnswerIndex: 0,
        explanation: "He mentions getting caught up with the report to explain why he didn't go to the store that morning."
      }
    ]
  },
  {
    id: "conv-2",
    title: "Conversation: Phone Battery",
    type: "conversation",
    transcriptText: "My phone keeps dying just a few hours after it's fully charged. You probably need a new battery. How long have you had it? Almost four years. It used to last all day, but now I charge it twice before dinner. I read online that once a battery starts losing power, it can even damage the phone if you ignore it for too long. Then you'd better replace it soon. There's a repair shop near the library that does same day service. Oh, I didn't know that. I'll head over there after work.",
    speakerType: "duo",
    imageUrl: "https://picsum.photos/seed/phone/800/400",
    questions: [
      {
        id: 11,
        questionText: "What does the man say about his phone battery?",
        options: [
          { label: "A", text: "It overheats whenever he plugs it in." },
          { label: "B", text: "It stops charging when it reaches half capacity." },
          { label: "C", text: "It loses power quickly after being fully charged." },
          { label: "D", text: "It takes several hours to recharge completely." }
        ],
        correctAnswerIndex: 2,
        explanation: "He says: 'My phone keeps dying just a few hours after it's fully charged.'"
      },
      {
        id: 12,
        questionText: "What does the woman advise the man to do?",
        options: [
          { label: "A", text: "Reduce how often he uses the phone." },
          { label: "B", text: "Carry a portable charger." },
          { label: "C", text: "Replace the battery." },
          { label: "D", text: "Wait until the weekend." }
        ],
        correctAnswerIndex: 2,
        explanation: "She says: 'Then you'd better replace it soon.'"
      }
    ]
  },
  {
    id: "ann-1",
    title: "Announcement: Advising",
    type: "announcement",
    transcriptText: "Good morning students. The academic advising office will offer extended walk-in hours next week for anyone planning to register for summer courses. Advisers will be available from 9 a.m. to 4 p.m. Monday through Thursday. No appointment is necessary, but please arrive early to avoid long wait times.",
    speakerType: "female",
    imageUrl: "https://picsum.photos/seed/advising/800/400",
    questions: [
      {
        id: 13,
        questionText: "What is the main purpose of the announcement?",
        options: [
          { label: "A", text: "To inform students about changes to advising hours" },
          { label: "B", text: "To announce the deadline for summer registration" },
          { label: "C", text: "To remind students of normal hours" },
          { label: "D", text: "To encourage students to attend a workshop" }
        ],
        correctAnswerIndex: 0,
        explanation: "It announces extended walk-in hours for the upcoming week."
      },
      {
        id: 14,
        questionText: "What are students encouraged to do?",
        options: [
          { label: "A", text: "Arrive early to avoid long waits" },
          { label: "B", text: "Schedule their appointments online" },
          { label: "C", text: "Email advisors for registration forms" },
          { label: "D", text: "Extend their hours to register" }
        ],
        correctAnswerIndex: 0,
        explanation: "The speaker says: 'please arrive early to avoid long wait times.'"
      }
    ]
  },
  {
    id: "ann-2",
    title: "Announcement: Blood Drive",
    type: "announcement",
    transcriptText: "Hi everyone, our club is partnering with the local Red Cross to host a community blood drive next Wednesday from 10 AM to 3 PM in the Student Center Ballroom. Donors should eat beforehand and bring a photo ID. If you'd like to volunteer, please sign up using the link sent in yesterday's email.",
    speakerType: "male",
    imageUrl: "https://picsum.photos/seed/redcross/800/400",
    questions: [
      {
        id: 15,
        questionText: "What should donors do before participating?",
        options: [
          { label: "A", text: "Contact the Red Cross" },
          { label: "B", text: "Fill out a volunteer form" },
          { label: "C", text: "Eat a meal" },
          { label: "D", text: "Pick up a wristband" }
        ],
        correctAnswerIndex: 2,
        explanation: "The announcement states: 'Donors should eat beforehand.'"
      },
      {
        id: 16,
        questionText: "Why does the speaker mention the email link?",
        options: [
          { label: "A", text: "To explain where to send confirmation messages" },
          { label: "B", text: "To remind members how to register as volunteers" },
          { label: "C", text: "To thank students who already signed up" },
          { label: "D", text: "To provide contact information" }
        ],
        correctAnswerIndex: 1,
        explanation: "He says: 'If you'd like to volunteer, please sign up using the link sent in yesterday's email.'"
      }
    ]
  },
  {
    id: "talk-1",
    title: "Academic Talk: Biology (Monarchs)",
    type: "lecture",
    transcriptText: "Every autumn, millions of monarch butterflies travel from the northern United States and Canada to the mountain forests of central Mexico. Their bright orange wings make the sky seem alive with motion. What makes this journey remarkable is its length and accuracy. Monarchs travel thousands of kilometers, yet the butterflies that arrive in Mexico are not the same ones that left the North. The journey takes several generations to complete, with each new group continuing the route their ancestors started. Scientists have been fascinated by how monarchs know where to go. Studies suggest they use the position of the sun as a kind of compass. They also appear to rely on an internal clock that adjusts for the sun's movement during the day. Some experiments show that when the butterflies' antennae are covered, they lose their sense of direction, suggesting that light sensors there play an important role. Despite their endurance, monarch populations have declined sharply in recent years. The biggest threats are habitat loss and the disappearance of milkweed plants, which are the only food source for monarch caterpillars.",
    speakerType: "lecturer",
    imageUrl: "https://picsum.photos/seed/monarch/800/400",
    questions: [
      {
        id: 17,
        questionText: "What is the main topic of the talk?",
        options: [
          { label: "A", text: "The remarkable lives of monarch butterflies" },
          { label: "B", text: "How monarch butterflies adapt to environmental changes" },
          { label: "C", text: "The structure of butterfly wings and their colors" },
          { label: "D", text: "The effects of climate change on monarch butterflies" }
        ],
        correctAnswerIndex: 0,
        explanation: "The talk covers their migration, navigation, and threats."
      },
      {
        id: 18,
        questionText: "Why does the speaker mention that multiple generations complete the migration?",
        options: [
          { label: "A", text: "To compare monarchs with other long-distance species" },
          { label: "B", text: "To suggest that migration patterns constantly change" },
          { label: "C", text: "To highlight how extraordinary the monarchs' life cycle and navigation are" },
          { label: "D", text: "To explain why scientists cannot study the full journey" }
        ],
        correctAnswerIndex: 2,
        explanation: "It highlights the unique fact that new generations continue a route they've never flown before."
      },
      {
        id: 19,
        questionText: "According to the speaker, what helps monarch butterflies navigate during migration?",
        options: [
          { label: "A", text: "The scent of milkweed plants" },
          { label: "B", text: "Landmarks they recognize" },
          { label: "C", text: "The position of the sun combined with an internal clock" },
          { label: "D", text: "Temperature changes" }
        ],
        correctAnswerIndex: 2,
        explanation: "The speaker mentions using the 'position of the sun as a kind of compass' and an 'internal clock'."
      },
      {
        id: 20,
        questionText: "What can be inferred about monarch migration?",
        options: [
          { label: "A", text: "It varies dramatically each year." },
          { label: "B", text: "It depends on inherited biological mechanisms." },
          { label: "C", text: "It can occur under constant wind conditions." },
          { label: "D", text: "It is identical to other insects." }
        ],
        correctAnswerIndex: 1,
        explanation: "Since ancestors start it and descendants finish it without learning it, it must be biological/instinctual."
      }
    ]
  }
];

// --- MODULE 2 (HARD) ---
// Contains the "after break" discrete items + Office Supplies Conv + Marine Biology Talk
const M2_HARD_SEGMENTS: TestSegment[] = [
  {
    id: "m2-q21",
    title: "Listen and Choose (Item 9)",
    type: "discrete",
    transcriptText: "Who approved the new advertising budget?",
    speakerType: "male",
    questions: [{
      id: 21,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "I spoke with the finance team." },
        { label: "B", text: "It's due by the end of the quarter." },
        { label: "C", text: "The marketing director signed off on it." },
        { label: "D", text: "There's a meeting about it scheduled." }
      ],
      correctAnswerIndex: 2,
      explanation: "The question asks 'Who'. Option C provides a specific person/role (Marketing Director)."
    }]
  },
  {
    id: "m2-q22",
    title: "Listen and Choose (Item 10)",
    type: "discrete",
    transcriptText: "I can't make it to the meeting tomorrow.",
    speakerType: "female",
    questions: [{
      id: 22,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "The meeting's on the third floor." },
        { label: "B", text: "Let's plan to meet next week instead." },
        { label: "C", text: "I already sent the link to your inbox." },
        { label: "D", text: "I'm sorry to hear about your loss." }
      ],
      correctAnswerIndex: 1,
      explanation: "Option B offers a solution (rescheduling) to the statement that they can't attend."
    }]
  },
  {
    id: "m2-q23",
    title: "Listen and Choose (Item 11)",
    type: "discrete",
    transcriptText: "The hallway lights aren't working again.",
    speakerType: "female",
    questions: [{
      id: 23,
      questionText: "Choose the best response:",
      options: [
        { label: "A", text: "They were installed last year." },
        { label: "B", text: "I'll ask maintenance to take a look." },
        { label: "C", text: "The lights are brighter earlier in the day." },
        { label: "D", text: "It's about time to look for a new apartment." }
      ],
      correctAnswerIndex: 1,
      explanation: "Option B addresses the problem by calling maintenance."
    }]
  },
  {
    id: "conv-3",
    title: "Conversation: Office Supplies",
    type: "conversation",
    transcriptText: "The shipment of office supplies still hasn't arrived. It's been almost a week since we placed that order. I called the supplier this morning, and they said the delivery truck broke down outside the city. They're sending another one tomorrow. That explains it. I'll let the team know to go easy on the printing until then.",
    speakerType: "duo",
    imageUrl: "https://picsum.photos/seed/office/800/400",
    questions: [
      {
        id: 24,
        questionText: "What can be inferred about the man's workplace?",
        options: [
          { label: "A", text: "They plan to change suppliers soon." },
          { label: "B", text: "They received an extra delivery last week." },
          { label: "C", text: "They are running low on certain supplies." },
          { label: "D", text: "They have recently put limits on their printing." }
        ],
        correctAnswerIndex: 2,
        explanation: "The man asks the team to 'go easy on the printing', implying they are low on paper or ink."
      },
      {
        id: 25,
        questionText: "What will happen tomorrow?",
        options: [
          { label: "A", text: "A replacement delivery will arrive" },
          { label: "B", text: "The supplier will issue a refund" },
          { label: "C", text: "The office will run out of supplies" },
          { label: "D", text: "The team will cancel all print jobs" }
        ],
        correctAnswerIndex: 0,
        explanation: "The woman says: 'They're sending another one tomorrow'."
      }
    ]
  },
  {
    id: "talk-2",
    title: "Academic Talk: Marine Biology",
    type: "lecture",
    transcriptText: "In the dark depths of the ocean, where sunlight never reaches, many organisms have developed the ability to produce their own light. This natural glow, known as bioluminescence, serves a variety of purposes. Some species use it to attract prey, while others rely on it to hide from predators. But one of the most intriguing uses is communication. For many deep sea creatures, light is their language. Certain squid, for example, flash rhythmic pulses of blue light from their bodies to signal to potential mates or to coordinate movement within a group. In one species, these light displays become more complex during mating season, almost like a visual conversation. Other animals, such as the lanternfish, have glowing spots arranged along their sides that may help them recognize members of their own species in the darkness. Each pattern acts like an identification badge in a place where vision is limited. Researchers studying these organisms have discovered that light production is not always controlled by the animal alone. In some cases, bacteria living inside the creature's body produce the glow. This cooperation between host and microbe shows how even in extreme environments, life depends on partnerships. Next, let's look at how these biological light systems might inspire new forms of communication technology, such as underwater signaling devices or low energy lighting systems.",
    speakerType: "lecturer",
    imageUrl: "https://picsum.photos/seed/biolum/800/401",
    questions: [
      {
        id: 28,
        questionText: "What is the main topic of the talk?",
        options: [
          { label: "A", text: "How bioluminescence affects ecosystems" },
          { label: "B", text: "How deep-sea organisms use bioluminescence to survive" },
          { label: "C", text: "How scientists discovered bioluminescence" },
          { label: "D", text: "How light pollution interferes with bioluminescence" }
        ],
        correctAnswerIndex: 1,
        explanation: "The talk explains various survival uses (prey, predators, communication)."
      },
      {
        id: 29,
        questionText: "All of the following are mentioned as ways deep-sea animals use bioluminescence EXCEPT:",
        options: [
          { label: "A", text: "To navigate using reflected light from the ocean surface" },
          { label: "B", text: "To attract prey in the dark" },
          { label: "C", text: "To recognize others of the same species" },
          { label: "D", text: "To signal to potential mates" }
        ],
        correctAnswerIndex: 0,
        explanation: "Navigation via surface light is not mentioned and is impossible in the 'dark depths'."
      },
      {
        id: 30,
        questionText: "What can be inferred about the relationship between bacteria and bioluminescent animals?",
        options: [
          { label: "A", text: "The light from the bacteria can only be produced in shallow water." },
          { label: "B", text: "The bacteria weaken the animal's immune system." },
          { label: "C", text: "Both organisms benefit from the light they produce together." },
          { label: "D", text: "The bacteria rely on the animal's nervous system." }
        ],
        correctAnswerIndex: 2,
        explanation: "It's described as a 'cooperation' and 'partnership', implying mutual benefit."
      },
      {
        id: 31,
        questionText: "What will the speaker most likely discuss next?",
        options: [
          { label: "A", text: "How bioluminescent systems could inspire communication technologies" },
          { label: "B", text: "How scientists study light production in land-based animals" },
          { label: "C", text: "How climate change affects bioluminescent organisms" },
          { label: "D", text: "How ocean currents influence bacteria" }
        ],
        correctAnswerIndex: 0,
        explanation: "The last sentence explicitly introduces 'communication technology' as the next topic."
      }
    ]
  }
];

// --- MODULE 2 (EASY) ---
// Contains Gym Conv + History Talk + reuse of discrete items for structure
const M2_EASY_SEGMENTS: TestSegment[] = [
  {
    id: "conv-4",
    title: "Conversation: Gym Membership",
    type: "conversation",
    transcriptText: "I canceled my gym membership last month, and now I regret it. What happened? I thought I'd save money and just work out at home, but I haven't exercised once since then. You could always rejoin; sometimes they let you skip the sign up fee if you were a recent member. That's good to know. I'll stop by this weekend and ask. Do it. It's easier to stay motivated when you go somewhere to train.",
    speakerType: "duo",
    imageUrl: "https://picsum.photos/seed/gym/800/400",
    questions: [
      {
        id: 26,
        questionText: "Why did the man cancel his gym membership?",
        options: [
          { label: "A", text: "He moved to a new neighborhood." },
          { label: "B", text: "He wanted to save money by exercising at home." },
          { label: "C", text: "He was dissatisfied with the gym's equipment." },
          { label: "D", text: "He decided to start running outdoors." }
        ],
        correctAnswerIndex: 1,
        explanation: "He says: 'I thought I'd save money and just work out at home.'"
      },
      {
        id: 27,
        questionText: "Why does the woman mention the signup fee?",
        options: [
          { label: "A", text: "To warn that some gyms increase fees." },
          { label: "B", text: "To explain why she stopped going." },
          { label: "C", text: "To suggest he compare prices." },
          { label: "D", text: "To show that rejoining might not cost much." }
        ],
        correctAnswerIndex: 3,
        explanation: "She mentions skipping the fee to encourage him that rejoining won't be expensive."
      }
    ]
  },
  {
    id: "talk-3",
    title: "Academic Talk: Ancient History",
    type: "lecture",
    transcriptText: "Around 10,000 years ago, in a region of the Middle East once known as the Fertile Crescent, a group of people began an experiment that would change human history. They were not building cities or empires yet. They were simply trying to survive in a landscape of grasslands and rivers that flooded each spring. Archaeological evidence from sites near the Tigris and Euphrates rivers shows that small communities began gathering wild grains that grew after the floods. Over time, they noticed that seeds dropped near their camps sprouted again the next season. This observation marked the beginning of agriculture. One of the best studied settlements from this period is Jericho. Located near the Jordan River. The people there constructed circular houses from mud and built stone walls to protect their crops from animals and seasonal floods. Storage pits found beneath the floors suggest that they were saving food from one harvest to the next. This ability to store grain gave them security through harsh seasons and allowed the population to grow. Families no longer needed to move constantly in search of food, and social roles began to change as some members specialized in tool making and food preparation. These early farmers could not have known the long-term consequences of their innovation. Yet their decision to plant and protect grain set in motion the rise of complex societies. In the next section, we will look at how similar communities laid the groundwork for the first civilizations.",
    speakerType: "lecturer",
    imageUrl: "https://picsum.photos/seed/jericho/800/402",
    questions: [
      {
        id: 32,
        questionText: "What is the main focus of the talk?",
        options: [
          { label: "A", text: "How early farmers domesticated animals" },
          { label: "B", text: "How ancient empires expanded trade" },
          { label: "C", text: "How climate change forced ancient peoples to change" },
          { label: "D", text: "How early communities in the Fertile Crescent developed agriculture" }
        ],
        correctAnswerIndex: 3,
        explanation: "The talk traces the development from gathering wild grains to agriculture and settlement."
      },
      {
        id: 33,
        questionText: "What evidence suggests that people in Jericho stored food?",
        options: [
          { label: "A", text: "Archaeologists found storage pits beneath the floors." },
          { label: "B", text: "Large clay jars were discovered." },
          { label: "C", text: "Stone carvings showed baskets." },
          { label: "D", text: "Written records described the process." }
        ],
        correctAnswerIndex: 0,
        explanation: "The speaker mentions: 'Storage pits found beneath the floors suggest that they were saving food'."
      },
      {
        id: 34,
        questionText: "Why does the speaker mention specialization in toolmaking?",
        options: [
          { label: "A", text: "To describe how farming weakened family structures" },
          { label: "B", text: "To explain why communities abandoned hunting" },
          { label: "C", text: "To show how stable food supplies made new forms of labor possible" },
          { label: "D", text: "To suggest that early agriculture caused conflict" }
        ],
        correctAnswerIndex: 2,
        explanation: "It explains that food security allowed people to stop searching for food constantly and specialize."
      },
      {
        id: 35,
        questionText: "What will the speaker most likely discuss next?",
        options: [
          { label: "A", text: "How farming communities contributed to early civilizations" },
          { label: "B", text: "How modern agriculture differs from ancient techniques" },
          { label: "C", text: "How trade spread agricultural ideas" },
          { label: "D", text: "How early farmers adapted to colder climates" }
        ],
        correctAnswerIndex: 0,
        explanation: "The last sentence says: 'look at how similar communities laid the groundwork for the first civilizations'."
      }
    ]
  }
];

// Module 1: 13 Questions. 13 * 45s = ~10m.
export const MODULE_1: Module = {
  id: 'module-1',
  label: 'Module 1: Routing',
  description: 'Complete this mix of items to determine your adaptive path.',
  timeLimitSeconds: 10 * 60, 
  segments: M1_SEGMENTS
};

// Module 2 Hard: 7 Questions. ~5m.
export const MODULE_2_HARD: Module = {
  id: 'module-2-hard',
  label: 'Module 2: Advanced',
  description: 'Higher difficulty items. Allows for maximum score potential (Band 5.0-6.0).',
  timeLimitSeconds: 6 * 60, 
  segments: M2_HARD_SEGMENTS
};

// Module 2 Easy: 6 Questions. ~5m.
export const MODULE_2_EASY: Module = {
  id: 'module-2-easy',
  label: 'Module 2: Standard',
  description: 'Standard difficulty items. Score potential capped (Band 1.0-4.0).',
  timeLimitSeconds: 5 * 60, 
  segments: M2_EASY_SEGMENTS
};