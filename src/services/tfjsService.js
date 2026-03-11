import * as tf from '@tensorflow/tfjs';

/* ─── PlantVillage 38 Classes ─── */
const CLASSES = [
  "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
  "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_",
  "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy", "Grape___Black_rot",
  "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
  "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
  "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight",
  "Potato___Late_blight", "Potato___healthy", "Raspberry___healthy", "Soybean___healthy",
  "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy",
  "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold",
  "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite",
  "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus",
  "Tomato___healthy"
];

/* ─── Full Treatment Database — all 38 PlantVillage classes ─── */
const SPECIFIC_TREATMENTS = {
  // 0: Apple Scab
  0: {
    en: { disease: "Apple Scab", treatment: [
      "Remove and destroy all fallen leaves and infected fruit immediately to eliminate overwintering spores.",
      "Apply a protectant fungicide (captan or myclobutanil) starting at bud-break and repeat every 7–10 days during wet weather.",
      "Prune the canopy to improve air circulation — scab thrives in humid, enclosed conditions.",
      "Avoid overhead irrigation; use drip lines to keep foliage dry.",
      "Plant scab-resistant apple varieties (e.g., Liberty, Redfree) when replanting."
    ]},
    sw: { disease: "Ugonjwa wa Maganda ya Tufaha", treatment: [
      "Ondoa na teketeza majani yote yaliyoanguka na matunda yaliyoathirika mara moja ili kuondoa spores.",
      "Tumia dawa ya ukungu (captan au myclobutanil) kuanzia maua na uendelee kila siku 7–10 wakati wa mvua.",
      "Kata matawi ya ziada ili kuruhusu hewa kupita — ugonjwa huu hustawi katika hali ya unyevunyevu.",
      "Epuka kumwagilia kutoka juu; tumia mfumo wa matone ili majani yabaki makavu.",
      "Panda aina ya tufaha zinazostahimili ugonjwa huu (k.m. Liberty, Redfree) unapoumea upya."
    ]},
  },
  // 1: Apple Black Rot
  1: {
    en: { disease: "Apple Black Rot", treatment: [
      "Prune out all dead or cankered wood and dispose of it away from the orchard — do not compost.",
      "Apply captan or thiophanate-methyl fungicide from pink bud stage through harvest, every 10–14 days.",
      "Remove mummified fruit clinging to branches; they harbour spores all winter.",
      "Thin fruit clusters to reduce humidity and physical contact between fruit.",
      "Disinfect pruning tools between cuts using a 10% bleach solution to prevent spreading the fungus."
    ]},
    sw: { disease: "Kuoza kwa Tufaha (Black Rot)", treatment: [
      "Kata matawi yaliyokufa au yenye vidonda na yateketeze mbali na bustani — usiyafanye mboji.",
      "Tumia dawa ya captan au thiophanate-methyl kuanzia hatua ya bud hadi mavuno, kila siku 10–14.",
      "Ondoa matunda yaliyokauka yaliyobaki kwenye matawi; yana spores kipindi chote cha baridi.",
      "Punguza matunda yanayokaa pamoja ili kupunguza unyevu na mguso kati ya matunda.",
      "Disinfect zana za kukata kati ya kila mkato kwa kutumia bleach ya 10% kuzuia kuenea kwa ukungu."
    ]},
  },
  // 2: Apple Cedar Rust
  2: {
    en: { disease: "Apple Cedar-Apple Rust", treatment: [
      "Remove nearby Eastern red cedar or juniper trees within 1 km where possible — they are the alternate host.",
      "Apply myclobutanil or propiconazole fungicide at pink bud stage, then every 7–10 days through petal fall.",
      "Plant rust-resistant apple varieties such as Enterprise or Freedom for future seasons.",
      "Rake and destroy fallen leaves in autumn to reduce spore load.",
      "Avoid excessive nitrogen fertilisation as it produces lush foliage that is more susceptible."
    ]},
    sw: { disease: "Kutu ya Tufaha na Mti wa Cedar", treatment: [
      "Kata miti ya juniper au cedar karibu (ndani ya km 1) iwezekanavyo — ndiyo mwenyeji mbadala wa ugonjwa huu.",
      "Tumia dawa ya myclobutanil au propiconazole wakati wa maua, kisha kila siku 7–10 hadi petals zinapoanguka.",
      "Panda aina ya tufaha zinazostahimili kutu (k.m. Enterprise, Freedom) msimu ujao.",
      "Okota na teketeza majani yaliyoanguka vuli ili kupunguza spores.",
      "Epuka mbolea nyingi ya nitrojeni kwani husababisha majani laini ambayo huathirika zaidi."
    ]},
  },
  // 3: Apple Healthy
  3: {
    en: { disease: "Healthy Apple Tree", treatment: [
      "Continue scouting every 7 days throughout the growing season for early signs of scab, rust, or mites.",
      "Apply a balanced NPK fertiliser in early spring before bud break to support vigorous growth.",
      "Maintain a 1-metre weed-free zone around the trunk to reduce pest habitat.",
      "Thin fruit to one per cluster when it reaches marble size to improve size and reduce disease pressure.",
      "Prune annually in late winter to maintain an open canopy for light penetration and air flow."
    ]},
    sw: { disease: "Mti wa Tufaha wenye Afya", treatment: [
      "Endelea kufanya ukaguzi kila siku 7 wakati wa msimu wa ukuaji kwa dalili za mapema za magonjwa.",
      "Tumia mbolea ya NPK iliyosawa mapema spring kabla ya maua ili kusaidia ukuaji.",
      "Weka eneo la mita 1 bila magugu karibu na shina kupunguza makazi ya wadudu.",
      "Punguza matunda hadi moja kwa kila kundi linapofika ukubwa wa shaba ili kuboresha ukubwa.",
      "Kata matawi kila mwaka mwisho wa baridi ili kudumisha canopy wazi kwa mwanga na hewa."
    ]},
  },
  // 4: Blueberry Healthy
  4: {
    en: { disease: "Healthy Blueberry Plant", treatment: [
      "Maintain soil pH between 4.5 and 5.5 — blueberries are highly sensitive to alkaline soils.",
      "Mulch with pine needles or woodchips to retain moisture, suppress weeds, and acidify the soil.",
      "Scout weekly for signs of mummy berry, botrytis, or spotted wing drosophila.",
      "Fertilise with an acid-forming ammonium sulphate formula in early spring and after harvest.",
      "Net the plants in summer to protect ripe berries from bird damage."
    ]},
    sw: { disease: "Mmea wa Blueberry wenye Afya", treatment: [
      "Dumisha pH ya udongo kati ya 4.5 na 5.5 — blueberry ni nyeti sana kwa udongo wa alkali.",
      "Weka matandazo ya sindano za pine au vipande vya miti kuhifadhi unyevu na kuongeza asidi.",
      "Angalia kila wiki kwa dalili za magonjwa ya mummy berry, botrytis, au wadudu.",
      "Mbolea kwa formula ya ammonium sulphate mapema spring na baada ya mavuno.",
      "Weka nyavu majira ya joto kulinda matunda kutoka kwa ndege."
    ]},
  },
  // 5: Cherry Powdery Mildew
  5: {
    en: { disease: "Cherry Powdery Mildew", treatment: [
      "Apply sulphur-based or potassium bicarbonate fungicide at first sign of white powdery coating on leaves.",
      "Prune infected shoot tips immediately and bag the prunings before removing them from the orchard.",
      "Improve canopy ventilation with annual pruning to reduce the humid microclimate the fungus needs.",
      "Avoid excessive nitrogen fertiliser — high nitrogen promotes soft, susceptible new growth.",
      "Apply neem oil spray (2%) every 7 days during high humidity periods as an organic alternative."
    ]},
    sw: { disease: "Unga Mweupe wa Mtunda (Powdery Mildew)", treatment: [
      "Tumia dawa ya sulphur au potassium bicarbonate mara unapona mipako nyeupe kwenye majani.",
      "Kata ncha za matawi yaliyoathirika mara moja na vifunge kwenye mfuko kabla ya kuvitoa bustanini.",
      "Boresha mzunguko wa hewa kwa kukata matawi kila mwaka kupunguza unyevu ambao ukungu unahitaji.",
      "Epuka mbolea nyingi ya nitrojeni — inahimiza ukuaji mpole ambao huathirika zaidi.",
      "Piga dawa ya mafuta ya neem (2%) kila siku 7 wakati wa unyevu kama njia ya asili."
    ]},
  },
  // 6: Cherry Healthy
  6: {
    en: { disease: "Healthy Cherry Tree", treatment: [
      "Scout the canopy every 7–10 days for brown rot, leaf spot, or aphid colonies.",
      "Apply a copper-based dormant spray in late winter before bud swell to prevent bacterial diseases.",
      "Ensure adequate calcium nutrition to improve fruit firmness and reduce cracking.",
      "Net trees as fruit ripens to prevent bird and insect damage.",
      "Remove and dispose of any mummified fruit remaining from the previous season."
    ]},
    sw: { disease: "Mti wa Cherry wenye Afya", treatment: [
      "Angalia matawi kila siku 7–10 kwa madoa ya majani, brown rot, au makundi ya aphid.",
      "Tumia dawa ya copper mwishoni mwa baridi kabla ya maua kuzuia magonjwa ya bakteria.",
      "Hakikisha lishe ya kutosha ya kalsiamu kuboresha ugumu wa matunda na kupunguza kupasuka.",
      "Weka nyavu matunda yanapoiva kuzuia uharibifu wa ndege na wadudu.",
      "Ondoa na teketeza matunda yoyote yaliyokauka kutoka msimu uliopita."
    ]},
  },
  // 7: Corn Gray Leaf Spot
  7: {
    en: { disease: "Maize Gray Leaf Spot", treatment: [
      "Apply foliar fungicide (Mancozeb 80 WP or Azoxystrobin) at first sign of rectangular grey lesions on lower leaves.",
      "Rotate crops — avoid planting maize on the same plot for at least 2 consecutive seasons.",
      "Use certified disease-tolerant hybrid seeds recommended by your local extension office.",
      "Ensure proper plant spacing (75 cm × 25 cm) to improve air flow between plants.",
      "Collect and burn all infected crop debris after harvest — do not incorporate into soil."
    ]},
    sw: { disease: "Madoa ya Kijivu ya Mahindi", treatment: [
      "Tumia dawa ya ukungu (Mancozeb 80 WP au Azoxystrobin) mara unapoona madoa ya kijivu kwenye majani ya chini.",
      "Zungusha mazao — epuka kupanda mahindi kwenye shamba moja kwa misimu 2 mfululizo.",
      "Tumia mbegu bora za mahindi zinazostahimili ugonjwa zilizoidhinishwa na ofisi ya kilimo.",
      "Hakikisha nafasi sahihi ya kupanda (75 cm × 25 cm) ili kuboresha mzunguko wa hewa.",
      "Kusanya na kuchoma mabaki yote ya mazao baada ya mavuno — usiyachanganye na udongo."
    ]},
  },
  // 8: Corn Common Rust
  8: {
    en: { disease: "Maize Common Rust", treatment: [
      "Apply a triazole fungicide (e.g., Propiconazole) at first appearance of brick-red pustules on both leaf surfaces.",
      "Scout fields weekly from tasseling stage — rust spreads rapidly under cool, humid conditions.",
      "Plant rust-resistant certified hybrid varieties in the next season.",
      "Practice early planting to allow the crop to mature before peak rust pressure in mid-season.",
      "Remove and destroy heavily infected leaves to reduce the local spore load."
    ]},
    sw: { disease: "Kutu ya Kawaida ya Mahindi", treatment: [
      "Tumia dawa ya triazole (k.m. Propiconazole) mara madoa mekundu-matofali yanapoanza kuonekana pande zote za jani.",
      "Angalia mashamba kila wiki tangu hatua ya tasseling — kutu huenea haraka wakati wa baridi na unyevu.",
      "Panda aina ya mahindi yanayostahimili kutu katika msimu ujao.",
      "Panda mapema ili mazao yaive kabla ya msongo wa kutu katikati ya msimu.",
      "Ondoa na teketeza majani yaliyoathirika sana ili kupunguza spores eneo."
    ]},
  },
  // 9: Corn Northern Leaf Blight
  9: {
    en: { disease: "Maize Northern Leaf Blight", treatment: [
      "Apply Mancozeb or Chlorothalonil fungicide when large cigar-shaped grey-green lesions first appear.",
      "Practice crop rotation with non-host crops (beans, sunflower) for at least one season.",
      "Deep-plough crop residues immediately after harvest to bury and decompose fungal spores.",
      "Plant NCLB-tolerant hybrid varieties — ask your agro-dealer for regionally recommended options.",
      "Avoid late planting which increases disease exposure during the critical growth stages."
    ]},
    sw: { disease: "Ugonjwa wa Majani wa Kaskazini wa Mahindi", treatment: [
      "Tumia dawa ya Mancozeb au Chlorothalonil madoa makubwa ya kijivu-kijani yanapoanza kuonekana.",
      "Zungusha mazao na mazao yasiyoathirika (maharagwe, alizeti) kwa angalau msimu mmoja.",
      "Lima kwa kina mabaki ya mazao mara baada ya mavuno kuzika na kuoza spores za ukungu.",
      "Panda aina za mahindi zinazostahimili NCLB — uliza mwuzaji wa pembejeo kwa mapendekezo ya eneo.",
      "Epuka kupanda kwa kuchelewa ambako huongeza mfiduo wa ugonjwa wakati wa hatua muhimu za ukuaji."
    ]},
  },
  // 10: Corn Healthy
  10: {
    en: { disease: "Healthy Maize Crop", treatment: [
      "Your maize crop looks healthy — continue scouting every 7 days for rust, blight, and stalk borer.",
      "Apply top-dress nitrogen (CAN or Urea) at knee-high stage for maximum yield.",
      "Monitor for fall armyworm — look for window-pane feeding and frass in the whorl.",
      "Ensure adequate soil moisture especially during tasseling and grain-fill stages.",
      "Keep field edges free of weeds and volunteer maize that can harbour disease and pests."
    ]},
    sw: { disease: "Mahindi yenye Afya", treatment: [
      "Mahindi yako yanaonekana kuwa na afya — endelea kufanya ukaguzi kila siku 7 kwa kutu, blight, na viwavi.",
      "Weka mbolea ya juu ya nitrojeni (CAN au Urea) mahindi yanapofikia urefu wa magoti kwa mavuno bora.",
      "Angalia viwavi wa fall armyworm — tafuta kula kwa dirisha na uchafu ndani ya whorl.",
      "Hakikisha unyevu wa kutosha wa udongo hasa wakati wa tasseling na kujaza punje.",
      "Weka kingo za shamba zisizo na magugu na mahindi ya porini ambayo yanaweza kuhifadhi magonjwa."
    ]},
  },
  // 11: Grape Black Rot
  11: {
    en: { disease: "Grape Black Rot", treatment: [
      "Apply mancozeb or myclobutanil fungicide from bud break, every 7–14 days through veraison (colour change).",
      "Remove and destroy all mummified berries and infected tendrils — they carry spores into the next season.",
      "Prune vines to an open canopy and train shoots upright for maximum air circulation.",
      "Avoid overhead irrigation; water at the base in the morning so foliage dries quickly.",
      "After harvest, rake and remove all leaf litter and fallen fruit from the vineyard floor."
    ]},
    sw: { disease: "Kuoza Nyeusi kwa Zabibu", treatment: [
      "Tumia dawa ya mancozeb au myclobutanil kuanzia maua, kila siku 7–14 hadi veraison (mabadiliko ya rangi).",
      "Ondoa na teketeza matunda yote yaliyokauka na vichipukizi vilivyoathirika — vina spores kwa msimu ujao.",
      "Kata mizabibu hadi canopy wazi na fundisha vichipukizi wima kwa mzunguko bora wa hewa.",
      "Epuka kumwagilia kutoka juu; mwagilia chini asubuhi ili majani yakauke haraka.",
      "Baada ya mavuno, okota na ondoa majani yote yaliyoanguka na matunda kutoka kwenye sakafu ya bustani."
    ]},
  },
  // 12: Grape Esca (Black Measles)
  12: {
    en: { disease: "Grape Esca (Black Measles)", treatment: [
      "There is no chemical cure — management focuses on slowing the disease: prune out all visibly infected wood.",
      "Paint large pruning wounds immediately with a fungicidal pruning paste (Topsin-M or similar) to prevent spore entry.",
      "Remove and burn severely affected vines to prevent spread to healthy vines.",
      "Avoid pruning during wet weather — spores enter through fresh wounds.",
      "Delay pruning until mid-winter when vines are fully dormant and infection risk is lowest."
    ]},
    sw: { disease: "Ugonjwa wa Esca wa Zabibu", treatment: [
      "Hakuna tiba ya kemikali — udhibiti unazingatia kupunguza ugonjwa: kata mti wote unaoonekana kuathirika.",
      "Paka majeraha makubwa ya kukata mara moja na dawa ya ukungu ya kupaka (Topsin-M au sawa nayo) kuzuia spores kuingia.",
      "Ondoa na kuchoma mizabibu iliyoathirika sana kuzuia kuenea kwa mizabibu yenye afya.",
      "Epuka kukata matawi wakati wa mvua — spores huingia kupitia majeraha mapya.",
      "Chelewa kukata matawi hadi katikati ya baridi wakati mizabibu iko katika hali ya usingizi na hatari ya maambukizi ni ndogo."
    ]},
  },
  // 13: Grape Leaf Blight
  13: {
    en: { disease: "Grape Leaf Blight (Isariopsis)", treatment: [
      "Apply copper oxychloride or mancozeb fungicide at first sign of brown angular spots on leaves.",
      "Increase spray frequency to every 7 days during prolonged wet periods.",
      "Ensure good canopy management — remove basal leaves around the cluster zone for better spray penetration.",
      "Remove heavily infected leaves and fallen debris from the vineyard floor promptly.",
      "Rotate fungicide classes each season to prevent resistance build-up."
    ]},
    sw: { disease: "Ugonjwa wa Majani wa Zabibu (Isariopsis)", treatment: [
      "Tumia dawa ya copper oxychloride au mancozeb mara unapoona madoa ya kahawia kwenye majani.",
      "Ongeza mara za kunyunyizia hadi kila siku 7 wakati wa mvua ndefu.",
      "Hakikisha usimamizi mzuri wa canopy — ondoa majani ya chini karibu na kundi la zabibu kwa upenyezaji bora wa dawa.",
      "Ondoa majani yaliyoathirika sana na mabaki yaliyoanguka kutoka kwenye sakafu ya bustani haraka.",
      "Zungusha aina za dawa za ukungu kila msimu kuzuia ujenzi wa upinzani."
    ]},
  },
  // 14: Grape Healthy
  14: {
    en: { disease: "Healthy Grapevine", treatment: [
      "Continue weekly scouting for powdery mildew, downy mildew, and leafhopper damage.",
      "Apply a preventative sulphur spray before humid periods to head off powdery mildew.",
      "Ensure balanced potassium nutrition to improve berry quality and disease tolerance.",
      "Maintain trellis and training system to maximise sunlight penetration into the canopy.",
      "Monitor soil moisture; avoid waterlogging which promotes root diseases."
    ]},
    sw: { disease: "Mzabibu wenye Afya", treatment: [
      "Endelea kufanya ukaguzi wa kila wiki kwa powdery mildew, downy mildew, na uharibifu wa leafhopper.",
      "Tumia dawa ya sulphur kama kinga kabla ya vipindi vya unyevu kuzuia powdery mildew.",
      "Hakikisha lishe ya potassium iliyosawa kuboresha ubora wa zabibu na uvumilivu wa magonjwa.",
      "Dumisha mfumo wa trellis na mafunzo kuongeza upenyezaji wa jua ndani ya canopy.",
      "Angalia unyevu wa udongo; epuka maji ya ziada ambayo yanakuza magonjwa ya mizizi."
    ]},
  },
  // 15: Orange Huanglongbing
  15: {
    en: { disease: "Citrus Greening (Huanglongbing)", treatment: [
      "There is currently no cure — immediately remove and destroy infected trees to protect neighbouring citrus.",
      "Control the Asian citrus psyllid vector aggressively using imidacloprid systemic insecticide.",
      "Inspect all new nursery stock for psyllid eggs and nymphs before planting — use certified disease-free material only.",
      "Establish a psyllid monitoring programme with yellow sticky traps throughout the orchard.",
      "Report the disease to your local agricultural authority as it is a notifiable disease in most countries."
    ]},
    sw: { disease: "Ugonjwa wa Citrus Greening (HLB)", treatment: [
      "Kwa sasa hakuna tiba — ondoa na teketeza miti iliyoathirika mara moja kulinda michungwa ya jirani.",
      "Dhibiti wadudu wa psyllid wa Asia kwa nguvu kwa kutumia dawa ya imidacloprid ya ndani ya mmea.",
      "Kagua miche yote mipya kwa mayai na nymphs za psyllid kabla ya kupanda — tumia nyenzo zisizo na ugonjwa tu.",
      "Anzisha programu ya ufuatiliaji wa psyllid kwa kutumia mitego ya njano ya kunata katika bustani yote.",
      "Ripoti ugonjwa huu kwa mamlaka ya kilimo yako ya mtaa kwani ni ugonjwa wa kuripotiwa katika nchi nyingi."
    ]},
  },
  // 16: Peach Bacterial Spot
  16: {
    en: { disease: "Peach Bacterial Spot", treatment: [
      "Apply copper hydroxide or oxytetracycline spray starting at petal fall, every 5–7 days during wet weather.",
      "Prune to open the canopy and reduce leaf wetness duration.",
      "Avoid overhead irrigation — bacterial spot is spread by splashing water.",
      "Remove and destroy severely infected shoots and leaves during the season.",
      "Plant resistant peach varieties (e.g., Redhaven, Candor) when replanting to reduce ongoing pressure."
    ]},
    sw: { disease: "Madoa ya Bakteria ya Tunda la Peach", treatment: [
      "Tumia dawa ya copper hydroxide au oxytetracycline kuanzia petals zinapoanguka, kila siku 5–7 wakati wa mvua.",
      "Kata matawi ili kufungua canopy na kupunguza muda wa unyevu wa majani.",
      "Epuka kumwagilia kutoka juu — madoa ya bakteria yanaenezwa na maji yanayomwagika.",
      "Ondoa na teketeza vichipukizi na majani yaliyoathirika sana wakati wa msimu.",
      "Panda aina za peach zinazostahimili (k.m. Redhaven, Candor) unapoumea upya kupunguza msongo unaoendelea."
    ]},
  },
  // 17: Peach Healthy
  17: {
    en: { disease: "Healthy Peach Tree", treatment: [
      "Continue weekly scouting for brown rot, leaf curl, and oriental fruit moth.",
      "Apply a copper dormant spray in late winter to protect against bacterial canker and leaf curl.",
      "Thin fruit to one per 15 cm of branch when the fruit reaches marble size to improve size and quality.",
      "Fertilise with balanced NPK in spring; avoid late-season nitrogen which delays hardening.",
      "Monitor for borers — look for gummosis (amber sap) at the base of the trunk."
    ]},
    sw: { disease: "Mti wa Peach wenye Afya", treatment: [
      "Endelea kufanya ukaguzi wa kila wiki kwa brown rot, leaf curl, na wadudu wa matunda.",
      "Tumia dawa ya copper mwisho wa baridi kulinda dhidi ya magonjwa ya bakteria na leaf curl.",
      "Punguza matunda hadi moja kwa kila sm 15 ya tawi linapofika ukubwa wa shaba.",
      "Mbolea kwa NPK iliyosawa spring; epuka nitrojeni ya mwishoni mwa msimu ambayo inachelewa ugumu.",
      "Angalia wadudu wa borer — tafuta gummosis (utomvu wa njano) kwenye msingi wa shina."
    ]},
  },
  // 18: Pepper Bacterial Spot
  18: {
    en: { disease: "Bell Pepper Bacterial Spot", treatment: [
      "Apply copper bactericide (copper hydroxide or copper sulphate) every 5–7 days during wet periods.",
      "Remove and destroy infected leaves and fruit promptly to prevent further bacterial spread.",
      "Avoid working in the field when plants are wet — bacterial spot spreads rapidly on wet foliage.",
      "Use drip irrigation instead of sprinklers to keep foliage dry.",
      "Rotate peppers out of the same bed for at least 2–3 seasons; plant resistant varieties where available."
    ]},
    sw: { disease: "Madoa ya Bakteria ya Pilipili Hoho", treatment: [
      "Tumia dawa ya copper (copper hydroxide au copper sulphate) kila siku 5–7 wakati wa mvua.",
      "Ondoa na teketeza majani na matunda yaliyoathirika haraka kuzuia kuenea zaidi kwa bakteria.",
      "Epuka kufanya kazi shambani mimea ikiwa na unyevu — madoa ya bakteria huenea haraka kwenye majani yenye unyevu.",
      "Tumia umwagiliaji wa matone badala ya vinyunyuzi kuweka majani makavu.",
      "Zungusha pilipili kutoka kwenye kitanda hicho kwa angalau misimu 2–3; panda aina zinazostahimili zinapopatikana."
    ]},
  },
  // 19: Pepper Healthy
  19: {
    en: { disease: "Healthy Bell Pepper Plant", treatment: [
      "Continue scouting every 5–7 days for bacterial spot, phytophthora blight, and aphids.",
      "Side-dress with calcium nitrate at first flower to prevent blossom end rot.",
      "Stake or cage plants to keep fruit off the ground and reduce disease risk.",
      "Maintain consistent soil moisture — drought stress followed by heavy watering causes fruit cracking.",
      "Scout for pepper weevil and thrips, especially in hot, dry weather."
    ]},
    sw: { disease: "Mmea wa Pilipili Hoho wenye Afya", treatment: [
      "Endelea kufanya ukaguzi kila siku 5–7 kwa madoa ya bakteria, phytophthora, na aphids.",
      "Ongeza calcium nitrate pembeni ya mstari wakati wa maua ya kwanza kuzuia magonjwa ya matunda.",
      "Simamisha au zingira mimea kuweka matunda mbali na ardhi na kupunguza hatari ya ugonjwa.",
      "Dumisha unyevu thabiti wa udongo — msongo wa ukame ukifuatiwa na kumwagilia sana husababisha kupasuka kwa matunda.",
      "Angalia weevil wa pilipili na thrips, hasa wakati wa hali ya joto na ukame."
    ]},
  },
  // 20: Potato Early Blight
  20: {
    en: { disease: "Potato Early Blight", treatment: [
      "Apply mancozeb or chlorothalonil fungicide at first sign of concentric-ring dark spots on lower leaves.",
      "Remove and destroy infected lower leaves to slow disease progress up the plant.",
      "Avoid overhead irrigation in the evening — water in the morning so foliage dries by nightfall.",
      "Ensure adequate potassium and phosphorus nutrition to improve plant resistance.",
      "Hill up soil around stems and rotate out of solanaceous crops (tomato, pepper) for 2–3 seasons."
    ]},
    sw: { disease: "Ugonjwa wa Mapema wa Viazi (Early Blight)", treatment: [
      "Tumia dawa ya mancozeb au chlorothalonil unapoona madoa ya giza yenye mviringo kwenye majani ya chini.",
      "Ondoa na teketeza majani ya chini yaliyoathirika ili kupunguza maendeleo ya ugonjwa kwenye mmea.",
      "Epuka kumwagilia kutoka juu jioni — mwagilia asubuhi ili majani yakauke kabla ya usiku.",
      "Hakikisha lishe ya kutosha ya potassium na phosphorus kuboresha upinzani wa mmea.",
      "Funika udongo kuzunguka mashina na zungusha mazao kutoka kwa mazao ya solanaceous kwa misimu 2–3."
    ]},
  },
  // 21: Potato Late Blight
  21: {
    en: { disease: "Potato Late Blight", treatment: [
      "Act immediately — late blight can destroy an entire crop within days. Apply metalaxyl + mancozeb (Ridomil Gold) right away.",
      "Remove and bag all visibly infected haulms (above-ground parts) and dispose of them away from the field — do not compost.",
      "Spray every 5–7 days during cool, wet weather using a systemic fungicide; rotate active ingredients.",
      "Avoid harvesting during or after rain — lesions on tubers spread during wet handling.",
      "After harvest, inspect all stored tubers and remove any showing dark rot; store in cool, dry, ventilated conditions."
    ]},
    sw: { disease: "Ugonjwa wa Marehemu wa Viazi (Late Blight)", treatment: [
      "Chukua hatua mara moja — late blight inaweza kuangamiza zao zima ndani ya siku chache. Tumia metalaxyl + mancozeb (Ridomil Gold) sasa hivi.",
      "Ondoa na vifunge kwenye mfuko sehemu zote za juu zinazoonekana kuathirika na uziteketeze mbali na shamba — usizifanye mboji.",
      "Nyunyizia kila siku 5–7 wakati wa hali ya baridi na mvua ukitumia dawa ya ndani ya mmea; zungusha vipengele vya kazi.",
      "Epuka kuvuna wakati wa au baada ya mvua — vidonda kwenye viazi huenea wakati wa kushughulika mvua ikiwepo.",
      "Baada ya mavuno, kagua viazi vyote vilivyohifadhiwa na ondoa vinavyoonyesha kuoza giza; hifadhi katika hali ya baridi, kavu, na uingizaji hewa."
    ]},
  },
  // 22: Potato Healthy
  22: {
    en: { disease: "Healthy Potato Plant", treatment: [
      "Continue weekly scouting for late blight — inspect the lower canopy especially during cool, wet periods.",
      "Hill up soil around stems when plants are 15–20 cm tall to protect tubers and prevent greening.",
      "Apply a preventative copper or mancozeb spray before forecasted wet periods.",
      "Monitor for Colorado potato beetle — handpick adults and egg masses early in the season.",
      "Rotate potatoes out of the same ground every 3 years to prevent build-up of soil-borne diseases."
    ]},
    sw: { disease: "Mmea wa Viazi wenye Afya", treatment: [
      "Endelea kufanya ukaguzi wa kila wiki kwa late blight — kagua canopy ya chini hasa wakati wa hali ya baridi na mvua.",
      "Funika udongo kuzunguka mashina mimea ikiwa na urefu wa sm 15–20 kulinda viazi na kuzuia kuwa kijani.",
      "Tumia dawa ya kinga ya copper au mancozeb kabla ya vipindi vya mvua vilivyotabiriwa.",
      "Angalia mdudu wa Colorado potato beetle — okota watu wazima na makundi ya mayai mapema msimu.",
      "Zungusha viazi kutoka kwenye ardhi hiyo kila miaka 3 kuzuia mkusanyiko wa magonjwa ya udongo."
    ]},
  },
  // 23: Raspberry Healthy
  23: {
    en: { disease: "Healthy Raspberry Plant", treatment: [
      "Prune out all floricanes (2-year-old canes) immediately after harvest to reduce disease pressure.",
      "Thin new primocanes to 6 per metre of row to improve air circulation and reduce botrytis risk.",
      "Scout weekly for cane blight, spur blight, and raspberry beetle from bud break.",
      "Apply sulphur fungicide at bud break as a preventative against powdery mildew.",
      "Maintain soil pH between 5.5 and 6.5 and fertilise with NPK in early spring."
    ]},
    sw: { disease: "Mmea wa Raspberry wenye Afya", treatment: [
      "Kata matawi yote ya miaka 2 (floricanes) mara baada ya mavuno kupunguza msongo wa magonjwa.",
      "Punguza matawi mapya hadi 6 kwa kila mita ya mstari kuboresha mzunguko wa hewa.",
      "Angalia kila wiki kwa cane blight, spur blight, na mdudu wa raspberry kuanzia ufunguaji wa maua.",
      "Tumia dawa ya sulphur mwanzoni mwa msimu kama kinga dhidi ya powdery mildew.",
      "Dumisha pH ya udongo kati ya 5.5 na 6.5 na mbolea kwa NPK mapema spring."
    ]},
  },
  // 24: Soybean Healthy
  24: {
    en: { disease: "Healthy Soybean Plant", treatment: [
      "Scout weekly from emergence for sudden death syndrome, soybean rust, and aphid infestations.",
      "Inoculate seeds with Bradyrhizobium japonicum before planting to maximise biological nitrogen fixation.",
      "Ensure adequate soil pH (6.0–6.5) and phosphorus for strong nodule development.",
      "Monitor for soybean aphids especially from V3 to R2 stages — threshold is 250 aphids per plant.",
      "Rotate with maize or sorghum every 2 years to break pest and disease cycles."
    ]},
    sw: { disease: "Mmea wa Soya wenye Afya", treatment: [
      "Angalia kila wiki tangu kuota kwa ugonjwa wa sudden death syndrome, kutu ya soya, na aphids.",
      "Chanjo mbegu na Bradyrhizobium japonicum kabla ya kupanda ili kuongeza uwiano wa nitrojeni ya kibiolojia.",
      "Hakikisha pH ya udongo (6.0–6.5) na phosphorus kwa ukuaji imara wa nodule.",
      "Angalia aphids wa soya hasa kutoka hatua za V3 hadi R2 — kiwango ni aphids 250 kwa mmea.",
      "Zungusha na mahindi au mtama kila miaka 2 kuvunja mzunguko wa wadudu na magonjwa."
    ]},
  },
  // 25: Squash Powdery Mildew
  25: {
    en: { disease: "Squash Powdery Mildew", treatment: [
      "Apply potassium bicarbonate or sulphur-based fungicide at first sign of white powdery coating — do not wait.",
      "Spray neem oil (2%) as an organic option every 5–7 days during humid conditions.",
      "Improve air circulation by removing dense or yellowing leaves from the base of the plant.",
      "Water at the base early in the morning — avoid wetting foliage.",
      "Plant resistant squash varieties in future seasons; remove and dispose of crop debris immediately after harvest."
    ]},
    sw: { disease: "Unga Mweupe wa Boga (Powdery Mildew)", treatment: [
      "Tumia dawa ya potassium bicarbonate au sulphur mara unapoona mipako nyeupe — usisubiri.",
      "Nyunyizia mafuta ya neem (2%) kama njia ya asili kila siku 5–7 wakati wa unyevu.",
      "Boresha mzunguko wa hewa kwa kuondoa majani mazito au yanayogeuka njano kutoka chini ya mmea.",
      "Mwagilia chini asubuhi — epuka kulowanisha majani.",
      "Panda aina za boga zinazostahimili misimu ijayo; ondoa na teketeza mabaki ya mazao mara baada ya mavuno."
    ]},
  },
  // 26: Strawberry Leaf Scorch
  26: {
    en: { disease: "Strawberry Leaf Scorch", treatment: [
      "Apply captan or myclobutanil fungicide at first appearance of purplish-red blotches on leaves.",
      "Remove and destroy infected leaves and runners immediately — do not compost them.",
      "Ensure good air circulation by spacing plants at least 30 cm apart and removing dense leaf growth.",
      "Avoid overhead irrigation; use drip irrigation to minimise leaf wetness.",
      "After fruiting, renovate the bed by mowing off old foliage and removing debris to reduce inoculum."
    ]},
    sw: { disease: "Kuungua kwa Majani ya Jordani (Leaf Scorch)", treatment: [
      "Tumia dawa ya captan au myclobutanil unapoona madoa ya zambarau-nyekundu kwenye majani.",
      "Ondoa na teketeza majani na runners zilizoathirika mara moja — usizifanye mboji.",
      "Hakikisha mzunguko mzuri wa hewa kwa kupanda mimea umbali wa angalau sm 30 na kuondoa ukuaji mzito wa majani.",
      "Epuka kumwagilia kutoka juu; tumia umwagiliaji wa matone kupunguza unyevu wa majani.",
      "Baada ya kutoa matunda, fanya upya kitanda kwa kukata majani ya zamani na kuondoa mabaki kupunguza inokulum."
    ]},
  },
  // 27: Strawberry Healthy
  27: {
    en: { disease: "Healthy Strawberry Plant", treatment: [
      "Scout every 5 days for leaf scorch, botrytis grey mould, and two-spotted spider mites.",
      "Apply a preventative sulphur spray before warm, humid periods to head off powdery mildew.",
      "Renovate the bed after the last harvest by cutting off old foliage and applying a balanced fertiliser.",
      "Remove runners unless you are propagating new plants — they compete for resources.",
      "Mulch with straw around plants to keep fruit clean and retain soil moisture."
    ]},
    sw: { disease: "Mmea wa Jordani wenye Afya", treatment: [
      "Angalia kila siku 5 kwa leaf scorch, botrytis, na sarafu nyekundu mbili.",
      "Tumia dawa ya sulphur ya kinga kabla ya vipindi vya joto na unyevu kuzuia powdery mildew.",
      "Fanya upya kitanda baada ya mavuno ya mwisho kwa kukata majani ya zamani na kutumia mbolea.",
      "Ondoa runners isipokuwa unazalisha mimea mipya — zinashindana kwa rasilimali.",
      "Weka matandazo ya majani ya ngano kuzunguka mimea kuweka matunda safi na kuhifadhi unyevu wa udongo."
    ]},
  },
  // 28: Tomato Bacterial Spot
  28: {
    en: { disease: "Tomato Bacterial Spot", treatment: [
      "Apply copper bactericide (copper hydroxide) every 5–7 days from early season, especially before rain.",
      "Use disease-free certified seed or transplants — bacterial spot can be seed-borne.",
      "Avoid working in the field when plants are wet — the bacteria spreads by splash and contact.",
      "Remove and destroy heavily infected leaves to reduce the bacterial load on the plant.",
      "Rotate tomatoes to a different bed every 2–3 years and avoid overhead irrigation."
    ]},
    sw: { disease: "Madoa ya Bakteria ya Nyanya", treatment: [
      "Tumia dawa ya copper (copper hydroxide) kila siku 5–7 kuanzia mwanzo wa msimu, hasa kabla ya mvua.",
      "Tumia mbegu au miche iliyoidhinishwa bila ugonjwa — madoa ya bakteria yanaweza kubebwa na mbegu.",
      "Epuka kufanya kazi shambani mimea ikiwa na unyevu — bakteria huenea kwa kunyunyuka na kugusana.",
      "Ondoa na teketeza majani yaliyoathirika sana kupunguza mzigo wa bakteria kwenye mmea.",
      "Zungusha nyanya kwenye kitanda tofauti kila miaka 2–3 na uepuke umwagiliaji wa kutoka juu."
    ]},
  },
  // 29: Tomato Early Blight
  29: {
    en: { disease: "Tomato Early Blight", treatment: [
      "Apply mancozeb or chlorothalonil fungicide at the first sign of dark concentric lesions on lower leaves.",
      "Remove infected lower leaves immediately and dispose away from the garden.",
      "Mulch around the base of plants to prevent soil splash which spreads fungal spores.",
      "Water at the base of the plant in the morning; avoid wetting foliage.",
      "Stake or cage tomatoes to keep foliage and fruit off the ground and improve air flow."
    ]},
    sw: { disease: "Ugonjwa wa Mapema wa Nyanya (Early Blight)", treatment: [
      "Tumia dawa ya mancozeb au chlorothalonil unapoona vidonda vya giza vya mviringo kwenye majani ya chini.",
      "Ondoa majani ya chini yaliyoathirika mara moja na utupe mbali na bustani.",
      "Weka matandazo kuzunguka msingi wa mimea kuzuia kunyunyuka kwa udongo ambako kunasambaza spores.",
      "Mwagilia chini ya mmea asubuhi; epuka kulowanisha majani.",
      "Simamisha au zingira nyanya kuweka majani na matunda mbali na ardhi na kuboresha mzunguko wa hewa."
    ]},
  },
  // 30: Tomato Late Blight
  30: {
    en: { disease: "Tomato Late Blight", treatment: [
      "Act urgently — late blight spreads extremely fast. Apply metalaxyl + mancozeb (Ridomil Gold) immediately.",
      "Remove and bag all infected plant material; do not compost — dispose away from the garden.",
      "Spray every 5 days during cool, wet conditions, rotating between metalaxyl and copper-based products.",
      "Avoid overhead watering — use drip irrigation or water at the base only.",
      "At the end of the season, remove all crop debris and do not plant tomatoes or potatoes in the same spot for 2 years."
    ]},
    sw: { disease: "Ugonjwa wa Marehemu wa Nyanya (Late Blight)", treatment: [
      "Chukua hatua haraka — late blight huenea haraka sana. Tumia metalaxyl + mancozeb (Ridomil Gold) mara moja.",
      "Ondoa na vifunge kwenye mfuko nyenzo zote za mmea zilizpoathirika; usizifanye mboji — teketeza mbali na bustani.",
      "Nyunyizia kila siku 5 wakati wa hali ya baridi na mvua, ukizungusha kati ya metalaxyl na bidhaa za copper.",
      "Epuka kumwagilia kutoka juu — tumia umwagiliaji wa matone au mwagilia chini tu.",
      "Mwishoni mwa msimu, ondoa mabaki yote ya mazao na usipande nyanya au viazi mahali hapo kwa miaka 2."
    ]},
  },
  // 31: Tomato Leaf Mold
  31: {
    en: { disease: "Tomato Leaf Mold", treatment: [
      "Apply chlorothalonil or copper-based fungicide at first sign of yellow patches on upper leaves with olive-green mould below.",
      "Increase ventilation in greenhouses or tunnels immediately — leaf mold thrives in high humidity above 85%.",
      "Remove and destroy infected leaves; wash hands before touching other plants.",
      "Space plants further apart and train side-shoots to reduce canopy density.",
      "Plant leaf-mold resistant tomato varieties in future crops."
    ]},
    sw: { disease: "Ukungu wa Majani ya Nyanya (Leaf Mold)", treatment: [
      "Tumia dawa ya chlorothalonil au copper unapoona madoa ya njano kwenye juu la majani na ukungu wa kijani-zeituni chini.",
      "Ongeza uingizaji hewa ndani ya greenhouses au tunnels mara moja — leaf mold hustawi katika unyevu zaidi ya 85%.",
      "Ondoa na teketeza majani yaliyoathirika; osha mikono kabla ya kugusa mimea mingine.",
      "Panda mimea mbali zaidi na ufundishe vichipukizi vya pembeni kupunguza msongamano wa canopy.",
      "Panda aina za nyanya zinazostahimili leaf mold katika mazao ya baadaye."
    ]},
  },
  // 32: Tomato Septoria Leaf Spot
  32: {
    en: { disease: "Tomato Septoria Leaf Spot", treatment: [
      "Apply mancozeb, chlorothalonil, or copper fungicide at first sign of small circular spots with dark borders and white centres.",
      "Remove and destroy infected leaves from the bottom of the plant up — do not compost.",
      "Mulch around the base to prevent rain-splash from transferring spores from soil to leaves.",
      "Avoid overhead irrigation; water early in the morning at the base of the plant.",
      "Rotate tomatoes out of the bed for at least 2 years; destroy all crop debris at season end."
    ]},
    sw: { disease: "Madoa ya Septoria ya Majani ya Nyanya", treatment: [
      "Tumia dawa ya mancozeb, chlorothalonil, au copper unapoona madoa madogo ya duara yenye mipaka ya giza na katikati nyeupe.",
      "Ondoa na teketeza majani yaliyoathirika kuanzia chini ya mmea kwenda juu — usiyafanye mboji.",
      "Weka matandazo kuzunguka msingi kuzuia kunyunyuka kwa mvua kuhamisha spores kutoka udongo kwenda majani.",
      "Epuka umwagiliaji wa kutoka juu; mwagilia mapema asubuhi chini ya mmea.",
      "Zungusha nyanya kutoka kwenye kitanda kwa angalau miaka 2; teketeza mabaki yote ya mazao mwishoni mwa msimu."
    ]},
  },
  // 33: Tomato Spider Mites
  33: {
    en: { disease: "Tomato Spider Mites (Two-Spotted)", treatment: [
      "Apply miticide (abamectin or spiromesifen) — standard insecticides are ineffective against mites.",
      "Spray the underside of leaves thoroughly where mites feed and lay eggs.",
      "Introduce predatory mites (Phytoseiulus persimilis) in greenhouse settings as a biological control.",
      "Increase irrigation around plants — spider mites thrive in hot, dry conditions; humidity suppresses them.",
      "Remove and bag heavily infested leaves; rotate miticide classes to prevent resistance."
    ]},
    sw: { disease: "Sarafu Nyekundu Mbili za Nyanya (Spider Mites)", treatment: [
      "Tumia dawa ya sarafu (abamectin au spiromesifen) — dawa za kawaida za wadudu hazifanyi kazi dhidi ya sarafu.",
      "Nyunyizia chini ya majani vizuri ambapo sarafu hula na kutaga mayai.",
      "Ingiza sarafu za ukarimu (Phytoseiulus persimilis) katika greenhouses kama udhibiti wa kibiolojia.",
      "Ongeza umwagiliaji kuzunguka mimea — sarafu hustawi katika hali ya joto na ukame; unyevu huzizuia.",
      "Ondoa na vifunge kwenye mfuko majani yaliyoshambuliwa sana; zungusha aina za dawa za sarafu kuzuia upinzani."
    ]},
  },
  // 34: Tomato Target Spot
  34: {
    en: { disease: "Tomato Target Spot", treatment: [
      "Apply azoxystrobin or tebuconazole fungicide at first sign of concentric ring lesions ('bullseye' pattern) on leaves.",
      "Remove infected leaves at the base of the plant and dispose of them away from the field.",
      "Improve air circulation by pruning excessive foliage and staking plants upright.",
      "Avoid overhead irrigation; water at the base in the morning to minimise leaf wetness periods.",
      "Rotate tomatoes with non-solanaceous crops for at least 2 seasons after an outbreak."
    ]},
    sw: { disease: "Madoa ya Target ya Nyanya", treatment: [
      "Tumia dawa ya azoxystrobin au tebuconazole mara unapoona vidonda vya mviringo kama lengo kwenye majani.",
      "Ondoa majani yaliyoathirika kwenye msingi wa mmea na yateketeze mbali na shamba.",
      "Boresha mzunguko wa hewa kwa kukata majani ya ziada na kusimamisha mimea wima.",
      "Epuka umwagiliaji kutoka juu; mwagilia chini asubuhi kupunguza vipindi vya unyevu wa majani.",
      "Zungusha nyanya na mazao yasiyo ya solanaceous kwa angalau misimu 2 baada ya mlipuko."
    ]},
  },
  // 35: Tomato Yellow Leaf Curl Virus
  35: {
    en: { disease: "Tomato Yellow Leaf Curl Virus (TYLCV)", treatment: [
      "There is no cure for infected plants — remove and destroy all infected plants immediately to protect the rest of the crop.",
      "Control the whitefly vector aggressively using imidacloprid or thiamethoxam systemic insecticide at transplanting.",
      "Install 50-mesh insect-proof nets over seedbeds and young transplants to exclude whiteflies.",
      "Use yellow sticky traps throughout the field to monitor and capture adult whiteflies.",
      "Plant TYLCV-resistant tomato varieties (e.g., Tanya F1, Tomato TY hybrids) in future seasons."
    ]},
    sw: { disease: "Virusi vya Njano vya Majani ya Nyanya (TYLCV)", treatment: [
      "Hakuna tiba kwa mimea iliyoambukizwa — ondoa na teketeza mimea yote iliyoambukizwa mara moja kulinda mazao yaliyobaki.",
      "Dhibiti whitefly inayosambaza ugonjwa kwa nguvu kwa kutumia imidacloprid au thiamethoxam wakati wa kupandikiza.",
      "Weka nyavu za kuzuia wadudu za mesh-50 juu ya vitalu vya mche na miche michanga.",
      "Tumia mitego ya njano ya kunata katika shamba lote kuangalia na kunasa whitefly wazima.",
      "Panda aina za nyanya zinazostahimili TYLCV (k.m. Tanya F1, nyanya za TY hybrids) misimu ijayo."
    ]},
  },
  // 36: Tomato Mosaic Virus
  36: {
    en: { disease: "Tomato Mosaic Virus (ToMV)", treatment: [
      "Remove and destroy all symptomatic plants immediately — there is no cure and the virus spreads by contact.",
      "Wash hands thoroughly with soap and water before handling plants, and after touching any infected material.",
      "Disinfect all tools, stakes, and ties with 10% bleach or 70% alcohol between uses.",
      "Do not smoke or use tobacco near tomato crops — tobacco can carry related mosaic viruses.",
      "Plant ToMV-resistant tomato varieties and use certified disease-free transplants in future seasons."
    ]},
    sw: { disease: "Virusi vya Mosaic ya Nyanya (ToMV)", treatment: [
      "Ondoa na teketeza mimea yote yenye dalili mara moja — hakuna tiba na virusi huenea kwa kugusana.",
      "Osha mikono vizuri kwa sabuni na maji kabla ya kushughulikia mimea, na baada ya kugusa nyenzo yoyote iliyoambukizwa.",
      "Disinfect zana zote, nguzo, na vifungo kwa bleach ya 10% au pombe ya 70% kati ya matumizi.",
      "Usivute sigara au kutumia tumbaku karibu na mazao ya nyanya — tumbaku inaweza kubeba virusi vinavyohusiana.",
      "Panda aina za nyanya zinazostahimili ToMV na utumie miche iliyoidhinishwa bila ugonjwa misimu ijayo."
    ]},
  },
  // 37: Tomato Healthy
  37: {
    en: { disease: "Healthy Tomato Plant", treatment: [
      "Your tomato plant looks healthy — scout every 5 days for early blight, late blight, and whitefly.",
      "Apply a preventative copper spray before forecasted rainy spells to protect against bacterial and fungal threats.",
      "Side-dress with calcium nitrate every 3 weeks from first flower to prevent blossom end rot.",
      "Stake and prune side-shoots regularly to improve air circulation and concentrate energy into fruit.",
      "Maintain consistent even moisture — irregular watering leads to blossom end rot and fruit cracking."
    ]},
    sw: { disease: "Mmea wa Nyanya wenye Afya", treatment: [
      "Mmea wako wa nyanya unaonekana kuwa na afya — angalia kila siku 5 kwa early blight, late blight, na whitefly.",
      "Tumia dawa ya copper ya kinga kabla ya vipindi vya mvua vilivyotabiriwa kulinda dhidi ya vitisho vya bakteria na ukungu.",
      "Ongeza calcium nitrate pembeni kila wiki 3 kuanzia maua ya kwanza kuzuia magonjwa ya matunda.",
      "Simamisha na kata vichipukizi vya pembeni mara kwa mara kuboresha mzunguko wa hewa na kusanya nguvu kwa matunda.",
      "Dumisha unyevu thabiti na sawa — kumwagilia visivyo sawa husababisha magonjwa ya matunda na kupasuka."
    ]},
  },
};

const getGenericTreatment = (className, lang) => {
  const isHealthy = className.toLowerCase().includes("healthy");
  const formattedName = className.replace(/___/g, " - ").replace(/_/g, " ");
  
  if (isHealthy) {
    return {
      disease: lang === 'sw' ? `${formattedName} (Zao Lenye Afya)` : `${formattedName} (Healthy)`,
      treatment: lang === 'sw' 
        ? ["Zao lako linaonekana kuwa na afya. Endelea kufuatilia.", "Dumisha maji na mbolea vizuri."] 
        : ["Your crop appears healthy. Continue regular monitoring.", "Maintain proper irrigation and fertilization."]
    };
  }

  return {
    disease: formattedName,
    treatment: lang === 'sw'
      ? [
          "Ugonjwa huu umezinduliwa kwenye mmea mmoja au nyingi.",
          "Tenga mimea iliyoathiriwa ili kuzuia kuenea zaidi.",
          "Ondoa na tekeleza majani au matawi yaliyo na magonjwa mara moja.",
          "Ikiwa inafaa, tumia dawa ya kupambana na ukungu au wadudu kwa mimea yaliyobaki.",
          "Ikiwa uko na uhakika, wasiliana na afisa wa kilimo wa eneo lako haraka."
        ]
      : [
          "This disease has been detected on one or more plants.",
          "Isolate the affected plants to prevent further spread if possible.",
          "Prune and destroy severely infected leaves or branches immediately.",
          "Apply an appropriate fungicide or pesticide treatment depending on the exact pathogen.",
          "Consult your local agricultural extension officer for specific chemical recommendations."
        ]
  };
};

class TFJSService {
  constructor() {
    this.model = null;
    this.isLoaded = false;
  }

  async loadModel(modelUrl = '/model/model.json') {
    if (this.isLoaded) return;
    
    try {
      console.log('Loading Real PlantVillage TFJS model from', modelUrl);
      // Depending on the export tool, it might be a GraphModel or LayersModel.
      // TeachableMachine & common Keras exports are usually LayersModels.
      try {
        this.model = await tf.loadLayersModel(modelUrl);
      } catch (err) {
        // Fallback if it was exported as a Graph model
        console.log("Not a layers model, trying GraphModel...");
        this.model = await tf.loadGraphModel(modelUrl);
      }
      
      // Warm up the model
      const warmupResult = this.model.predict(tf.zeros([1, 224, 224, 3]));
      warmupResult.dispose();
      
      this.isLoaded = true;
      console.log('TFJS model loaded successfully!');
    } catch (error) {
      console.error('Failed to load TFJS model:', error);
      throw error;
    }
  }

  async predict(imageElement, lang = 'en') {
    if (!this.isLoaded || !this.model) {
      throw new Error("Model not loaded yet");
    }

    return tf.tidy(() => {
      // 1. Convert Image Element to Tensor
      let imgTensor = tf.browser.fromPixels(imageElement);

      // 2. Preprocess: Resize to 224x224
      imgTensor = tf.image.resizeBilinear(imgTensor, [224, 224]);
      
      // Normalize depending on how the model was trained. 
      // Typical MobileNet/PlantVillage transfers use standard normalizations over 255
      imgTensor = imgTensor.div(255.0);

      // 3. Expand dimensions to create a batch of 1
      const batchedImg = imgTensor.expandDims(0);

      // 4. Run inference
      const predictions = this.model.predict(batchedImg);
      
      // 5. Post-process
      const data = Array.from(predictions.dataSync());
      const maxIndex = data.indexOf(Math.max(...data));
      const highestConfidence = data[maxIndex];

      const className = CLASSES[maxIndex];

      // Retrieve treatment text: either specific (if we hand-wrote it) or generic
      const textData = SPECIFIC_TREATMENTS[maxIndex] 
        ? SPECIFIC_TREATMENTS[maxIndex][lang]
        : getGenericTreatment(className, lang);
      
      const result = {
        ...textData,
        confidence: Number(highestConfidence.toFixed(2)),
        _rawClass: className,
      };
      
      return result;
    });
  }
}

const tfjsService = new TFJSService();
export default tfjsService;
