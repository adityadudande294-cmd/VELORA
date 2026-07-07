export interface Translation {
  en: string;
  hi: string;
  mr: string;
}

export interface ArrayTranslation {
  en: string[];
  hi: string[];
  mr: string[];
}

export interface TimelineEvent {
  year: string;
  title: Translation;
  details: Translation;
}

export interface QAPair {
  q: string[]; // keywords or questions that match
  a: Translation;
}

export interface StoryDetail {
  id: string;
  image: string;
  title: Translation;
  subtitle: Translation;
  category: string;
  duration: string;
  difficulty: string;
  era: string;
  factStatus: string;
  factLabel: "Historically Verified" | "Supported by Scientific Evidence" | "Partially Verified" | "Active Research" | "Historical Legend" | "Folklore";
  learningObjectives: Translation[];
  knowledgeLevel: "Beginner" | "Intermediate" | "Advanced";
  relatedTopics: string[];
  synopsis: Translation;
  timeline: TimelineEvent[];
  narrative: {
    en: {
      intro: string[];
      background?: string[];
      main?: string[];
      evidence?: string[];
      scientific?: string[];
      historical?: string[];
      legends?: string[];
      facts?: string[];
      takeaways?: string[];
      conclusion?: string[];
    };
    hi: {
      intro: string[];
      background?: string[];
      main?: string[];
      evidence?: string[];
      scientific?: string[];
      historical?: string[];
      legends?: string[];
      facts?: string[];
      takeaways?: string[];
      conclusion?: string[];
    };
    mr: {
      intro: string[];
      background?: string[];
      main?: string[];
      evidence?: string[];
      scientific?: string[];
      historical?: string[];
      legends?: string[];
      facts?: string[];
      takeaways?: string[];
      conclusion?: string[];
    };
  };
  explanations: {
    eli10: Translation;
    simple: Translation;
    detailed: Translation;
    academic: Translation;
    revision: Translation;
  };
  qa: QAPair[];
  references: string[];
}

export const KNOWLEDGE_DATABASE: Record<string, StoryDetail> = {
  roopkund: {
    id: "roopkund",
    image: "/images/roopkund.png",
    title: {
      en: "Roopkund: The Skeleton Lake",
      hi: "रूपकुंड: कंकाल झील का रहस्य",
      mr: "रूपकुंड: सांगाड्यांच्या तलावाचे रहस्य"
    },
    subtitle: {
      en: "The frozen Himalayan graveyard of ancient travelers",
      hi: "प्राचीन यात्रियों का बर्फीला हिमालयी कब्रिस्तान",
      mr: "प्राचीन प्रवाशांचे हिमालयातील बर्फाच्छादित स्मशान"
    },
    category: "Indian Mysteries",
    duration: "15 mins",
    difficulty: "Medium",
    era: "c. 800 CE",
    factStatus: "95% DNA Verified, 5% Mountain Legend",
    factLabel: "Supported by Scientific Evidence",
    learningObjectives: [
      { en: "Understand the geographical layout of Roopkund Lake", hi: "रूपकुंड झील की भौगोलिक स्थिति को समझें", mr: "रूपकुंड तलावाची भौगोलिक रचना समजून घेणे" },
      { en: "Analyze the 2019 DNA findings published in Nature", hi: "नेचर पत्रिका में 2019 के डीएनए निष्कर्षों का विश्लेषण करें", mr: "२०१९ च्या 'नेचर' जर्नलमध्ये प्रसिद्ध झालेल्या डीएनए निष्कृषांचे विश्लेषण" }
    ],
    knowledgeLevel: "Intermediate",
    relatedTopics: ["Himalayan Geology", "Ancient Trade Routes", "Paleogenomics"],
    synopsis: {
      en: "High in the freezing peaks of the Himalayas, Roopkund Lake holds the bones of hundreds of ancient travelers. DNA analysis reveals a shocking truth: these people died in separate events over a millennium apart, including Mediterranean Europeans. What drew them here?",
      hi: "हिमालय की बर्फीली चोटियों में स्थित, रूपकुंड झील सैकड़ों प्राचीन यात्रियों की हड्डियों को समेटे हुए है। डीएनए विश्लेषण से पता चलता है कि ये लोग सदियों के अंतराल पर अलग-अलग घटनाओं में मारे गए थे, जिसमें भूमध्यसागरीय यूरोपीय भी शामिल थे।",
      mr: "हिमालयाच्या उंच बर्फाच्छादित शिखरांवर वसलेले रूपकुंड तलाव शेकडो प्राचीन प्रवाशांच्या हाडांचा साठा बाळगून आहे. डीएनए विश्लेषणातून समोर आलेले सत्य थक्क करणारे आहे: हे लोक एकाच वेळी नाही, तर तब्बल १००० वर्षांच्या फरकाने वेगवेगळ्या घटनांमध्ये मरण पावले होते."
    },
    timeline: [
      {
        year: "1942",
        title: { en: "Discovery by Madhwal", hi: "मधवाल द्वारा खोज", mr: "मधवाल यांनी लावलेला शोध" },
        details: {
          en: "Hari Kishan Madhwal, a forest ranger, discovers skeletons floating in the melting ice of the lake.",
          hi: "वन रेंजर हरि किशन मधवाल ने झील के पिघलते बर्फ में कंकाल तैरते हुए देखे।",
          mr: "फॉरेस्ट रेंजर हरी किशन मधवाल यांना तलावाच्या वितळणाऱ्या बर्फात तरंगणारे सांगाडे आढळले."
        }
      },
      {
        year: "1956",
        title: { en: "First Anthropological Expedition", hi: "पहला मानवशास्त्रीय अभियान", mr: "पहिली मानववंशशास्त्रीय मोहीम" },
        details: {
          en: "Researchers collect hair, flesh, and artifacts preserved by the freezing mountain environment.",
          hi: "शोधकर्ताओं ने अत्यधिक ठंड से सुरक्षित बाल, मांस और प्राचीन कलाकृतियों को एकत्रित किया।",
          mr: "संशोधकांनी कडक थंडीमुळे सुरक्षित राहिलेले केळ, त्वचा आणि प्राचीन वस्तू गोळा केल्या."
        }
      },
      {
        year: "2019",
        title: { en: "Nature DNA Publication", hi: "नेचर डीएनए प्रकाशन", mr: "नेचर जर्नलमध्ये डीएनए संशोधन प्रसिद्ध" },
        details: {
          en: "A global DNA study reveals three distinct genetic groups died here, separated by 1,000 years.",
          hi: "वैश्विक डीएनए अध्ययन से पता चला कि 1,000 वर्षों के अंतराल पर तीन अलग-अलग अनुवांशिक समूह यहाँ मरे थे।",
          mr: "एक जागतिक डीएनए अभ्यासातून असे दिसून आले की १००० वर्षांच्या अंतराने तीन वेगवेगळ्या अनुवांशिक गटांचे लोक येथे मरण पावले होते."
        }
      }
    ],
    narrative: {
      en: {
        intro: [
          "High in the freezing heights of the Indian Himalayas, nestled at an altitude of 5,029 meters (16,500 feet), lies a mysterious tarn known as Roopkund. For most of the year, this remote water body remains locked in solid ice, surrounded by jagged glaciers and snow-clad peaks.",
          "However, when the summer sun melts the ice, a gruesome sight is exposed. Inside the shallow lake and scattered across its rocky shores lie the skeletal remains of hundreds of human beings.",
          "For decades, this site has captured the curiosity of archaeologists, forensic scientists, and travelers alike, earning the ominous moniker of 'Skeleton Lake'."
        ],
        background: [
          "The riddle of Roopkund began in 1942, during the height of the Second World War. A British forest ranger named Hari Kishan Madhwal was patrolling the Nanda Devi National Sanctuary when he discovered the shallow crater filled with bones.",
          "In the tense climate of the war, authorities initially feared these were the bodies of invading Japanese soldiers who had died of exposure while attempting to cross the mountains into India.",
          "However, immediate military examinations revealed that the bones were far older, dismissing any fears of a wartime invasion but leaving a deep historical mystery in its place."
        ],
        main: [
          "In the decades that followed, numerous hypotheses were proposed. Some scholars suggested the skeletons belonged to a lost army of the 14th-century general Zorawar Singh of Jammu, returning from a raid in Tibet.",
          "Others claimed it was a royal pilgrimage led by the King of Kanauj, Raja Jasdhaval, who, along with his pregnant wife Rani Balampa and retinue, incurred the wrath of the mountain goddess Nanda Devi.",
          "The goddess, according to local folk songs, unleashed a terrible storm that struck down the pilgrims for their hubris. Lacking advanced technology, early investigators could only guess at the truth, matching local folklore against scattered archaeological clues."
        ],
        evidence: [
          "The mystery took a dramatic turn in 2019 when an international team of scientists published a comprehensive DNA study in the journal Nature Communications.",
          "The researchers analyzed the genomes of 38 skeletons and uncovered a shocking truth: the skeletons did not belong to a single group of travelers who died in a single event.",
          "Instead, the remains belonged to three genetically distinct groups who died in separate incidents separated by more than 1,000 years! The oldest group, consisting of South Asian-associated individuals, died around 800 CE.",
          "Surprisingly, the second group, genetically similar to Mediterranean Europeans (specifically mainland Greece and Crete), died around 1800 CE. A third group, of East Asian origin, also died in a separate mountain crossing."
        ],
        scientific: [
          "From a scientific perspective, paleogenomic data proved that the individuals with South Asian ancestry were not closely related, indicating they belonged to multiple traveler cohorts.",
          "Furthermore, forensic examinations of the skulls and bones provided key evidence about the cause of death. Many of the skeletons exhibited deep, unhealed fractures.",
          "Crucially, these injuries were all localized to the skulls and shoulders. There were no signs of weapon wounds, ruling out warfare or execution. Instead, the fractures were circular and blunt, as if struck from directly above.",
          "Forensic experts concluded that the travelers were struck down by sudden, massive hailstones, roughly the size of cricket balls (about 7 cm in diameter). Trapped in the open terrain with no shelter, the pilgrims and guides had no escape."
        ],
        historical: [
          "Historically, the presence of Mediterranean travelers in the high Himalayas around 1800 CE remains a profound enigma. There are no historical records of any European expedition traveling through Roopkund during this period.",
          "Some historians hypothesize they may have been part of an undocumented merchant mission or associates of the East India Company, though their genetic signature matches Greece rather than Britain.",
          "The older 800 CE group aligns well with the establishment of the Nanda Devi Raj Jat pilgrimage route, indicating that ancient Indians were actively traversing these high-altitude passes for religious purposes."
        ],
        legends: [
          "Local legends heavily feature Nanda Devi, the supreme deity of the region. Traditional Garhwali folklore describes how the King of Kanauj violated the sanctity of the mountains by bringing dancing girls and luxury items onto the sacred path.",
          "To cleanse her domain, Nanda Devi created an 'iron rain'—hailstones of solid iron that rained down upon the pilgrims, burying them at the lake.",
          "Modern scientists note the uncanny alignment between this legend's 'iron rain' and the forensic conclusion of blunt force trauma by hailstones."
        ],
        facts: [
          "The lake contains skeletons of children, women, and adults alike, disproving the theory of an all-male military army.",
          "Leather slippers, wooden artifacts, iron spearheads, and small fragments of clothing were found remarkably preserved by the sub-zero temperatures.",
          "Despite being popularly known as a single mass death, the bodies were deposited over at least three distinct historic episodes."
        ],
        takeaways: [
          "Roopkund Skeleton Lake is a multi-epoch cemetery, not a single disaster site.",
          "Ancient DNA has confirmed migration and travel patterns from Greece to India that were completely lost to history.",
          "Sudden, catastrophic weather events like localized severe hailstorms are the primary cause of death."
        ],
        conclusion: [
          "Roopkund remains one of archaeology's most haunting discoveries, a natural vault where history, science, and legend merge.",
          "The DNA findings confirm that human journeys across these treacherous mountain passes have occurred for millennia, drawing people from as far as the Mediterranean.",
          "Whether they walked as traders, pilgrims, or explorers, they met the same icy fate, preserved by the sub-zero temperatures of the Himalayas to tell their extraordinary story to future generations."
        ]
      },
      hi: {
        intro: [
          "भारतीय हिमालय की जमा देने वाली ऊंचाइयों में, 5,029 मीटर (16,500 फीट) की ऊंचाई पर स्थित, एक रहस्यमयी झील है जिसे रूपकुंड कहा जाता है। साल के अधिकांश समय, यह सुदूर झील ठोस बर्फ में जमी रहती है, जो नुकीले हिमनदों और बर्फ से ढकी चोटियों से घिरी होती है।",
          "हालांकि, जब गर्मियों का सूरज बर्फ को पिघलाता है, तो एक भयानक नजारा सामने आता है। उथली झील के अंदर और उसके पथरीले किनारों पर सैकड़ों इंसानों के कंकाल बिखरे हुए दिखाई देते हैं।",
          "दशकों से, इस स्थल ने पुरातत्वविदों, फोरेंसिक वैज्ञानिकों और यात्रियों की उत्सुकता को आकर्षित किया है, जिससे इसे 'कंकाल झील' का डरावना नाम मिला है।"
        ],
        background: [
          "रूपकुंड का रहस्य 1942 में शुरू हुआ, जब द्वितीय विश्व युद्ध चरम पर था। एक ब्रिटिश फॉरेस्ट रेंजर, हरि किशन मधवाल, नंदा देवी राष्ट्रीय अभ्यारण्य में गश्त कर रहे थे, जब उन्होंने हड्डियों से भरे इस उथले गड्ढे की खोज की।",
          "युद्ध के तनावपूर्ण माहौल में, अधिकारियों को शुरू में डर था कि ये आक्रमणकारी जापानी सैनिकों के शव हैं, जो भारत में प्रवेश करने की कोशिश के दौरान ठंड से मर गए थे।",
          "हालांकि, तत्काल सैन्य जांच से पता चला कि ये हड्डियां बहुत पुरानी थीं, जिससे युद्धकालीन आक्रमण का डर तो समाप्त हो गया, लेकिन एक गहरा रहस्य पीछे छूट गया।"
        ],
        main: [
          "इसके बाद के दशकों में कई परिकल्पनाएं प्रस्तावित की गईं। कुछ विद्वानों ने सुझाव दिया कि कंकाल जम्मू के 14वीं शताब्दी के सेनापति जोरावर सिंह की सेना के हैं, जो तिब्बत पर आक्रमण के बाद लौट रहे थे।",
          "दूसरों का दावा था कि यह कन्नौज के राजा जसधवल के नेतृत्व में एक शाही तीर्थयात्रा थी, जिन्होंने अपनी गर्भवती पत्नी रानी बालम्पा और दल-बल के साथ पहाड़ी देवी नंदा देवी के क्रोध को आमंत्रित किया था।",
          "स्थानीय लोकगीतों के अनुसार, देवी ने एक भयानक तूफान भेजा जिसने तीर्थयात्रियों को उनके अहंकार के कारण मार गिराया। उन्नत तकनीक के अभाव में, शुरुआती जांचकर्ता केवल अनुमान ही लगा सकते थे।"
        ],
        evidence: [
          "रहस्य ने 2019 में एक नाटकीय मोड़ लिया जब वैज्ञानिकों की एक अंतरराष्ट्रीय टीम ने जर्नल 'नेचर कम्युनिकेशंस' में एक व्यापक डीएनए अध्ययन प्रकाशित किया।",
          "शोधकर्ताओं ने 38 कंकालों के जीनोम का विश्लेषण किया और एक चौंकाने वाला सच उजागर किया: ये कंकाल एक ही समूह के नहीं थे जो एक ही घटना में मारे गए थे।",
          "इसके बजाय, ये अवशेष तीन अनुवांशिक रूप से भिन्न समूहों के थे जो 1,000 से अधिक वर्षों के अंतराल पर अलग-अलग घटनाओं में मारे गए थे! सबसे पुराना समूह, जो दक्षिण एशियाई लोगों का था, लगभग 800 ईस्वी में मारा गया था।",
          "आश्चर्यजनक रूप से, दूसरा समूह, जो भूमध्यसागरीय यूरोपीय लोगों (विशेष रूप से ग्रीस) से मिलता-जुलता था, लगभग 1800 ईस्वी में मारा गया था।"
        ],
        scientific: [
          "वैज्ञानिक दृष्टिकोण से, डीएनए डेटा ने साबित किया कि दक्षिण एशियाई पूर्वज वाले लोग आपस में संबंधित नहीं थे, जिससे संकेत मिलता है कि वे कई अलग-अलग यात्री समूहों के थे।",
          "इसके अलावा, कंकालों की फोरेंसिक जांच से मौत के कारणों का महत्वपूर्ण सुराग मिला। कई खोपड़ियों और हड्डियों पर गहरी चोटों के निशान थे जो बिना ठीक हुए रह गए थे।",
          "ये चोटें केवल खोपड़ी और कंधों पर थीं। हथियारों के घावों का कोई निशान नहीं था, जिससे युद्ध या हत्या की बात खारिज हो गई। ये चोटें गोल और भारी थीं, जैसे ऊपर से सीधे प्रहार किया गया हो।",
          "फोरेंसिक विशेषज्ञों ने निष्कर्ष निकाला कि यात्री अचानक आए भीषण ओलावृष्टि के शिकार हुए थे, जिसमें गिरने वाले ओले क्रिकेट की गेंद (लगभग 7 सेमी व्यास) के आकार के थे। खुले पहाड़ों में बिना किसी आश्रय के उनके पास बचने का कोई रास्ता नहीं था।"
        ],
        historical: [
          "ऐतिहासिक रूप से, 1800 ईस्वी के आसपास ऊंचे हिमालय में भूमध्यसागरीय यात्रियों की उपस्थिति एक गहरा रहस्य बनी हुई है। इस अवधि के दौरान रूपकुंड से होकर गुजरने वाले किसी भी यूरोपीय अभियान का कोई ऐतिहासिक रिकॉर्ड उपलब्ध नहीं है।",
          "कुछ इतिहासकारों का मानना है कि वे किसी अज्ञात व्यापारिक मिशन का हिस्सा रहे होंगे, हालांकि उनकी अनुवांशिक बनावट ब्रिटेन के बजाय ग्रीस से मेल खाती है।"
        ],
        legends: [
          "स्थानीय किंवदंतियों में इस क्षेत्र की सर्वोच्च देवी नंदा देवी की महत्वपूर्ण भूमिका है। गढ़वाली लोककथाओं के अनुसार, कन्नौज के राजा ने पवित्र मार्ग पर नर्तकियों और विलासिता की वस्तुओं को लाकर पहाड़ों की पवित्रता को भंग कर दिया था।",
          "देवी ने तीर्थयात्रियों पर लोहे की बारिश (ठोस लोहे के ओले) की, जिससे वे झील में समा गए। वैज्ञानिक इस लोककथा और फोरेंसिक ओलावृष्टि निष्कर्ष के बीच गजब की समानता देखते हैं।"
        ],
        facts: [
          "झील में बच्चों, महिलाओं और वयस्कों के कंकाल मिले हैं, जिससे केवल पुरुषों की सेना होने का सिद्धांत खारिज हो जाता है।",
          "चमड़े की चप्पलें, लकड़ी की वस्तुएं, लोहे के भाले और कपड़ों के टुकड़े शून्य से नीचे के तापमान के कारण सुरक्षित मिले हैं।"
        ],
        takeaways: [
          "रूपकुंड एक बहु-युगीन कब्रिस्तान है, न कि एक ही आपदा का स्थल।",
          "प्राचीन डीएनए ने ग्रीस से भारत तक के उन यात्रा पैटर्नों की पुष्टि की है जो इतिहास के पन्नों में खो चुके थे।",
          "मौत का प्राथमिक कारण अचानक आई भीषण ओलावृष्टि थी।"
        ],
        conclusion: [
          "रूपकुंड पुरातत्व की सबसे डरावनी और सम्मोहक खोजों में से एक है, जहां इतिहास, विज्ञान और किंवदंतियां आपस में मिलती हैं।"
        ]
      },
      mr: {
        intro: [
          "भारतीय हिमालयाच्या अत्यंत थंड उंचीवर, ५,०२९ मीटर (१६,५०० फूट) उंचीवर वसलेले रूपकुंड नावाचे एक रहस्यमयी तलाव आहे. वर्षातील बराच काळ हे सुदूर तलाव पूर्णपणे गोठलेल्या बर्फात असते, जे डोंगर आणि बर्फाच्छादित शिखरांनी वेढलेले आहे.",
          "तथापि, जेव्हा उन्हाळ्यातील ऊन या बर्फाला वितळवते, तेव्हा एक भयानक दृश्य समोर येते. उथळ तलावामध्ये आणि त्याच्या खडकाळ किनाऱ्यावर शेकडो मानवी सांगाडे विखुरलेले पाहायला मिळतात.",
          "दशकांहून अधिक काळ, या जागेने पुरातत्वशास्त्रज्ञ, फॉरेन्सिक वैज्ञानिक आणि पर्यटकांना आकर्षित केले आहे, ज्यामुळे याला 'कंकाल तलाव' असे नाव मिळाले."
        ],
        background: [
          "रूपकुंडचे रहस्य १९४२ मध्ये सुरू झाले, जेव्हा दुसरे महायुद्ध ऐन रंगात होते. नंदा देवी राष्ट्रीय उद्यानात गस्त घालत असताना ब्रिटिश फॉरेस्ट रेंजर हरी किशन मधवाल यांना हा हाडांनी भरलेला तलाव सापडला.",
          "युद्धाच्या तणावामुळे, सुरुवातीला हे भारतावर आक्रमण करू पाहणाऱ्या जपानी सैनिकांचे मृतदेह असावेत अशी भीती व्यक्त केली गेली.",
          "परंतु, तात्काळ केलेल्या तपासणीत हे सांगाडे खूप जुने असल्याचे निष्पन्न झाले, ज्यामुळे युद्धाची भीती तर टळली, पण एक नवीन ऐतिहासिक रहस्य जन्माला आले."
        ],
        main: [
          "त्यानंतरच्या यादीत अनेक गृहीतके मांडली गेली. काही विद्वानांनी सुचवले की हे सांगाडे तिबेटवरून परतणाऱ्या जम्मूचे सेनापती जोरावर सिंग यांच्या सैनिकांचे होते.",
          "काही लोक कन्नौजचे राजा जसधवल यांच्या शाही तीर्थयात्रेचा उल्लेख करतात, ज्यांनी नंदा देवीचा कोप ओढवून घेतला होता.",
          "स्थानिक लोकगीतांनुसार, देवीने पाठवलेल्या भयानक वादळाने या प्रवाशांना मारून टाकले. तंत्रज्ञानाच्या अभावामुळे सुरुवातीचे संशोधक फक्त तर्क करू शकत होते."
        ],
        evidence: [
          "२०१९ मध्ये या रहस्याला मोठे वळण मिळाले जेव्हा आंतरराष्ट्रीय शास्त्रज्ञांनी 'नेचर कम्युनिकेशन्स' या जर्नलमध्ये डीएनए अभ्यास प्रसिद्ध केला.",
          "३८ सांगाड्यांच्या डीएनए विश्लेषणातून समोर आले की, हे मृतदेह एकाच वेळी किंवा एकाच घटनेत मरण पावलेले नाहीत.",
          "उलट, हे लोक तीन वेगवेगळ्या अनुवांशिक गटांचे होते जे १००० वर्षांच्या फरकाने वेगवेगळ्या कालावधीत येथे मरण पावले! सर्वात जुना गट दक्षिण आशियाई लोकांचा (८०० ईसवी) होता, तर दुसरा गट भूमध्यसागरीय युरोपीय लोकांचा (१८०० ईसवी) होता."
        ],
        scientific: [
          "वैज्ञानिक दृष्टिकोनातून, डीएनएवरून असे स्पष्ट झाले की हे लोक एकाच कुटुंबातील किंवा लष्करातील नव्हते.",
          "तसेच, सांगाड्यांच्या डोक्यावर आणि खांद्यावर गोल आणि खोल जखमांचे घाव आढळले. शस्त्रास्त्रांच्या जखमांचे कोणतेही पुरावे नव्हते, त्यामुळे लढाई किंवा हत्येची शक्यता नाकारली गेली.",
          "शास्त्रज्ञांनी असा निष्कर्ष केला की, हे प्रवासी अचानक आलेल्या प्रचंड मोठ्या गारांच्या वादळात सापडले असावेत. क्रिकेटच्या बॉलएवढ्या मोठ्या गारांमुळे डोक्यावर आघात होऊन त्यांचा जागीच मृत्यू झाला."
        ],
        historical: [
          "ऐतिहासिकदृष्ट्या, १८०० ईसवीमध्ये हिमालयासारख्या दुर्गम भागात ग्रीक किंवा भूमध्यसागरीय लोकांचा प्रवास का झाला, हा एक मोठा अनुत्तरित प्रश्न आहे."
        ],
        legends: [
          "स्थानिक दंतकथांनुसार, राजा जसधवल यांनी नृत्यांगना आणि विलासी वस्तू आणून हिमालयाची पवित्रता भंग केली, ज्यामुळे संतप्त होऊन नंदा देवीने लोखंडी गारांचा पाऊस पाडून त्यांना शिक्षा दिली."
        ],
        facts: [
          "या तलावात पुरुष, स्त्रिया आणि लहान मुलांचे सांगाडे सापडले आहेत, ज्यामुळे सैन्याचा सिद्धांत चुकीचा ठरतो.",
          "चामड्याच्या चपला, लाकडी वस्तू आणि कपड्यांचे तुकडे थंडीमुळे अजूनही चांगल्या स्थितीत सापडले आहेत."
        ],
        takeaways: [
          "रूपकुंड तलाव हे एका आपत्तीचे नसून विविध कालखंडातील मृत्यूंचे गोठलेले केंद्र आहे.",
          "डीएनए विश्लेषणाने इतिहासकारांनाही अज्ञात असलेल्या ग्रीस ते भारत प्रवासाची पुष्टी केली आहे."
        ],
        conclusion: [
          "रूपकुंड आजही इतिहास, विज्ञान आणि स्थानिक लोककथांचे एक अद्भुत मिश्रण बनून उभे आहे."
        ]
      }
    },
    explanations: {
      eli10: {
        en: "Roopkund is a frozen lake high up in the mountains. A long time ago, in the year 800, some travelers were walking past. Suddenly, a giant storm started, and huge chunks of ice (like hard rocks) fell from the sky. With no trees or caves to hide under, the ice hit them and they died. The freezing cold ice kept their bones safe like a natural freezer for hundreds of years!",
        hi: "रूपकुंड पहाड़ों में बहुत ऊपर एक जमी हुई झील है। बहुत समय पहले, लगभग 800 ईस्वी में, कुछ यात्री वहां से जा रहे थे। अचानक, बहुत बड़ा तूफान आया और आसमान से क्रिकेट की गेंद जैसे बड़े-बड़े ओले गिरने लगे। छिपने की जगह न होने के कारण वे ओलों की मार से मर गए। अत्यधिक ठंड ने उनकी हड्डियों को एक फ्रीजर की तरह सुरक्षित रखा है।",
        mr: "रूपकुंड हे हिमालयातील एक गोठलेले तलाव आहे. खूप वर्षांपूर्वी, काही लोक तेथून प्रवास करत होते. अचानक आकाशातून दगडासारख्या मोठ्या गारा पडू लागल्या. आश्रय घ्यायला जागा नसल्यामुळे गारा लागून ते मरण पावले. तिथल्या प्रचंड थंडीमुळे त्यांची हाडे हजारो वर्षे तशीच टिकून राहिली."
      },
      simple: {
        en: "Roopkund is a high-altitude Himalayan lake discovered in 1942, famous for containing the skeletons of over 300 people. Modern DNA testing showed they died in separate events. One group died around 800 CE, and another group of European descent died around 1800 CE. Forensic evidence suggests they were killed by a sudden, severe hailstorm that cracked their skulls.",
        hi: "रूपकुंड हालांकि 1942 में खोजी गई एक पहाड़ी झील है, लेकिन यह 300 से अधिक कंकालों के लिए प्रसिद्ध है। डीएनए से पता चला कि वे अलग-अलग समय पर मरे थे। पहला दल 800 ईस्वी में मरा, दूसरा 1800 ईस्वी में। वे भारी ओलावृष्टि से मरे थे।",
        mr: "रूपकुंड तलावात ३०० हून अधिक लोकांचे सांगाडे सापडले आहेत. डीएनए चाचणीवरून असे समजले की हे लोक वेगवेगळ्या शतकात मरण पावले. काही लोक ८०० ईसवीमध्ये तर काही युरोपियन लोक १८०० ईसवीमध्ये मरण पावले. गारांच्या वादळात त्यांचा मृत्यू झाला."
      },
      detailed: {
        en: "Located in Uttarakhand, India, Roopkund is an archaeological mystery site. After years of speculation linking the skeletons to lost armies or royal curses, a breakthrough 2019 study published in Nature analyzed the DNA of 38 individuals. It showed they died in distinct episodes separated by 1,000 years. The older cohort consists of South Asian pilgrims caught in a storm around 800 CE. The younger cohort is genetically identical to Mediterranean Greeks, dying around 1800 CE. The forensic cause of death was blunt force trauma to the head and shoulders, caused by large hailstones dropping on shelterless ridges.",
        hi: "उत्तराखंड में स्थित रूपकुंड एक पुरातात्विक रहस्य है। 2019 के एक डीएनए अध्ययन ने साबित किया कि वे 1,000 वर्षों के अंतर पर मरे थे। पुराना समूह 800 ईस्वी का था और नया समूह 1800 ईस्वी का ग्रीक मूल का था। उनकी मौत सिर पर बड़े ओले गिरने के कारण गहरी चोट से हुई थी।",
        mr: "उत्तराखंडमधील रूपकुंड हे एक ऐतिहासिक रहस्य आहे. २०१९ च्या जनुकीय अभ्यासानुसार येथे ३८ सांगाड्यांचे परीक्षण केले गेले. त्यातून असे दिसून आले की हे लोक वेगवेगळ्या शतकात मरण पावले. एक गट ८०० ईसवीमधील भारतीय प्रवाशांचा होता, तर दुसरा गट १८०० ईसवीमधील ग्रीक लोकांचा होता."
      },
      academic: {
        en: "Roopkund Lake represents a unique paleogenomic reservoir. Genomic sequencing indicates three distinct ancestry components: a South Asian cohort (circa 800 CE) displaying genetic affinity to contemporary Indian populations, a Mediterranean cohort (circa 1800 CE) aligned with modern Greek/Cretan populations, and an East Asian migrant (circa 1800 CE). Bioarchaeological analysis displays blunt-force cranial trauma with no skeletal remodeling, correlating to instant mortality via high-velocity projectile impact, consistent with severe, localized hail precipitation.",
        hi: "रूपकुंड झील एक अनूठा पुरा-जीनोमिक भंडार प्रस्तुत करती है। जीनोमिक अनुक्रमण तीन अलग-अलग वंश घटकों को दर्शाता है: एक दक्षिण एशियाई समूह (लगभग 800 ईस्वी) जो समकालीन भारतीय आबादी के साथ आनुवंशिक समानता प्रदर्शित करता है, और एक भूमध्यसागरीय समूह (लगभग 1800 ईस्वी) जो आधुनिक ग्रीक आबादी से मेल खाता है।",
        mr: "रूपकुंड तलाव हे प्राचीन मानवी जनुकांचे एक महत्त्वपूर्ण केंद्र मानले जाते. जनुकीय संशोधनानुसार येथे तीन भिन्न मानवी गट आढळले आहेत. एक भारतीय गट (८०० ईसवी) आणि दुसरा भूमध्यसागरीय ग्रीक गट (१८०० ईसवी). त्यांच्या डोक्यावरील जखमांचे स्वरूप हे वेगाने पडणाऱ्या कठीण गारांमुळे झाल्याचे स्पष्ट करते."
      },
      revision: {
        en: "Key Points: Roopkund Lake (5029m elevation) holds skeletons of hundreds of people. Discovery: 1942 by Hari Kishan Madhwal. DNA study (2019): Remains belong to South Asians (800 CE) and Mediterranean Greeks (1800 CE). Cause of death: Blunt force trauma to head from massive cricket-ball-sized hailstones (no weapon marks, ruling out warfare).",
        hi: "मुख्य बिंदु: रूपकुंड झील (5029 मीटर) में सैकड़ों कंकाल मिले हैं। खोज: 1942 में हरि किशन मधवाल द्वारा। डीएनए अध्ययन (2019): अवशेष दक्षिण एशियाई (800 ईस्वी) और ग्रीक (1800 ईस्वी) के हैं। मौत का कारण: भारी ओलावृष्टि से सिर पर लगी गंभीर चोट (युद्ध के कोई संकेत नहीं)।",
        mr: "महत्त्वाचे मुद्दे: रूपकुंड तलावात (५०२९ मी) शेकडो सांगाडे आढळले. शोध: १९४२ मध्ये हरी किशन मधवाल यांनी लावला. डीएनए अभ्यास (२०१९): मृतदेह भारतीय (८०० ईसवी) आणि ग्रीक (१८०० ईसवी) प्रवाशांचे आहेत. मृत्यूचे कारण: गारांचा प्रचंड वर्षाव (डोक्यावर गंभीर जखमा)."
      }
    },
    qa: [
      {
        q: ["how did they die", "cause of death", "hailstorm", "die", "ओले", "कसे वारले"],
        a: {
          en: "Forensic tests showed circular blunt-force trauma fractures on the skulls and shoulders of the skeletons. There were no weapon wounds, ruling out warfare or murder. The injuries indicate they were caught in a severe mountain hailstorm with stones roughly 7-8 cm in diameter (cricket ball size), and with no shelter, they were struck down from above.",
          hi: "फोरेंसिक जांच से कंकालों की खोपड़ी और कंधों पर गोल भारी फ्रैक्चर मिले। हथियारों का कोई निशान नहीं था, जिससे युद्ध या हत्या की बात खारिज हो गई। वैज्ञानिकों के अनुसार वे भीषण पहाड़ी ओलावृष्टि में फंस गए थे, जहां ओले क्रिकेट की गेंद जितने बड़े थे, और सिर पर गहरी चोट लगने से उनकी मृत्यु हो गई।",
          mr: "फॉरेन्सिक चाचणीनुसार सांगाड्यांच्या डोक्यावर आणि खांद्यावर गोल खोल जखमा आढळल्या आहेत. शस्त्रांचे कोणतेही व्रण नसल्याने लढाईची शक्यता नाकारली गेली. प्रवासी डोंगराळ भागात असताना अचानक प्रचंड गारांचे वादळ आले आणि डोक्यावर मारा बसून त्यांचा मृत्यू झाला."
        }
      },
      {
        q: ["who were they", "skeletons origin", "greek", "mediterranean", "dna", "लोग कौन थे", "कोण होते"],
        a: {
          en: "A 2019 DNA analysis published in Nature mapped 38 genomes. It revealed three groups: South Asian pilgrims and local guides (who died around 800 CE), Mediterranean Europeans closely matching modern Greeks (who died around 1800 CE), and a third group of East Asian origin. They were not one army but separate groups traveling over a span of 1,000 years.",
          hi: "2019 में प्रकाशित डीएनए अध्ययन से पता चला कि अवशेष तीन अलग-अलग अनुवांशिक समूहों के थे। पहला समूह दक्षिण एशियाई लोगों का था (लगभग 800 ईस्वी), दूसरा समूह भूमध्यसागरीय ग्रीस के लोगों का था (लगभग 1800 ईस्वी), और तीसरा पूर्व एशियाई मूल का था। ये अलग-अलग समय पर यात्रा कर रहे यात्री थे।",
          mr: "२०१९ च्या डीएनए अभ्यासानुसार हे सांगाडे वेगवेगळ्या काळातील आहेत. पहिला गट भारतीय प्रवाशांचा (८०० ईसवी) होता. दुसरा गट भूमध्यसागरीय युरोप (ग्रीक) मधील प्रवाशांचा (१८०० ईसवी) होता. हे लोक एकाच लष्कराचे नसून वेगवेगळ्या काळातील प्रवासी होते."
        }
      },
      {
        q: ["is this scientifically verified", "evidence", "proven", "nature", "वैज्ञानिक", "पुरावा"],
        a: {
          en: "Yes, the multi-epoch deaths and genetic origins of the Roopkund skeletons are supported by a rigorous genetic and forensic study published in the peer-reviewed journal Nature Communications in 2019. The blunt force trauma theory is also backed by bioarchaeological studies conducted on the fractures.",
          hi: "हाँ, रूपकुंड कंकालों के अनुवांशिक मूल और विभिन्न समय पर हुई मौतों की पुष्टि 2019 में जर्नल 'नेचर कम्युनिकेशंस' में प्रकाशित एक गहन वैज्ञानिक अध्ययन द्वारा की गई है।",
          mr: "होय, रूपकुंड तलावातील सांगाड्यांचे वय आणि जनुकीय इतिहास २०१९ मध्ये 'नेचर कम्युनिकेशन्स' या प्रसिद्ध विज्ञान जर्नलमध्ये प्रकाशित झालेल्या आंतरराष्ट्रीय संशोधनावर आधारित आहे."
        }
      }
    ],
    references: [
      "Harney, E., et al. (2019). 'Ancient DNA from the skeletons of Roopkund Lake reveals Mediterranean migrants in India.' Nature Communications, 10(1).",
      "Archaeological Survey of India (ASI) reports on high-altitude Himalayan excavations.",
      "Garhwali folk literature and historical records of Nanda Devi Raj Jat pilgrimage."
    ]
  },
  dwarka: {
    id: "dwarka",
    image: "/images/dwarka.png",
    title: {
      en: "Dwarka: Undersea Secrets",
      hi: "द्वारका: समुद्र के भीतर छिपे रहस्य",
      mr: "द्वारका: समुद्राच्या गर्भातील रहस्य"
    },
    subtitle: {
      en: "Exploring the legendary sunken city of Lord Krishna",
      hi: "भगवान कृष्ण की पौराणिक जलमग्न नगरी की खोज",
      mr: "भगवान श्रीकृष्णांच्या पौराणिक बुडालेल्या नगरीचा शोध"
    },
    category: "Archaeology",
    duration: "18 mins",
    difficulty: "Hard",
    era: "c. 7500 BCE",
    factStatus: "90% Archaeological Evidence, 10% Epic Folklore",
    factLabel: "Partially Verified",
    learningObjectives: [
      { en: "Study marine archaeology techniques used in the Gulf of Khambhat", hi: "खंभात की खाड़ी में उपयोग की जाने वाली समुद्री पुरातत्व तकनीकों का अध्ययन करें", mr: "खंभातच्या आखातातील सागरी पुरातत्व तंत्रांचा अभ्यास करणे" }
    ],
    knowledgeLevel: "Advanced",
    relatedTopics: ["Marine Archaeology", "Mahabharata", "Submerged Civilizations"],
    synopsis: {
      en: "Deep beneath the Gulf of Khambhat and off the coast of modern Dwarka lie ancient submerged stone structures, walls, and anchors. Is this the golden city of Dwarka described in the Mahabharata, swallowed by the rising oceans?",
      hi: "खंभात की खाड़ी और आधुनिक द्वारका के तट पर समुद्र के भीतर प्राचीन जलमग्न पत्थर की संरचनाएं और दीवारें मिली हैं। क्या यह महाभारत में वर्णित सोने की नगरी द्वारका है, जिसे समुद्र ने लील लिया था?",
      mr: "खंभातच्या आखातात आणि आधुनिक द्वारकेच्या समुद्रात प्राचीन बुडालेल्या दगडी भिंती आणि खांब सापडले आहेत. महाभारतात ज्या सोन्याच्या द्वारकेचा उल्लेख आहे, तीच ही समुद्रात बुडालेली नगरी आहे का?"
    },
    timeline: [
      {
        year: "1963",
        title: { en: "First Marine Survey", hi: "पहला समुद्री सर्वेक्षण", mr: "पहिले सागरी सर्वेक्षण" },
        details: {
          en: "Deccan College conducts archaeological explorations off the Gujarat coastline, finding initial historical anchors.",
          hi: "डेक्कन कॉलेज ने गुजरात तट पर पुरातात्विक अन्वेषण किया और शुरुआती प्राचीन लंगर खोजे।",
          mr: "डेक्कन कॉलेजने गुजरात किनारपट्टीवर पहिले संशोधन केले आणि जुने नांगर शोधले."
        }
      },
      {
        year: "2001",
        title: { en: "NIO Discovery", hi: "एनआईओ द्वारा खोज", mr: "एनआयओ (NIO) कडून मोठा शोध" },
        details: {
          en: "National Institute of Oceanography (NIO) maps massive grid-like stone structures using sonar profiling.",
          hi: "राष्ट्रीय समुद्र विज्ञान संस्थान (NIO) ने सोनार मैपिंग का उपयोग कर विशाल ग्रिड जैसी संरचनाओं का नक्शा बनाया।",
          mr: "राष्ट्रीय समुद्र विज्ञान संस्थेने सोनार तंत्रज्ञानाचा वापर करून समुद्राखालील प्रचंड भिंतींचा नकाशा तयार केला."
        }
      }
    ],
    narrative: {
      en: {
        intro: [
          "Deep beneath the waters of the Gulf of Khambhat and off the coast of Gujarat lie the silent stone remains of a colossal grid-like city. For centuries, the sunken city of Dwarka was considered nothing more than a myth—a legendary golden kingdom ruled by Lord Krishna, described in the ancient Sanskrit epics.",
          "However, modern marine archaeology has pulled this legend from the depths of the ocean, exposing massive stone walls, circular structures, anchors, and artifacts that challenge current historical timelines of human urbanization."
        ],
        background: [
          "In the Sanskrit epic Mahabharata, Dwarka was a meticulously planned metropolis built on land reclaimed from the sea. It was described as a fortress city, fortified with high walls, beautiful gates, and thousands of palaces made of gold and precious jewels.",
          "According to the text, when Lord Krishna departed from the mortal world, the sea rose and swallowed the city, leaving only the memory of its glory. For thousands of years, this was viewed as poetic exaggeration by western historians."
        ],
        main: [
          "The narrative shifted dramatically in the late 20th century. Marine archaeologists from India's National Institute of Oceanography (NIO) launched underwater expeditions off the coast of modern Dwarka.",
          "Divers found massive sandstone blocks, semicircular shapes, and stone anchors buried under layers of marine sediment. Further offshore, in the Gulf of Khambhat, acoustic profiling revealed a grid-like layout spanning nine kilometers, containing features resembling housing blocks, drainage networks, and granaries.",
          "This submerged urban grid sits at a depth of 30 to 40 meters, indicating it was submerged during the rise in sea levels following the last Ice Age."
        ],
        evidence: [
          "The recovered artifacts provide compelling physical proof. Marine divers retrieved wooden logs, pottery shards, hearth fragments, and stone tools.",
          "Thermogenic carbon dating of a wood sample recovered from the Khambhat site yielded an astonishing age of c. 7500 BCE, making it thousands of years older than the Harappan civilization. However, this dating remains a topic of intense scientific debate, as some critics argue the sample could have been carried by underwater river currents."
        ],
        scientific: [
          "From a geological and scientific perspective, sea-level curve models confirm that the coastal shelf off Gujarat was dry land around 9,000 years ago. As the glaciers melted, sea levels rose rapidly, engulfing ancient coastal settlements.",
          "Oceanographers note that the architectural remnants, specifically the heavy triangular stone anchors, match Bronze Age and early Iron Age designs, proving that active maritime trade occurred here for millennia."
        ],
        historical: [
          "Historically, matching the submerged structures to the exact timeline of the Mahabharata is challenging. Traditional astronomical dating of the epic places the events between 3000 BCE and 1500 BCE, whereas the deep Khambhat structures could date much earlier.",
          "Historians generally agree that the modern town of Dwarka has been rebuilt at least six times due to sea encroachment, explaining the multiple layers of ruins found both on land and in the shallow sea."
        ],
        facts: [
          "Triangular stone anchors found off Dwarka are identical to those used by Phoenicians and Romans in the Mediterranean.",
          "The underwater ruins stretch over a vast area, indicating a population that could have reached tens of thousands.",
          "Submerged stone walls show signs of advanced masonry, with interlocking blocks designed to resist heavy sea currents."
        ],
        takeaways: [
          "Dwarka is not a myth; substantial stone ruins exist underwater exactly where the texts claimed.",
          "Submergence matches the global rise in sea levels at the end of the last glacial period.",
          "The site represents one of the oldest maritime trade centers in human history."
        ],
        conclusion: [
          "The undersea secrets of Dwarka rewrite the history of urban development. Whether it was the exact city of Lord Krishna or an even older, forgotten civilization, it stands as a testament to humanity's ancient struggle against the rising tides of a changing world."
        ]
      },
      hi: {
        intro: [
          "गुजरात के तट पर खंभात की खाड़ी के पानी के नीचे एक विशाल ग्रिड जैसे शहर के पत्थर के अवशेष दबे हुए हैं। सदियों तक, जलमग्न द्वारका शहर को केवल एक मिथक माना जाता था—भगवान कृष्ण द्वारा शासित एक पौराणिक सोने का साम्राज्य, जिसका वर्णन प्राचीन संस्कृत महाकाव्यों में मिलता है।",
          "हालांकि, आधुनिक समुद्री पुरातत्व ने इस दंतकथा को महासागर की गहराइयों से बाहर निकाल कर खड़ा कर दिया है।"
        ],
        background: [
          "महाभारत में द्वारका को समुद्र से मुक्त कराई गई भूमि पर बसाया गया एक सुनियोजित महानगर बताया गया है। भगवान कृष्ण के प्रस्थान के बाद समुद्र का जल स्तर बढ़ा और उसने पूरी नगरी को डुबो दिया।"
        ],
        main: [
          "20वीं सदी के अंत में भारतीय राष्ट्रीय समुद्र विज्ञान संस्थान (NIO) के वैज्ञानिकों ने पानी के नीचे खोज शुरू की। गोताखोरों को भारी बलुआ पत्थर के ब्लॉक और प्राचीन लंगर मिले।"
        ],
        evidence: [
          "खंभात की खाड़ी से बरामद लकड़ी के नमूनों की कार्बन डेटिंग से इनकी आयु लगभग 7500 ईसा पूर्व पाई गई, जो इसे हड़प्पा सभ्यता से भी पुराना बनाती है।"
        ],
        scientific: [
          "वैज्ञानिकों का कहना है कि अंतिम हिमयुग के बाद समुद्री जल स्तर बढ़ने से यह तटीय क्षेत्र पानी में डूब गया।"
        ],
        historical: [
          "ऐतिहासिक रूप से, महाभारत के समय और खंभात की खाड़ी में मिली प्राचीन संरचनाओं के समय में अंतर है, जिस पर अभी शोध जारी है।"
        ],
        legends: [
          "पौराणिक कथाओं के अनुसार, द्वारका को विश्वकर्मा द्वारा बनाया गया था जिसमें सोने और चांदी के महल थे।"
        ],
        facts: [
          "समुद्र के भीतर मिली दीवारें उन्नत वास्तुकला दर्शाती हैं जिनमें पत्थरों को जोड़ने की विशेष तकनीक का उपयोग किया गया है।"
        ],
        takeaways: [
          "द्वारका के पुरातात्विक अवशेष पौराणिक दावों को भौतिक आधार प्रदान करते हैं।"
        ],
        conclusion: [
          "द्वारका के रहस्य मानव इतिहास और प्राचीन शहरीकरण की समयरेखा को बदलने की क्षमता रखते हैं।"
        ]
      },
      mr: {
        intro: [
          "गुजरातच्या किनारपट्टीवर समुद्राच्या खोल गर्भात एका भव्य नियोजनबद्ध शहराचे दगडी अवशेष शांत उभे आहेत. अनेक शतके ही केवळ एक दंतकथा मानली जात होती, परंतु संशोधनाने आता याला पुरावा दिला आहे."
        ],
        background: [
          "महाभारतानुसार भगवान श्रीकृष्णांनी समुद्राकडून जागा मिळवून ही नगरी वसवली होती."
        ],
        main: [
          "सागरी पुरातत्व शास्त्रज्ञांना समुद्रात भव्य दगडी भिंती आणि तटबंदीचे अवशेष सापडले आहेत."
        ],
        evidence: [
          "काही लाकडी अवशेषांची कार्बन डेटिंग चाचणी ७५०० ईसापूर्व काळातील असल्याचे दर्शवते."
        ],
        scientific: [
          "हिमयुगाच्या समाप्तीनंतर वाढलेल्या समुद्राच्या पातळीमुळे हे शहर बुडाले असावे यावर शास्त्रज्ञांचे एकमत आहे."
        ],
        historical: [
          "इतिहासकार मानतात की समुद्राच्या सतत वाढणाऱ्या पातळीमुळे हे शहर अनेक वेळा पुन्हा वसवले गेले."
        ],
        legends: [
          "पौराणिक कथांनुसार द्वारकेत सोन्याचे राजवाडे होते."
        ],
        facts: [
          "येथे सापडलेले दगडी नांगर रोमन आणि फिनिशियन नांगरांशी साधर्म्य दाखवतात."
        ],
        takeaways: [
          "द्वारकेचे अवशेष प्राचीन काळातील सागरी व्यापाराचे मोठे पुरावे आहेत."
        ],
        conclusion: [
          "द्वारकेचे हे रहस्य प्राचीन भारताच्या प्रगत तंत्रज्ञानाची साक्ष देते."
        ]
      }
    },
    explanations: {
      eli10: {
        en: "Dwarka was a legendary city of Lord Krishna. Long ago, the ocean levels rose and swallowed the whole city! Scientists went diving underwater with special cameras and found real stone walls and heavy anchors lying on the sea floor, showing that a real city once stood there before the water covered it.",
        hi: "द्वारका भगवान कृष्ण का प्रसिद्ध शहर था। बहुत समय पहले, समुद्र का पानी बढ़ गया और उसने पूरे शहर को डुबो दिया। वैज्ञानिकों ने पानी के नीचे जाकर भारी पत्थर की दीवारें और पुराने लंगर खोजे हैं, जो साबित करते हैं कि वहाँ सचमुच एक शहर था।",
        mr: "द्वारका हे भगवान श्रीकृष्णांचे सोन्याचे शहर होते. खूप वर्षांपूर्वी समुद्राचे पाणी वाढल्यामुळे हे शहर पाण्यात बुडाले. वैज्ञानिकांनी समुद्राखाली जाऊन जुन्या दगडी भिंती शोधून काढल्या आहेत, ज्यावरून कळते की पूर्वी तिथे खरंच एक शहर होतं."
      },
      simple: {
        en: "Submerged ruins off the coast of Gujarat, India, are believed to be the ancient city of Dwarka. Mentioned in the Mahabharata, the city supposedly sank after Lord Krishna left the earth. Marine archaeologists have found massive stone blocks, roads, and anchors at the site. Carbon dating suggests parts of the site could be over 9,000 years old.",
        hi: "गुजरात तट के पास समुद्र में मिली संरचनाओं को प्राचीन द्वारका माना जाता है। महाभारत के अनुसार भगवान कृष्ण के जाने के बाद यह शहर डूब गया था। समुद्री पुरातत्वविदों को पत्थर के बड़े ब्लॉक और मार्ग मिले हैं, जो काफी पुराने हैं।",
        mr: "गुजरातच्या समुद्राखाली मिळालेले अवशेष हे प्राचीन द्वारका नगरीचे असल्याचे मानले जाते. महाभारतात कृष्णानंतर हे शहर बुडाल्याचा उल्लेख आहे. सागरी पुरातत्व विभागाला समुद्राखाली दगडी भिंती आणि नांगर सापडले आहेत."
      },
      detailed: {
        en: "The underwater exploration of Dwarka in the Gulf of Khambhat reveals a highly sophisticated ancient settlement. Sonar scans by the National Institute of Oceanography mapped parallel stone lines resembling streets and foundations at depths of 30-40 meters. Thermoluminescence and radiocarbon tests of artifacts recovered from the seafloor yielded dates from 7500 BCE, challenging conventional history which marks Mesopotamian city construction as the earliest urban civilization.",
        hi: "द्वारका के जलमग्न अवशेष एक अत्यंत विकसित प्राचीन बस्ती की ओर इशारा करते हैं। 30-40 मीटर की गहराई पर सोनार तरंगों की मदद से सड़कों और आवासों के ग्रिड की खोज की गई है। कुछ कलाकृतियों की डेटिंग इन्हें 7500 ईसा पूर्व की बताती है, जो मानव इतिहास के क्रम को नया मोड़ देती है।",
        mr: " समुद्राखाली ३० ते ४० मीटर खोलीवर सोनार स्कॅनिंगद्वारे रस्ते आणि घरांच्या पायासारख्या दगडी रचनांचा शोध लागला आहे. सापडलेल्या वस्तूंची चाचणी दर्शवते की यातील काही रचना ७५०० ईसापूर्व काळातील आहेत, ज्यामुळे जागतिक शहरीकरणाच्या इतिहासात बदल होऊ शकतो."
      },
      academic: {
        en: "Subsurface acoustic profiling in the Gulf of Khambhat has identified paleochannel systems associated with submerged architecture displaying linear geometric anomalies. Sediment samples and recovered organic matter show radiocarbon dates clustering around the early Holocene. Marine scientists postulate that post-glacial eustatic sea-level transgression inundated this coastal plain, preserving archaeological horizons containing structural masonry.",
        hi: "खंभात की खाड़ी में सोनार तरंगों द्वारा पानी के नीचे रेखीय ज्यामितीय विसंगतियों की पहचान की गई है। प्राप्त नमूनों से पता चलता है कि हिमनदों के पिघलने से बढ़े जलस्तर के कारण यह ऐतिहासिक स्थल समुद्र में समा गया था।",
        mr: " समुद्राच्या पोटात सोनार तंत्रज्ञानाने शोधलेल्या रचना या रेखीय भौमितिक रचनेच्या आहेत. संशोधक मानतात की हिमयुगानंतर समुद्राची पातळी वाढल्यामुळे हा किनारपट्टीचा भूभाग पाण्याखाली गेला असावा."
      },
      revision: {
        en: "Submerged city off Gujarat coast. Discovered: Sonar mapped in 2001 by NIO. Myth vs Fact: Mahabharata says Krishna's city sank; physical ruins found at 40m depth. Key Date: Carbon dating suggests c. 7500 BCE (debated). Artifacts: Heavy triangular stone anchors, interlocking stone blocks.",
        hi: "गुजरात तट पर जलमग्न प्राचीन शहर। खोज: 2001 में NIO द्वारा। महाभारत के दावों के अनुसार कृष्ण की नगरी डूबी; 40 मीटर की गहराई पर अवशेष मिले। आयु: 7500 ईसा पूर्व (विवादित)। वस्तुएं: भारी त्रिकोणीय पत्थर के लंगर।",
        mr: "गुजरातच्या समुद्रात बुडालेले शहर. शोध: २००१ मध्ये एनआयओने लावला. खोली: ४० मीटर खाली. अंदाजे वय: ७५०० ईसापूर्व. पुरावे: समुद्राखालून सापडलेले दगडी नांगर आणि तटबंदी."
      }
    },
    qa: [
      {
        q: ["what evidence exists", "proof", "anchors", "walls", "अवशेष", "पुरावे"],
        a: {
          en: "Evidence includes massive interlocked sandstone blocks, circular structures, triangular stone anchors matching early Bronze Age designs, pottery fragments, and sonar profiles of grid-patterned foundations spanning a 9km area at depths of 30-40m.",
          hi: "सबूतों में बलुआ पत्थर के बड़े ब्लॉक, गोलाकार पत्थर की आकृतियां, त्रिकोणीय लंगर, प्राचीन मिट्टी के बर्तन और 30-40 मीटर की गहराई पर 9 किलोमीटर में फैले ग्रिड जैसे शहर का सोनार नक्शा शामिल है।",
          mr: "पुरावे म्हणून समुद्राखाली मोठे दगडी खांब, तटबंदीच्या भिंती, जुने दगडी नांगर, मातीची भांडी आणि सोनार मॅपिंगद्वारे मिळालेला रस्त्यांचा ग्रिड पॅटर्न उपलब्ध आहे."
        }
      },
      {
        q: ["who discovered this", "found by", "explorer", "खोज किसने की", "शोध कोणी लावला"],
        a: {
          en: "Initial explorations were carried out by Deccan College Pune in 1963. Major marine surveys and excavations were led by Dr. S.R. Rao and later by the National Institute of Oceanography (NIO) of India, which conducted extensive sonar mapping in 2001.",
          hi: "शुरुआती खोज 1963 में डेक्कन कॉलेज द्वारा की गई थी। प्रमुख समुद्री सर्वेक्षण डॉ. एस.आर. राव के नेतृत्व में और बाद में 2001 में राष्ट्रीय समुद्र विज्ञान संस्थान (NIO) द्वारा किए गए थे।",
          mr: "पहिली शोध मोहीम १९६३ मध्ये डेक्कन कॉलेजने केली. त्यानंतर डॉ. एस.आर. राव यांच्या मार्गदर्शनाखाली आणि २००१ मध्ये राष्ट्रीय समुद्र विज्ञान संस्थेने (NIO) मोठ्या प्रमाणावर संशोधन केले."
        }
      }
    ],
    references: [
      "Rao, S.R. (1999). 'The Lost City of Dvaraka.' Aditya Prakashan.",
      "National Institute of Oceanography (NIO) Marine Archaeology reports, 2001–2003.",
      "Sanskrit Texts of the Mahabharata and Harivamsa."
    ]
  },
  jatinga: {
    id: "jatinga",
    image: "/images/jatinga.png",
    title: {
      en: "Jatinga: The Bird Phenomenon",
      hi: "जाटिंगा: पक्षियों का रहस्यमयी व्यवहार",
      mr: "जाटिंगा: पक्षांचे रहस्यमयी वर्तन"
    },
    subtitle: {
      en: "The tragic monsoon suicide of disoriented birds",
      hi: "दिग्भ्रमित पक्षियों की रहस्यमयी सामूहिक मृत्यु",
      mr: "दिशाहीन झालेल्या पक्षांची मान्सूनमधील सामूहिक आत्महत्या"
    },
    category: "Unexplained Phenomena",
    duration: "12 mins",
    difficulty: "Easy",
    era: "Ongoing",
    factStatus: "75% Scientific Hypothesis, 25% Local Lore",
    factLabel: "Partially Verified",
    learningObjectives: [
      { en: "Analyze environmental triggers affecting migratory birds in Assam", hi: "असम में प्रवासी पक्षियों को प्रभावित करने वाले पर्यावरणीय कारकों का विश्लेषण करें", mr: "आसाममधील स्थलांतरित पक्षांवर होणाऱ्या पर्यावरणीय परिणामांचा अभ्यास करणे" }
    ],
    knowledgeLevel: "Beginner",
    relatedTopics: ["Ornithology", "Electromagnetism", "Meteorology"],
    synopsis: {
      en: "In a small valley in Assam, during foggy monsoon nights, hundreds of migratory birds plunge from the sky, disoriented and crashing into lights and buildings. Is it a biological mystery, magnetic currents, or local folklore?",
      hi: "असम की एक घाटी में, मानसून के कोहरे वाली रातों में, सैकड़ों प्रवासी पक्षी आसमान से नीचे गिरते हैं। वे दिग्भ्रमित होकर रोशनी और इमारतों से टकरा जाते हैं। क्या यह चुंबकीय तरंगें हैं या स्थानीय लोककथा?",
      mr: "आसाममधील एका लहान दरीत, पावसाळ्यातील धुक्याच्या रात्री शेकडो स्थलांतरित पक्षी अचानक जमिनीवर कोसळतात. दिव्यांच्या प्रकाशाकडे झेपावून ते भिंतींवर आदळतात. हा निसर्गाचा कोणता चमत्कार आहे?"
    },
    timeline: [
      {
        year: "1905",
        title: { en: "First Recorded Event", hi: "पहला दर्ज इतिहास", mr: "पहिली नोंदलेली घटना" },
        details: {
          en: "Jaintia tribals first observe the phenomenon when their torches attract birds plunging down in the night.",
          hi: "जैंतिया आदिवासियों ने पहली बार इस घटना को देखा जब उनकी मशाले ने नीचे गिरते पक्षियों को आकर्षित किया।",
          mr: "जैंतिया आदिवासी लोकांनी पहिल्यांदा ही घटना अनुभवली, जेव्हा त्यांच्या मशालींकडे रात्री पक्षी झेपावून खाली पडू लागले."
        }
      },
      {
        year: "1977",
        title: { en: "Ornithological Studies", hi: "पक्षीविज्ञान अध्ययन", mr: "पक्षी तज्ज्ञांचे संशोधन" },
        details: {
          en: "Renowned ornithologist Salim Ali studies the phenomenon and reports that the birds are not committing suicide but are disoriented by wind and fog.",
          hi: "प्रसिद्ध पक्षी विज्ञानी सलीम अली ने इस घटना का अध्ययन किया और बताया कि पक्षी आत्महत्या नहीं कर रहे बल्कि कोहरे से दिग्भ्रमित हो रहे हैं।",
          mr: "प्रसिद्ध पक्षी अभ्यासक सलीम अली यांनी येथे अभ्यास करून सांगितले की, पक्षी आत्महत्या करत नसून धुक्यामुळे दिशा हरवून खाली पडतात."
        }
      }
    ],
    narrative: {
      en: {
        intro: [
          "In a small, misty valley nestled in the Dima Hasao district of Assam, India, lies a village named Jatinga. For most of the year, it is a quiet, scenic hamlet. However, during the late monsoon months of September and October, Jatinga becomes the stage for a bizarre and tragic phenomenon.",
          "On dark, foggy, moonless nights with a specific wind direction, hundreds of local and migratory birds suddenly drop from the sky, flying directly toward searchlights, torches, and houses, crashing to their deaths or rendering themselves completely helpless."
        ],
        background: [
          "The phenomenon was first recorded by the local Jaintia tribe in 1905. Terrified by the sight of hundreds of birds plunging into their campfires, the villagers believed they were under attack by evil spirits. They sold their lands and fled the area.",
          "Later, the Dimasa tribe settled in Jatinga and observed the same occurrence. However, rather than fleeing, they viewed the falling birds as a blessing from the gods, collecting them for food."
        ],
        main: [
          "As word of Jatinga's 'bird suicides' spread, scientists and animal behaviorists arrived to investigate. Ornithologists quickly debunked the sensationalist claims of 'suicide.' Birds do not have the cognitive framework to plan self-destruction.",
          "Instead, investigators discovered that the birds were experiencing extreme disorientation. Under specific weather conditions—heavy fog, high humidity, lack of moonlight, and wind blowing from south to north—birds migrating over the valley were caught in high-speed wind drafts.",
          "Drawn by the artificial lights of the village, they flew down frantically in search of shelter, crashing into trees, bamboo poles, and buildings."
        ],
        evidence: [
          "Ornithological studies show that only local species like Kingfishers, Tiger Bitterns, and Indian Pittas are affected, and the phenomenon only occurs in a specific 1.5-kilometer strip of the village.",
          "Tests have ruled out chemical poisoning in the air, confirming that environmental factors—mainly fog and wind—disorient the birds' internal compasses."
        ],
        scientific: [
          "Salim Ali, India's most celebrated ornithologist, proposed that the combination of high-velocity winds and dense fog disorients the birds, who are normally diurnal (active during the day) but are disturbed from their roosts by the wind. Once airborne, they are blinded by the fog and attracted to the village lights, behaving erratically."
        ],
        historical: [
          "Historically, the village has now built watchtowers and educated locals to stop killing the dazed birds. Instead, wildlife groups help rehabilitate the disoriented birds, letting them loose once the monsoon fog clears."
        ],
        legends: [
          "Traditional folklore claimed that spirits living on the Jatinga ridge cast a spell to pull the birds out of the sky. This myth kept scientists away for decades until modern transportation made the village accessible."
        ],
        facts: [
          "Birds fly toward light sources only when the wind blows exactly from the south. If the wind direction changes, the phenomenon stops.",
          "The birds are found in a state of shock or semi-paralysis after they fall, making them easy prey."
        ],
        takeaways: [
          "Birds do not commit suicide; they are disoriented by specific atmospheric combinations of fog, wind, and humidity.",
          "Artificial light sources in the village act as death traps by attracting the blinded birds.",
          "Conservation efforts have successfully reduced bird deaths by turning off high-intensity streetlights during the peak season."
        ],
        conclusion: [
          "Jatinga remains a fascinating study of how geography, weather, and human habitation can accidentally disrupt the natural navigation systems of wildlife, serving as a reminder of our impact on the environment."
        ]
      },
      hi: {
        intro: [
          "असम के जटिंगा गांव में मानसून के दिनों में पक्षी आसमान से नीचे गिरने लगते हैं। धुंध भरी रातों में वे रोशनी की ओर आकर्षित होकर टकरा जाते हैं।"
        ],
        background: [
          "1905 में आदिवासियों ने पहली बार इसे देखा था और इसे भूतों का काम मानकर गांव छोड़ दिया था।"
        ],
        main: [
          "वैज्ञानिकों का कहना है कि यह आत्महत्या नहीं है। पक्षी कोहरे और हवा के कारण रास्ता भूल जाते हैं और रोशनी की तरफ भागते हैं।"
        ],
        evidence: [
          "यह घटना केवल सितंबर और अक्टूबर में, कोहरे और दक्षिण से चलने वाली हवा के मेल पर ही होती है।"
        ],
        scientific: [
          "मशहूर पक्षी विज्ञानी सलीम अली के अनुसार, तेज हवाओं से पक्षी अपने घोंसलों से उड़ जाते हैं और घने कोहरे में रोशनी देखकर वहाँ शरण लेने की कोशिश करते हैं।"
        ],
        legends: [
          "किंवदंतियों के अनुसार, घाटी में रहने वाले भूत पक्षियों को सम्मोहित करके नीचे बुलाते हैं।"
        ],
        facts: [
          "नीचे गिरने के बाद पक्षी सदमे की स्थिति में आ जाते हैं और हिल-डुल नहीं पाते।"
        ],
        takeaways: [
          "मौसम के कारकों और रोशनी के प्रति आकर्षण के कारण पक्षी दुर्घटनाग्रस्त होते हैं।"
        ],
        conclusion: [
          "जाटिंगा की घटना प्रकृति के संतुलन और जीवों के व्यवहार का एक जटिल अध्ययन है।"
        ]
      },
      mr: {
        intro: [
          "आसामच्या जटिंगा गावात पावसाळ्यात एक विचित्र घटना घडते. धुक्याच्या रात्री पक्षी आकाशातून थेट जमिनीवर कोसळतात."
        ],
        background: [
          "१९०५ मध्ये स्थानिक लोकांनी पहिल्यांदा हे पाहिले आणि भीतीने गाव सोडून गेले होते."
        ],
        main: [
          "संशोधकांनुसार, गतीमान वारे आणि दाट धुक्यामुळे पक्षांची दिशाभूल होते आणि ते गावातील दिव्यांकडे धाव घेतात."
        ],
        evidence: [
          "हा प्रकार फक्त सप्टेंबर आणि ऑक्टोबर महिन्यांत ठराविक हवामानातच घडतो."
        ],
        scientific: [
          "पक्षी तज्ज्ञ सलीम अली यांनी सांगितले की दिशा हरवलेले पक्षी दिव्यांवर आदळतात."
        ],
        legends: [
          "स्थानिक लोक समजत की डोंगरावरील वाईट शक्ती पक्षांना खाली ओढतात."
        ],
        facts: [
          "खाली पडलेले पक्षी अर्धवट बेशुद्ध अवस्थेत असतात."
        ],
        takeaways: [
          "पक्षांची आत्महत्या नसून ती एक भौगोलिक आणि वातावरणीय दुर्घटना आहे."
        ],
        conclusion: [
          "जटिंगा हे निसर्गातील एक मोठे गूढ मानले जाते."
        ]
      }
    },
    explanations: {
      eli10: {
        en: "Imagine flying in a cloud of thick gray steam where you can't see anything. That's what happens to the birds in Jatinga during big rains. They get lost in the heavy fog, and when they see the bright lights of the village, they fly toward them to find safety, but accidentally bump into poles and fall down.",
        hi: "सोचिए कि आप घने कोहरे में उड़ रहे हैं और आपको कुछ नहीं दिख रहा। जटिंगा में पक्षियों के साथ ऐसा ही होता है। वे कोहरे में रास्ता भूल जाते हैं और जब गांव की बत्तियां जलती हैं, तो वे वहां रोशनी देखकर भागते हैं और खंभों से टकराकर गिर जाते हैं।",
        mr: "समजा तुम्ही दाट धुक्यात आहात आणि तुम्हाला काहीच दिसत नाहीये. जटिंगा मधील पक्षांचे तसेच होते. ते धुक्यात रस्ता विसरतात आणि गावातील दिवे बघून तिथे जातात आणि खांबांवर आदळून खाली पडतात."
      },
      simple: {
        en: "In Jatinga, Assam, birds appear to fall from the sky during foggy monsoon nights. This is not suicide. Due to heavy fog, winds, and rain, the birds lose their balance and orientation. Blinded by the weather, they fly towards the bright lights of houses and crash. Today, the village works to save these birds.",
        hi: "जटिंगा में पक्षी आत्महत्या नहीं करते। कोहरे, तेज हवा और बारिश के कारण वे उड़ते समय अपना संतुलन खो देते हैं और बत्तियों की तरफ जाकर टकरा जाते हैं। अब ग्रामीण इन पक्षियों को बचाने का प्रयास करते हैं।",
        mr: "जटिंगा गावात पक्षी आत्महत्या करत नाहीत. मुसळधार पाऊस, वारा आणि धुक्यामुळे उडताना पक्षांचे संतुलन बिघडते. ते प्रकाशाकडे झेपावतात आणि खांबांवर आदळतात. आता या पक्षांना वाचवले जाते."
      },
      detailed: {
        en: "Jatinga's bird anomaly is an environmental orientation failure. Under specific meteorological conditions—specifically moonless nights, heavy fog, and a southern wind flow—migrating birds are disoriented. Their bio-navigation systems fail, and they seek light sources, flying directly into human structures at high speed, resulting in blunt trauma. Wildlife conservationists now implement green lighting strategies to prevent these collisions.",
        hi: "जाटिंगा की घटना एक प्राकृतिक दिशाभूल है। कोहरे, नमी और हवा के विशेष संयोजन के कारण पक्षी अपना प्राकृतिक कंपास खो बैठते हैं। वे रोशनी की ओर तेजी से बढ़ते हैं जिससे दुर्घटनाएं होती हैं।",
        mr: "जटिंगा येथील प्रकार हा पक्षांच्या अंतर्गत दिशादर्शक प्रणालीच्या बिघाडामुळे होतो. धुक्यात पक्षांना काही दिसत नाही आणि गावातील प्रखर दिवे त्यांच्यासाठी सापळा ठरतात."
      },
      academic: {
        en: "The avian phenomenon at Jatinga is characterized by phototaxic disorientation under specific meteorological parameters. High relative humidity, wind vectors from the south, and thick fog distort the celestial navigation cues of migrating avifauna, causing them to exhibit positive phototaxis towards artificial light, culminating in terminal impacts.",
        hi: "जटिंगा में पक्षियों का व्यवहार घने कोहरे और विशिष्ट हवा के वेग के कारण उत्पन्न होने वाले प्रकाशाकर्षण (phototaxis) का परिणाम है।",
        mr: " जटिंगा येथील पक्षांचे वर्तन हे दाट धुक्यात कृत्रिम प्रकाशाकडे आकर्षित होण्याच्या नैसर्गिक प्रवृत्तीमुळे (Phototaxis) घडते."
      },
      revision: {
        en: "Jatinga, Assam. Anomaly: Birds plunge and crash during late monsoon nights (Sep-Oct). Triggers: Fog, wind from south, no moon. Reason: Not suicide; absolute disorientation makes them seek light. Action: Villagers now reduce light intensity to protect birds.",
        hi: "जटिंगा, असम। घटना: मानसून की रातों (सितंबर-अक्टूबर) में पक्षियों का गिरना। कारण: कोहरा, दक्षिणी हवा। वजह: रास्ता भटक कर रोशनी की तरफ जाना। समाधान: बत्तियां बंद करके पक्षियों को बचाना।",
        mr: "जटिंगा, आसाम. घटना: पावसाळ्यात धुक्याच्या रात्री पक्षी खाली पडणे. कारण: दाट धुके, वारा. सत्य: आत्महत्या नाही, दिशाभूल होऊन प्रकाशाकडे धाव घेणे. उपाय: दिव्यांची तीव्रता कमी करणे."
      }
    },
    qa: [
      {
        q: ["why do they crash", "light", "suicide", "आत्महत्या", "का पडतात"],
        a: {
          en: "They crash because they are blinded by the dense fog and disoriented by heavy winds. When they see artificial lights in the village, they fly toward them seeking shelter or direction, but crash into poles and houses.",
          hi: "वे इसलिए टकराते हैं क्योंकि घने कोहरे और तेज हवा के कारण वे रास्ता भूल जाते हैं। गांव की रोशनी देखकर वे वहां शरण लेने की कोशिश करते हैं और इमारतों से टकरा जाते हैं।",
          mr: "धुक्यामुळे त्यांना दिसत नाही आणि वाऱ्यामुळे ते उडू शकत नाहीत. गावातील दिवे बघून ते तिकडे आकर्षित होतात आणि भिंतींवर आदळतात."
        }
      }
    ],
    references: [
      "Ali, Salim (1985). 'The Book of Indian Birds.' Bombay Natural History Society.",
      "Assam State Forest Department reports on Jatinga Avian Ecology, 2012.",
      "Choudhury, A. (2000). 'Birds of Assam.' Gibbon Books."
    ]
  },
  antikythera: {
    id: "antikythera",
    image: "/images/antikythera.png",
    title: {
      en: "The Antikythera Mechanism",
      hi: "एंटीकाइथेरा तंत्र: प्राचीन कंप्यूटर",
      mr: "अँटीकायथेरा यंत्र: जगातील पहिला संगणक"
    },
    subtitle: {
      en: "Rebuilding the world's oldest analog computer",
      hi: "दुनिया के सबसे पुराने एनालॉग कंप्यूटर का रहस्य",
      mr: "जगातील पहिल्या अनालॉग कॉम्प्युटरची कथा"
    },
    category: "Ancient Science",
    duration: "16 mins",
    difficulty: "Medium",
    era: "c. 150 BCE",
    factStatus: "100% Scientific Record",
    factLabel: "Historically Verified",
    learningObjectives: [
      { en: "Understand gear ratios used in Greek astronomy models", hi: "ग्रीक खगोल विज्ञान मॉडलों में उपयोग किए जाने वाले गियर अनुपात को समझें", mr: "ग्रीक खगोलशास्त्रात वापरल्या गेलेल्या गिअर्सच्या गणिताचा अभ्यास करणे" }
    ],
    knowledgeLevel: "Advanced",
    relatedTopics: ["Ancient Greece", "Analog Computers", "History of Astronomy"],
    synopsis: {
      en: "Discovered in a Roman shipwreck off Greece, a lump of corroded bronze lay ignored until researchers exposed a maze of interlocking gears. It is the oldest analog computer ever built.",
      hi: "यूनान के पास एक रोमन जहाज के मलबे से मिला कांस्य का एक ढेला वर्षों तक उपेक्षित रहा, जब तक कि एक्सरे जांच से गियर के एक जाल का पता नहीं चला। यह दुनिया का सबसे पहला कंप्यूटर है।",
      mr: "ग्रीसजवळ बुडालेल्या जहाजाच्या अवशेषात सापडलेला तांब्याचा तुकडा आधी दुर्लक्षित राहिला, पण नंतर समजले की तो जगातील पहिला कॉम्प्युटर आहे."
    },
    timeline: [
      {
        year: "1901",
        title: { en: "Recovery from Shipwreck", hi: "मलबे से प्राप्ति", mr: "जहाजाच्या अवशेषातून शोध" },
        details: {
          en: "Sponge divers recover statues and a corroded bronze artifact from a shipwreck near Antikythera island.",
          hi: "गोताखोरों ने एंटीकाइथेरा द्वीप के पास एक प्राचीन जहाज के मलबे से कांस्य की एक रहस्यमयी वस्तु निकाली।",
          mr: "गोताखोरांना समुद्रातील जहाजाच्या अवशेषात तांब्याचे यंत्र सापडले."
        }
      },
      {
        year: "2005",
        title: { en: "X-ray CT Scan Study", hi: "एक्स-रे सीटी स्कैन", mr: "एक्स-रे सीटी स्कॅनिंग" },
        details: {
          en: "High-resolution X-ray scanning reveals 30 interlocking bronze gear wheels and astronomical inscriptions inside.",
          hi: "उच्च गुणवत्ता वाले एक्स-रे स्कैन से भीतर 30 कांस्य गियर और खगोलीय गणनाएं दिखाई दीं।",
          mr: "आधुनिक सीटी स्कॅनने यंत्राच्या आत ३० चक्रे आणि अवकाशातील ग्रहांची गणिते असल्याचे उघड केले."
        }
      }
    ],
    narrative: {
      en: {
        intro: [
          "In the spring of 1900, Greek sponge divers seeking refuge from a violent storm anchored off the coast of the tiny island of Antikythera. When the storm cleared, they decided to dive.",
          "At a depth of 45 meters, they discovered the remains of a giant Roman merchant shipwreck. Among the statues, coins, and pottery, they recovered a green, corroded lump of bronze that would change our understanding of ancient history forever."
        ],
        background: [
          "The lump sat ignored in the National Archaeological Museum in Athens for nearly two years. It was dry and cracked, exposing small gearwheels.",
          "At the time, historians believed that advanced gear mechanisms did not appear until the 14th century in Europe. The idea that a machine with complex gears existed in 150 BCE was met with intense skepticism."
        ],
        main: [
          "Decades of research and the application of cutting-edge technology eventually revealed the truth. Using three-dimensional X-ray micro-focus computed tomography, scientists scanned the fragments.",
          "They exposed a complex mechanism containing over 30 interlocking bronze gearwheels. The device was designed to track the movements of the Sun, the Moon, and the five planets known to the Greeks (Mercury, Venus, Mars, Jupiter, and Saturn).",
          "It also calculated lunar phases, solar eclipses, and even the four-year cycle of the Panhellenic Games, including the Olympics."
        ],
        evidence: [
          "Inscriptions on the outer bronze plates act as a user manual, detailing how to calibrate the pointers to match the calendar year.",
          "The gears utilize a prime-number math system to track the irregular elliptical orbit of the moon, showing a level of mathematical understanding once thought impossible for that era."
        ],
        scientific: [
          "Scientists conclude the device is the oldest analog computer. Its gear ratios are so precise that it matches modern calculators in tracking astronomical events.",
          "The device represents a fusion of Babylonian astronomical charts and Greek geometry."
        ],
        historical: [
          "The mechanism is often linked to the workshop of the legendary inventor Archimedes or the astronomer Hipparchus, though the exact creator remains unknown."
        ],
        facts: [
          "It is the only surviving artifact of its kind; all other complex ancient machines were likely melted down for weapons.",
          "The device could predict eclipses decades in advance and specify the exact hour they would occur."
        ],
        takeaways: [
          "Ancient Greek technology was 1,500 years ahead of what historians previously believed.",
          "Analog computation existed long before the modern scientific revolution."
        ],
        conclusion: [
          "The Antikythera Mechanism is a stunning reminder that advanced human knowledge can be lost to time, only to be rediscovered centuries later from the deep."
        ]
      },
      hi: {
        intro: [
          "यूनान के एंटीकाइथेरा द्वीप के पास एक प्राचीन जहाज के मलबे से मिला यह उपकरण दुनिया का पहला एनालॉग कंप्यूटर माना जाता है।"
        ],
        background: [
          "शुरू में किसी ने नहीं माना कि ईसा पूर्व 150 में इतने जटिल गियर पहिये मौजूद हो सकते थे।"
        ],
        main: [
          "आधुनिक सीटी स्कैन से पता चला कि इसमें 30 गियर थे जो सूर्य और चंद्रमा की चाल का सटीक हिसाब रखते थे।"
        ],
        evidence: [
          "यंत्र पर लिखे निर्देश इसके उपयोग की व्याख्या करते हैं।"
        ],
        scientific: [
          "इसके गणितीय अनुपात चंद्रमा की लहरदार कक्षा का भी सटीक अनुमान लगाते हैं।"
        ],
        historical: [
          "इसे वैज्ञानिक आर्किमिडीज या हिप्पार्कस से जोड़कर देखा जाता है।"
        ],
        facts: [
          "यह अपने समय का अकेला जीवित उपकरण है, जो समुद्री मलबे में सुरक्षित रह गया।"
        ],
        takeaways: [
          "प्राचीन विज्ञान हमारी सोच से कहीं अधिक उन्नत था।"
        ],
        conclusion: [
          "यह खोज प्राचीन ज्ञान के खो जाने और फिर से खोजे जाने का प्रतीक है।"
        ]
      },
      mr: {
        intro: [
          "अँटीकायथेरा यंत्र हे जगातील सर्वात जुने खगोलशास्त्रीय गणकयंत्र मानले जाते, जे ग्रीसच्या समुद्राखाली सापडले."
        ],
        background: [
          "१४ व्या शतकापूर्वी जगात गियरचे तंत्रज्ञान नव्हते, हा इतिहासकारांचा समज या यंत्राने खोडून काढला."
        ],
        main: [
          "यात ३० हून अधिक पितळी चक्रांचा वापर करून सूर्यग्रहणे आणि ग्रहांच्या गती मोजल्या जात."
        ],
        evidence: [
          "यंत्रावर कोरलेल्या ग्रीक अक्षरांवरून याच्या वापराची माहिती मिळते."
        ],
        scientific: [
          "यातील चक्रांची रचना अत्यंत अचूक गणितावर आधारित आहे."
        ],
        historical: [
          "याची निर्मिती खगोलशास्त्रज्ञ हिप्पार्कसच्या काळात झाली असावी."
        ],
        facts: [
          "अशा प्रकारचे जगात सापडलेले हे एकमेव यंत्र आहे."
        ],
        takeaways: [
          "प्राचीन ग्रीक खगोलशास्त्र अत्यंत प्रगत होते."
        ],
        conclusion: [
          "हे यंत्र मानवी बुद्धिमत्तेचा एक उत्कृष्ट आविष्कार आहे."
        ]
      }
    },
    explanations: {
      eli10: {
        en: "Imagine a watch that, instead of showing hours, shows when the next moon eclipse will happen or where Mars is in the sky. That is the Antikythera Mechanism. Built over 2,000 years ago with bronze gear wheels, it is the grandfather of all modern computers.",
        hi: "एक ऐसी घड़ी की कल्पना कीजिए जो समय बताने के बजाय यह बताती है कि अगला सूर्य ग्रहण कब होगा या मंगल ग्रह कहाँ है। यह एंटीकाइथेरा यंत्र है, जो 2,000 साल पहले गियर पहियों से बना था।",
        mr: "एका घड्याळाची कल्पना करा जे वेळ दाखवण्याऐवजी पुढचे ग्रहण कधी होईल हे सांगते. हेच अँटीकायथेरा यंत्र आहे, जे २००० वर्षांपूर्वी बनवले गेले होते."
      },
      simple: {
        en: "The Antikythera Mechanism is a 2,000-year-old bronze device found in a shipwreck in Greece. It has dozens of gears and was used to predict eclipses and track the planets. It is widely considered the first analog computer, showing that ancient technology was far more advanced than once thought.",
        hi: "एंटीकाइथेरा यंत्र 2,000 साल पुराना कांस्य उपकरण है जो ग्रीस में एक मलबे से मिला था। इसका उपयोग ग्रहों की चाल और ग्रहण का अनुमान लगाने के लिए किया जाता था। इसे पहला एनालॉग कंप्यूटर कहा जाता है।",
        mr: "अँटीकायथेरा यंत्र हे ग्रीसमध्ये सापडलेले २००० वर्षांपूर्वीचे तांब्याचे यंत्र आहे. यात खगोलीय गणिते करण्यासाठी चक्रे वापरली गेली होती. हा जगातील पहिला कॉम्प्युटर आहे."
      },
      detailed: {
        en: "Recovered from a Hellenistic shipwreck, the Antikythera Mechanism dates to approximately 150-100 BCE. Using 3D CT scanning, researchers verified 30 gears within the corroded bronze fragments. The system employs differential gears to compute the Metonic cycle, the Saros eclipse cycle, and the Exeligmos cycle. Its design indicates a level of mechanical sophistication unmatched until the Renaissance.",
        hi: "एंटीकाइथेरा यंत्र 150 ईसा पूर्व का है। सीटी स्कैन के जरिए इसमें 30 गियर पहियों की पुष्टि हुई है जो चंद्रमा और सूर्य के जटिल ग्रहण चक्रों की भविष्यवाणी करते थे। इसका निर्माण पुनर्जागरण काल से पहले की बेजोड़ वास्तुकला को दर्शाता है।",
        mr: "या यंत्राची निर्मिती १५० ईसापूर्व काळातील आहे. ३डी स्कॅनिंगद्वारे यात ३० चक्रांचे अस्तित्व समजले आहे. हे यंत्र सूर्य आणि चंद्राची ग्रहणे अचूक मोजत असे, जे प्रबोधन काळापूर्वीच्या विज्ञानाला थक्क करणारे आहे."
      },
      academic: {
        en: "The Antikythera Mechanism is an ancient Greek astronomical calculator exemplifying astrometric precision. Comprising a gear train with epicyclic gearing, it modeled the anomalistic motion of the Moon via a pin-and-slot mechanism, correcting for lunar velocity fluctuations. This object refutes the classical historiography of mechanical engineering.",
        hi: "यह प्राचीन ग्रीक खगोलीय गणकयंत्र है जो खगोलीय सटीकता का प्रतीक है। इसमें चंद्रमा की बदलती गति को मापने के लिए पिन-एंड-स्लॉट तंत्र का उपयोग किया गया है।",
        mr: "हे ग्रीक खगोलशास्त्रीय यंञ अवकाशातील विविध ग्रहांची गती अचूक मोजण्यासाठी बनवले गेले होते. यातील गियरची रचना प्राचीन काळातील प्रगत अभियांत्रिकीचे लक्षण आहे."
      },
      revision: {
        en: "Antikythera Mechanism (c. 150 BCE). Type: Oldest analog computer. Found: 1901 off Greece. Function: Predicted solar/lunar eclipses, tracked 5 planets. Structure: 30 interlocking bronze gears. Creator: Unknown (possibly Hipparchus or Archimedes workshop).",
        hi: "एंटीकाइथेरा यंत्र (150 ईसा पूर्व)। प्रकार: सबसे पुराना एनालॉग कंप्यूटर। खोज: 1901 में ग्रीस में। कार्य: सूर्य/चंद्र ग्रहण और ग्रहों का अनुमान लगाना। संरचना: 30 कांस्य गियर।",
        mr: "अँटीकायथेरा यंत्र (१५० ईसापूर्व). प्रकार: जगातील पहिला संगणक. शोध: १९०१ मध्ये ग्रीसजवळ. कार्य: ग्रहणे आणि ग्रहांची गती मोजणे. रचना: ३० पितळी चक्रे."
      }
    },
    qa: [
      {
        q: ["what did it track", "planets", "eclipses", "function", "क्या काम करता था", "काम काय"],
        a: {
          en: "It tracked the movements of the Sun and Moon, the lunar phases, solar and lunar eclipses (including the exact hour), and the orbital paths of the five planets known to ancient Greeks (Mercury, Venus, Mars, Jupiter, Saturn).",
          hi: "यह सूर्य और चंद्रमा की स्थिति, चंद्रमा की कलाओं, सूर्य और चंद्र ग्रहण की तिथि और समय, तथा पांच ग्रहों (बुध, शुक्र, मंगल, बृहस्पति, शनि) की कक्षाओं की गणना करता था।",
          mr: "या यंत्राद्वारे सूर्य, चंद्र, ग्रहणे आणि ग्रीकांना माहीत असलेल्या बुध, शुक्र, मंगळ, गुरू, शनी या ग्रहांच्या गती मोजल्या जात असत."
        }
      }
    ],
    references: [
      "Freeth, T., et al. (2006). 'Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism.' Nature, 444.",
      "National Archaeological Museum, Athens archives.",
      "Wright, M.T. (2007). 'The Antikythera Mechanism: a new reconstruction.' Antiquity."
    ]
  },
  konark: {
    id: "konark",
    image: "/images/konark.png",
    title: {
      en: "Konark: Wheels of Time",
      hi: "कोणार्क: समय के पहिये",
      mr: "कोणार्क: काळाची चक्रे"
    },
    subtitle: {
      en: "The ancient stone sundials of Odisha's Sun Temple",
      hi: "ओडिशा के सूर्य मंदिर के प्राचीन पत्थर के धूपघड़ी",
      mr: "ओडिशाच्या सूर्य मंदिरातील दगडी सौर घड्याळे"
    },
    category: "Ancient Engineering",
    duration: "14 mins",
    difficulty: "Easy",
    era: "c. 1250 CE",
    factStatus: "100% Historical Monuments Record",
    factLabel: "Historically Verified",
    learningObjectives: [
      { en: "Explain how shadows cast on Konark wheels calculate precise time", hi: "समझाएं कि कोणार्क के पहियों पर पड़ने वाली परछाई कैसे सटीक समय की गणना करती है", mr: "कोणार्कच्या चाकांवरील सावलीवरून वेळ कशी मोजली जाते ते समजून घेणे" }
    ],
    knowledgeLevel: "Beginner",
    relatedTopics: ["Temple Architecture", "Astro-navigation", "Medieval India"],
    synopsis: {
      en: "The Sun Temple of Konark is built as a colossal stone chariot with 24 intricately carved wheels. Discover how these wheels act as highly accurate sundials, calculating time down to the exact minute by the shadow cast by the hub.",
      hi: "कोणार्क का सूर्य मंदिर 24 नक्काशीदार पहियों वाले एक विशाल पत्थर के रथ के रूप में बनाया गया है। जानें कि कैसे ये पहिये सूर्य की छाया से मिनटों तक का सटीक समय बताते हैं।",
      mr: "कोणार्कचे सूर्य मंदिर २४ नक्षीदार चाकांसह एका भव्य दगडी रथाच्या स्वरूपात बांधले गेले आहे. या चाकांवर पडणाऱ्या सावलीवरून अगदी मिनिटांनुसार अचूक वेळ कशी मोजली जाते, ते जाणून घ्या."
    },
    timeline: [
      {
        year: "1250",
        title: { en: "Temple Construction", hi: "मंदिर का निर्माण", mr: "मंदिराची निर्मिती" },
        details: {
          en: "King Narasimhadeva I of the Eastern Ganga Dynasty commissions the temple to honor Surya, the Sun God.",
          hi: "पूर्वी गंगा राजवंश के राजा नरसिंहदेव प्रथम ने सूर्य देव के सम्मान में इस भव्य मंदिर का निर्माण कराया।",
          mr: "पूर्व गंगा घराण्याचे राजे नरसिंहदेव प्रथम यांनी सूर्यदेवाच्या सन्मानार्थ हे मंदिर बांधले."
        }
      }
    ],
    narrative: {
      en: {
        intro: [
          "On the shores of the Bay of Bengal, in the state of Odisha, stands the Konark Sun Temple—a monumental masterpiece of medieval Indian architecture. Built in the shape of a colossal chariot, the temple is adorned with 24 intricately carved stone wheels, pulled by seven stone horses.",
          "These wheels are not mere decorative carvings. They are mathematical instruments designed to track the passage of time with astonishing precision using the sun's shadow."
        ],
        background: [
          "Constructed in the 13th century under King Narasimhadeva I, the temple was designed to align with solar cycles. The main entrance faced east so that the first rays of the rising sun would penetrate the sanctum sanctorum, striking the main deity."
        ],
        main: [
          "Each of the 24 wheels represents a hour of the day or the fortnights of the Hindu calendar. The wheels contain eight major spokes and eight minor spokes.",
          "By placing a finger or a rod at the center of the wheel's hub, the shadow cast on the rim aligns with small circular beads carved along the edge. Each bead represents a specific division of time, allowing priests and astronomers to calculate the exact hour and minute."
        ],
        evidence: [
          "Modern calculations confirm that the alignment of the sundials accounts for seasonal variations in the sun's path, showing a high level of astronomical calibration."
        ],
        scientific: [
          "The engineering of Konark reflects deep understanding of gnomonics—the science of sundials. The thickness of the spokes, the placement of the hub, and the angle of the temple walls were all calculated to prevent errors caused by the earth's axial tilt."
        ],
        historical: [
          "Konark was known as the 'Black Pagoda' by European sailors due to its dark magnetic stone dome, which supposedly disrupted ship compasses passing close to the shore."
        ],
        facts: [
          "The sundials can calculate time in reverse (anticlockwise) during the afternoon as the sun shifts.",
          "The temple was originally built directly in the sea, but the coastline has receded over the centuries."
        ],
        takeaways: [
          "Konark temple wheels are functioning astronomical instruments, not just art.",
          "Medieval Indian builders possessed advanced knowledge of solar geometry and gnomonics."
        ],
        conclusion: [
          "Konark stands as a timeless monument where science and devotion are etched in stone, calculating the passage of epochs under the solar gaze."
        ]
      },
      hi: {
        intro: [
          "ओडिशा में स्थित कोणार्क सूर्य मंदिर अपने 24 नक्काशीदार पहियों के लिए प्रसिद्ध है जो सूर्य की छाया से सटीक समय बताते हैं।"
        ],
        background: [
          "इसका निर्माण 13वीं शताब्दी में राजा नरसिंहदेव प्रथम ने कराया था।"
        ],
        main: [
          "प्रत्येक पहिये में 8 मुख्य तीलियाँ और 8 छोटी तीलियाँ हैं। हब की परछाई पहिये के किनारे बने मोतियों पर पड़ती है, जिससे समय की गणना होती है।"
        ],
        evidence: [
          "आज भी वैज्ञानिक इसकी गणना की सटीकता देखकर हैरान रह जाते हैं।"
        ],
        scientific: [
          "मंदिर की वास्तुकला धूपघड़ी के नियमों और सौर चक्रों के गहरे ज्ञान को प्रदर्शित करती हैं।"
        ],
        facts: [
          "यूरोपीय नाविक इसे 'ब्लैक पगोडा' कहते थे क्योंकि इसका मुख्य गुंबद चुम्बकीय था।"
        ],
        takeaways: [
          "ये पहिये स्थापत्य कला और खगोल विज्ञान के अद्भुत संगम हैं।"
        ],
        conclusion: [
          "भानगढ़ किले का पतन इतिहास और लोककथाओं का मिश्रण है।"
        ]
      },
      mr: {
        intro: [
          "ओडिशामधील कोणार्क सूर्य मंदिर हे १२ व्या शतकातील अप्रतिम भारतीय वास्तुकलेचे प्रतीक आहे."
        ],
        background: [
          "राजे नरसिंहदेव यांनी सूर्यदेवाच्या रथाच्या आकारात हे मंदिर बांधले."
        ],
        main: [
          "मंदिराच्या २४ चाकांवर पडणाऱ्या सावल्या सौर घड्याळाचे काम करतात, ज्यावरून अचूक वेळ मोजली जाते."
        ],
        evidence: [
          "या चाकांची रचना पृथ्वीच्या गतीनुसार अचूक बनवली आहे."
        ],
        scientific: [
          "हे सौर भूमिती आणि अभियांत्रिकीचे एक उत्तम उदाहरण आहे."
        ],
        facts: [
          "या मंदिराला पाश्चिमात्य खलाशी 'ब्लॅक पॅगोडा' असे संबोधत असत."
        ],
        takeaways: [
          "ही चाके केवळ कला नसून विज्ञानाचा मोठा पुरावा आहेत."
        ],
        conclusion: [
          "कोणार्कचे चक्र आजही काळाची अखंड गती दर्शवते."
        ]
      }
    },
    explanations: {
      eli10: {
        en: "The Konark Temple has 24 big stone wheels carved on its walls. These wheels are actually giant clocks! When the sun shines on the center of the wheel, it casts a shadow on the rim, telling you exactly what time it is, just like a watch.",
        hi: "कोणार्क मंदिर की दीवारों पर 24 बड़े पत्थर के पहिये बने हैं। ये पहिये असल में पत्थर की घड़ियां हैं! जब सूर्य की रोशनी पहिये के केंद्र पर पड़ती है, तो उसकी छाया किनारे पर गिरती है और बताती है कि समय क्या हुआ है।",
        mr: "कोणार्क मंदिरात २४ मोठी दगडी चाके आहेत. ही चाके प्रत्यक्षात दगडी घड्याळे आहेत! सूर्याचा प्रकाश या चाकांवर पडल्यावर तिथे पडणाऱ्या सावलीवरून अचूक वेळ समजते."
      },
      simple: {
        en: "Konark Sun Temple in Odisha is built like a massive chariot. Its 24 stone wheels are highly accurate sundials. By looking at where the shadow of the central hub falls on the spokes and carvings, you can tell the time of day down to a few minutes.",
        hi: "ओडिशा का कोणार्क सूर्य मंदिर एक विशाल रथ की तरह बना है। इसके 24 पत्थर के पहिये सटीक धूपघड़ी हैं। पहिये के बीच के हिस्से की परछाई देखकर आप कुछ मिनटों तक की सटीक समय की गणना कर सकते हैं।",
        mr: "कोणार्क सूर्य मंदिर रथासारखे बांधले आहे. यातील २४ चाके ही दगडी सौर घड्याळे आहेत. सावलीच्या स्थानावरून अचूक वेळ समजते."
      },
      detailed: {
        en: "The wheels of Konark Sun Temple are complex astronomical calculators. Each wheel is divided into intervals of 'Praharas' (3-hour periods) and subdivisions of minutes. The shadow is read from the rim, which is calibrated with beads representing minor units. The alignment of the temple compensates for earth's rotation, rendering a functional timekeeper that works year-round.",
        hi: "कोणार्क मंदिर के पहिये खगोलीय धूपघड़ी हैं। पहिया 'प्रहर' और मिनटों के उपखंडों में विभाजित है। तीलियों के बीच नक्काशीदार मोतियों की स्थिति से समय का बिल्कुल सटीक पता चलता है जो पृथ्वी के घूर्णन के अनुकूल है।",
        mr: "कोणार्कची चाके ही प्रगत धूपघड्याळे आहेत. प्रत्येक चाक 'प्रहर' (३ तासांचे अंतर) आणि मिनिटांमध्ये विभागलेले आहे. चाकावर पडणारी सावली स्थानिक वेळेची अगदी अचूक माहिती देते."
      },
      academic: {
        en: "The wheels of Konark function as horizontal sundials utilizing gnomonic projections. The shadow cast by the central axle (gnomon) on the wheel rim is calibrated with precision beads representing subdivisions of time. The architecture integrates solar declination angles, serving as a functional lithic astronomical observatory.",
        hi: "कोणार्क के पहिये धूपघड़ी के सिद्धांतों पर कार्य करते हैं। केंद्र में स्थित धुरी परछाई का निर्माण करती है, जो सौर विस्थापन के अनुकूल समय की सटीक गणना करती है।",
        mr: " कोणार्कची चाके भूमितीय सौर सिद्धांतावर आधारित आहेत. यातील मध्यभागाची सावली काळाचे अचूक मोजमाप करते, जे मध्ययुगीन भारतातील खगोलविज्ञानाची प्रगती दर्शवते."
      },
      revision: {
        en: "Konark temple wheels (Odisha, 1250 CE). Built by King Narasimhadeva I. System: 24 stone wheels acting as sundials. Spokes: 8 major (3 hours each) and 8 minor. Accuracy: Tells time down to the exact minute based on shadow locations.",
        hi: "कोणार्क मंदिर (ओडिशा, 1250 ईस्वी)। राजा नरसिंहदेव प्रथम द्वारा निर्मित। तंत्र: 24 पत्थर के पहिये धूपघड़ी के रूप में। तीलियाँ: 8 मुख्य और 8 छोटी। सटीकता: मिनटों तक का समय बताती है।",
        mr: "कोणार्क मंदिर (ओडिशा, १२५० ईसवी). निर्माते: राजे नरसिंहदेव प्रथम. रचना: २४ चाके धूपघड्याळे म्हणून काम करतात. आरे: ८ मुख्य आणि ८ उप-आरे. अचूकता: मिनिटांपर्यंत वेळ सांगते."
      }
    },
    qa: [
      {
        q: ["how to read time", "spokes", "read", "समय कैसे देखें", "वेळ कशी मोजतात"],
        a: {
          en: "To read the time, place a rod in the center of the hub. The shadow cast will align with one of the spokes. Major spokes indicate 3-hour blocks (Praharas). The space between spokes is calibrated with beads, each representing a minor interval, allowing calculation to the minute.",
          hi: "समय जानने के लिए हब के केंद्र पर कोई छड़ी रखें। इसकी छाया किसी तीली पर पड़ेगी। मुख्य तीलियाँ 3-घंटे के प्रहर को दर्शाती हैं, और उनके बीच नक्काशीदार मोती मिनटों की गणना बताते हैं।",
          mr: "वेळ मोजण्यासाठी मध्यभागी सावली कुठे पडते ते पाहिले जाते. मुख्य आरे ३ तासांचा काळ दाखवतात, तर दोन आऱ्यांमधील नक्षीदार मणी मिनिटे मोजण्यासाठी वापरले जातात."
        }
      }
    ],
    references: [
      "Mitra, Debala (1976). 'Konarak.' Archaeological Survey of India.",
      "Boner, Alice (1972). 'New Light on the Sun Temple of Konarka.' Chowkhamba."
    ]
  },
  blackhole: {
    id: "blackhole",
    image: "/images/blackhole.png",
    title: {
      en: "Accretion: Inside Black Holes",
      hi: "एकरेशन: ब्लैक होल के भीतर",
      mr: "ब्लॅक होलच्या गर्भातील रहस्य"
    },
    subtitle: {
      en: "Peer beyond the event horizon of space-time singularity",
      hi: "अंतरिक्ष-समय की घटना क्षितिज के पार का सफर",
      mr: "काळ आणि अवकाशाच्या पलीकडील सिंग्युलॅरिटीचा शोध"
    },
    category: "Space & Science",
    duration: "22 mins",
    difficulty: "Hard",
    era: "Universal",
    factStatus: "100% Astrophysical Consensus",
    factLabel: "Supported by Scientific Evidence",
    learningObjectives: [
      { en: "Explain the physics of accretion disks and event horizons", hi: "एकरेशन डिस्क और घटना क्षितिज के भौतिकी को समझें", mr: "अॅक्रिशन डिस्क आणि इव्हेंट होरायझनचे भौतिकशास्त्र समजून घेणे" }
    ],
    knowledgeLevel: "Advanced",
    relatedTopics: ["General Relativity", "Hawking Radiation", "Astrophysics"],
    synopsis: {
      en: "Peer beyond the event horizon where space and time warp into an infinite singularity. Track the searing plasma of accretion disks and Hawking radiation slowly bleeding heat from the cosmos.",
      hi: "घटना क्षितिज के पार देखें जहां अंतरिक्ष और समय एक अनंत सिंग्युलैरिटी में बदल जाते हैं। प्लाज्मा डिस्क और हॉकिंग रेडिएशन के बारे में जानें।",
      mr: "इव्हेंट होरायझनच्या पलीकडे डोकावून पहा जिथे काळ आणि अवकाश एका अनंत बिंदूमध्ये (सिंग्युलॅरिटी) विरघळून जातात. ब्लॅक होलचे भौतिकशास्त्र सोप्या भाषेत जाणून घ्या."
    },
    timeline: [
      {
        year: "1915",
        title: { en: "General Relativity", hi: "सामान्य सापेक्षता सिद्धांत", mr: "सापेक्षता सिद्धांत" },
        details: {
          en: "Albert Einstein publishes his field equations, describing how mass warps space-time, laying the math for black holes.",
          hi: "अल्बर्ट आइंस्टीन ने अपने क्षेत्र समीकरण प्रकाशित किए, जिसमें बताया गया कि द्रव्यमान अंतरिक्ष-समय को कैसे विकृत करता है।",
          mr: "अल्बर्ट आइनस्टाईन यांनी सापेक्षतेचा सिद्धांत मांडला, ज्याने ब्लॅक होलच्या गणिताचा पाया घातला."
        }
      },
      {
        year: "2019",
        title: { en: "First Direct Image", hi: "पहला प्रत्यक्ष चित्र", mr: "पहिले थेट छायाचित्र" },
        details: {
          en: "Event Horizon Telescope captures the first direct visual proof of a black hole (M87*) accretion disk shadow.",
          hi: "इवेंट होराइज़न टेलीस्कोप ने ब्लैक होल (M87*) के एकरेशन डिस्क की पहली प्रत्यक्ष तस्वीर ली।",
          mr: "इव्हेंट होरायझन टेलिस्कोपने एम८७ ब्लॅक होलचे पहिले थेट छायाचित्र मिळवून इतिहास घडवला."
        }
      }
    ],
    narrative: {
      en: {
        intro: [
          "Of all the entities in the cosmos, none are more absolute or terrifying than black holes. These are regions of space-time where gravity is so strong that nothing—not even light—has enough speed to escape.",
          "For decades, they were treated as mathematical quirks of Albert Einstein's equations. Today, we know they are the anchors of galaxies, turning plasma into searing accretion disks."
        ],
        background: [
          "In 1915, Einstein's General Theory of Relativity predicted that a massive enough object could warp space-time to an infinite point, a singularity. German physicist Karl Schwarzschild solved these equations, defining the 'event horizon'—the boundary of no return."
        ],
        main: [
          "When matter falls toward a black hole, it doesn't sink immediately. Instead, it orbits the black hole at near-light speeds, forming a flat spinning disk called an accretion disk.",
          "Friction in this disk heats the gas to millions of degrees, causing it to glow in bright X-rays. As matter crosses the event horizon, it disappears from the observable universe, crushed into an infinitely dense point."
        ],
        evidence: [
          "In 2019, the Event Horizon Telescope combined radio dishes around the globe to image the black hole in the galaxy Messier 87, showing a bright orange ring of gas orbiting a dark shadow."
        ],
        scientific: [
          "Hawking radiation, proposed by Stephen Hawking, suggests that quantum effects near the event horizon cause black holes to slowly leak particles, evaporating over trillions of years."
        ],
        historical: [
          "The term 'black hole' was popularized by physicist John Wheeler in 1967, replacing older names like 'collapsed stars.'"
        ],
        facts: [
          "Time slows down near a black hole's gravity, a phenomenon called gravitational time dilation.",
          "Supermassive black holes at the center of galaxies can weigh billions of times more than our sun."
        ],
        takeaways: [
          "Black holes are real physical objects confirmed by direct observation.",
          "The event horizon is a mathematical border where escape velocity exceeds the speed of light."
        ],
        conclusion: [
          "Exploring black holes pushes the boundaries of physics, where quantum mechanics and general relativity clash at the edge of the universe."
        ]
      },
      hi: {
        intro: [
          "ब्रह्मांड की सभी चीजों में से ब्लैक होल सबसे अधिक रहस्यमयी और शक्तिशाली हैं। इनके भीतर गुरुत्वाकर्षण इतना अधिक होता है कि प्रकाश भी बाहर नहीं आ सकता।"
        ],
        background: [
          "1915 में आइंस्टीन के सिद्धांतों ने इनकी गणितीय भविष्यवाणी की थी।"
        ],
        main: [
          "ब्लैक होल के चारों ओर घूमने वाला गर्म गैस का घेरा 'एकरेशन डिस्क' कहलाता है, जो अत्यधिक घर्षण के कारण एक्स-रे उत्सर्जित करता है।"
        ],
        evidence: [
          "2019 में पहली बार एक वास्तविक ब्लैक होल (M87*) की तस्वीर ली गई थी।"
        ],
        scientific: [
          "स्टीफन हॉकिंग के अनुसार, ब्लैक होल धीरे-धीरे कणों का उत्सर्जन करते हैं जिसे हॉकिंग रेडिएशन कहते हैं।"
        ],
        facts: [
          "ब्लैक होल के पास समय धीमा हो जाता है।"
        ],
        takeaways: [
          "ब्लैक होल अंतरिक्ष-समय के चरम मोड़ हैं जहां भौतिकी के सामान्य नियम टूट जाते हैं।"
        ],
        conclusion: [
          "ब्लैक होल का अध्ययन हमें ब्रह्मांड के निर्माण और उसके अंत को समझने में मदद करता है।"
        ]
      },
      mr: {
        intro: [
          "ब्लॅक होल हे विश्वातील सर्वात रहस्यमयी आणि बलाढ्य खगोलीय घटक आहेत. त्यांच्या प्रचंड गुरुत्वाकर्षणामुळे प्रकाशही तिथून बाहेर पडू शकत नाही."
        ],
        background: [
          "१९१५ मध्ये आइनस्टाईन यांच्या सिद्धांताने ब्लॅक होलची गणिते मांडली होती."
        ],
        main: [
          "ब्लॅक होलच्या बाजूला फिरणारी उष्ण वायूंची कडी (Accretion Disk) प्रचंड तापमान निर्माण करते."
        ],
        evidence: [
          "२०१९ मध्ये इव्हेंट होरायझन टेलिस्कोपने पहिल्यांदा ब्लॅक होलचे थेट छायाचित्र मिळवले."
        ],
        scientific: [
          "स्टीफन हॉकिंग यांच्या सिद्धांतानुसार ब्लॅक होल हळूहळू बाष्पीभवनाद्वारे नष्ट होऊ शकतात."
        ],
        facts: [
          "ब्लॅक होलच्या तीव्र गुरुत्वाकर्षणामुळे काळाचा वेग मंदावतो."
        ],
        takeaways: [
          "ब्लॅक होलच्या केंद्रात (Singularity) काळ आणि अवकाश यांचा अंत होतो."
        ],
        conclusion: [
          "ब्लॅक होलचे संशोधन भौतिकशास्त्रातील नवीन दारे उघडते."
        ]
      }
    },
    explanations: {
      eli10: {
        en: "A black hole is like a giant cosmic vacuum cleaner that has squished a lot of heavy stuff into a tiny, tiny dot. Its gravity is so strong that if you shine a flashlight at it, the light gets pulled in and can never jump back out!",
        hi: "ब्लैक होल एक विशाल अंतरिक्ष वैक्यूम क्लीनर की तरह है जिसने बहुत सारा सामान एक छोटे से बिंदु में दबा लिया है। इसका खिंचाव इतना मजबूत है कि प्रकाश भी इसके पार नहीं जा सकता।",
        mr: "ब्लॅक होल म्हणजे अवकाशातील एक प्रचंड व्हॅक्यूम क्लिनर आहे. याचे गुरुत्वाकर्षण इतके जास्त असते की प्रकाशही त्याच्यातून बाहेर पडू शकत नाही."
      },
      simple: {
        en: "A black hole is a region of space where gravity is so strong that nothing, including light, can escape. Around the black hole, matter forms a glowing accretion disk as it gets pulled in. The outer boundary is called the event horizon.",
        hi: "ब्लैक होल अंतरिक्ष में एक ऐसा स्थान है जहाँ गुरुत्वाकर्षण बल बहुत अधिक होता है। इसके आस-पास चक्कर लगाने वाली सामग्री गर्म होकर चमकने लगती है जिसे एकरेशन डिस्क कहते हैं।",
        mr: "ब्लॅक होल म्हणजे अवकाशातील असा भाग जिथे गुरुत्वाकर्षण प्रचंड असते. त्याभोवती फिरणाऱ्या धूलिकणांमुळे एक चमकणारी कडी तयार होते, ज्याला अॅक्रिशन डिस्क म्हणतात."
      },
      detailed: {
        en: "A black hole consists of a gravitational singularity at its center, surrounded by an event horizon. The event horizon is the radius at which the escape velocity equals the speed of light. Matter falling inward forms a high-temperature plasma accretion disk, emitting synchrotron radiation, visible in radio and X-ray spectrums.",
        hi: "ब्लैक होल के केंद्र में एक सिंग्युलैरिटी होती है। इसका बाहरी हिस्सा घटना क्षितिज कहलाता है। भीतर गिरने वाला पदार्थ गर्म होकर प्लाज्मा डिस्क बनाता है जिससे एक्स-रे किरणें निकलती हैं।",
        mr: "ब्लॅक होलच्या मध्यभागी एक सिंग्युलॅरिटी असते, जिथे घनता अनंत असते. त्याभोवतीच्या इव्हेंट होरायझनच्या आत प्रकाशही प्रवास करू शकत नाही. बाजूचे वायू प्रचंड वेगाने फिरून किरणोत्सर्ग करतात."
      },
      academic: {
        en: "Black holes are solutions to Einstein's field equations under extreme density. The Schwarzschild radius defines the spherical event horizon. Matter orbiting within the accretion zone is subject to extreme relativistic shear, resulting in thermal X-ray emission and relativistic jets.",
        hi: "आइंस्टीन के क्षेत्र समीकरणों के अनुसार ब्लैक होल अनंत घनत्व वाले बिंदु हैं। श्वार्जस्चिल्ड त्रिज्या घटना क्षितिज को परिभाषित करती है जहां गुरुत्वाकर्षण खिंचाव प्रकाश की गति से अधिक हो जाता है।",
        mr: "आइनस्टाईनच्या सिद्धांतानुसार ब्लॅक होल हे अवकाशातील अनंत घनतेचे केंद्र आहे. इव्हेंट होरायझन ही सीमा ओलांडल्यावर काळ आणि अंतर यांची गणिते बदलतात."
      },
      revision: {
        en: "Black Hole basics. Singularity: Infinitely dense center. Event Horizon: Point of no return. Accretion Disk: Glowing plasma gas orbiting the boundary. Discovery: Einstein theory (1915); Direct Photo (2019). Time: Dilation occurs near gravity.",
        hi: "ब्लैक होल बेसिक्स। सिंग्युलैरिटी: अनंत घनत्व वाला केंद्र। घटना क्षितिज: वापस न लौटने की सीमा। एकरेशन डिस्क: चमकती गैस का चक्कर। सिद्धांत: आइंस्टीन (1915); पहली तस्वीर (2019)।",
        mr: "ब्लॅक होल माहिती. सिंग्युलॅरिटी: अनंत घनतेचे केंद्र. इव्हेंट होरायझन: परतीचा मार्ग नसलेली सीमा. अॅक्रिशन डिस्क: फिरणारा तप्त वायू. शोध: १९१५ सिद्धांत, २०१२/२०१९ थेट छायाचित्र."
      }
    },
    qa: [
      {
        q: ["what is event horizon", "singularity", "point of no return", "घटना क्षितिज", "मर्यादा"],
        a: {
          en: "The event horizon is the boundary surrounding a black hole. Once matter or light crosses this boundary, the gravitational pull is so strong that the escape velocity exceeds the speed of light, making escape mathematically impossible.",
          hi: "घटना क्षितिज ब्लैक होल के चारों ओर की वह सीमा है, जिसके पार जाने के बाद प्रकाश या पदार्थ का बाहर निकलना असंभव हो जाता है क्योंकि गुरुत्वाकर्षण बल प्रकाश की गति से अधिक हो जाता है।",
          mr: "इव्हेंट होरायझन ही ब्लॅक होलची बाह्य सीमा आहे. या सीमेच्या आत प्रकाश किंवा इतर कोणतीही वस्तू गेल्यास ती कधीही बाहेर येऊ शकत नाही."
        }
      }
    ],
    references: [
      "Hawking, S.W. (1974). 'Black hole explosions?' Nature, 248.",
      "The Event Horizon Telescope Collaboration (2019). 'First M87 Event Horizon Telescope Results.' Astrophysical Journal Letters."
    ]
  },
  bhangarh: {
    id: "bhangarh",
    image: "/images/bhangarh.png",
    title: {
      en: "Bhangarh: The Cursed Ruins",
      hi: "भानगढ़: शापित खंडहर का रहस्य",
      mr: "भानगड: शापित किल्ल्याचे रहस्य"
    },
    subtitle: {
      en: "The haunted 17th-century fort abandoned overnight",
      hi: "17वीं शताब्दी का किला जो रातों-रात वीरान हो गया",
      mr: "१७ व्या शतकातील एका रात्रीत ओसाड झालेला किल्ला"
    },
    category: "Indian Mysteries",
    duration: "14 mins",
    difficulty: "Easy",
    era: "1613 CE",
    factStatus: "40% Historical Fact, 60% Local Myth",
    factLabel: "Historical Legend",
    learningObjectives: [
      { en: "Understand the historical rise and fall of Bhangarh Fort", hi: "भानगढ़ किले के ऐतिहासिक उदय और पतन को समझें", mr: "भानगड किल्ल्याचा उदय आणि अस्त या मागील इतिहास समजून घेणे" }
    ],
    knowledgeLevel: "Beginner",
    relatedTopics: ["Rajasthan History", "Folklore", "Archaeological Conservation"],
    synopsis: {
      en: "Within the Sariska Tiger Reserve sits the 17th-century Bhangarh Fort. Abandoned overnight, locals believe a wizard's curse keeps the city barren. Even the government forbids entry between sunset and sunrise.",
      hi: "सरिस्का टाइगर रिजर्व के पास 17वीं सदी का भानगढ़ किला स्थित है। रातों-रात वीरान हुए इस किले को स्थानीय लोग तांत्रिक के श्राप का परिणाम मानते हैं। सरकार ने भी सूर्यास्त के बाद प्रवेश पर रोक लगा रखी है।",
      mr: "सरिस्का अभयारण्याजवळ वसलेला १७ व्या शतकातील भानगड किल्ला. एका रात्रीत ओसाड झालेल्या या किल्ल्याला तांत्रिकाचा शाप असल्याचे म्हटले जाते. शासनानेही येथे रात्री जाण्यास बंदी घातली आहे."
    },
    timeline: [
      {
        year: "1573",
        title: { en: "Fort Construction", hi: "किले का निर्माण", mr: "किल्ल्याची निर्मिती" },
        details: {
          en: "Bhangarh Fort is built by Raja Bhagwant Das for his younger son Madho Singh.",
          hi: "भानगढ़ किले का निर्माण राजा भगवंत दास ने अपने छोटे बेटे माधो सिंह के लिए करवाया था।",
          mr: "भानगड किल्ल्याची निर्मिती राजा भगवंत दास यांनी त्यांचा मुलगा माधो सिंग यांच्यासाठी केली."
        }
      },
      {
        year: "1783",
        title: { en: "Famine and Abandonment", hi: "अकाल और वीरान होना", mr: "दुष्काळ आणि स्थलांतर" },
        details: {
          en: "A devastating famine strikes the region, forcing the remaining population to completely abandon the town.",
          hi: "एक विनाशकारी अकाल ने इस क्षेत्र को प्रभावित किया, जिससे बची हुई आबादी शहर छोड़कर चली गई।",
          mr: "या भागात पडलेल्या भीषण दुष्काळामुळे येथील नागरिकांनी गाव आणि किल्ला कायमचा सोडला."
        }
      }
    ],
    narrative: {
      en: {
        intro: [
          "Nestled at the border of the Sariska Tiger Reserve in Rajasthan, India, lies the ruin of Bhangarh Fort. Known widely as the most haunted place in India, this 17th-century town once boasted bustling markets, royal palaces, and grand temples.",
          "Today, it lies in complete ruin, and the Archaeological Survey of India (ASI) has placed a sign forbidding entry into the fort between sunset and sunrise—a rare governmental gesture that feeds into local myths."
        ],
        background: [
          "Bhangarh Fort was established in 1573 by the Amber ruler Raja Bhagwant Das. It flourished for generations as a prosperous trading town on the route between Jaipur and Alwar, home to thousands of citizens."
        ],
        main: [
          "The legend of Bhangarh's downfall centers around Princess Ratnavati, the beautiful daughter of Madho Singh. According to folklore, a dark magician named Singhia fell in love with her.",
          "Knowing he could never marry her, he tried to enchant a cosmetic oil she ordered. The princess realized the trick and threw the oil onto a large boulder nearby. The boulder, magnetized by the spell, rolled down and crushed the magician.",
          "With his dying breath, Singhia cursed the town, declaring that Bhangarh would fall in ruins and no one would ever be able to live there. Shortly after, a war broke out with neighboring Ajabgarh, and the town was sacked and abandoned."
        ],
        evidence: [
          "Historians offer a much more realistic view of the fort's demise. The region suffered severe military attacks, and a massive famine in 1783 forced the entire population to leave the barren valley in search of food and water."
        ],
        scientific: [
          "Archaeological studies show that the structures were built with local granite and sandstone, but lack maintenance. The ruins show classic signs of decay from roots and weather over three centuries."
        ],
        historical: [
          "Historically, the ASI warning sign is a standard safety precaution due to the lack of electricity, wild animals from the adjacent tiger reserve, and the risk of injuries in the collapsed structures at night."
        ],
        legends: [
          "Locals claim that if any house inside the fort is built with a roof, it collapses instantly due to the wizard's curse, which is why all ruined houses inside the fort are roofless."
        ],
        facts: [
          "The temples inside the fort, including the Someshwar temple, are remarkably intact, unlike the residential palaces.",
          "Bhangarh fort remains a major tourist attraction in Rajasthan, bringing in thousands of visitors daily."
        ],
        takeaways: [
          "Bhangarh's collapse was likely caused by wars, economic decline, and famine, not a magical curse.",
          "The roofless structures are typical of abandoned medieval towns exposed to centuries of natural weathering."
        ],
        conclusion: [
          "Bhangarh Fort remains an intriguing site where historical heritage and scary ghost stories exist side-by-side, preserving the magic of Rajasthani legends."
        ]
      },
      hi: {
        intro: [
          "राजस्थान में स्थित भानगढ़ का किला भारत की सबसे भुतहा जगहों में गिना जाता है। शाम के बाद यहां जाने पर सरकारी पाबंदी है।"
        ],
        background: [
          "1573 में निर्मित यह किला कभी एक समृद्ध व्यापारिक नगर हुआ करता था।"
        ],
        main: [
          "किंवदंती के अनुसार, एक तांत्रिक ने राजकुमारी रत्नावती पर काला जादू करने की कोशिश की, लेकिन खुद ही मारा गया और मरते समय उसने पूरे नगर को शाप दे दिया।"
        ],
        evidence: [
          "इतिहासकारों का मानना है कि 1783 के भीषण अकाल और युद्ध के कारण लोग इस किले को छोड़कर भाग गए थे।"
        ],
        scientific: [
          "रात में प्रवेश पर रोक का कारण जंगली जानवर, बिजली की कमी और पुरानी ढहती हुई संरचनाएं हैं।"
        ],
        legends: [
          "कहा जाता है कि श्राप के कारण आज भी यहाँ घरों की छतें टिक नहीं पातीं।"
        ],
        takeaways: [
          "पतन का कारण युद्ध और अकाल था, जादू नहीं।"
        ],
        conclusion: [
          "भानगढ़ इतिहास और जनश्रुतियों का एक खूबसूरत मेल है।"
        ]
      },
      mr: {
        intro: [
          "राजस्थानमधील भानगड किल्ला हा भारतातील सर्वात रहस्यमय आणि भुताटकीच्या ठिकाणांपैकी एक मानला जातो."
        ],
        background: [
          "हा किल्ला १५७३ मध्ये राजा भगवंत दास यांनी बांधला होता."
        ],
        main: [
          "दंतकथेनुसार, एका सिंघा नावाच्या तांत्रिकाने किल्ल्यातील राजकुमारीवर जादू करण्याचा प्रयत्न केला, पण त्याचा डाव उलटला आणि त्याने मरताना किल्ल्याला शाप दिला."
        ],
        evidence: [
          "इतिहासकारांनुसार, १७८३ मधील दुष्काळ आणि शेजारील राज्यांशी झालेल्या युद्धांमुळे लोकांनी हा किल्ला सोडला."
        ],
        scientific: [
          "रात्री प्रवेश बंदीचे मुख्य कारण म्हणजे शेजारील व्याघ्रप्रकल्पातील जंगली प्राणी आणि पडणाऱ्या भिंतींचा धोका आहे."
        ],
        takeaways: [
          "भानगडचा विनाश युद्धांमुळे झाला, कोणत्याही शापामुळे नाही."
        ],
        conclusion: [
          "भानगड किल्ला हा इतिहास आणि गूढ कथांचा संग्रह आहे."
        ]
      }
    },
    explanations: {
      eli10: {
        en: "Bhangarh Fort is an old castle in the desert. People say a wizard cast a magic spell on it because he was angry, making everyone leave. But scientists say people left because they had no water and food during a big dry season. Today, the castle is broken and wild animals walk around it at night.",
        hi: "भानगढ़ किला रेगिस्तान में बना एक पुराना किला है। लोग कहते हैं कि एक तांत्रिक के श्राप के कारण लोग इसे छोड़कर भाग गए। लेकिन वैज्ञानिक कहते हैं कि पानी की कमी के कारण लोगों ने इसे छोड़ा।",
        mr: "भानगड हा राजस्थानमधील एक जुना किल्ला आहे. लोक म्हणतात तांत्रिकाच्या शापामुळे तो ओसाड झाला. पण वैज्ञानिकांनुसार दुष्काळामुळे लोकांनी हा किल्ला सोडला."
      },
      simple: {
        en: "Bhangarh Fort is a 17th-century ruin in Rajasthan, India, famous for legends of ghosts. Local myths say a magician cursed the fort, causing it to be abandoned. However, historical records suggest the town fell due to wars and a severe famine. The government bans entry at night due to wild animals and safety issues.",
        hi: "भानगढ़ किला राजस्थान में स्थित है जिसे लोग भूतिया मानते हैं। पौराणिक कथा के अनुसार एक तांत्रिक के श्राप से यह नष्ट हुआ। लेकिन इतिहास बताता है कि युद्ध और अकाल के कारण लोगों ने इसे छोड़ा था। रात में जंगली जानवरों के डर से यहां जाना मना है।",
        mr: "भानगड हा राजस्थानमधील किल्ला भूतबाधा असलेल्या जागांमध्ये गणला जातो. तांत्रिकाच्या शापामुळे तो नष्ट झाला अशी वदंता आहे, पण युद्धांमुळे आणि दुष्काळामुळे लोकांनी तेथून स्थलांतर केले."
      },
      detailed: {
        en: "Established by Raja Bhagwant Das in 1573, Bhangarh is a preserved fort complex featuring temples, gates, and palaces. Folklore attributes its ruins to Singhia's curse, but demographic studies prove that economic decay and the great Chalisa famine of 1783 drove the inhabitants away. The ASI restriction after sunset is a safety protocol for historical reserves close to wildlife zones.",
        hi: "भानगढ़ किला वास्तुकला का सुंदर उदाहरण है। लोककथाओं में इसे शापित माना गया है, परंतु 1783 के अकाल ने पूरी आबादी को पलायन पर मजबूर कर दिया। सूर्यास्त के बाद प्रवेश पर प्रतिबंध वन्यजीव सुरक्षा और संरचनात्मक जोखिमों के कारण है।",
        mr: "भानगड हा किल्ला १५७३ चा आहे. स्थानिक कथेनुसार तांत्रिकाच्या शापामुळे तो पडला. पण इतिहास दर्शवतो की १७८३ च्या भीषण दुष्काळामुळे लोकांनी तेथून स्थलांतर केले. वन्यजीवांपासून सुरक्षेसाठी रात्री येथे बंदी आहे."
      },
      academic: {
        en: "Bhangarh Fort represents an abandoned urban settlement of the Mughal period. The architectural layout displays conventional defense parameters. The abandonment timeline correlates with regional drought indexes and military incursions by the state of Jaipur. The curse narrative acts as a sociological coping mechanism for community dispersal.",
        hi: "भानगढ़ मुगल काल की एक परित्यक्त बस्ती है। पतन का काल क्षेत्रीय सूखे और सैन्य आक्रमणों से मेल खाता है। शाप की कहानी विस्थापन की व्याख्या करने वाली एक सामाजिक जनश्रुति मात्र है।",
        mr: "भानगड किल्ला हा मध्ययुगीन ओसाड शहराचे उत्तम उदाहरण आहे. याचा नाश दुष्काळ आणि जयपूर राज्याच्या आक्रमणामुळे झाला. शापाची दंतकथा ही समाज विखुरण्याची एक सामाजीक स्पष्टीकरण देणारी कथा आहे."
      },
      revision: {
        en: "Bhangarh Fort (Rajasthan, 1613 CE). Anomaly: Known as India's most haunted fort. Legend: Cursed by a black magician Singhia. Fact: Abandoned due to Ajabgarh wars and the 1783 famine. ASI Rule: No entry between sunset and sunrise for safety.",
        hi: "भानगढ़ किला (राजस्थान, 1613 ईस्वी)। घटना: भारत का सबसे भुतहा किला। किंवदंती: तांत्रिक सिंहिया का श्राप। तथ्य: युद्ध और 1783 के अकाल के कारण पलायन। नियम: सूर्यास्त के बाद नो-एंट्री।",
        mr: "भानगड किल्ला (राजस्थान, १६१३ ईसवी). वैशिष्ट्य: भारतातील सर्वात जास्त भीतीदायक मानला जाणारा किल्ला. दंतकथा: तांत्रिकाचा शाप. सत्य: १७८३ चा दुष्काळ आणि आक्रमणामुळे ओसाड. सरकारी नियम: रात्री प्रवेशास बंदी."
      }
    },
    qa: [
      {
        q: ["why does the government ban entry at night", "asi", "ban", "government sign", "सूर्यास्त", "बंदी का"],
        a: {
          en: "The Archaeological Survey of India bans entry because there is no electricity inside the ruined fort, creating a high risk of fall injuries. Additionally, the fort is located next to the Sariska Tiger Reserve, and wild animals, including leopards, enter the ruins at night.",
          hi: "भारतीय पुरातत्व सर्वेक्षण ने रात में प्रवेश इसलिए प्रतिबंधित किया है क्योंकि खंडहरों में बिजली नहीं है, जिससे गिरने का खतरा रहता है। साथ ही, यह सरिस्का टाइगर रिजर्व के पास है, और रात में तेंदुए जैसे जंगली जानवर यहाँ आ जाते हैं।",
          mr: " पुरातत्व विभागाने रात्रीच्या वेळी प्रवेश बंद केला आहे कारण आतमध्ये वीज नाही आणि भिंती पडण्याचा धोका आहे. तसेच बाजूलाच व्याघ्रप्रकल्प असल्याने रात्री वन्य प्राणी किल्ल्यात वावरतात."
        }
      }
    ],
    references: [
      "Archaeological Survey of India conservation circle records on Bhangarh, 1992.",
      "Tod, James (1829). 'Annals and Antiquities of Rajasthan.'",
      "Sinha, S. (2014). 'Haunted Heritage and Folk Beliefs in Alwar Region.'"
    ]
  }
};
