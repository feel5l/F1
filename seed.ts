
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const staffData = [
  { fullName: "زياد عبدالمحسن زياد العتيبي", nationalId: "1016956672", jobNumber: "—", phone: "0542173045", role: "مدير المدرسة", specialization: "رياضيات" },
  { fullName: "محمد سعيد الزمامي", nationalId: "1017303627", jobNumber: "—", phone: "0592030000", role: "وكيل", specialization: "لغة عربية" },
  { fullName: "ضيدان علي طميش الدوسري", nationalId: "1019548153", jobNumber: "—", phone: "0552090006", role: "موجه طلابي", specialization: "لغة عربية" },
  { fullName: "صالح مسعود حمد الدوسري", nationalId: "1061885511", jobNumber: "—", phone: "0508869616", role: "معلم", specialization: "دراسات إسلامية" },
  { fullName: "ناصر باتل محمد الدوسري", nationalId: "1016161554", jobNumber: "—", phone: "0504926892", role: "معلم", specialization: "دراسات إسلامية" },
  { fullName: "محمد فهد عائض آل جحيش", nationalId: "1034056687", jobNumber: "—", phone: "0590580707", role: "معلم", specialization: "دراسات إسلامية" },
  { fullName: "حمد محمد عبيد المري", nationalId: "1015876749", jobNumber: "—", phone: "0508773729", role: "معلم", specialization: "دراسات إسلامية" },
  { fullName: "عبد الرحمن محمد عبد الله القو", nationalId: "1059538288", jobNumber: "—", phone: "0555933779", role: "معلم", specialization: "لغة عربية" },
  { fullName: "محمد بن سلمان بن محمد الملحم", nationalId: "1002645479", jobNumber: "—", phone: "0505928521", role: "معلم", specialization: "لغة عربية" },
  { fullName: "خالد محمد عمر الملا", nationalId: "1008838706", jobNumber: "—", phone: "0549043200", role: "معلم", specialization: "لغة عربية" },
  { fullName: "عبد المحسن هادي دواس العجمي", nationalId: "1004394993", jobNumber: "—", phone: "0555933433", role: "معلم", specialization: "لغة عربية" },
  { fullName: "عبد الله ماجد العرجاني", nationalId: "1023987314", jobNumber: "—", phone: "0503388118", role: "معلم", specialization: "لغة عربية" },
  { fullName: "أسامة عبد اللطيف عبد الرحمن الدوغان", nationalId: "1031692708", jobNumber: "—", phone: "0504858995", role: "معلم", specialization: "رياضيات" },
  { fullName: "نايف عبد اللطيف موسى الجغيمان", nationalId: "1017259076", jobNumber: "—", phone: "0544402112", role: "معلم", specialization: "رياضيات" },
  { fullName: "عبد المحسن عبد الله طليحان الخالدي", nationalId: "1059405850", jobNumber: "—", phone: "0561388331", role: "معلم", specialization: "رياضيات" },
  { fullName: "إبراهيم عبد الله صالح المحبوب", nationalId: "1004855274", jobNumber: "—", phone: "0504933933", role: "معلم", specialization: "علوم" },
  { fullName: "عبد العزيز إبراهيم الخلفان", nationalId: "1002623120", jobNumber: "—", phone: "0506923615", role: "معلم", specialization: "علوم" },
  { fullName: "محمد أحمد محمد الحسن", nationalId: "1001831971", jobNumber: "—", phone: "0568397917", role: "معلم", specialization: "علوم" },
  { fullName: "عبد الرحمن غنام عبد الرحمن الدوسري", nationalId: "1008970608", jobNumber: "—", phone: "0504853755", role: "معلم", specialization: "اجتماعيات" },
  { fullName: "عبد المحسن زعال الدوسري", nationalId: "1050436813", jobNumber: "—", phone: "0507044577", role: "محضر مختبر", specialization: "محضر معمل" },
  { fullName: "فيحان بن فالح جابر المري", nationalId: "1051379707", jobNumber: "—", phone: "0556009778", role: "صعوبات تعلم", specialization: "صعوبات تعلم" },
  { fullName: "خالد نجيب خالد الحليبي", nationalId: "1002722427", jobNumber: "—", phone: "0503919868", role: "معلم", specialization: "إنجليزي" },
  { fullName: "خليفة سعد القعيمي", nationalId: "1077033494", jobNumber: "—", phone: "0556129529", role: "معلم", specialization: "تربية بدنية" },
  { fullName: "محمد عمر المالكي", nationalId: "1063203507", jobNumber: "—", phone: "0501212213", role: "معلم", specialization: "حاسب آلي" },
  { fullName: "عبد الحي خليفة العبدالحي", nationalId: "1012531560", jobNumber: "—", phone: "0508052281", role: "حارس", specialization: "حارس" },
  { fullName: "فهد عبدالله المنقاش", nationalId: "1029465133", jobNumber: "—", phone: "0531321312", role: "مساعد إداري", specialization: "مساعد إداري" },
  { fullName: "عادل عبد الرحيم سعد السماح", nationalId: "1060949623", jobNumber: "144789", phone: "0537715250", role: "مساعد إداري", specialization: "مساعد إداري" },
  { fullName: "محمد عبدالحميد العدساني", nationalId: "1023823550", jobNumber: "—", phone: "0530222228", role: "معلم", specialization: "مكمل (E)" },
  { fullName: "هادي جابر المري", nationalId: "—", jobNumber: "—", phone: "0501191999", role: "معلم", specialization: "مكمل بدنية" },
];

async function seed() {
  console.log("Starting staff seed process...");

  for (const staff of staffData) {
    try {
      const docId = staff.nationalId !== "—" ? staff.nationalId : undefined;
      const staffRef = docId ? doc(db, 'staff', docId) : doc(collection(db, 'staff'));
      
      await setDoc(staffRef, {
        fullName: staff.fullName,
        nationalId: staff.nationalId,
        jobNumber: staff.jobNumber,
        phone: staff.phone,
        role: staff.role,
        specialization: staff.specialization
      });
      console.log(`Imported Staff: ${staff.fullName}`);
    } catch (e) {
      console.error(`Error importing staff ${staff.fullName}:`, e);
    }
  }

  console.log("Staff seed process completed.");
}

seed();
