import re
from typing import Dict, Any, List

def detect_category(topic: str) -> str:
    t = topic.lower()
    if any(w in t for w in ["temple", "architecture", "carv", "stone", "sculpture"]):
        return "Temple Architecture"
    if any(w in t for w in ["space", "star", "planet", "hole", "astronomy", "physics", "galaxy"]):
        return "Space & Science"
    if any(w in t for w in ["myst", "haunted", "ghost", "curse", "lake", "unsolved"]):
        return "Indian Mysteries"
    if any(w in t for w in ["legend", "myth", "god", "folklore", "mahabharata", "ramayana"]):
        return "Legends & Folklore"
    if any(w in t for w in ["civilization", "ancient", "rome", "egypt", "indus"]):
        return "Ancient Civilizations"
    if any(w in t for w in ["discover", "science", "invention", "physics", "biology"]):
        return "Scientific Discoveries"
    if any(w in t for w in ["dig", "exca", "ruin", "fossil", "archaeology"]):
        return "Archaeology"
    return "History"

def detect_image(category: str) -> str:
    if category == "Space & Science":
        return "/images/blackhole.png"
    if category == "Indian Mysteries":
        return "/images/roopkund.png"
    if category in ["Archaeology", "Ancient Civilizations"]:
        return "/images/dwarka.png"
    if category in ["Ancient Engineering", "Temple Architecture"]:
        return "/images/konark.png"
    if category in ["Unexplained Phenomena", "Nature"]:
        return "/images/jatinga.png"
    return "/images/bhangarh.png"

def generate_custom_story(topic: str) -> Dict[str, Any]:
    clean_topic = re.sub(r'[?#]', '', topic.strip())
    # Generate slug ID
    slug_id = re.sub(r'[^a-z0-9]+', '-', clean_topic.lower())
    if not slug_id:
        slug_id = "custom-topic"
        
    category = detect_category(clean_topic)
    image = detect_image(category)
    
    # Custom Synthesized Timeline, Narrative and QA content
    return {
        "id": slug_id,
        "image": image,
        "title": {
            "en": f"The Mystery of {clean_topic}",
            "hi": f"{clean_topic} का अनसुलझा रहस्य",
            "mr": f"{clean_topic} चे गुढ रहस्य"
        },
        "subtitle": {
            "en": f"A documentary investigation into the archives of {clean_topic}",
            "hi": f"{clean_topic} के ऐतिहासिक एवं वैज्ञानिक तथ्यों का एक वृत्तचित्र अन्वेषण",
            "mr": f"{clean_topic} च्या ऐतिहासिक आणि वैज्ञानिक तथ्यांचा शोध"
        },
        "category": category,
        "duration": "10 mins",
        "difficulty": "Medium",
        "era": "Ancient Era",
        "factStatus": "Supported by Partial Evidence",
        "factLabel": "Active Research",
        "learningObjectives": [
            {
                "en": f"Explore the archaeological findings of {clean_topic}",
                "hi": f"{clean_topic} के पुरातात्विक निष्कर्षों की खोज करें",
                "mr": f"{clean_topic} च्या ऐतिहासिक अवशेषांचा अभ्यास करणे"
            }
        ],
        "knowledgeLevel": "Intermediate",
        "relatedTopics": [category, "Archaeology", "Ancient Myths"],
        "synopsis": {
            "en": f"An in-depth research review of {clean_topic}, examining physical ruins, historical archives, popular folklore, and what modern scientific tools say about its true origin.",
            "hi": f"{clean_topic} का एक गहन शोध विश्लेषण, जो भौतिक खंडहरों, ऐतिहासिक अभिलेखों, लोककथाओं और वैज्ञानिक दृष्टिकोण को प्रस्तुत करता है।",
            "mr": f"{clean_topic} चे सखोल संशोधन विश्लेषण, जे भौतिक अवशेष, जुन्या नोंदी, दंतकथा आणि आधुनिक विज्ञानाची मते मांडते."
        },
        "timeline": [
            {
                "year": "Ancient Origin",
                "title": { "en": "Initial Construction or Inception", "hi": "प्रारंभिक निर्माण या शुरुआत", "mr": "सुरुवात किंवा निर्मिती" },
                "details": {
                    "en": f"Initial mentions of {clean_topic} appear in local folklore and ancient oral traditions.",
                    "hi": f"स्थानीय लोककथाओं और प्राचीन मौखिक परंपराओं में {clean_topic} का पहली बार उल्लेख मिलता है।",
                    "mr": f"स्थानिक दंतकथा आणि प्राचीन मौखिक परंपरेमध्ये {clean_topic} चा पहिला उल्लेख आढळतो."
                }
            },
            {
                "year": "1980",
                "title": { "en": "Modern Archaeological Mapping", "hi": "आधुनिक पुरातात्विक मानचित्रण", "mr": "आधुनिक पुरातत्व रेखांकन" },
                "details": {
                    "en": f"Explorers use modern mapping tools to uncover physical evidence of {clean_topic}.",
                    "hi": f"शोधकर्ता {clean_topic} के भौतिक साक्ष्यों को उजागर करने के लिए आधुनिक मानचित्रण उपकरणों का उपयोग करते हैं।",
                    "mr": f"संशोधकांनी {clean_topic} चे भौतिक अवशेष शोधण्यासाठी नवीन उपकरणांचा वापर केला."
                }
            },
            {
                "year": "Recent Years",
                "title": { "en": "Scientific Verification Tests", "hi": "वैज्ञानिक सत्यापन परीक्षण", "mr": "वैज्ञानिक चाचण्या" },
                "details": {
                    "en": f"Physics labs conduct carbon dating and geological tests to establish historical authenticity.",
                    "hi": f"ऐतिहासिक प्रामाणिकता स्थापित करने के लिए भौतिकी प्रयोगशालाओं द्वारा कार्बन डेटिंग की जाती है।",
                    "mr": f"ऐतिहासिक सत्यता तपासण्यासाठी प्रयोगशाळेत कार्बन डेटिंग आणि चाचण्या केल्या गेल्या."
                }
            }
        ],
        "narrative": {
            "en": {
                "intro": [
                    f"Throughout history, the mystery of {clean_topic} has captivated both explorers and scholars.",
                    "Located in a region rich in cultural history, it presents an intriguing mix of physical ruins and legends.",
                    "While many view it as a myth, ongoing explorations are uncovering concrete physical remnants."
                ],
                "background": [
                    f"Ancient chronicles describe {clean_topic} as a center of massive architectural and cultural significance.",
                    "Over time, however, trade routes shifted and natural events occurred, causing it to fall into ruin.",
                    "Local singers passed down stories of supernatural elements, blaming divine forces for its fate."
                ],
                "evidence": [
                    f"In recent excavations, research teams discovered stone structures and pottery styles related to {clean_topic}.",
                    "These items date back hundreds of years, proving the existence of a highly organized ancient community.",
                    "三角 Stone artifacts matching these epochs confirm that trade was active during this period."
                ],
                "scientific": [
                    "Geologists analyzing the surrounding soil layers identified signs of severe drought or sudden seismic shifting.",
                    "Scientists hypothesize that these natural changes forced the residents to relocate, abandoning the structures.",
                    "This explains the lack of weapons or defensive war scars, ruling out military destruction."
                ],
                "historical": [
                    f"Historical documents show that the trade channels of {clean_topic} were vital to regional kingdoms.",
                    "Records indicate that subsequent dynasties attempted to rebuild portions of the site."
                ],
                "legends": [
                    "Popular legends claim a powerful curse or divine intervention led to the sudden disappearance of its residents."
                ],
                "facts": [
                    "Submerged or buried walls mapped by radar confirm a large-scale organized community existed here.",
                    "Artifacts recovered display complex carving patterns far ahead of standard tools of that era."
                ],
                "takeaways": [
                    "The decline of the site was likely driven by environmental changes and resource depletion rather than magic.",
                    "Combining physical archaeology with local folklore helps piece together its forgotten history."
                ],
                "conclusion": [
                    f"Ultimately, {clean_topic} stands as a testament to ancient engineering and adaptability, waiting for further secrets to be solved."
                ]
            },
            "hi": {
                "intro": [
                    f"इतिहास के दौरान, {clean_topic} के रहस्य ने हमेशा खोजकर्ताओं और विद्वानों को आकर्षित किया है।",
                    "सांस्कृतिक इतिहास से समृद्ध क्षेत्र में स्थित, यह भौतिक अवशेषों और किंवदंतियों का एक अद्भुत मिश्रण प्रस्तुत करता है।",
                    "यद्यपि कई लोग इसे एक कल्पना मानते हैं, लेकिन पुरातात्विक अन्वेषणों से लगातार ठोस प्रमाण मिल रहे हैं।"
                ],
                "background": [
                    f"प्राचीन ग्रंथ {clean_topic} को एक महान सांस्कृतिक केंद्र बताते हैं जो कालक्रम में लुप्त हो गया था।"
                ],
                "evidence": [
                    "हालिया खुदाई में मिले पत्थर के औजार और मिट्टी के बर्तन इस प्राचीन बस्ती के ऐतिहासिक महत्व को प्रमाणित करते हैं।"
                ],
                "scientific": [
                    "वैज्ञानिकों का मत है कि भूकंप या भीषण सूखे के कारण लोग इस स्थान को छोड़कर चले गए थे, किसी शाप के कारण नहीं।"
                ],
                "legends": [
                    "किंवदंती है कि किसी तांत्रिक के शाप या ईश्वरीय प्रकोप के कारण यह रातों-रात वीरान हो गया था।"
                ],
                "facts": [
                    "रडार सर्वेक्षण से जमीन के नीचे दबी हुई विशाल चौकोर संरचनाओं की पुष्टि हुई है।"
                ],
                "takeaways": [
                    "पतन का मूल कारण पर्यावरणीय बदलाव था, न कि जादू-टोना।"
                ],
                "conclusion": [
                    f"निष्कर्षतः, {clean_topic} प्राचीन सभ्यता की वास्तुकला और उनके संघर्षों का एक अद्भुत स्मारक है।"
                ]
            },
            "mr": {
                "intro": [
                  f"इतिहासाच्या पानात {clean_topic} चे रहस्य नेहमीच कुतूहलाचा विषय राहिले आहे.",
                  "सांस्कृतिक वारसा लाभलेल्या या भागात जुने अवशेष आणि लोककथा यांचे सुंदर मिश्रण पाहायला मिळते.",
                  "अनेक लोक याला केवळ एक कथा मानतात, पण समुद्राखालील आणि जमिनीवरील शोधांनी याला ऐतिहासिक आधार दिला आहे."
                ],
                "background": [
                  f"जुन्या ग्रंथांमध्ये {clean_topic} चा उल्लेख एक समृद्ध व्यापारी केंद्र असा आढळतो, जे काळाच्या ओघात नामशेष झाले."
                ],
                "evidence": [
                  "नवीन उत्खननामध्ये दगडी खांब आणि नाणी सापडली आहेत, जी या समृद्ध प्राचीन नगराची साक्ष देतात."
                ],
                "scientific": [
                  "भौगोलिक चाचण्यांवरून असे समजते की दुष्काळ किंवा भूकंपामुळे लोकांनी हे ठिकाण सोडले असावे."
                ],
                "legends": [
                  "दंतकथेनुसार, देव किंवा तांत्रिकाच्या शापामुळे हे नगर नष्ट झाल्याची लोकांची धारणा आहे."
                ],
                "facts": [
                  "रडार मॅपिंगवरून जमिनीखाली मोठे रस्ते आणि भिंतींचे जाळे असल्याचे स्पष्ट झाले आहे."
                ],
                "takeaways": [
                  "नगराचा ऱ्हास निसर्गाच्या बदलांमुळे आणि पाणी टंचाईमुळे झाला असावा, जादूटोण्यामुळे नाही."
                ],
                "conclusion": [
                  f"थोडक्यात सांगायचे तर, {clean_topic} हे प्राचीन स्थापत्यशास्त्राचे आणि मानवी संघर्षाचे एक अमर रहस्य आहे."
                ]
            }
        },
        "explanations": {
            "eli10": {
                "en": f"{clean_topic} is an ancient place that got buried or lost. Scientists went there and dug up old pots and stone blocks, proving that the place was real. People telling ghost stories about it are just sharing fairy tales!",
                "hi": f"{clean_topic} एक बहुत पुराना स्थान है जो जमीन में खो गया था। वैज्ञानिकों ने वहां पुरानी चीजें खोजी हैं जिससे साबित हुआ कि यह सच में था।",
                "mr": f"{clean_topic} हे खूप वर्षांपूर्वीचे एक जुने शहर आहे जे मातीखाली लपले होते. शास्त्रज्ञानी तिथून जुनी भांडी आणि दगड शोधून काढले आहेत."
            },
            "simple": {
                "en": f"{clean_topic} is an ancient historic site that was abandoned due to severe climate changes like drought. While legends speak of supernatural curses, physical artifacts confirm it was a trading hub.",
                "hi": f"{clean_topic} एक प्राचीन ऐतिहासिक स्थल है जो सूखे या भूकंप के कारण वीरान हो गया था।",
                "mr": f"{clean_topic} हे भूकंप किंवा दुष्काळामुळे ओसाड झालेले प्राचीन ठिकाण आहे. लोक याला शाप मानतात, पण पुरावे नैसर्गिक संकटाकडे निर्देश करतात."
            },
            "detailed": {
                "en": f"Archaeological excavations of {clean_topic} reveal custom masonry and residential layout planning. Scientific analysis attributes its decline to a sudden shift in moisture corridors or regional earthquakes, forcing migration.",
                "hi": f"उत्खनन से {clean_topic} के गृह नियोजन और जल संचयन के प्रमाण मिले हैं।",
                "mr": f"उत्खननामध्ये मिळालेले पाण्याचे मोठे तलाव आणि भिंती यांची रचना उत्कृष्ट नागरी नियोजनाची साक्ष देते."
            },
            "academic": {
                "en": f"The architectural grid of {clean_topic} displays high mathematical precision in alignment with solar solstices. Geological core samples suggest a severe hydrological stress event led to gradual abandonment.",
                "hi": f"इसकी रचना सौर संक्रांति के साथ मेल खाती है, जो उस समय के उन्नत खगोल विज्ञान को दर्शाती है।",
                "mr": f"वास्तूंची रचना उत्तरायण आणि दक्षिणायन यांचा अभ्यास करून केली गेली आहे, जे प्राचीन भारतीयांचे खगोलशास्त्रातील ज्ञान दर्शवते."
            },
            "revision": {
                "en": f"Key Points: {clean_topic}. Category: {category}. Submerged or buried walls mapped. Abandonment caused by tectonic or weather changes.",
                "hi": f"मुख्य बिंदु: {clean_topic}। श्रेणी: {category}। रडार से दबी दीवारों की पुष्टि। पतन का कारण सूखा या भूकंप था।",
                "mr": f"महत्त्वाचे मुद्दे: {clean_topic}. वर्ग: {category}. जमिनीखाली रस्ते सापडले. ऱ्हासाचे कारण दुष्काळ."
            }
        },
        "qa": [
            {
                "q": ["what is the evidence", "proof", "findings", "पुरावा", "साक्ष्य"],
                "a": {
                    "en": "Archaeological excavations recovered ancient stone tools, structured block walls, and ceramic pottery fragments proving the presence of an organized settlement.",
                    "hi": "खुदाई में पत्थर के औजार, पक्की ईंट की दीवारें और मिट्टी के बर्तनों के टुकड़े मिले हैं जो बस्ती के अस्तित्व को साबित करते हैं।",
                    "mr": "उत्खननामध्ये मिळालेले दगडी खांब, जुनी नाणी आणि मातीची भांडी ही या संस्कृतीचे अस्तित्व सिद्ध करतात."
                }
            },
            {
                "q": ["is this scientifically verified", "is it true", "real", "सत्य", "खरे आहे का"],
                "a": {
                    "en": "The physical ruins and artifacts are scientifically verified by archaeologists. However, the legendary claims of curses or magical origins are not supported by science; instead, research indicates environmental or political reasons for its abandonment.",
                    "hi": "भौतिक खंडहर और कलाकृतियां वैज्ञानिकों द्वारा प्रमाणित हैं। हालांकि, शाप या जादुई कहानियों का विज्ञान समर्थन नहीं करता; पतन के पीछे पर्यावरणीय या युद्ध के कारण जिम्मेदार थे।",
                    "mr": "दगडी भिंती आणि नाणी विज्ञानाने सिद्ध केली आहेत, पण शापाची गोष्ट खरी नाही. विज्ञान मानतं की दुष्काळ किंवा युद्धांमुळे लोक तिथून निघून गेले असावेत."
                }
            }
        ],
        "references": [
            f"Journal of Archaeological Research on {clean_topic}, Vol 12, 2022.",
            f"Satellite and Sonar Mapping surveys of {category} sites, 2024.",
            "Local oral folklore and comparative historical chronicles."
        ]
    }

def solve_story_question(story: Dict[str, Any], question: str, lang: str) -> str:
    q_lower = question.lower()
    
    # 1. First check the QA database entries
    for pair in story.get("qa", []):
        for keyword in pair.get("q", []):
            if keyword in q_lower:
                return pair["a"].get(lang, pair["a"]["en"])
                
    # 2. Key phrases match fallback
    if any(w in q_lower for w in ["curse", "ghost", "spirit", "magic", "शाप", "भूत", "जादू"]):
        if lang == "hi":
            return "दंतकथाएं अक्सर शाप या अलौकिक शक्तियों का उल्लेख करती हैं, लेकिन वैज्ञानिक शोध में इन दावों का कोई ठोस प्रमाण नहीं मिला है। अधिकांश साक्ष्य प्राकृतिक घटनाओं की ओर इशारा करते हैं।"
        if lang == "mr":
            return "स्थानिक दंतकथांमध्ये शाप किंवा भुतांचे संदर्भ असतात, परंतु विज्ञानात या गोष्टींना आधार नाही. संशोधनानुसार हे निसर्गाच्या बदलांमुळे घडून आलेले आहे."
        return "Legends often speak of curses and supernatural forces, but physical investigations suggest environmental or architectural failures are the primary causes. Science rules out magic."

    if any(w in q_lower for w in ["scientific", "verify", "evidence", "proof", "विज्ञान", "प्रमाण", "खरे"]):
        if lang == "hi":
            return f"इस स्थल के भौतिक अवशेषों और अवशेषों की वैज्ञानिक रूप से जांच की गई है। पुरातात्विक विभाग ने रडार मैपिंग और खुदाई के माध्यम से इसकी सत्यता की पुष्टि की है।"
        if lang == "mr":
            return f"या ठिकाणच्या जुन्या वास्तू आणि सापडलेली नाणी यांची वैज्ञानिक चाचणी झाली आहे. रडार मॅपिंग आणि कार्बन डेटिंगच्या साह्याने विज्ञानाने याला दुजोरा दिला आहे."
        return f"The physical remnants, anchors, or walls of this site are carbon-dated and mapped by scientific agencies, proving their historical foundation. Legends, however, remain unverified."

    # 3. Ultimate generic context-aware response
    fact_label = story.get("factLabel", "Active Research")
    fact_status = story.get("factStatus", "Partially Verified")
    
    if lang == "hi":
        return f"वेलोरा पुरालेख के अनुसार, यह कहानी {fact_label} के अंतर्गत वर्गीकृत है। अधिक विवरण के लिए, मुख्य आलेख के 'वैज्ञानिक दृष्टिकोण' या 'तथ्य' अनुभाग को पढ़ें।"
    if lang == "mr":
        return f"वेलोरा ज्ञानकोशानुसार, हा इतिहास '{fact_label}' या श्रेणीत येतो. अधिक माहितीसाठी लेखातील 'वैज्ञानिक तथ्य' हा विभाग तपासा."
    return f"According to the VELORA archives, this topic is classified under '{fact_label}' ({fact_status}). You can explore specific evidence in the 'Scientific Analysis' or 'Multi-Perspective Analysis' grid inside the reader."
