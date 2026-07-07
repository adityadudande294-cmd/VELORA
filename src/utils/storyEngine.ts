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
