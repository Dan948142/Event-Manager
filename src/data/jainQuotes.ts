import { JainQuote } from '../types';

export const JAIN_QUOTES: JainQuote[] = [
  {
    id: 'quote-ahimsa',
    sanskrit: 'अहिंसा परमो धर्मः',
    hindiTranslation: 'अहिंसा ही परम धर्म है।',
    englishTranslation: 'Non-violence is the supreme spiritual path. Live and let live in peace and harmony with all beings.',
    source: 'Tirthankara Mahavira',
  },
  {
    id: 'quote-paraspar',
    sanskrit: 'परस्परोपग्रहो जीवानाम्',
    hindiTranslation: 'सभी जीव एक-दूसरे के उपकार और कल्याण के लिए हैं।',
    englishTranslation: 'All souls are bound together by mutual assistance, compassion, and shared spiritual upliftment.',
    source: 'Tattvartha Sutra 5.21',
  },
  {
    id: 'quote-micchami',
    sanskrit: 'खामेमि सव्व जीवे, सव्वे जीवा खमंतु मे। मित्ती मे सव्व भूएसु, वेरं मज्झं न केणइ॥',
    hindiTranslation: 'मैं सभी जीवों से क्षमा मांगता हूँ, सब जीव मुझे क्षमा करें। मेरी सब जीवों से मैत्री है, किसी से बैर नहीं।',
    englishTranslation: 'I forgive all living beings; may all beings forgive me. I cherish universal friendship with all beings and harbor ill-will toward none.',
    source: 'Pratikraman Sutra',
  },
  {
    id: 'quote-truth',
    sanskrit: 'सच्चं लोगम्मि सारभूयं',
    hindiTranslation: 'इस संसार में सत्य ही सारभूत और सर्वोत्तम तत्व है।',
    englishTranslation: 'Truth is the most profound essence in the universe; adherence to truth purifies the soul.',
    source: 'Acharanga Sutra',
  },
  {
    id: 'quote-darshan',
    sanskrit: 'दर्शनं जिनसूर्यस्य संसारध्वान्तनाशनम्',
    hindiTranslation: 'जिनसूर्य का दर्शन संसार के अंधकार को नष्ट करने वाला है।',
    englishTranslation: 'Beholding the serene radiance of the Jina dispels the darkness of delusion and fills the heart with sacred calm.',
    source: 'Jinendra Bhakti',
  },
  {
    id: 'quote-samata',
    sanskrit: 'सत्त्वेषु मैत्रीं गुणिषु प्रमोदं क्लिष्टेषु जीवेषु कृपापरत्वम्',
    hindiTranslation: 'सभी जीवों के प्रति मैत्री, गुणवानों को देखकर प्रसन्नता, और दुखियों के प्रति करुणा का भाव रखें।',
    englishTranslation: 'Cultivate friendship towards all living beings, joy in the virtues of others, and compassion towards those in distress.',
    source: 'Acharya Amitagati',
  },
];

export const JAIN_EVENT_TYPES = [
  'Temple Darshan',
  'Morning Puja & Abhishek',
  'Bhakti Sandhya & Aarti',
  'Swadhyay & Pravachan',
  'Navkar Jaap & Samayik',
  'Tirth Yatra & Pilgrimage',
  'Sadarmik Vatsalya & Seva',
] as const;

export const DEFAULT_TEMPLE_GUIDELINES = `1. Dress Code: Traditional decent attire (white/light colors preferred, pure puja vastra for abhishek).
2. Purity: Please wash hands and feet at the entrance before entering the garbhagriha.
3. Temple Etiquette: Leather articles (belts, wallets, watchstraps) and footwear must be deposited outside.
4. Silence & Devotion: Maintain serene calm, chant Navkar Mantra mentally or gently.`;

export const IIT_KGP_HALLS = [
  'Ashutosh Mukherjee Hall',
  'Azad Hall',
  'B. C. Roy Hall',
  'B. R. Ambedkar Hall',
  'Gokhale Hall',
  'Homi J. Bhabha (HJB) Hall',
  'J. C. Bose (JCB) Hall',
  'Lal Bahadur Shastri (LBS) Hall',
  'Lala Lajpat Rai (LLR) Hall',
  'Madan Mohan Malviya (MMM) Hall',
  'Meghnad Saha (MS) Hall',
  'Mother Teresa Hall',
  'Nehru Hall',
  'Patel Hall',
  'Radhakrishnan (RK) Hall',
  'Rajendra Prasad (RP) Hall',
  'Rani Laxmibai (RLB) Hall',
  'SAM Hall (Sister Nivedita / Sir Ashutosh Mukherjee)',
  'Sarojini Naidu / Indira Gandhi (SN/IG) Hall',
  'Vidyasagar (VS) Hall',
  'Vikram Sarabhai Residential Complex (VSRC)',
  'Zakir Hussain Hall',
  'Campus Staff / Faculty Quarters',
  'Day Scholar / Off-Campus / Visitor',
] as const;

export const POPULAR_CAMPUS_AREAS = IIT_KGP_HALLS;
