// Cardiovascular & visceral systems: Chinese names and short descriptions.
// Keys are English names with a leading "Left/Right " removed (side is shown separately).

const V = {
  // heart
  'coronary artery': '冠狀動脈', 'Anterior interventricular artery': '前室間支（左前降支）', 'Septal branches of anterior interventricular artery': '前室間支的中隔支',
  'Circumflex artery of heart': '迴旋支', 'inferolateral branch of right coronary artery': '右冠狀動脈下外側支', 'atrium': '心房', 'ventricle': '心室',
  'Inferior papillary muscle of left ventricle': '左心室下乳頭肌', 'Anterior papillary muscle of right ventricle': '右心室前乳頭肌', 'Inferior papillary muscle of right ventricle': '右心室下乳頭肌',
  'Septal papillary muscle of right ventricle': '右心室中隔乳頭肌', 'Inferior leaflet of right atrioventricular valve': '三尖瓣下瓣葉', 'Posterior leaflet of left atrioventricular valve': '二尖瓣後瓣葉',
  'Septal leaflet of right atrioventricular valve': '三尖瓣中隔瓣葉', 'coronary leaflet': '主動脈瓣冠狀瓣葉', 'Non-coronary leaflet': '主動脈瓣無冠瓣葉',
  'Anterior semilunar leaflet of pulmonary valve': '肺動脈瓣前半月瓣', 'semilunar leaflet of pulmonary valve': '肺動脈瓣半月瓣',
  'Coronary sinus': '冠狀竇', 'Great cardiac vein': '心大靜脈', 'Inferior vein of left ventricle': '左心室下靜脈', "Inferior vein of left ventricle (//Posterior '')": '左心室下靜脈', 'Middle cardiac vein': '心中靜脈',
  // pulmonary
  'pulmonary artery': '肺動脈', 'Pulmonary trunk': '肺動脈幹', 'Bifurcation of pulmonary trunk': '肺動脈幹分叉', 'Inferior lobar artery of right lung': '右肺下葉動脈', 'Middle lobar artery of right lung': '右肺中葉動脈',
  'Superior lobar artery of right lung': '右肺上葉動脈', 'Inferior lingular artery of left lung': '左肺下舌段動脈', 'Superior lingular artery of left lung': '左肺上舌段動脈',
  '?x': '名稱不明的分支（原始資料名稱損毀）', '????????': '名稱不明的心臟靜脈（原始資料名稱損毀）', 'inferior pulmonary vein': '下肺靜脈', 'superior pulmonary vein': '上肺靜脈',
  // aorta & trunk
  'Ascending aorta': '升主動脈', 'Aortic arch': '主動脈弓', 'Thoracic aorta': '胸主動脈', 'Abdominal aorta': '腹主動脈', 'Brachiocephalic trunk': '頭臂幹',
  'Coeliac trunk': '腹腔幹', 'Common hepatic artery': '肝總動脈', 'Gastroduodenal artery': '胃十二指腸動脈', 'Proper hepatic artery': '肝固有動脈', 'gastric artery': '胃動脈', 'Splenic artery': '脾動脈',
  'Superior mesenteric artery': '腸繫膜上動脈', 'Inferior mesenteric artery': '腸繫膜下動脈', 'colic artery': '結腸動脈', 'Ascending branch of left colic artery': '左結腸動脈升支', 'Descending branch of left colic artery': '左結腸動脈降支',
  'Sigmoid arteries': '乙狀結腸動脈', 'Superior anorectal artery': '直腸上動脈', 'Inferior phrenic artery': '膈下動脈', 'Superior phrenic arteries': '膈上動脈', 'renal artery': '腎動脈', 'Anterior branch of renal artery': '腎動脈前支',
  'Posterior branch of renal artery': '腎動脈後支', 'Inferior suprarenal artery': '腎上腺下動脈', 'Intrarenal arteries of left kidney': '左腎內動脈', 'Intrarenal arteries of right kidney': '右腎內動脈', 'testicular artery': '睪丸動脈',
  'Lumbar arteries': '腰動脈', 'Ileocolic artery': '迴結腸動脈', 'Appendicular artery': '闌尾動脈', 'Colic branch of ileocolic artery': '迴結腸動脈結腸支', 'Ileal branch of ileocolic artery': '迴結腸動脈迴腸支',
  'Inferior pancreaticoduodenal artery': '胰十二指腸下動脈', 'Anterior inferior pancreaticoduodenal artery': '胰十二指腸前下動脈', 'Marginal artery': '結腸邊緣動脈', 'Middle colic artery': '中結腸動脈',
  'Posterior intercostal arteries': '肋間後動脈', 'Subcostal artery': '肋下動脈', 'Anterior spinal artery': '脊髓前動脈', 'Median sacral artery': '薦正中動脈',
  // pelvis
  'Common iliac artery': '髂總動脈', 'External iliac artery': '髂外動脈', 'Internal iliac artery': '髂內動脈', 'Inferior epigastric artery': '腹壁下動脈', 'Anterior division of internal iliac artery': '髂內動脈前幹',
  'Posterior division of internal iliac artery': '髂內動脈後幹', 'Inferior gluteal artery': '臀下動脈', 'Superior gluteal artery': '臀上動脈', 'Internal pudendal artery': '陰部內動脈', 'Deep artery of penis': '陰莖深動脈',
  'Dorsal artery of penis': '陰莖背動脈', 'Iliolumbar artery': '髂腰動脈', 'Iliacus branch of iliolumbar artery': '髂腰動脈髂肌支', 'Lumbar branch of iliolumbar artery': '髂腰動脈腰支', 'Spinal branch of iliolumbar artery': '髂腰動脈脊支',
  'Obturator artery': '閉孔動脈',
  // lower limb arteries
  'Femoral artery': '股動脈', 'Deep femoral artery': '股深動脈', 'Deep external pudendal artery': '陰部外深動脈', 'Superficial external pudendal artery': '陰部外淺動脈', 'Superficial epigastric artery': '腹壁淺動脈',
  'Lateral circumflex femoral artery': '旋股外側動脈', 'Descending branch of lateral circumflex femoral artery': '旋股外側動脈降支', 'Medial circumflex femoral artery': '旋股內側動脈', 'Perforating femoral arteries': '股深動脈穿支',
  'Popliteal artery': '膕動脈', 'Anterior tibial artery': '脛前動脈', 'Dorsalis pedis artery': '足背動脈', 'Arcuate artery': '弓狀動脈', 'Dorsal metatarsal arteries': '蹠背動脈', 'Dorsal digital arteries of foot': '趾背動脈',
  'Deep plantar artery': '足底深動脈', 'Lateral tarsal artery': '跗外側動脈', 'Inferior lateral genicular artery': '膝下外側動脈', 'Inferior medial genicular artery': '膝下內側動脈', 'Middle genicular artery': '膝中動脈',
  'Superior lateral genicular artery': '膝上外側動脈', 'Superior medial genicular artery': '膝上內側動脈', 'Patellar anastomosis': '髕骨動脈網', 'Posterior tibial artery': '脛後動脈', 'Calcaneal branches of posterior tibial artery': '脛後動脈跟支',
  'Fibular artery': '腓動脈', 'Calcaneal branches of fibular artery': '腓動脈跟支', 'Lateral plantar artery': '足底外側動脈', 'Medial plantar artery': '足底內側動脈', 'Superficial branch of medial plantar artery': '足底內側動脈淺支',
  'Plantar arch': '足底動脈弓', 'Plantar metatarsal arteries': '蹠足底動脈', 'Common plantar digital arteries': '趾足底總動脈', 'Proper plantar digital arteries': '趾足底固有動脈', 'Perforating branches of plantar metatarsal arteries': '蹠足底動脈穿支',
  // head & neck arteries
  'common carotid artery': '頸總動脈', 'External carotid artery': '頸外動脈', 'Internal carotid artery': '頸內動脈', 'Ascending pharyngeal artery': '咽升動脈', 'Facial artery': '顏面動脈', 'Angular artery': '內眥動脈',
  'Inferior labial artery': '下唇動脈', 'Superior labial artery': '上唇動脈', 'Submental artery': '頦下動脈', 'Maxillary artery': '上頜動脈', 'Anterior deep temporal artery': '顳深前動脈', 'Posterior deep temporal artery': '顳深後動脈',
  'Artery of pterygoid canal': '翼管動脈', 'Buccal artery': '頰動脈', 'Descending palatine artery': '腭降動脈', 'Greater palatine artery': '腭大動脈', 'Inferior alveolar artery': '下齒槽動脈', 'Mental branch of inferior alveolar artery': '下齒槽動脈頦支',
  'Mylohyoid branch of inferior alveolar artery': '下齒槽動脈下頜舌骨肌支', 'Infra-orbital artery': '眶下動脈', 'Middle meningeal artery': '腦膜中動脈', 'Accessory branch of middle meningeal artery': '腦膜中動脈副支',
  'Posterior lateral nasal branches of sphenopalatine artery.': '蝶腭動脈鼻後外側支', 'Posterior septal branches of sphenopalatine artery': '蝶腭動脈鼻中隔後支', 'Posterior superior alveolar artery': '上齒槽後動脈',
  'Occipital artery': '枕動脈', 'Superficial temporal artery': '顳淺動脈', 'Frontal branch of superficial temporal artery': '顳淺動脈額支', 'Transverse facial artery': '面橫動脈',
  'Ophthalmic artery': '眼動脈', 'Anterior ethmoidal artery': '篩前動脈', 'Anterior septal branches of anterior ethmoidal artery': '篩前動脈鼻中隔前支', 'Central retinal artery': '視網膜中央動脈', 'Lacrimal artery': '淚腺動脈',
  'Long posterior ciliary arteries': '睫狀後長動脈', 'Short posterior ciliary arteries': '睫狀後短動脈', 'Posterior ethmoidal artery': '篩後動脈', 'Septal branches of posterior ethmoidal artery': '篩後動脈鼻中隔支',
  'Supra-orbital artery': '眶上動脈', 'Supratrochlear artery': '滑車上動脈', 'Vertebral artery': '椎動脈', 'Basilar artery': '基底動脈', 'Posterior inferior cerebellar artery': '小腦下後動脈', 'Anterior inferior cerebellar artery': '小腦下前動脈',
  'Superior cerebellar artery': '小腦上動脈', 'Lateral pontine branches of basilar artery': '基底動脈橋腦外側支', 'Medial pontine branches of basilar artery': '基底動脈橋腦內側支',
  'Anterior communicating artery': '前交通動脈', 'Posterior communicating artery': '後交通動脈', 'Anterior cerebral artery': '大腦前動脈', 'Posterior cerebral artery': '大腦後動脈', 'Callosomarginal artery': '胼胝體緣動脈',
  'Frontal branches of callosomarginal artery': '胼胝體緣動脈額支', 'Orbitofrontal branches of anterior cerebral artery': '大腦前動脈眶額支', 'Pericallosal artery': '胼周動脈', 'Lateral occipital artery': '枕外側動脈',
  'Medial occipital artery': '枕內側動脈', 'Parieto-occipital artery': '頂枕動脈', 'Middle cerebral artery (M1-segment)': '大腦中動脈（M1 段）', 'Middle cerebral artery (M3 segment)': '大腦中動脈（M3 段）', 'Middle cerebral artery (M3-segment)': '大腦中動脈（M3 段）',
  'Insular branches of middle cerebral artery (M2-segment)': '大腦中動脈島葉支（M2 段）', 'Insular branches of middle cerebral artery (M2)': '大腦中動脈島葉支（M2 段）', 'Parietal branches of middle cerebral artery': '大腦中動脈頂葉支',
  'Temporal branches of middle cerebral artery': '大腦中動脈顳葉支', 'Distal lateral striate branches': '外側紋狀體支（遠段）', 'Proximal lateral striate branches': '外側紋狀體支（近段）', 'Anterior temporal branch': '顳前支', 'Posterior temporal branch': '顳後支',
  'Artery of precentral sulcus': '中央前溝動脈', 'Artery of central sulcus': '中央溝動脈', 'Postcentral arterial branch': '中央後溝支', 'Posterior parietal artery': '頂後動脈', 'Temporo-occipital branch': '顳枕支', 'Branch to angular gyrus': '角回支',
  'Prefrontal artery': '前額動脈', 'Lateral frontobasal artery': '額底外側動脈',
  // upper limb arteries
  'subclavian artery': '鎖骨下動脈', 'Axillary artery': '腋動脈', 'Anterior circumflex humeral artery': '旋肱前動脈', 'Posterior circumflex humeral artery': '旋肱後動脈', 'Brachial artery': '肱動脈', 'Deep brachial artery': '肱深動脈',
  'Middle collateral artery': '中副動脈', 'Radial collateral artery': '橈側副動脈', 'Inferior ulnar collateral artery': '尺側下副動脈', 'Superior ulnar collateral artery': '尺側上副動脈', 'Radial artery': '橈動脈', 'Ulnar artery': '尺動脈',
  'Ulnar recurrent artery': '尺側返動脈', 'Common interosseous artery': '骨間總動脈', 'Posterior interosseous artery': '骨間後動脈', 'Recurrent interosseous artery': '骨間返動脈', 'Deep palmar arch': '掌深弓', 'Superficial palmar arch': '掌淺弓',
  'Palmar metacarpal arteries': '掌心動脈', 'Dorsal carpal anastomosis': '腕背動脈網', 'Dorsal metacarpal arteries': '掌背動脈', 'Dorsal digital arteries of hand': '指背動脈', 'Palmar carpal branch of radial artery': '橈動脈腕掌支',
  'Dorsal carpal branch of ulnar artery': '尺動脈腕背支', 'Common palmar digital arteries': '指掌側總動脈', 'Proper palmar digital arteries': '指掌側固有動脈', 'Lateral thoracic artery': '胸外側動脈', 'Subscapular artery': '肩胛下動脈',
  'Circumflex scapular artery': '旋肩胛動脈', 'Thoracodorsal artery': '胸背動脈', 'Thoraco-acromial artery': '胸肩峰動脈', 'Pectoral branches of thoraco-acromial artery': '胸肩峰動脈胸肌支', 'Costocervical trunk': '肋頸幹',
  'Deep cervical artery': '頸深動脈', 'Supreme intercostal artery': '肋間最上動脈', 'First posterior intercostal artery': '第一肋間後動脈', 'Second posterior intercostal artery': '第二肋間後動脈', 'Internal thoracic artery': '胸廓內動脈',
  'Musculophrenic artery': '肌膈動脈', 'Superior epigastric artery': '腹壁上動脈', 'Thyrocervical trunk': '甲狀頸幹', 'Inferior thyroid artery': '甲狀腺下動脈', 'Suprascapular artery': '肩胛上動脈', 'Transverse cervical artery': '頸橫動脈',
  'Deep branch of transverse cervical artery': '頸橫動脈深支', 'Superficial branch of transverse cervical artery': '頸橫動脈淺支',
  // veins
  'Inferior petrosal sinus': '岩下竇', 'Superior petrosal sinus': '岩上竇', 'Basilar venous plexus': '基底靜脈叢', 'Anterior intercavernous sinus': '海綿間前竇', 'Posterior intercavernous sinus': '海綿間後竇', 'Cavernous sinus': '海綿竇',
  'Sigmoid sinus': '乙狀竇', 'Transverse sinus': '橫竇', 'Inferior sagittal sinus': '下矢狀竇', 'Superior sagittal sinus': '上矢狀竇', 'Occipital sinus': '枕竇', 'Straight sinus': '直竇', 'Inferior ophthalmic vein': '眼下靜脈',
  'Superior ophthalmic vein': '眼上靜脈', 'Femoral vein': '股靜脈', 'Deep femoral vein': '股深靜脈', 'Perforating veins': '穿靜脈', 'Great saphenous vein': '大隱靜脈', 'Small saphenous vein': '小隱靜脈', 'External pudendal veins': '陰部外靜脈',
  'Superficial epigastric vein': '腹壁淺靜脈', 'Lateral circumflex femoral veins': '旋股外側靜脈', 'Medial circumflex femoral veins': '旋股內側靜脈', 'Popliteal vein': '膕靜脈', 'Anterior tibial veins': '脛前靜脈', 'Genicular veins': '膝靜脈',
  'Posterior tibial veins': '脛後靜脈', 'Fibular veins': '腓靜脈', 'Lateral plantar veins': '足底外側靜脈', 'Medial plantar veins': '足底內側靜脈', 'Plantar venous arch': '足底靜脈弓', 'Plantar metatarsal veins': '蹠足底靜脈',
  'Plantar digital veins': '趾足底靜脈', 'Dorsal venous arch of foot': '足背靜脈弓', 'Dorsal metatarsal veins': '蹠背靜脈', 'Dorsal digital veins of foot': '趾背靜脈', 'Intercapitular veins of foot': '足頭間靜脈',
  'Superficial dorsal veins of penis': '陰莖背淺靜脈', 'Deep dorsal vein of penis': '陰莖背深靜脈', 'Splenic vein': '脾靜脈', 'Inferior mesenteric vein': '腸繫膜下靜脈', 'Superior mesenteric vein': '腸繫膜上靜脈', 'Sigmoid veins': '乙狀結腸靜脈',
  'gastro-omental vein': '胃網膜靜脈', 'Middle colic vein': '中結腸靜脈', 'colic vein': '結腸靜脈', 'Hepatic portal vein': '肝門靜脈', 'Hepatic veins': '肝靜脈', 'Inferior vena cava (thoracic part)': '下腔靜脈（胸段）',
  'Inferior vena cava (abdominal part)': '下腔靜脈（腹段）', 'Superior vena cava': '上腔靜脈', 'Common iliac vein': '髂總靜脈', 'External iliac vein': '髂外靜脈', 'Internal iliac vein': '髂內靜脈', 'Inferior epigastric vein': '腹壁下靜脈',
  'Iliolumbar vein': '髂腰靜脈', 'Inferior gluteal veins': '臀下靜脈', 'Superior gluteal veins': '臀上靜脈', 'Internal pudendal vein': '陰部內靜脈', 'Lateral sacral veins': '薦外側靜脈', 'renal vein': '腎靜脈',
  'Intrarenal veins of left kidney': '左腎內靜脈', 'Intrarenal veins of right kidney': '右腎內靜脈', 'testicular vein': '睪丸靜脈', 'Lumbar veins': '腰靜脈', 'Internal jugular vein': '頸內靜脈', 'External jugular vein': '頸外靜脈',
  'Anterior jugular vein': '頸前靜脈', 'Common facial vein': '面總靜脈', 'Retromandibular vein': '下頜後靜脈', 'Anterior division of retromandibular vein': '下頜後靜脈前支', 'Posterior division of retromandibular vein': '下頜後靜脈後支',
  'Maxillary veins': '上頜靜脈', 'Superficial temporal veins': '顳淺靜脈', 'Facial vein': '顏面靜脈', 'Angular vein': '內眥靜脈', 'Inferior labial veins': '下唇靜脈', 'Superior labial vein': '上唇靜脈', 'Submental vein': '頦下靜脈',
  'Lingual vein': '舌靜脈', 'Superior thyroid vein': '甲狀腺上靜脈', 'subclavian vein': '鎖骨下靜脈', 'Axillary vein': '腋靜脈', 'Anterior circumflex humeral vein': '旋肱前靜脈', 'Posterior circumflex humeral vein': '旋肱後靜脈',
  'Basilic vein': '貴要靜脈', 'Cephalic vein': '頭靜脈', 'Median cubital vein': '肘正中靜脈', 'Median antebrachial vein': '前臂正中靜脈', 'Brachial veins': '肱靜脈', 'Radial veins': '橈靜脈', 'Ulnar veins': '尺靜脈',
  'Deep venous palmar arch': '掌深靜脈弓', 'Superficial venous palmar arch': '掌淺靜脈弓', 'Palmar digital veins': '指掌側靜脈', 'Dorsal venous network of hand': '手背靜脈網', 'Dorsal digital veins of hand': '指背靜脈',
  'Lateral thoracic vein': '胸外側靜脈', 'Subscapular vein': '肩胛下靜脈', 'Circumflex scapular vein': '旋肩胛靜脈', 'Thoracodorsal vein': '胸背靜脈', 'Posterior auricular vein': '耳後靜脈', 'Suprascapular vein': '肩胛上靜脈',
  'Azygos vein': '奇靜脈', 'Hemi-azygos vein': '半奇靜脈', 'Accessory hemi-azygos vein': '副半奇靜脈', 'ascending lumbar vein': '腰升靜脈', 'subcostal vein': '肋下靜脈', 'superior intercostal vein': '肋間上靜脈',
  'superior phrenic vein': '膈上靜脈', 'brachiocephalic vein': '頭臂靜脈', 'Internal thoracic veins': '胸廓內靜脈', 'Musculophrenic veins': '肌膈靜脈', 'Superior epigastric veins': '腹壁上靜脈', 'Vertebral vein': '椎靜脈', 'Occipital vein': '枕靜脈',
};

const O = {
  'Greater omentum': '大網膜', 'Lesser omentum': '小網膜', 'Mesocolon': '結腸繫膜', 'Meso-appendix': '闌尾繫膜', 'Ascending colon': '升結腸', 'Descending colon': '降結腸', 'Sigmoid colon': '乙狀結腸', 'Transverse colon': '橫結腸',
  'Free taenia': '獨立結腸帶', 'Mesocolic taenia': '繫膜結腸帶', 'Omental taenia': '網膜結腸帶', 'Vermiform appendix': '闌尾', 'Oesophagus': '食道', 'Duodenum': '十二指腸', 'Jejunum': '空腸', 'Stomach': '胃', 'Mucosa of stomach': '胃黏膜',
  'Bile duct': '膽總管', 'Gallbladder': '膽囊', 'Liver': '肝臟', 'Anterior lateral segment of liver (VI)': '肝臟第 VI 段', 'Anterior medial segment of liver (V)': '肝臟第 V 段', 'anterior lateral segment of liver (III)': '肝臟第 III 段',
  'medial segment of liver (IV)': '肝臟第 IV 段', 'posterior lateral segment of liver (II)': '肝臟第 II 段', 'Posterior lateral segment of liver (VII)': '肝臟第 VII 段', 'Posterior medial segment of liver (VIII)': '肝臟第 VIII 段',
  'Posterior segment of liver (I)': '肝臟第 I 段（尾狀葉）', 'Gingiva': '牙齦', 'Accessory parotid gland': '副腮腺', 'Parotid duct': '腮腺管', 'Parotid gland': '腮腺', 'Sublingual gland': '舌下腺', 'Submandibular duct': '頜下腺管',
  'Submandibular gland': '頜下腺', 'Soft palate': '軟腭', 'Tongue': '舌', 'Uvula of palate': '懸雍垂', 'Pancreas': '胰臟', 'Accessory pancreatic duct': '副胰管', 'Pancreatic duct': '胰管', 'Laryngopharynx': '喉咽', 'Nasopharynx': '鼻咽',
  'Oropharynx': '口咽', 'Adenohypophysis': '腦下垂體前葉', 'Neurohypophysis': '腦下垂體後葉', 'Inferior parathyroid gland': '下副甲狀腺', 'Superior parathyroid gland': '上副甲狀腺', 'Pineal gland': '松果體', 'Suprarenal gland': '腎上腺',
  'Thyroid gland': '甲狀腺', 'Corpus cavernosum of penis': '陰莖海綿體', 'Corpus spongiosum of penis': '尿道海綿體', 'Glans penis': '龜頭', 'Ductus deferens': '輸精管', 'Ejaculatory duct': '射精管', 'Epididymis': '副睪', 'Prostate': '攝護腺',
  'Seminal gland': '精囊', 'Testis': '睪丸', 'Epiglottis': '會厭', 'Inferior lobe of left lung': '左肺下葉', 'Superior lobe of left lung': '左肺上葉', 'Inferior lobe of right lung': '右肺下葉', 'Middle lobe of right lung': '右肺中葉',
  'Superior lobe of right lung': '右肺上葉', 'Mucosa of nasal cavity': '鼻腔黏膜', 'main bronchus': '主支氣管', 'inferior lobar bronchus': '下葉支氣管', 'superior lobar bronchus': '上葉支氣管', 'Intermediate bronchus': '中間支氣管',
  'Middle lobar bronchus': '中葉支氣管', 'Trachea': '氣管', 'Pleura': '胸膜', 'Fibrous capsule of kidney': '腎纖維囊', 'Hilum of kidney': '腎門', 'Renal columns': '腎柱', 'Renal cortex': '腎皮質', 'Renal papillae': '腎乳頭',
  'Renal pyramids': '腎錐體', 'Renal pelvis': '腎盂', 'Major calices': '腎大盞', 'Minor calices': '腎小盞', 'Ureter': '輸尿管', 'Urethra': '尿道', 'Urinary bladder': '膀胱',
};

// lung segments (arteries, veins, bronchi)
const SEG = {
  'Apical': '尖', 'Posterior': '後', 'Anterior': '前', 'Superior': '上（背）', 'Lateral': '外側', 'Medial': '內側', 'Apicoposterior': '尖後',
  'Anterior basal': '前底', 'Lateral basal': '外側底', 'Medial basal': '內側底', 'Posterior basal': '後底', 'Anteromedial basal': '前內側底',
  'Superior lingular': '上舌', 'Inferior lingular': '下舌', 'Inferior basal': '下底', 'Superior basal': '上底', 'Lingular': '舌',
};

function lungName(n) {
  let m = /^(.*?) segmental (artery|bronchus) of (left|right) lung(?: \((.+)\))?$/.exec(n);
  if (m && SEG[m[1]]) return (m[3] === 'left' ? '左' : '右') + '肺' + SEG[m[1]] + '段' + (m[2] === 'artery' ? '動脈' : '支氣管') + (m[4] ? `（${m[4]}）` : '');
  m = /^(.*?) vein of (left|right) lung$/.exec(n);
  if (m && SEG[m[1]]) return (m[2] === 'left' ? '左' : '右') + '肺' + SEG[m[1]] + '靜脈';
  return null;
}

export function organZh(name, sys) {
  const n = name.replace(/^\((.*)\)$/, '$1').replace(/^(Left|Right) /, '');
  const map = sys === 'visceral' ? O : V;
  return map[n] || map[n.charAt(0).toLowerCase() + n.slice(1)] || lungName(n) || null;
}

export function organKind(name, path) {
  if (/arterial/.test(path)) return 'a';
  if (/venous/.test(path)) return 'v';
  return 'o';
}

export function organInfo(name, kind, path) {
  const n = name;
  if (/atrium|ventricle|papillary|leaflet|valve/i.test(n) && kind !== 'o') return '心臟的一部分：心房收集回流的血液，心室把血液打出去；瓣膜和乳頭肌讓血液只往一個方向流。';
  if (/coronary|cardiac vein|Coronary sinus|interventricular|Circumflex artery of heart/i.test(n)) return '冠狀血管：供應心肌本身的血液。冠狀動脈阻塞就是心肌梗塞。';
  if (/pulmonary|lung/i.test(n) && kind !== 'o') return kind === 'a' ? '肺動脈：把缺氧的血從右心室送到肺部交換氣體（是唯一攜帶缺氧血的動脈）。' : '肺靜脈：把肺部充氧後的血送回左心房。';
  if (/sinus|venous plexus/i.test(n) && kind === 'v') return '硬腦膜靜脈竇：腦部的靜脈血先匯集到這些夾在硬腦膜之間的管道，再流到頸內靜脈。';
  if (kind === 'a') return '動脈：把心臟打出的血液送到身體各處。動脈通常和同名的靜脈、神經伴行。';
  if (kind === 'v') return /saphenous|Cephalic|Basilic|Median cubital|jugular vein|dorsal vein|venous network|venous arch/i.test(n)
    ? '淺層靜脈：走在皮下，抽血、打點滴常用；靜脈曲張也多發生在淺層靜脈。'
    : '靜脈：把身體各處的血液送回心臟。四肢深層靜脈常成對伴行同名動脈。';
  if (/digestive/.test(path)) return '消化系統：攝取、消化食物並吸收養分。';
  if (/respiratory/.test(path)) return '呼吸系統：空氣經鼻、咽、喉、氣管、支氣管進入肺，在肺泡交換氧氣和二氧化碳。';
  if (/urinary/.test(path)) return '泌尿系統：腎臟過濾血液產生尿液，經輸尿管、膀胱、尿道排出。';
  if (/genital/.test(path)) return '生殖系統。';
  if (/endocrine/.test(path)) return '內分泌腺：分泌激素到血液中，調節生長、代謝、壓力反應等。';
  if (/cavity/.test(path)) return '腹膜和網膜：包住或懸吊腹腔內臟的薄膜。';
  return '內臟器官。';
}
