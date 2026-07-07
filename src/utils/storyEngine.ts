import { KNOWLEDGE_DATABASE, Translation, StoryDetail } from "../data/knowledgeDatabase";
export type { StoryDetail };

// Helper to determine category from custom topic
function detectCategory(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("temple") || t.includes("architecture") || t.includes("carv") || t.includes("stone")) return "Temple Architecture";
  if (t.includes("space") || t.includes("star") || t.includes("planet") || t.includes("hole") || t.includes("astronomy") || t.includes("physics")) return "Space & Science";
  if (t.includes("myst") || t.includes("haunted") || t.includes("ghost") || t.includes("curse") || t.includes("lake")) return "Indian Mysteries";
  if (t.includes("legend") || t.includes("myth") || t.includes("god") || t.includes("folklore")) return "Legends & Folklore";
  if (t.includes("civilization") || t.includes("ancient") || t.includes("rome") || t.includes("egypt")) return "Ancient Civilizations";
  if (t.includes("discover") || t.includes("science") || t.includes("invention")) return "Scientific Discoveries";
  if (t.includes("dig") || t.includes("exca") || t.includes("ruin") || t.includes("fossil")) return "Archaeology";
  return "History";
}

function detectImage(category: string): string {
  if (category === "Space & Science") return "/images/blackhole.png";
  if (category === "Indian Mysteries") return "/images/roopkund.png";
  if (category === "Archaeology" || category === "Ancient Civilizations") return "/images/dwarka.png";
  if (category === "Ancient Engineering" || category === "Temple Architecture") return "/images/konark.png";
  if (category === "Unexplained Phenomena" || category === "Nature") return "/images/jatinga.png";
  return "/images/bhangarh.png";
}

// Generate a rich, documentary-style story for custom topics on-the-fly
export function generateCustomStory(topic: string): StoryDetail {
  const cleanTopic = topic.trim().replace(/[?#]/g, "");
  const id = cleanTopic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const category = detectCategory(cleanTopic);
  const image = detectImage(category);

  // AI Safety Warnings
  const safetyWarningEN = "This topic contains multiple interpretations and historical evidence is incomplete.";
  const safetyWarningHI = "इस विषय में कई व्याख्याएं शामिल हैं और ऐतिहासिक साक्ष्य अपूर्ण हैं।";
  const safetyWarningMR = "या विषयामध्ये अनेक मते असून ऐतिहासिक पुरावे अपूर्ण आहेत.";

  const title: Translation = {
    en: `The Mystery of ${cleanTopic}`,
    hi: `${cleanTopic} का अनसुलझा रहस्य`,
    mr: `${cleanTopic} चे गुढ रहस्य`
  };

  const subtitle: Translation = {
    en: `A documentary investigation into the archives of ${cleanTopic}`,
    hi: `${cleanTopic} के ऐतिहासिक एवं वैज्ञानिक तथ्यों का एक वृत्तचित्र अन्वेषण`,
    mr: `${cleanTopic} च्या ऐतिहासिक आणि वैज्ञानिक तथ्यांचा शोध`
  };

  const synopsis: Translation = {
    en: `What lies behind the legend of ${cleanTopic}? This narrative explores the verified facts, scientific perspectives, and local legends surrounding this historical enigma. ${safetyWarningEN}`,
    hi: `${cleanTopic} की कहानी के पीछे क्या सच है? यह कहानी इस ऐतिहासिक रहस्य से जुड़े सत्यापित तथ्यों, वैज्ञानिक दृष्टिकोणों और स्थानीय किंवदंतियों की खोज करती है। ${safetyWarningHI}`,
    mr: `${cleanTopic} च्या दंतकथांमागे नेमके काय सत्य आहे? हे कथानक या ऐतिहासिक रहस्याशी संबंधित सत्यापित तथ्ये आणि वैज्ञानिक दृष्टिकोनांचा शोध घेते. ${safetyWarningMR}`
  };

  const timeline = [
    {
      year: "Ancient Era",
      title: { en: "Origins & Earliest Records", hi: "उत्पत्ति और प्रारंभिक रिकॉर्ड", mr: "उत्पत्ती आणि सुरुवातीचे रेकॉर्ड" },
      details: {
        en: `The first documented mentions or construction period of ${cleanTopic} begins, recorded in ancient logs and travelers' journals.`,
        hi: `प्राचीन यात्रा वृत्तांतों और दस्तावेजों में ${cleanTopic} का पहला प्रलेखित उल्लेख मिलता है।`,
        mr: `प्राचीन प्रवासवर्णन आणि दस्तऐवजांमध्ये ${cleanTopic} चा पहिला उल्लेख आढळतो.`
      }
    },
    {
      year: "c. 19th Century",
      title: { en: "Scientific Rediscovery", hi: "वैज्ञानिक पुनर्खोज", mr: "वैज्ञानिक पुनर्शोध" },
      details: {
        en: `Archaeologists and explorers conduct initial excavations and modern surveys to map the structures related to ${cleanTopic}.`,
        hi: `पुरातत्वविदों और खोजकर्ताओं ने ${cleanTopic} से संबंधित संरचनाओं का नक्शा बनाने के लिए प्रारंभिक खुदाई शुरू की।`,
        mr: `पुरातत्वशास्त्रज्ञ आणि संशोधकांनी ${cleanTopic} संबंधित संरचनेचा नकाशा तयार करण्यासाठी संशोधन सुरू केले.`
      }
    },
    {
      year: "Active Research",
      title: { en: "Modern Investigations", hi: "आधुनिक अन्वेषण", mr: "आधुनिक संशोधन" },
      details: {
        en: `Advanced carbon dating, sonar mapping, or geological surveys are conducted, sparking global discussions.`,
        hi: `उन्नत कार्बन डेटिंग, सोनार मैपिंग या भूवैज्ञानिक सर्वेक्षण किए गए, जिससे दुनिया भर में चर्चा छिड़ गई।`,
        mr: `प्रगत कार्बन डेटिंग, सोनार मॅपिंग किंवा भूवैज्ञानिक सर्वेक्षण करण्यात आले, ज्याने नवीन प्रश्न उपस्थित केले.`
      }
    }
  ];

  const narrative = {
    en: {
      intro: [
        `Throughout human history, few topics have sparked as much intrigue and debate as the enigma of ${cleanTopic}. Nestled within the annals of time, it stands as a monument of human curiosity, drawing travelers, scientists, and historians to decrypt its silent records.`,
        `For generations, the truth behind this subject remained shrouded in secrecy and folklore. Modern discoveries, however, are finally shedding light on what was once deemed incomprehensible, separating facts from romanticized legends.`
      ],
      background: [
        `Historical records suggest that the context of ${cleanTopic} evolved during a period of significant cultural and scientific changes. Early builders and ancient travelers left scattered artifacts, writing systems, and architectural clues describing its immense importance.`,
        `Despite these early entries, much of the physical evidence lay buried under centuries of soil, ocean sediment, or cosmic dust. Lacking advanced excavation equipment, early explorers could only speculate, leading to the rise of fantastic local legends.`
      ],
      main: [
        `The breakthrough came with modern research and scientific mapping. Archaeologists deployed state-of-the-art scanners and geological profiling to expose structural foundations and deep layers of historical deposit associated with ${cleanTopic}.`,
        `What they discovered was a highly organized grid of elements, showcasing a level of engineering and mathematical skill that far exceeded the assumed technology of that era. This discovery immediately forced historians to reconsider the timeline of ancient developments.`,
        `As the physical features of the site emerged, they revealed a story of environmental adaptation, cultural exchange, and human determination that echoes down the centuries.`
      ],
      evidence: [
        `Physical evidence recovered from the site includes tools, pottery shards, organic deposits, and inscriptions. Microscopic analysis of these materials suggests a complex network of trade and travel.`,
        `Furthermore, carbon-14 dating of core samples provides a reliable window, placing the primary usage phase of the site much earlier than previously written in mainstream textbooks. While some of these dates remain under debate, the physical presence of the structures is undeniable.`
      ],
      scientific: [
        `From a scientific perspective, researchers utilize satellite imaging and geochemical analysis to understand the environmental triggers that influenced the site. Climate models suggest that a sudden shifts in river systems or localized weather anomalies played a primary role in its abandonment.`,
        `Geophysicists note that the structural alignment of the monuments matches solar and celestial coordinates with high accuracy, pointing to sophisticated astro-navigation capabilities among the ancient builders.`
      ],
      historical: [
        `Historically, experts compare the site's layout with contemporary cities of the same era. There are signs of shared architectural motifs, proving that ${cleanTopic} was not isolated but rather acted as a crucial node in ancient global exchange networks.`,
        `However, because written records are incomplete, historians warn against making absolute claims, noting that the true purpose of the site remains subject to active research.`
      ],
      legends: [
        `Local legends, as expected, offer a more dramatic explanation. Folklore claims that ${cleanTopic} was created by celestial beings or protected by a magical curse designed to keep intruders away.`,
        `According to local singers, any attempt to disturb the sacred soil results in instant misfortune. While scientists dismiss the curse, they acknowledge that these stories helped protect the ruins from looters for centuries.`
      ],
      facts: [
        `The structural blocks used in construction weigh several tons, showcasing advanced logistics.`,
        `Inscriptions found near the entrance contain mathematical calculations that track annual cycles.`,
        `The layout demonstrates sophisticated water management and drainage channels.`
      ],
      takeaways: [
        `${cleanTopic} is a verified historical site containing significant architectural and cultural remains.`,
        `Scientific modeling indicates advanced engineering and astronomical alignments.`,
        `Factual evidence must be separated from local curses and legends to understand its true historical value.`
      ],
      conclusion: [
        `Ultimately, ${cleanTopic} remains an ongoing chapter in the story of human civilization. It is a reminder that the past still holds secrets that science is only beginning to unlock.`,
        `As research continues, each uncovered stone and decrypted writing brings us closer to understanding the brilliant minds that built this monument, keeping our curiosity alive for generations to come.`
      ]
    },
    hi: {
      intro: [
        `मानव इतिहास में, ${cleanTopic} के रहस्य ने हमेशा लोगों को आकर्षित किया है। यह स्थल हमारी जिज्ञासा का एक ऐसा केंद्र है, जिसने दुनिया भर के वैज्ञानिकों और इतिहासकारों को अपनी ओर खींचा है।`,
        `वर्षों तक इस विषय पर केवल दंतकथाओं का ही बोलबाला रहा। लेकिन आधुनिक खोजें अब धीरे-धीरे सच को सामने ला रही हैं, और हमें सबूतों और कहानियों के बीच अंतर करने में मदद कर रही हैं।`
      ],
      background: [
        `ऐतिहासिक रिकॉर्ड बताते हैं कि ${cleanTopic} का उदय प्राचीन काल में हुआ था। इसके अवशेष सदियों तक मिट्टी के नीचे दबे रहे, जिससे लोग केवल अनुमान ही लगा सकते थे।`
      ],
      main: [
        `आधुनिक पुरातत्वविदों ने उन्नत तकनीकों का उपयोग करके इस रहस्यमयी संरचना का नक्शा तैयार किया है। उन्होंने पाया कि इसके निर्माण में असाधारण गणितीय और वास्तुकला कौशल का उपयोग किया गया था।`
      ],
      evidence: [
        `यहाँ से प्राप्त औजारों और कलाकृतियों की जांच से इसके प्राचीन होने के पुख्ता सबूत मिले हैं। कार्बन डेटिंग इसके कालखंड को बहुत पुराना बताती है।`
      ],
      scientific: [
        `वैज्ञानिकों के अनुसार, यह स्थान खगोलीय और सौर संरेखण (solar alignment) पर आधारित है, जो उस समय के लोगों के खगोलीय ज्ञान को दर्शाता है।`
      ],
      historical: [
        `इतिहासकार मानते हैं कि यह स्थल प्राचीन व्यापारिक और सांस्कृतिक मार्गों का एक मुख्य केंद्र रहा होगा, हालांकि इसके पतन का कारण अभी पूरी तरह स्पष्ट नहीं है।`
      ],
      legends: [
        `स्थानीय किंवदंतियों के अनुसार, इस स्थान को दैवीय शक्तियों द्वारा बनाया गया था और यह आज भी एक शाप से सुरक्षित है। वैज्ञानिकों के लिए ये कहानियाँ केवल लोककथाएँ हैं।`
      ],
      facts: [
        `निर्माण में प्रयुक्त भारी पत्थरों को उठाने के लिए उन्नत क्रेन तकनीक का उपयोग किया गया होगा।`,
        `यहाँ पानी के संचयन की अद्भुत प्रणाली देखी जा सकती है।`
      ],
      takeaways: [
        `${cleanTopic} एक वास्तविक ऐतिहासिक धरोहर है जो प्राचीन काल की अद्भुत तकनीक को दर्शाती है।`
      ],
      conclusion: [
        `अंततः, ${cleanTopic} का रहस्य आज भी हमें इतिहास को नए नजरिए से देखने के लिए प्रेरित करता है।`
      ]
    },
    mr: {
      intro: [
        `मानवी इतिहासात ${cleanTopic} च्या रहस्याने नेहमीच कुतूहल निर्माण केले आहे. हा विषय विज्ञान आणि इतिहास यांच्यातील संशोधनाचा एक महत्त्वाचा भाग बनला आहे.`
      ],
      background: [
        `प्राचीन प्रवाशांनी लिहून ठेवलेल्या नोंदींवरून समजते की, हे ठिकाण त्या काळी अत्यंत महत्त्वाचे केंद्र होते.`
      ],
      main: [
        `संशोधकांना येथे प्रगत वास्तुकलेचे पुरावे मिळाले आहेत. दगडी रचनेची भूमिती दर्शवते की त्या काळातील अभियंते गणितात हुशार होते.`
      ],
      evidence: [
        `येथून मिळालेल्या मातीच्या भांड्यांची आणि लाकडी अवशेषांची कार्बन चाचणी ही अत्यंत जुन्या काळातील असल्याचे सिद्ध करते.`
      ],
      scientific: [
        `वैज्ञानिकांनुसार, या वास्तूची दिशा ग्रहांच्या स्थितीनुसार ठरवली गेली होती.`
      ],
      historical: [
        `इतिहासकार मानतात की नैसर्गिक आपत्ती किंवा दुष्काळामुळे लोकांनी हे शहर सोडले असावे.`
      ],
      legends: [
        `दंतकथांनुसार या वास्तूला वाईट शक्तींचा शाप आहे. मात्र, शास्त्रज्ञ या गोष्टी मानत नाहीत.`
      ],
      facts: [
        `येथील दगडी भिंती भूकंपाचा धक्का सहन करू शकतील अशा प्रकारे बांधल्या गेल्या आहेत.`
      ],
      takeaways: [
        `${cleanTopic} ही एक खरी ऐतिहासिक वास्तू असून प्राचीन मानवाच्या प्रगतीची साक्ष देते.`
      ],
      conclusion: [
        `अशा प्रकारे, ${cleanTopic} चे रहस्य अजूनही पूर्णपणे उलगडलेले नाही आणि त्यावर संशोधन सुरूच आहे.`
      ]
    }
  };

  const explanations = {
    eli10: {
      en: `A long time ago, people built a very special place called ${cleanTopic}. Later, it was covered in dirt and forgotten. Now, scientists are using special scanners to find it. They discovered that the people who built it were really smart, like ancient magicians! ${safetyWarningEN}`,
      hi: `बहुत समय पहले, लोगों ने ${cleanTopic} नाम का एक विशेष स्थान बनाया था। बाद में यह मिट्टी में दब गया और लोग इसे भूल गए। अब वैज्ञानिक इसे फिर से खोज रहे हैं। ${safetyWarningHI}`,
      mr: `खूप वर्षांपूर्वी लोकांनी ${cleanTopic} नावाची एक विशेष जागा तयार केली होती. पुढे ती मातीखाली गाडली गेली. आता शास्त्रज्ञ शोध घेऊन ती पुन्हा समोर आणत आहेत. ${safetyWarningMR}`
    },
    simple: {
      en: `The story of ${cleanTopic} is a mix of history and legend. While old stories say it was cursed, marine scans and excavations show it was a real, planned settlement built with heavy stone blocks. Scientists believe it was abandoned due to sudden weather changes. ${safetyWarningEN}`,
      hi: `${cleanTopic} की कहानी इतिहास और लोककथाओं का मिश्रण है। जहाँ कहानियाँ इसे शापित मानती हैं, वहीं वैज्ञानिक जांच बताती है कि यह पत्थरों से बना एक वास्तविक शहर था जो मौसम बदलने के कारण नष्ट हो गया। ${safetyWarningHI}`,
      mr: `${cleanTopic} चा इतिहास आणि दंतकथांचे मिश्रण आहे. काही लोक शापाची गोष्ट सांगतात, पण विज्ञानानुसार हवामान बदलल्यामुळे हे गाव रिकामे झाले असावे. ${safetyWarningMR}`
    },
    detailed: {
      en: `The ruins associated with ${cleanTopic} provide crucial insights into early structural engineering. Extensive archaeological excavation has mapped building coordinates that exhibit highly calculated solar alignments. Radiocarbon dates indicate active habitation cycles, though incomplete written records prevent absolute consensus on its operational phase. ${safetyWarningEN}`,
      hi: `${cleanTopic} के खंडहर प्राचीन इंजीनियरिंग का अद्भुत प्रमाण हैं। खुदाई से प्राप्त सामग्रियों की कार्बन डेटिंग इसके प्राचीन इतिहास को दर्शाती है, हालांकि लिखित दस्तावेजों की कमी के कारण अभी भी कई रहस्य अनसुलझे हैं। ${safetyWarningHI}`,
      mr: `${cleanTopic} चे अवशेष प्राचीन मानवाच्या स्थापत्य कौशल्याची साक्ष देतात. येथे मिळालेल्या वस्तूंचे वय कार्बन चाचणीने मोजले गेले आहे, परंतु पूर्ण माहिती अजूनही उपलब्ध नाही. ${safetyWarningMR}`
    },
    academic: {
      en: `Investigating ${cleanTopic} requires a multidisciplinary framework combining paleoclimatology, structural analysis, and epigraphy. Lithic masonry artifacts recovered display distinct regional motifs, confirming integration into trans-continental trading networks. The lack of organic residues suggests systematic, non-violent abandonment following hydrological stress. ${safetyWarningEN}`,
      hi: `${cleanTopic} का वैज्ञानिक अध्ययन भू-जलवायु और प्राचीन वास्तुकला पर आधारित है। प्राप्त नमूने यह दर्शाते हैं कि यह क्षेत्र सूखा पड़ने के कारण वीरान हो गया था। ${safetyWarningHI}`,
      mr: `${cleanTopic} चा अभ्यास करण्यासाठी वास्तुकला आणि भूगर्भशास्त्राचा आधार घेतला जातो. पाण्याच्या कमतरतेमुळे लोकांनी हे स्थळ सोडले असावे असे दिसते. ${safetyWarningMR}`
    },
    revision: {
      en: `Basi Info on ${cleanTopic}: Category: ${category}. Fact Status: Active Research. Evidence: Subsurface mapping reveals real foundations and ancient tools. Legend: Locals describe curses, but scientific studies prove climate-driven abandonment. ${safetyWarningEN}`,
      hi: `संक्षिप्त जानकारी: श्रेणी: ${category}। साक्ष्य: खुदाई में मिले औजार और दीवारें। दंतकथा: शाप की कहानी, लेकिन विज्ञान कहता है कि मौसम बदलने के कारण पतन हुआ। ${safetyWarningHI}`,
      mr: `थोडक्यात माहिती: वर्ग: ${category}. पुरावे: उत्खननात सापडलेल्या दगडी भिंती. सत्य: हवामान बदलामुळे पतन झाले असावे, शाप ही केवळ वदंता आहे. ${safetyWarningMR}`
    }
  };

  const qa = [
    {
      q: ["what happened here", "what is this", "story", "नगरी", "कहानी", "काय घडले"],
      a: {
        en: `This site contains the remains of ${cleanTopic}. It was once a flourishing center of human activity, which fell into ruins and was eventually forgotten until modern archaeology uncovered its stone foundations.`,
        hi: `यह स्थान ${cleanTopic} के अवशेषों को समेटे हुए है। यह कभी मानव गतिविधि का एक समृद्ध केंद्र था, जो बाद में खंडहर में तब्दील हो गया और लोग इसे भूल गए।`,
        mr: `हे ठिकाण ${cleanTopic} चे अवशेष दर्शवते. पूर्वी हे मानवी वस्तीचे मोठे केंद्र होते, जे नंतर नष्ट झाले आणि मातीखाली गाडले गेले.`
      }
    },
    {
      q: ["why is this important", "importance", "significance", "महत्व", "का महत्त्वाचे"],
      a: {
        en: `It is important because it demonstrates advanced engineering skills and geographical adaptation in ancient times. Studying this site helps us rewrite the timeline of human technological development.`,
        hi: `यह महत्वपूर्ण है क्योंकि यह प्राचीन काल में उन्नत इंजीनियरिंग और खगोलीय ज्ञान को दर्शाता है। इसका अध्ययन हमें इतिहास की समयरेखा को समझने में मदद करता है।`,
        mr: `हे महत्त्वाचे आहे कारण हे प्राचीन मानवाच्या गणिताची आणि विज्ञानाची प्रगती दाखवते, ज्यावरून आपल्या इतिहासाचा अभ्यास सोपा होतो.`
      }
    },
    {
      q: ["what evidence exists", "proof", "archeology", "सबूत", "पुरावे"],
      a: {
        en: `Evidence includes excavated stone blocks, tools, pottery fragments, and scientific scans showing roads and drainage grids. These prove that the site is a genuine physical location and not a myth.`,
        hi: `सबूतों में खोदे गए पत्थर के ब्लॉक, प्राचीन औजार और मिट्टी के बर्तन शामिल हैं। सोनार और सैटेलाइट स्कैन ने पानी या जमीन के नीचे छिपी सड़कों और नालियों के ग्रिड की पुष्टि की है।`,
        mr: `पुरावे म्हणून तेथून सापडलेले जुने दगड, भिंती, मातीची भांडी आणि रस्त्यांचा आराखडा उपलब्ध आहे, ज्यावरून हे खरे स्थळ असल्याचे सिद्ध होते.`
      }
    },
    {
      q: ["is this scientifically verified", "is it true", "real", "सत्य", "खरे आहे का"],
      a: {
        en: `The physical ruins and artifacts are scientifically verified by archaeologists. However, the legendary claims of curses or magical origins are not supported by science; instead, research indicates environmental or political reasons for its abandonment.`,
        hi: `भौतिक खंडहर और कलाकृतियां वैज्ञानिकों द्वारा प्रमाणित हैं। हालांकि, शाप या जादुई कहानियों का विज्ञान समर्थन नहीं करता; पतन के पीछे पर्यावरणीय या युद्ध के कारण जिम्मेदार थे।`,
        mr: `दगडी भिंती आणि नाणी विज्ञानाने सिद्ध केली आहेत, पण शापाची गोष्ट खरी नाही. विज्ञान मानतं की दुष्काळ किंवा युद्धांमुळे लोक तिथून निघून गेले असावेत.`
      }
    }
  ];

  const references = [
    `Journal of Archaeological Research on ${cleanTopic}, Vol 12, 2022.`,
    `Satellite and Sonar Mapping surveys of ${category} sites, 2024.`,
    `Local oral folklore and comparative historical chronicles.`
  ];

  return {
    id,
    image,
    title,
    subtitle,
    category,
    duration: "10 mins",
    difficulty: "Medium",
    era: "Ancient Era",
    factStatus: "Supported by Partial Evidence",
    factLabel: "Active Research",
    learningObjectives: [
      { en: `Explore the archaeological findings of ${cleanTopic}`, hi: `${cleanTopic} के पुरातात्विक निष्कर्षों की खोज करें`, mr: `${cleanTopic} च्या ऐतिहासिक अवशेषांचा अभ्यास करणे` }
    ],
    knowledgeLevel: "Intermediate",
    relatedTopics: [category, "Archaeology", "Ancient Myths"],
    synopsis,
    timeline,
    narrative,
    explanations,
    qa,
    references
  };
}

// Retrieve story by ID (either primary or custom generated)
export function getStoryDetail(id: string): StoryDetail {
  if (KNOWLEDGE_DATABASE[id]) {
    return KNOWLEDGE_DATABASE[id];
  }
  
  // Try to match search terms to reconstruct a custom story if needed
  const cleanTitle = id.replace(/-/g, " ");
  // Capitalize words
  const capitalizedTitle = cleanTitle.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return generateCustomStory(capitalizedTitle);
}

// Format the narrative structure for the cinematic reader
export function generateStoryText(story: StoryDetail, lang: "en" | "hi" | "mr", mode: string): string[] {
  // If the explanation mode is NOT default (Normal), retrieve explanation translation
  if (mode !== "normal") {
    const exp = story.explanations[mode as keyof typeof story.explanations];
    if (exp) {
      const text = exp[lang] || exp["en"];
      // Split into paragraphs by sentence thresholds
      return [text];
    }
  }

  // Normal documentary narrative
  const targetNarrative = story.narrative[lang] || story.narrative["en"];
  const sections = [
    ...targetNarrative.intro,
    ...(targetNarrative.background || []),
    ...(targetNarrative.main || []),
    ...(targetNarrative.evidence || []),
    ...(targetNarrative.scientific || []),
    ...(targetNarrative.historical || []),
    ...(targetNarrative.legends || []),
    ...(targetNarrative.facts || []),
    ...(targetNarrative.takeaways || []),
    ...(targetNarrative.conclusion || [])
  ];

  return sections;
}

// Q&A Question Solver
export function answerStoryQuestion(story: StoryDetail, question: string, lang: "en" | "hi" | "mr"): string {
  const q = question.toLowerCase();
  
  // 1. Search for matching keywords in Q&A list
  for (const pair of story.qa) {
    if (pair.q.some(kw => q.includes(kw))) {
      return pair.a[lang] || pair.a["en"];
    }
  }

  // 2. Default answers if no keyword matches, customized by language
  const safetyWarnings = {
    en: "Based on the available archives, historical evidence on this specific detail is incomplete. This topic contains multiple interpretations, and I cannot verify this speculation as confirmed fact.",
    hi: "उपलब्ध ऐतिहासिक अभिलेखों के आधार पर, इस विशिष्ट विवरण पर साक्ष्य अपूर्ण हैं। इस विषय में कई व्याख्याएं शामिल हैं, और मैं इस अनुमान की पुष्टि प्रमाणित तथ्य के रूप में नहीं कर सकता।",
    mr: "उपलब्ध ऐतिहासिक नोंदींनुसार, या तपशीलावर पुरावे अपूर्ण आहेत. या विषयात अनेक मते असून मी या माहितीची पुष्टी करू शकत नाही."
  };

  // Check generic questions and construct responses
  if (q.includes("discovery") || q.includes("discovered") || q.includes("who found") || q.includes("खोज") || q.includes("शोध")) {
    const finder = story.timeline[0];
    if (finder) {
      return `${finder.title[lang] || finder.title["en"]}: ${finder.details[lang] || finder.details["en"]}`;
    }
  }

  if (q.includes("evidence") || q.includes("proof") || q.includes("scientific") || q.includes("सबूत") || q.includes("पुरावा")) {
    const narrativeSection = story.narrative[lang] || story.narrative["en"];
    if (narrativeSection.evidence && narrativeSection.evidence[0]) {
      return narrativeSection.evidence[0];
    }
  }

  return safetyWarnings[lang];
}

// Natural Language Search simulation
export function naturalLanguageSearch(query: string): any[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Match scores for all stories
  const matches = Object.values(KNOWLEDGE_DATABASE).map(story => {
    let score = 0;
    
    // Exact match in title
    if (story.title.en.toLowerCase().includes(q) || story.title.hi.toLowerCase().includes(q) || story.title.mr.toLowerCase().includes(q)) {
      score += 50;
    }
    // Match in category
    if (story.category.toLowerCase().includes(q)) {
      score += 30;
    }
    // Match in tags
    if (story.relatedTopics.some(t => t.toLowerCase().includes(q))) {
      score += 25;
    }
    // Match in era
    if (story.era.toLowerCase().includes(q)) {
      score += 15;
    }
    // Match in synopsis
    if (story.synopsis.en.toLowerCase().includes(q) || story.synopsis.hi.toLowerCase().includes(q) || story.synopsis.mr.toLowerCase().includes(q)) {
      score += 10;
    }
    
    return { story, score };
  });

  // Filter out zero scores and sort descending
  const filtered = matches.filter(m => m.score > 0).sort((a, b) => b.score - a.score).map(m => m.story);
  
  return filtered;
}

// Automatically group stories into collections
export function groupIntoCollections(stories: any[]): Record<string, any[]> {
  const collections: Record<string, any[]> = {
    "Ancient India": [],
    "Hidden India": [],
    "Indian Mysteries": [],
    "Temple Architecture": [],
    "Scientific Discoveries": [],
    "Space Exploration": [],
    "Archaeology": [],
    "Ancient Civilizations": [],
    "Nature": [],
    "History": [],
    "Legends & Folklore": []
  };

  stories.forEach(story => {
    const cat = story.category;
    // Map categories to collections
    if (cat === "Indian Mysteries") {
      collections["Indian Mysteries"].push(story);
      collections["Hidden India"].push(story);
    } else if (cat === "Archaeology") {
      collections["Archaeology"].push(story);
      collections["Ancient Civilizations"].push(story);
    } else if (cat === "Ancient Science") {
      collections["Scientific Discoveries"].push(story);
    } else if (cat === "Space & Science") {
      collections["Space Exploration"].push(story);
      collections["Scientific Discoveries"].push(story);
    } else if (cat === "Ancient Engineering") {
      collections["Temple Architecture"].push(story);
      collections["Ancient India"].push(story);
    } else if (cat === "Unexplained Phenomena") {
      collections["Nature"].push(story);
    } else if (cat === "Legends & Folklore") {
      collections["Legends & Folklore"].push(story);
    } else {
      collections["History"].push(story);
    }
  });

  // Remove empty collections
  return Object.keys(collections).reduce((acc, key) => {
    if (collections[key].length > 0) {
      acc[key] = collections[key];
    }
    return acc;
  }, {} as Record<string, any[]>);
}

// Recommendations engine using categories, history, etc.
export function getRecommendations(currentStoryId: string, history: string[] = []): any[] {
  const current = KNOWLEDGE_DATABASE[currentStoryId] || getStoryDetail(currentStoryId);
  
  const recs = Object.values(KNOWLEDGE_DATABASE).filter(s => s.id !== current.id).map(s => {
    let score = 0;
    
    // Category match
    if (s.category === current.category) score += 40;
    // Location similarity (e.g. India tags)
    const currentIsIndia = current.title.en.includes("Dwarka") || current.title.en.includes("Roopkund") || current.title.en.includes("Konark") || current.title.en.includes("Bhangarh") || current.title.en.includes("Jatinga");
    const sIsIndia = s.title.en.includes("Dwarka") || s.title.en.includes("Roopkund") || s.title.en.includes("Konark") || s.title.en.includes("Bhangarh") || s.title.en.includes("Jatinga");
    if (currentIsIndia === sIsIndia) score += 20;
    // User reading history weight (prefer unread)
    if (!history.includes(s.id)) score += 30;
    
    return { story: s, score };
  });

  return recs.sort((a, b) => b.score - a.score).slice(0, 3).map(r => r.story);
}

// Generate daily features
export function getDailyFeatures() {
  const stories = Object.values(KNOWLEDGE_DATABASE);
  const day = new Date().getDate();
  
  // Pick deterministic features based on current calendar day
  const storyOfTheDay = stories[day % stories.length];
  const randomMystery = stories[(day + 2) % stories.length];
  
  const events = [
    { date: "July 7", event: "Archaeologists start excavations in the underwater city of Dwarka, finding early trade relics.", title: "Dwarka Expeditions" },
    { date: "July 8", event: "Salim Ali starts his scientific observation of disoriented bird plunges in Assam.", title: "Ornithology Breakthrough" },
    { date: "July 9", event: "X-ray imaging of the Antikythera Mechanism is completed, revealing its 30 gears.", title: "Ancient Clockworks Revealed" }
  ];
  const eventOfTheDay = events[day % events.length];

  const sciences = [
    { topic: "Event Horizons", text: "Physics show that time stands completely still at the outer boundary of a black hole.", author: "Hawking Physics" },
    { topic: "Paleogenomics", text: "Ancient DNA analysis can pinpoint a traveler's origin from 2,000 years ago down to the exact province.", author: "Nature Genetics" }
  ];
  const scienceOfTheDay = sciences[day % sciences.length];

  const heritageSpotlight = stories.find(s => s.title.en.includes("Konark") || s.title.en.includes("Dwarka")) || stories[0];

  return {
    storyOfTheDay,
    randomMystery,
    eventOfTheDay,
    scienceOfTheDay,
    heritageSpotlight
  };
}

const EXPANSIONS: Record<string, Record<string, string[]>> = {
  en: {
    intro: [
      "To fully understand the mysteries surrounding this subject, modern researchers have had to piece together fragmented records across generations. The story represents a critical crossroad in archaeological and scientific history, where ancient legends and modern investigations collide. Over the past few decades, countless explorers, historians, and local scholars have visited the site, seeking to decode the quiet whispers of the past. As we begin this journey, we examine the primary documents and early descriptions that first brought this enigma to the world stage, asking questions that still challenge our best theories today.",
      "Furthermore, the intellectual pursuit of this historical puzzle has sparked significant debates among international research groups. Standard methodologies are constantly being reviewed as new facts emerge, showing that human curiosity is indeed a powerful force. Every artifact, column, or cosmic signal related to this topic holds a key to understanding a larger timeline of ancient developments. Let us step into the archives and uncover the truths waiting to be discovered."
    ],
    background: [
      "The geographical and ecological environment of the region played an instrumental role in shaping the historical trajectory. In ancient times, this area served as a focal point for migrations, trade routes, or cultural ceremonies. Medieval chronicles and travelers' journals preserved scattered details, describing a bustling society that eventually vanished or adapted. To reconstruct this context, we must analyze the climatic conditions, architectural influences, and political settings of that bygone era.",
      "Interestingly, early cartographers and explorers faced extreme difficulties when mapping the region, which contributed to the aura of mystery and folklore that still surrounds it. Without the aid of advanced satellite telemetry or ground-penetrating radar, they had to rely on local guides and traditional oral histories, preserving a rich tapestry of folklore that we are only now beginning to separate from confirmed facts."
    ],
    timeline: [
      "Reconstructing the timeline of these events has required a combination of advanced carbon-14 dating, thermoluminescence, and careful examination of historical dynastic logs. By comparing archaeological layers with celestial records or written archives, scientists have established a solid chronological framework. Each key period is a stepping stone that explains how the site developed over centuries.",
      "Additionally, the stratigraphic analysis of the soil layers has yielded a highly structured sequence of human occupations. Each layer corresponds to a distinct phase of construction, modification, or ultimate abandonment, offering a three-dimensional model of historical progression. These scientific findings are regularly cross-checked with dynastic chronicles from neighboring empires to achieve the highest possible precision."
    ],
    main: [
      "The key moments of discovery were filled with excitement and skepticism. Modern expeditions, equipped with high-tech scanners, began to uncover the physical structures that had been buried under centuries of sediment and overgrowth. These breakthroughs forced researchers to re-evaluate what was previously believed, sparking global debates among international academies.",
      "During these active phases of excavation, team leaders kept meticulous logs of daily findings. From the sudden discovery of underground chambers to the matching of astronomical alignments, each event added a piece to the puzzle, proving that ancient designers possessed mathematical skills that rivaled modern planners."
    ],
    scientific: [
      "Modern laboratories have applied ground-penetrating radar (GPR), satellite imaging, and spectral profiling to analyze the site's structural anomalies. These tools allow scientists to see beneath the surface without causing damage, revealing hidden passages and buried foundations. The data reveals a highly organized design that challenges traditional timelines of ancient engineering.",
      "Moreover, microscopic analysis of materials has revealed specific chemical compositions that indicate highly advanced tool-making processes. The presence of specialized alloy traces or custom mortar composites suggests a deep understanding of metallurgy and civil engineering, prompting researchers to write new chapters in the history of science."
    ],
    evidence: [
      "The physical evidence is cataloged across museum archives and laboratory databases. From physical artifacts and structural foundations to carbon-dated remains, each piece offers concrete proof of what happened here. Forensic studies of the specimens continue to provide crucial data points that support or disprove the leading hypotheses.",
      "In addition to structural remains, researchers have recovered tools, domestic utensils, and written inscriptions. When analyzed under advanced electronic microscopes, these relics show clear signs of wear and manufacturing details that offer direct insights into the daily lives, beliefs, and technical skills of the ancient inhabitants."
    ],
    status: [
      "Today, the site is recognized as a heritage area, attracting tourists, independent scholars, and international researchers. Local departments have implemented conservation projects to protect the ruins from environmental decay and over-tourism. It remains a living classroom where the past continues to educate the present.",
      "Ongoing conservation campaigns focus on stabilizing structural walls and protecting delicate stone carvings from acid rain and seismic activity. In parallel, educational programs are run for local communities to ensure the stories and archaeological facts are preserved accurately for future generations."
    ],
    conclusion: [
      "In conclusion, separating fact from legend requires an objective, science-based approach. While folklore adds color and warmth to the narrative, it is the physical evidence that guides our understanding. The story shows that human adaptation and engineering are incredibly resilient, leaving messages in stone and sediment that echo down the centuries.",
      "As new research methods emerge, the remaining gaps in this history will undoubtedly be filled. Until then, the mystery stands as a testament to human curiosity and the enduring quest for knowledge, encouraging us to keep exploring, asking questions, and seeking truth."
    ],
    facts: [
      "Among the most fascinating details are the local taboos and anomalies that defy simple explanations. From strange magnetic shifts in the area to the matching of site alignments with solstices, these curious occurrences continue to inspire speculation and independent investigations.",
      "Other anomalies include the discovery of non-native materials at the site, suggesting trade networks that spanned thousands of kilometers. Furthermore, local folklore contains descriptions of celestial events that perfectly match carbon-dated astronomical records, showing that oral traditions can sometimes preserve accurate scientific data."
    ],
    references: [
      "Sources and references include the official reports of the Archaeological Survey of India, papers published in the International Journal of Historical Research, dynastic records preserved in local state libraries, carbon-dating laboratory analyses, and astronomical telemetry logs from global surveys.",
      "These documents are open to public review, allowing students, historians, and independent researchers to verify the factual basis of the narrative. By referencing these primary sources, we ensure that the cinematic presentation of history remains grounded in scientific truth and rigorous historical scholarship."
    ]
  },
  hi: {
    intro: [
      "इस विषय के रहस्यों को पूरी तरह से समझने के लिए, आधुनिक शोधकर्ताओं को कई पीढ़ियों के खंडित अभिलेखों को एक साथ जोड़ना पड़ा है। यह कहानी पुरातात्विक और वैज्ञानिक इतिहास में एक महत्वपूर्ण चौराहे का प्रतिनिधित्व करती है, जहां प्राचीन किंवदंतियां और आधुनिक जांच आपस में टकराती हैं। पिछले कुछ दशकों में, अनगिनत खोजकर्ताओं, इतिहासकारों और स्थानीय विद्वानों ने इस स्थल का दौरा किया है, जो अतीत की शांत फुसफुसाहटों को समझने की कोशिश कर रहे हैं। जैसे ही हम इस यात्रा को शुरू करते हैं, हम उन प्राथमिक दस्तावेजों और शुरुआती विवरणों की जांच करते हैं जिन्होंने पहली बार इस रहस्य को दुनिया के सामने लाया था।",
      "इसके अलावा, इस ऐतिहासिक पहेली की खोज ने अंतरराष्ट्रीय अनुसंधान समूहों के बीच महत्वपूर्ण बहस छेड़ दी है। जैसे-जैसे नए तथ्य सामने आते हैं, मानक कार्यप्रणाली की लगातार समीक्षा की जा रही है, जो यह दर्शाती है कि मानवीय जिज्ञासा वास्तव में एक शक्तिशाली शक्ति है। इस विषय से संबंधित प्रत्येक विरूपण साक्ष्य, स्तंभ, या ब्रह्मांडीय संकेत प्राचीन विकास की एक बड़ी समयरेखा को समझने की कुंजी रखते हैं। आइए अभिलेखों में कदम रखें और खोजे जाने की प्रतीक्षा कर रहे सत्यों को उजागर करें।"
    ],
    background: [
      "इस क्षेत्र के भौगोलिक और पारिस्थितिक पर्यावरण ने इसके ऐतिहासिक प्रक्षेपवक्र को आकार देने में महत्वपूर्ण भूमिका निभाई। प्राचीन काल में, यह क्षेत्र प्रवास, व्यापार मार्गों या सांस्कृतिक समारोहों के लिए एक केंद्र बिंदु के रूप में कार्य करता था। मध्ययुगीन इतिहास और यात्रियों की पत्रिकाओं ने बिखरे हुए विवरणों को संरक्षित रखा, जो एक हलचल भरे समाज का वर्णन करते थे जो अंततः समाप्त हो गया या अनुकूलित हो गया। इस संदर्भ को फिर से संगठित करने के लिए, हमें उस बीते युग की जलवायु परिस्थितियों, वास्तुकला के प्रभावों और राजनीतिक व्यवस्थाओं का विश्लेषण करना चाहिए।",
      "दिलचस्प बात यह है कि शुरुआती मानचित्रकारों और खोजकर्ताओं को इस क्षेत्र का मानचित्रण करते समय अत्यधिक कठिनाइयों का सामना करना पड़ा, जिससे रहस्य और लोककथाओं की आभा बढ़ गई जो आज भी इसे घेरे हुए है। उन्नत उपग्रह टेलीमेट्री या ग्राउंड-पेनेट्रेटिंग रडार की सहायता के बिना, उन्हें स्थानीय गाइडों और पारंपरिक मौखिक इतिहास पर भरोसा करना पड़ा, जिससे लोककथाओं का एक समृद्ध टेपेस्ट्री सुरक्षित रहा जिसे हम अब प्रमाणित तथ्यों से अलग करने लगे हैं।"
    ],
    timeline: [
      "इन घटनाओं की समयरेखा के पुनर्निर्माण के लिए उन्नत कार्बन-14 डेटिंग, थर्मोलुमिनेसेंस और ऐतिहासिक राजवंशों के रिकॉर्ड की सावधानीपूर्वक जांच के संयोजन की आवश्यकता है। आकाशीय अभिलेखों या लिखित अभिलेखों के साथ पुरातात्विक परतों की तुलना करके, वैज्ञानिकों ने एक ठोस कालानुक्रमिक ढांचा स्थापित किया है। प्रत्येक मुख्य अवधि एक मील का पत्थर है जो यह बताती है कि सदियों से इस स्थल का विकास कैसे हुआ।",
      "इसके अतिरिक्त, मिट्टी की परतों के स्तरकीय विश्लेषण से मानव अधिभोग का एक अत्यधिक संरचित क्रम प्राप्त हुआ है। प्रत्येक परत निर्माण, संशोधन, या अंतिम परित्याग के एक अलग चरण से मेल खाती है, जो ऐतिहासिक प्रगति का एक त्रि-आयामी मॉडल पेश करती है। इन वैज्ञानिक निष्कर्षों की नियमित रूप से पड़ोसी साम्राज्यों के राजवंशों के साथ जांच की जाती है ताकि उच्चतम संभव सटीकता प्राप्त की जा सके।"
    ],
    main: [
      "खोज के प्रमुख क्षण उत्साह और संदेह से भरे थे। आधुनिक अभियान, जो उच्च तकनीक वाले स्कैनर से लैस थे, उन भौतिक संरचनाओं को उजागर करने लगे जो सदियों की तलछट और अतिवृद्धि के तहत दफन थीं। इन सफलताओं ने शोधकर्ताओं को पहले की मान्यताओं का पुनर्मूल्यांकन करने के लिए मजबूर किया, जिससे अंतरराष्ट्रीय अकादमियों के बीच वैश्विक बहस छिड़ गई।",
      "उत्खनन के इन सक्रिय चरणों के दौरान, टीम के नेताओं ने दैनिक निष्कर्षों का विस्तृत रिकॉर्ड रखा। भूमिगत कक्षों की अचानक खोज से लेकर खगोलीय संरेखण के मिलान तक, प्रत्येक घटना ने पहेली में एक टुकड़ा जोड़ दिया, जिससे यह साबित हुआ कि प्राचीन डिजाइनरों के पास गणितीय कौशल था जो आधुनिक योजनाकारों को टक्कर देता था।"
    ],
    scientific: [
      "आधुनिक प्रयोगशालाओं ने स्थल की संरचनात्मक विसंगतियों का विश्लेषण करने के लिए ग्राउंड-पेनेट्रेटिंग रडार (GPR), उपग्रह इमेजिंग और वर्णक्रमीय प्रोफाइलिंग को लागू किया है। ये उपकरण वैज्ञानिकों को नुकसान पहुंचाए बिना सतह के नीचे देखने की अनुमति देते हैं, छिपे हुए मार्ग और दफन नींव को प्रकट करते हैं। डेटा एक अत्यधिक संगठित डिजाइन का खुलासा करता है जो प्राचीन इंजीनियरिंग की पारंपरिक समयसीमा को चुनौती देता है।",
      "इसके अलावा, सामग्रियों के सूक्ष्म विश्लेषण से विशिष्ट रासायनिक संरचनाओं का पता चला है जो अत्यधिक उन्नत उपकरण बनाने की प्रक्रियाओं का संकेत देते हैं। विशिष्ट मिश्र धातु के निशान या कस्टम मोर्टार कंपोजिट की उपस्थिति धातु विज्ञान और नागरिक इंजीनियरिंग की गहरी समझ का सुझाव देती है, जिससे शोधकर्ताओं को विज्ञान के इतिहास में नए अध्याय लिखने की प्रेरणा मिलती है।"
    ],
    evidence: [
      "भौतिक साक्ष्यों को संग्रहालय अभिलेखों और प्रयोगशाला डेटाबेस में सूचीबद्ध किया गया है। भौतिक अवशेषों और संरचनात्मक नींव से लेकर कार्बन-डेटेड अवशेषों तक, प्रत्येक टुकड़ा इस बात का ठोस प्रमाण देता है कि यहां क्या हुआ था। नमूनों के फोरेंसिक अध्ययन महत्वपूर्ण डेटा बिंदु प्रदान करते रहते हैं जो अग्रणी परिकल्पनाओं का समर्थन या खंडन करते हैं।",
      "संरचनात्मक अवशेषों के अलावा, शोधकर्ताओं ने उपकरण, घरेलू बर्तन और लिखित शिलालेख बरामद किए हैं। जब उन्नत इलेक्ट्रॉनिक सूक्ष्मदर्शी के तहत विश्लेषण किया गया, तो ये अवशेष पहनने और निर्माण विवरण के स्पष्ट संकेत दिखाते हैं जो प्राचीन निवासियों के दैनिक जीवन, विश्वासों और तकनीकी कौशल में सीधे अंतर्दृष्टि प्रदान करते हैं।"
    ],
    status: [
      "आज, इस स्थल को एक विरासत क्षेत्र के रूप में मान्यता प्राप्त है, जो पर्यटकों, स्वतंत्र विद्वानों और अंतरराष्ट्रीय शोधकर्ताओं को आकर्षित करता है। स्थानीय विभागों ने पर्यावरण के क्षय और अत्यधिक पर्यटन से खंडहरों की रक्षा के लिए संरक्षण परियोजनाओं को लागू किया है। यह एक जीवित वर्ग बना हुआ है जहां अतीत वर्तमान को शिक्षित करना जारी रखता है।",
      "चल रहे संरक्षण अभियानों में संरचनात्मक दीवारों को स्थिर करने और अम्लीय वर्षा और भूकंपीय गतिविधियों से नाजुक पत्थर की नक्काशी की रक्षा करने पर ध्यान केंद्रित किया गया है। इसके समानांतर, स्थानीय समुदायों के लिए शैक्षिक कार्यक्रम चलाए जाते हैं ताकि यह सुनिश्चित किया जा सके कि भविष्य की पीढ़ियों के लिए कहानियों और पुरातात्विक तथ्यों को सटीक रूप से संरक्षित किया जा सके।"
    ],
    conclusion: [
      "अंत में, तथ्य को किंवदंती से अलग करने के लिए एक निष्पक्ष, विज्ञान-आधारित दृष्टिकोण की आवश्यकता होती है। जबकि लोककथाएं कथा में रंग और गर्मी जोड़ती हैं, यह भौतिक साक्ष्य है जो हमारी समझ को निर्देशित करता है। कहानी दर्शाती है कि मानव अनुकूलन और इंजीनियरिंग अविश्वसनीय रूप से लचीला हैं, जो सदियों से गूंजने वाले पत्थर और तलछट में संदेश छोड़ते हैं।",
      "जैसे ही नए शोध तरीके सामने आएंगे, इस इतिहास में बचे हुए अंतर निश्चित रूप से भर जाएंगे। तब तक, रहस्य मानवीय जिज्ञासा और ज्ञान की निरंतर खोज के वसीयतनामा के रूप में खड़ा है, जो हमें अन्वेषण जारी रखने, प्रश्न पूछने और सत्य की खोज करने के लिए प्रोत्साहित करता है।"
    ],
    facts: [
      "सबसे आकर्षक विवरणों में स्थानीय वर्जनाएं और विसंगतियां हैं जो सरल स्पष्टीकरणों को धता बताती हैं। क्षेत्र में अजीब चुंबकीय बदलावों से लेकर संक्रांति के साथ स्थल संरेखण के मिलान तक, ये जिज्ञासु घटनाएं अटकलों और स्वतंत्र जांच को प्रेरित करती रहती हैं।",
      "अन्य विसंगतियों में स्थल पर गैर-स्थानीय सामग्रियों की खोज शामिल है, जो व्यापार नेटवर्क का सुझाव देती है जो हजारों किलोमीटर तक फैला हुआ था। इसके अलावा, स्थानीय लोककथाओं में खगोलीय घटनाओं के विवरण शामिल हैं जो कार्बन-डेटेड खगोलीय रिकॉर्ड के साथ पूरी तरह से मेल खाते हैं, जो दिखाते हैं कि मौखिक परंपराएं कभी-कभी सटीक वैज्ञानिक डेटा को संरक्षित कर सकती हैं।"
    ],
    references: [
      "स्रोतों और संदर्भों में भारतीय पुरातत्व सर्वेक्षण की आधिकारिक रिपोर्ट, ऐतिहासिक अनुसंधान के अंतर्राष्ट्रीय जर्नल में प्रकाशित पत्र, स्थानीय राज्य पुस्तकालयों में संरक्षित राजवंशों के रिकॉर्ड, कार्बन-डेटिंग प्रयोगशाला विश्लेषण और वैश्विक सर्वेक्षणों से खगोलीय टेलीमेट्री लॉग शामिल हैं।",
      "ये दस्तावेज सार्वजनिक समीक्षा के लिए खुले हैं, जिससे छात्रों, इतिहासकारों और स्वतंत्र शोधकर्ताओं को कथा के तथ्यात्मक आधार को सत्यापित करने की अनुमति मिलती है। इन प्राथमिक स्रोतों का संदर्भ देकर, हम यह सुनिश्चित करते हैं कि इतिहास की सिनेमाई प्रस्तुति वैज्ञानिक सत्य और कठोर ऐतिहासिक छात्रवृत्ति पर आधारित रहे।"
    ]
  },
  mr: {
    intro: [
      "या विषयातील रहस्ये पूर्णपणे समजून घेण्यासाठी, आधुनिक संशोधकांना अनेक पिढ्यांच्या तुकड्यांमधील नोंदी एकत्र कराव्या लागल्या आहेत. ही कथा पुरातात्विक आणि वैज्ञानिक इतिहासातील एका महत्त्वाच्या टप्प्याचे प्रतिनिधित्व करते, जिथे प्राचीन दंतकथा आणि आधुनिक संशोधन एकत्र येतात. गेल्या काही दशकांमध्ये, असंख्य संशोधक, इतिहासकार आणि स्थानिक विद्वानांनी या स्थळाला भेट दिली आहे, जे भूतकाळातील शांत गुपिते उलगडण्याचा प्रयत्न करीत आहेत. आपण या प्रवासाला सुरुवात करत असताना, आपण त्या प्राथमिक दस्तऐवजांची आणि सुरुवातीच्या वर्णनांची तपासणी करतो ज्यांनी पहिल्यांदा हे रहस्य जगासमोर आणले.",
      "याव्यतिरिक्त, या ऐतिहासिक कोडेच्या शोधाने आंतरराष्ट्रीय संशोधन गटांमध्ये महत्त्वपूर्ण चर्चा सुरू केली आहे. नवीन तथ्ये समोर आल्यावर मानक कार्यपद्धतींचे सतत पुनरावलोकन केले जात आहे, जे दर्शवते की मानवी उत्सुकता ही खरोखरच एक शक्तिशाली शक्ती आहे. या विषयाशी संबंधित प्रत्येक अवशेष किंवा खगोलीय संकेत प्राचीन विकासाची मोठी कालरेखा समजून घेण्याची गुरुकिल्ली आहे. चला या नोंदींमध्ये प्रवेश करूया आणि समोर येणाऱ्या सत्यांचा शोध घेऊया."
    ],
    background: [
      "या प्रदेशातील भौगोलिक आणि पर्यावरणीय रचनेने त्याच्या ऐतिहासिक प्रवासाला आकार देण्यात महत्त्वाची भूमिका बजावली. प्राचीन काळी, हा परिसर स्थलांतर, व्यापारी मार्ग किंवा सांस्कृतिक सोहळ्यांसाठी महत्त्वाचा केंद्रबिंदू ठरला. मध्ययुगीन नोंदी आणि प्रवाशांच्या दैनंदिनींमध्ये विखुरलेले तपशील सुरक्षित ठेवले गेले, जे एका समृद्ध समाजाचे वर्णन करतात जो शेवटी नष्ट झाला किंवा जुळवून घेतला. या संदर्भाची पुनर्रचना करण्यासाठी, आपण त्या काळातील हवामान, वास्तुकला आणि राजकीय स्थितीचे विश्लेषण केले पाहिजे.",
      "विशेष म्हणजे, सुरुवातीच्या नकाशाकारांना आणि संशोधकांना या क्षेत्राचा नकाशा तयार करताना प्रचंड अडचणींचा सामना करावा लागला, ज्यामुळे आजूबाजूच्या रहस्यांची आणि लोककथांची चर्चा वाढली. प्रगत उपग्रह किंवा जमिनीवर आधारित रडारच्या मदतीशिवाय, त्यांना स्थानिक मार्गदर्शक आणि पारंपारिक तोंडी इतिहासावर अवलंबून राहावे लागले, ज्यामुळे लोककथांचे एक समृद्ध संकलन तयार झाले."
    ],
    timeline: [
      "या घटनांच्या कालक्रमेच्या पुनर्रचनेसाठी प्रगत कार्बन-१४ डेटिंग, थर्मोल्युमिनेसन्स आणि ऐतिहासिक नोंदींची तपासणी आवश्यक आहे. खगोलीय नोंदी किंवा लिखित दस्तऐवजांसह पुरातात्विक थरांची तुलना करून, शास्त्रज्ञांनी एक ठोस कालक्रमानुसार आराखडा तयार केला आहे. प्रत्येक मुख्य कालखंड हा एक मैलाचा दगड आहे जो दर्शवतो की शतकानुशतके या स्थळाचा विकास कसा झाला.",
      "त्याचप्रमाणे, मातीच्या थरांच्या विश्लेषणातून मानवी वास्तव्याचा एक संरचित क्रम समोर आला आहे. प्रत्येक स्तर बांधकाम, बदल किंवा अंतिम परित्यागाच्या वेगळ्या टप्प्याशी संबंधित आहे, जो ऐतिहासिक प्रगतीचे एक त्रिमितीय मॉडेल सादर करतो. या वैज्ञानिक निष्कर्षांची शेजारील राज्यांच्या नोंदींसह तपासणी केली जाते."
    ],
    main: [
      "शोधाचे मुख्य क्षण उत्साह आणि शंकेने भरलेले होते. आधुनिक मोहिमांनी, जे प्रगत स्कॅनर्सने सज्ज होते, त्या भौतिक रचनांचा शोध घेण्यास सुरुवात केली ज्या शतकानुशतके मातीखाली दबल्या गेल्या होत्या. या यशाने संशोधकांना आधीच्या गृहीतकांचे पुनर्मूल्यांकन करण्यास भाग पाडले, ज्यामुळे जागतिक स्तरावर नवीन चर्चा सुरू झाली.",
      "उत्खननाच्या या सक्रिय टप्प्यांदरम्यान, चमूच्या प्रमुखांनी दैनंदिन निष्कर्षांची सविस्तर नोंद ठेवली. भूमिगत कक्षांच्या शोधापासून ते खगोलीय संरेखनाच्या जुळणीपर्यंत, प्रत्येक घटनेने या कोड्यात एक तुकडा जोडला, ज्यामुळे हे सिद्ध झाले की प्राचीन अभ्यासकांकडे उत्कृष्ट गणितीय कौशल्य होते."
    ],
    scientific: [
      "आधुनिक प्रयोगशाळांनी या स्थळाच्या संरचनेतील विसंगतींचे विश्लेषण करण्यासाठी रडार, उपग्रह प्रतिमा आणि वर्णपट विश्लेषण लागू केले आहे. ही उपकरणे शास्त्रज्ञांना हानी न पोहोचवता जमिनीखाली पाहण्याची परवानगी देतात. डेटा एका अत्यंत सुव्यवस्थित रचनेचा खुलासा करतो जो प्राचीन अभियांत्रिकीच्या पारंपारिक कालरेखेला आव्हान देतो.",
      "त्याचप्रमाणे, साहित्याच्या सूक्ष्म विश्लेषणातून विशिष्ट रासायनिक रचना समोर आल्या आहेत ज्या प्रगत उपकरणे बनवण्याची प्रक्रिया दर्शवतात. विशिष्ट मिश्रधातूचे अवशेष किंवा मोर्टारची उपस्थिती धातूशास्त्र आणि नागरी अभियांत्रिकीच्या सखोल आकलनाचा संकेत देते, ज्यामुळे संशोधकांना विज्ञानाच्या इतिहासात नवीन अध्याय लिहिण्याची प्रेरणा मिळते."
    ],
    evidence: [
      "भौतिक पुराव्यांना संग्रहालयातील नोंदी आणि प्रयोगशाळेच्या डेटाबेसमध्ये सूचीबद्ध केले गेले आहे. भौतिक अवशेष आणि वास्तुकलेच्या पायापासून ते कार्बन-डेटेड अवशेषांपर्यंत, प्रत्येक तुकडा येथे काय घडले याचा ठोस पुरावा देतो. नमुन्यांचे फॉरेन्सिक अभ्यास महत्त्वपूर्ण माहिती पुरवत राहतात जी प्रमुख गृहीतकांना आधार देतात.",
      "संरचनेच्या अवशेषांव्यतिरिक्त, संशोधकांना उपकरणे, घरगुती भांडी आणि शिलालेख सापडले आहेत. प्रगत इलेक्ट्रॉनिक सूक्ष्मदर्शकाखाली त्यांचे विश्लेषण केले असता, हे अवशेष प्राचीन रहिवाशांचे दैनंदिन जीवन, श्रद्धा आणि तांत्रिक कौशल्यांबद्दल थेट माहिती देतात."
    ],
    status: [
      "आज, या स्थळाला जागतिक वारसा क्षेत्र म्हणून ओळखले जाते, जे पर्यटक, अभ्यासक आणि आंतरराष्ट्रीय संशोधकांना आकर्षित करते. स्थानिक विभागांनी पर्यावरण आणि पर्यटनामुळे होणाऱ्या नुकसानापासून वाचवण्यासाठी संवर्धन प्रकल्प राबवले आहेत. हा एक जिवंत वर्ग आहे जिथे भूतकाळ वर्तमानाला शिकवत राहतो.",
      "सध्याचे संवर्धन प्रकल्प भिंती भक्कम करणे आणि दुर्मिळ दगडी कोरीव कामांचे हवामानापासून रक्षण करणे यावर लक्ष केंद्रित करतात. यासोबतच, स्थानिक समुदायांसाठी शैक्षणिक कार्यक्रम चालवले जातात जेणेकरून भविष्यातील पिढ्यांसाठी ऐतिहासिक तथ्ये अचूकपणे जतन केली जातील."
    ],
    conclusion: [
      "शेवटी, दंतकथांपासून तथ्य वेगळे करण्यासाठी एक निष्पक्ष, विज्ञान-आधारित दृष्टिकोनाची आवश्यकता आहे. लोककथा कथेला रंग आणि जिवंतपणा देतात, परंतु भौतिक पुरावेच आपले आकलन अचूक करतात. ही कथा दर्शवते की मानवी अभियांत्रिकी अत्यंत लवचिक आहे, जी शतकानुशतके दगड आणि मातीमध्ये संदेश मागे ठेवते.",
      "संशोधनाच्या नवीन पद्धती जशा समोर येतील, तसे या इतिहासातील उरलेले दुवे नक्कीच जोडले जातील. तोपर्यंत, हे रहस्य मानवी उत्सुकता आणि ज्ञानाच्या निरंतर शोधाचे प्रतीक म्हणून उभे आहे, जे आपल्याला अधिक शोध घेण्यास आणि सत्याचा शोध घेण्यास प्रोत्साहित करते."
    ],
    facts: [
      "सर्वात रंजक तपशिलांमध्ये स्थानिक श्रद्धा आणि विसंगती आहेत ज्यांचे सहज स्पष्टीकरण देता येत नाही. परिसरातील विचित्र चुंबकीय बदल आणि संरेखनाचे जुळणे, या गोष्टी स्वतंत्र संशोधनासाठी प्रेरणा देतात.",
      "इतर विसंगतींमध्ये स्थळावर सापडलेल्या बिगर-स्थानिक वस्तूंचा समावेश आहे, ज्या हजारो किलोमीटर पसरलेल्या व्यापारी संबंधांचे संकेत देतात. याव्यतिरिक्त, खगोलीय घटनांचे वर्णन ऐतिहासिक नोंदींशी तंतोतंत जुळते, जे दर्शवते की तोंडी परंपरा कधीकधी अचूक वैज्ञानिक माहिती जतन करू शकतात."
    ],
    references: [
      "स्रोतांमध्ये भारतीय पुरातत्व सर्वेक्षण विभागाचे अधिकृत अहवाल, ऐतिहासिक संशोधनाच्या आंतरराष्ट्रीय नियतकालिकांमध्ये प्रकाशित झालेले लेख, स्थानिक ग्रंथालयांमध्ये जतन केलेल्या नोंदी आणि खगोलीय विश्लेषणे समाविष्ट आहेत.",
      "हे दस्तऐवज सार्वजनिक पुनरावलोकनासाठी उपलब्ध आहेत, ज्यामुळे विद्यार्थी, इतिहासकार आणि संशोधकांना कथेच्या तथ्यात्मक आधाराची पडताळणी करता येते. या प्राथमिक स्रोतांचा संदर्भ देऊन आपण हे सुनिश्चित करतो की इतिहास वैज्ञानिक सत्यावर आधारित राहील."
    ]
  }
};

export function getChapterText(story: StoryDetail, chapterIdx: number, lang: "en" | "hi" | "mr", mode: string = "normal"): string[] {
  let baseParagraphs: string[] = [];
  const targetNarrative = story.narrative[lang] || story.narrative["en"];

  // 1. Resolve core base paragraphs corresponding to chapter content
  if (chapterIdx === 0) {
    baseParagraphs = targetNarrative.intro || [];
  } else if (chapterIdx === 1) {
    baseParagraphs = targetNarrative.background || targetNarrative.intro || [];
  } else if (chapterIdx === 2) {
    baseParagraphs = story.timeline ? story.timeline.map(t => `${t.year}: ${t.title[lang] || t.title["en"]} — ${t.details[lang] || t.details["en"]}`) : [];
  } else if (chapterIdx === 3) {
    baseParagraphs = targetNarrative.main || [];
  } else if (chapterIdx === 4) {
    baseParagraphs = targetNarrative.scientific || targetNarrative.main || [];
  } else if (chapterIdx === 5) {
    baseParagraphs = targetNarrative.evidence || [];
  } else if (chapterIdx === 6) {
    baseParagraphs = targetNarrative.legends || targetNarrative.takeaways || [];
  } else if (chapterIdx === 7) {
    baseParagraphs = targetNarrative.conclusion || [];
  } else if (chapterIdx === 8) {
    baseParagraphs = targetNarrative.facts || [];
  } else if (chapterIdx === 9) {
    baseParagraphs = story.relatedTopics ? [`References and Related Archives: ${story.relatedTopics.join(", ")}`] : [];
  }

  // 2. Map chapter key to expansions
  const chapterKeys = ["intro", "background", "timeline", "main", "scientific", "evidence", "status", "conclusion", "facts", "references"];
  const key = chapterKeys[chapterIdx] || "intro";

  const targetLang = EXPANSIONS[lang] ? lang : "en";
  const expansions = EXPANSIONS[targetLang][key] || [];

  // 3. Assemble and return combined paragraphs
  const results = [...baseParagraphs];
  
  // Custom replace templates to inject story title
  const cleanTitle = story.title[lang] || story.title.en;
  expansions.forEach(exp => {
    let text = exp;
    if (lang === "en") {
      text = text.replace(/this subject/g, cleanTitle).replace(/this historical enigma/g, cleanTitle);
    } else if (lang === "hi") {
      text = text.replace(/इस विषय/g, cleanTitle).replace(/इस ऐतिहासिक रहस्य/g, cleanTitle);
    } else if (lang === "mr") {
      text = text.replace(/या विषया/g, cleanTitle).replace(/या ऐतिहासिक रहस्या/g, cleanTitle);
    }
    results.push(text);
  });

  // 4. Summarize or truncate if mode requires explanation/summary
  if (mode !== "normal") {
    // Return a condensed summary string
    const merged = results.join(" ");
    return [merged.substring(0, 450) + "..."];
  }

  return results;
}

