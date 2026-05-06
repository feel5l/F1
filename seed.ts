
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const studentsData = [
  // === ثالث ابتدائي 1 (24 طالب) ===
  { id: "S0001", fullName: "أركان ابراهيم قاسم العواضي", className: "ثالث ابتدائي 1", guardianName: "ابراهيم قاسم منصور العواضي", guardianPhone: "966509486992", isActive: true },
  { id: "S0002", fullName: "احمد جمال بابكر الجباره", className: "ثالث ابتدائي 1", guardianName: "فادية حسن عبد الرحمن محمد", guardianPhone: "966538752312", isActive: true },
  { id: "S0003", fullName: "الوليد احمد علي المعمري", className: "ثالث ابتدائي 1", guardianName: "احمد علي خميس المعمري", guardianPhone: "966508916174", isActive: true },
  { id: "S0004", fullName: "باسل محمد بشير عمر", className: "ثالث ابتدائي 1", guardianName: "محمد بشير عمر ابراهيم", guardianPhone: "966534755113", isActive: true },
  { id: "S0005", fullName: "تركي أحمد عبار الشمري", className: "ثالث ابتدائي 1", guardianName: "أحمد عبار رحيل الشمري", guardianPhone: "966551702678", isActive: true },
  { id: "S0006", fullName: "حسن بخيت حمد القحطاني", className: "ثالث ابتدائي 1", guardianName: "بخيت حمد حامد القحطاني", guardianPhone: "966563086841", isActive: true },
  { id: "S0007", fullName: "حمود أحمد نواف الكنيس", className: "ثالث ابتدائي 1", guardianName: "احمد نوف الكنيس", guardianPhone: "966542638126", isActive: true },
  { id: "S0008", fullName: "راكان محمد بن علي العجمي", className: "ثالث ابتدائي 1", guardianName: "محمد علي مسفر العجمي", guardianPhone: "966552515446", isActive: true },
  { id: "S0009", fullName: "صالح جمال صالح علي", className: "ثالث ابتدائي 1", guardianName: "جمال صالح على كشيم", guardianPhone: "966596230648", isActive: true },
  { id: "S0010", fullName: "صالح عبد الهادي صالح المري", className: "ثالث ابتدائي 1", guardianName: "عبد الهادي بن صالح بن راشد الشدوق", guardianPhone: "966505578059", isActive: true },
  { id: "S0011", fullName: "عبد الرحمن شاجع فهد", className: "ثالث ابتدائي 1", guardianName: "رجسا سالم عايض العرجاني", guardianPhone: "966553132313", isActive: true },
  { id: "S0012", fullName: "علي خالد علي الصيعري", className: "ثالث ابتدائي 1", guardianName: "خالد علي سليمان الصيعري", guardianPhone: "966544410693", isActive: true },
  { id: "S0013", fullName: "عمر صالح محمد الوجيه", className: "ثالث ابتدائي 1", guardianName: "صالح محمد ناجي الوجيه", guardianPhone: "966561617140", isActive: true },
  { id: "S0014", fullName: "فياض فياض بن فهد العجمي", className: "ثالث ابتدائي 1", guardianName: "فياض فهد فياض العجمي", guardianPhone: "966556638543", isActive: true },
  { id: "S0015", fullName: "مبارك علي بن سالم المهري", className: "ثالث ابتدائي 1", guardianName: "علي بن سالم بن عامر المهري", guardianPhone: "966566522046", isActive: true },
  { id: "S0016", fullName: "مبارك محمد مبارك الدوسري", className: "ثالث ابتدائي 1", guardianName: "غزيل عبد الهادي عبد المحسن", guardianPhone: "966536301030", isActive: true },
  { id: "S0017", fullName: "محمد توفيق مهيوب المجيدي", className: "ثالث ابتدائي 1", guardianName: "توفيق مهيوب عبده المجيدي", guardianPhone: "966550206622", isActive: true },
  { id: "S0018", fullName: "محمد خالد علي المهري", className: "ثالث ابتدائي 1", guardianName: "خالد علي بن حسن المهري", guardianPhone: "966561202359", isActive: true },
  { id: "S0019", fullName: "محمد علي بن سالم المهري", className: "ثالث ابتدائي 1", guardianName: "علي بن سالم بن عامر المهري", guardianPhone: "966566522046", isActive: true },
  { id: "S0020", fullName: "مذكر ذيب حسن ال جابر", className: "ثالث ابتدائي 1", guardianName: "ذيب بن حسن بن صعيب ال جابر", guardianPhone: "966559098812", isActive: true },
  { id: "S0021", fullName: "ناصر سالم بداح الدوسري", className: "ثالث ابتدائي 1", guardianName: "سالم بداح بن سالم الدوسري", guardianPhone: "966533993406", isActive: true },
  { id: "S0022", fullName: "ناصر عبد الله ناصر الشكرة", className: "ثالث ابتدائي 1", guardianName: "عبد الله ناصر عبد الله الشكرة الدوسري", guardianPhone: "966539045560", isActive: true },
  { id: "S0023", fullName: "يوسف بسام ابوعون", className: "ثالث ابتدائي 1", guardianName: "بسام احمد ابوعون", guardianPhone: "966570940685", isActive: true },
  { id: "S0024", fullName: "يوسف راشد صالح", className: "ثالث ابتدائي 1", guardianName: "راشد صالح السلامه", guardianPhone: "966599223540", isActive: true },

  // === ثالث ابتدائي 2 (25 طالب) ===
  { id: "S0025", fullName: "تیم احمد محمد الرويثي", className: "ثالث ابتدائي 2", guardianName: "احمد محمد جري الرويثي", guardianPhone: "966547280509", isActive: true },
  { id: "S0026", fullName: "جابر مسلم بن عامر الدوسري", className: "ثالث ابتدائي 2", guardianName: "مسلم عامر مسلم الدوسري", guardianPhone: "966536018204", isActive: true },
  { id: "S0027", fullName: "حزام صالح حسين العواضي", className: "ثالث ابتدائي 2", guardianName: "صالح حسين سالم العواضي", guardianPhone: "966501444136", isActive: true },
  { id: "S0028", fullName: "خالد بن سلطان بن محمد العنزي", className: "ثالث ابتدائي 2", guardianName: "محمد سلطان محمد العنزي", guardianPhone: "966560522215", isActive: true },
  { id: "S0029", fullName: "خطاب هلال محسن سالم", className: "ثالث ابتدائي 2", guardianName: "هلال محسن سالم باديان", guardianPhone: "966502738384", isActive: true },
  { id: "S0030", fullName: "راشد جراح راشد الرشيدي", className: "ثالث ابتدائي 2", guardianName: "جراح راشد جراح الرشيدي", guardianPhone: "966555135118", isActive: true },
  { id: "S0031", fullName: "راشد حزام راشد المري", className: "ثالث ابتدائي 2", guardianName: "حزام راشد راشد المري", guardianPhone: "966558222953", isActive: true },
  { id: "S0032", fullName: "راكان نايف بن مطرب العتيبي", className: "ثالث ابتدائي 2", guardianName: "نايف بن مطرب بن مذكر العتيبي", guardianPhone: "966540679777", isActive: true },
  { id: "S0033", fullName: "ريان فواز عايد الرشيدي", className: "ثالث ابتدائي 2", guardianName: "فواز عايد عبيد الرشيدي", guardianPhone: "966559388836", isActive: true },
  { id: "S0034", fullName: "سلطان تركي بن فهد الدوسري", className: "ثالث ابتدائي 2", guardianName: "تركي بن فهد بن فهيد الدوسري", guardianPhone: "966530666013", isActive: true },
  { id: "S0035", fullName: "عذبي فياض بن فهد العجمي", className: "ثالث ابتدائي 2", guardianName: "فياض فهد فياض العجمي", guardianPhone: "966556638543", isActive: true },
  { id: "S0036", fullName: "عسكر فياض بن فهد العجمي", className: "ثالث ابتدائي 2", guardianName: "فياض فهد فياض العجمي", guardianPhone: "966556638543", isActive: true },
  { id: "S0037", fullName: "عقيل ابكر يوسف عقيلي", className: "ثالث ابتدائي 2", guardianName: "ابكر يوسف بن يحيى عقيلي", guardianPhone: "966552250106", isActive: true },
  { id: "S0038", fullName: "علي حسن بخيت القحطاني", className: "ثالث ابتدائي 2", guardianName: "حسن بخيت القحطاني", guardianPhone: "966537777178", isActive: true },
  { id: "S0039", fullName: "فهد محمد بن علي العجمي", className: "ثالث ابتدائي 2", guardianName: "محمد علي مسفر العجمي", guardianPhone: "966552515446", isActive: true },
  { id: "S0040", fullName: "فيصل نوار هلال العتيبي", className: "ثالث ابتدائي 2", guardianName: "نوار هلال عوض العتيبي", guardianPhone: "966551842917", isActive: true },
  { id: "S0041", fullName: "مبارك بخيت بن فيصل المجدول", className: "ثالث ابتدائي 2", guardianName: "بخيت فيصل مبارك الدوسرى", guardianPhone: "966505216668", isActive: true },
  { id: "S0042", fullName: "مبارك عبد الله مبارك الدوسري", className: "ثالث ابتدائي 2", guardianName: "عبدالله مبارك عبدالله الشكرا الدوسري", guardianPhone: "966567300445", isActive: true },
  { id: "S0043", fullName: "مبارك محمد بن مبارك العجمي", className: "ثالث ابتدائي 2", guardianName: "محمد مبارك بن مبارك العجمي", guardianPhone: "966556277708", isActive: true },
  { id: "S0044", fullName: "محمد حمود مطر الشمري", className: "ثالث ابتدائي 2", guardianName: "حمود مطر كنعان الشمري", guardianPhone: "966554522964", isActive: true },
  { id: "S0045", fullName: "محمد خليف عناد الشمري", className: "ثالث ابتدائي 2", guardianName: "خليف عناد مخلف الشمري", guardianPhone: "966507421113", isActive: true },
  { id: "S0046", fullName: "محمد هلال محسن سالم", className: "ثالث ابتدائي 2", guardianName: "هلال محسن سالم باديان", guardianPhone: "966502738384", isActive: true },
  { id: "S0047", fullName: "ناصر مفرح بن عبد الله العجمي", className: "ثالث ابتدائي 2", guardianName: "مفرح عبد الله بن هادي العجمي", guardianPhone: "966505646197", isActive: true },
  { id: "S0048", fullName: "يحيى ناصر علي عريشي", className: "ثالث ابتدائي 2", guardianName: "ناصر علي بن يحيى عريشي", guardianPhone: "966531317136", isActive: true },
  { id: "S0049", fullName: "يزن محمد عبده الشمراني", className: "ثالث ابتدائي 2", guardianName: "محمد عبده احمد الشمراني", guardianPhone: "966558455792", isActive: true },

  // === ثالث ابتدائي 3 (24 طالب) ===
  { id: "S0050", fullName: "إبراهيم أحمد إبراهيم أبو الغيث", className: "ثالث ابتدائي 3", guardianName: "أحمد إبراهيم هادي أبو الغيث", guardianPhone: "966502127263", isActive: true },
  { id: "S0051", fullName: "احمد حسن بن صالح المهري", className: "ثالث ابتدائي 3", guardianName: "حسن صالح حسن المهري", guardianPhone: "966548777114", isActive: true },
  { id: "S0052", fullName: "احمد مبارك بن سالم المهري", className: "ثالث ابتدائي 3", guardianName: "سالم بخيت سالم المهري", guardianPhone: "966547666014", isActive: true },
  { id: "S0053", fullName: "بدر عواد مغيران الرشيدي", className: "ثالث ابتدائي 3", guardianName: "عواد مغيران حمدان الرشيدي", guardianPhone: "966507466144", isActive: true },
  { id: "S0054", fullName: "تميم مشاري عبد الرحمن التميمي", className: "ثالث ابتدائي 3", guardianName: "مشاري عبد الرحمن التميمي", guardianPhone: "966551139441", isActive: true },
  { id: "S0055", fullName: "جلال عبد الله جلال مرعي", className: "ثالث ابتدائي 3", guardianName: "عبد الله جلال بن علي مرعي", guardianPhone: "966541570775", isActive: true },
  { id: "S0056", fullName: "حسن زكريا يحيى خبراني", className: "ثالث ابتدائي 3", guardianName: "زكريا يحيى يحيى خبراني", guardianPhone: "966553855584", isActive: true },
  { id: "S0057", fullName: "راجح فهد فياض العجمي", className: "ثالث ابتدائي 3", guardianName: "فهد فياض بن هادي العجمي", guardianPhone: "966556111002", isActive: true },
  { id: "S0058", fullName: "رشيد ممدوح رشيد الشمري", className: "ثالث ابتدائي 3", guardianName: "ممدوح رشيد مرضي الشمري", guardianPhone: "966538053641", isActive: true },
  { id: "S0059", fullName: "زياد طارق عبده محمد كمال", className: "ثالث ابتدائي 3", guardianName: "طارق عبده محمد كمال", guardianPhone: "966541603511", isActive: true },
  { id: "S0060", fullName: "شجاع ناصر بن شجاع العجمي", className: "ثالث ابتدائي 3", guardianName: "ناصر شجاع دليبان العجمي", guardianPhone: "966506893693", isActive: true },
  { id: "S0061", fullName: "عبد العزيز محمد بن مبارك المجدول", className: "ثالث ابتدائي 3", guardianName: "محمد بن مبارك بن فيصل المجدول", guardianPhone: "966545222045", isActive: true },
  { id: "S0062", fullName: "عبد الله حيان بن جعران الصيعري", className: "ثالث ابتدائي 3", guardianName: "حيان جعران صالح الصيعري", guardianPhone: "966558661601", isActive: true },
  { id: "S0063", fullName: "عبد الله يحيى احمد عريشي", className: "ثالث ابتدائي 3", guardianName: "يحيى احمد علي عريشي", guardianPhone: "966558473215", isActive: true },
  { id: "S0064", fullName: "علي سالم زري مسفر", className: "ثالث ابتدائي 3", guardianName: "سالم زري بن مسفر المهري", guardianPhone: "966564619478", isActive: true },
  { id: "S0065", fullName: "غنام نايف بن غنام الدوسري", className: "ثالث ابتدائي 3", guardianName: "نايف غنام بن جفران الدوسري", guardianPhone: "966556144415", isActive: true },
  { id: "S0066", fullName: "فيصل خالد فيصل الدوسري", className: "ثالث ابتدائي 3", guardianName: "خالد بن فيصل بن بخيت الدوسري", guardianPhone: "966551222453", isActive: true },
  { id: "S0067", fullName: "مبارك محمد بن راشد المري", className: "ثالث ابتدائي 3", guardianName: "محمد بن راشد بن عتيق المري", guardianPhone: "966503923304", isActive: true },
  { id: "S0068", fullName: "محمد جابر بن مبارك المري", className: "ثالث ابتدائي 3", guardianName: "جابر مبارك حمد جابر المري", guardianPhone: "966557555027", isActive: true },
  { id: "S0069", fullName: "محمد ضافي فهد العجمي", className: "ثالث ابتدائي 3", guardianName: "ضافي فهد ضافي العجمي", guardianPhone: "966551066700", isActive: true },
  { id: "S0070", fullName: "محمد يحيى علي خبراني", className: "ثالث ابتدائي 3", guardianName: "يحيى علي يحيى خبراني", guardianPhone: "966504240321", isActive: true },
  { id: "S0071", fullName: "ناصر راشد ناصر الدوسري", className: "ثالث ابتدائي 3", guardianName: "راشد ناصر بن عبدالله الدوسري", guardianPhone: "966532050058", isActive: true },
  { id: "S0072", fullName: "ياسين محمد عبد الفتاح محمد مرسي", className: "ثالث ابتدائي 3", guardianName: "محمد عبد الفتاح محمد مرسي", guardianPhone: "966556195723", isActive: true },
  { id: "S0073", fullName: "يعقوب يوسف محمد اليعقوب", className: "ثالث ابتدائي 3", guardianName: "يوسف محمد يعقوب اليعقوب", guardianPhone: "966548548981", isActive: true },

  // === ثالث ابتدائي 4 (25 طالب) ===
  { id: "S0074", fullName: "إياد فايع عبده مشني", className: "ثالث ابتدائي 4", guardianName: "فايع عبده محمد مشني", guardianPhone: "966502251341", isActive: true },
  { id: "S0075", fullName: "احمد تيمور بكر بخيت", className: "ثالث ابتدائي 4", guardianName: "تيمور بكر بخيت عثمان", guardianPhone: "966561113061", isActive: true },
  { id: "S0076", fullName: "احمد سالم بن صالح لمهري", className: "ثالث ابتدائي 4", guardianName: "سالم صالح حسن المهري", guardianPhone: "966548777114", isActive: true },
  { id: "S0077", fullName: "المنذر محمد علي المعمري", className: "ثالث ابتدائي 4", guardianName: "محمد علي خميس المعمري", guardianPhone: "966591113002", isActive: true },
  { id: "S0078", fullName: "تركي محمد نويجع الرشيدي", className: "ثالث ابتدائي 4", guardianName: "محمد نويجع ربيع الرشيدي", guardianPhone: "966559388836", isActive: true },
  { id: "S0079", fullName: "تركي ناصر ضيف الله العتيبي", className: "ثالث ابتدائي 4", guardianName: "ناصر ضيف الله فالح العتيبي", guardianPhone: "966502621115", isActive: true },
  { id: "S0080", fullName: "تميم مشعل بن ناصر الدوسري", className: "ثالث ابتدائي 4", guardianName: "مشعل بن ناصر بن خلف الدوسري", guardianPhone: "966505711677", isActive: true },
  { id: "S0081", fullName: "جاسم مرزوق عبيد الشمري", className: "ثالث ابتدائي 4", guardianName: "سويره هلال محسن الشمري", guardianPhone: "966552554604", isActive: true },
  { id: "S0082", fullName: "جابر محمد بن جابر الصيعري", className: "ثالث ابتدائي 4", guardianName: "محمد جابر بن عامر الصيعري", guardianPhone: "966544061805", isActive: true },
  { id: "S0083", fullName: "حبيب مروان حسين القشيري", className: "ثالث ابتدائي 4", guardianName: "مروان حسين سليم القشيري", guardianPhone: "966540643725", isActive: true },
  { id: "S0084", fullName: "حمد عبد الله حمد الدوسري", className: "ثالث ابتدائي 4", guardianName: "عبد الله بن حمد بن عبدالله الشكرة", guardianPhone: "966505414441", isActive: true },
  { id: "S0085", fullName: "دليم غنام بن جفران الدوسري", className: "ثالث ابتدائي 4", guardianName: "غنام بن جفران بن محمد الدوسري", guardianPhone: "966533033332", isActive: true },
  { id: "S0086", fullName: "راكان سليم بن مسلم المهري", className: "ثالث ابتدائي 4", guardianName: "سليم مسلم عامر المهري", guardianPhone: "966565111002", isActive: true },
  { id: "S0087", fullName: "سلمان هادي بن دليم القحطاني", className: "ثالث ابتدائي 4", guardianName: "هادي دليم مسفر القحطاني", guardianPhone: "966506456075", isActive: true },
  { id: "S0088", fullName: "عبد الرحمن حسن بن محمد هبة", className: "ثالث ابتدائي 4", guardianName: "حسن محمد احمد هبه", guardianPhone: "966551982705", isActive: true },
  { id: "S0089", fullName: "عبد العزيز حمود بن راشد المري", className: "ثالث ابتدائي 4", guardianName: "حمود راشد الشدوق المري", guardianPhone: "966502213600", isActive: true },
  { id: "S0090", fullName: "عبد العزيز محمد سالم المجدول", className: "ثالث ابتدائي 4", guardianName: "محمد بن سالم بن محمد القحطاني", guardianPhone: "966556113214", isActive: true },
  { id: "S0091", fullName: "عبد الله سالم بخيت المهري", className: "ثالث ابتدائي 4", guardianName: "سالم بخيت سالم المهري", guardianPhone: "966547666014", isActive: true },
  { id: "S0092", fullName: "عبد الله فهد ضافي العجمي", className: "ثالث ابتدائي 4", guardianName: "فهد ضافي هادي العجمي", guardianPhone: "966533611130", isActive: true },
  { id: "S0093", fullName: "علي بن ماجد بن مبارك المهري", className: "ثالث ابتدائي 4", guardianName: "ماجد بن مبارك المهري", guardianPhone: "966567222301", isActive: true },
  { id: "S0094", fullName: "مبارك بن محمد بن مبارك المهري", className: "ثالث ابتدائي 4", guardianName: "محمد مبارك بن مبارك المهري", guardianPhone: "966567111025", isActive: true },
  { id: "S0095", fullName: "محمد زري بن مسفر المهري", className: "ثالث ابتدائي 4", guardianName: "زري مسفر صمود المهري", guardianPhone: "966549222543", isActive: true },
  { id: "S0096", fullName: "محمد سيف بن محمد القحطاني", className: "ثالث ابتدائي 4", guardianName: "سيف بن محمد بن علي القحطاني", guardianPhone: "966551842917", isActive: true },
  { id: "S0097", fullName: "ناصر علي ناصر الدوسري", className: "ثالث ابتدائي 4", guardianName: "علي ناصر بن محمد الدوسري", guardianPhone: "966539045560", isActive: true },
  { id: "S0098", fullName: "يوسف ضافي فهد العجمي", className: "ثالث ابتدائي 4", guardianName: "ضافي فهد ضافي العجمي", guardianPhone: "966551066700", isActive: true },
];

async function seed() {
  console.log("Starting seed process...");

  const classCache: Record<string, string> = {};

  // Get existing classes to avoid duplicates
  const classesSnap = await getDocs(collection(db, 'classes'));
  classesSnap.forEach(snap => {
    classCache[snap.data().name] = snap.id;
  });

  const getOrCreateClass = async (name: string) => {
    if (classCache[name]) return classCache[name];
    
    // Determine grade level from name
    let gradeLevel = "غير محدد";
    if (name.includes("ثالث")) gradeLevel = "3";
    else if (name.includes("رابع")) gradeLevel = "4";
    else if (name.includes("خامس")) gradeLevel = "5";
    else if (name.includes("سادس")) gradeLevel = "6";

    const docRef = await addDoc(collection(db, 'classes'), {
      name,
      gradeLevel,
      homeroomTeacher: ""
    });
    classCache[name] = docRef.id;
    return docRef.id;
  };

  for (const s of studentsData) {
    try {
      const classId = await getOrCreateClass(s.className);
      await setDoc(doc(db, "students", s.id), {
        fullName: s.fullName,
        classId: classId,
        className: s.className,
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        isActive: s.isActive
      });
      console.log(`Imported ${s.id}: ${s.fullName}`);
    } catch (e) {
      console.error(`Error importing ${s.id}:`, e);
    }
  }

  console.log("Seed process completed for this chunk.");
}

seed();
