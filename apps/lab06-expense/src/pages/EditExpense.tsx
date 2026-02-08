import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { useIonRouter } from "@ionic/react";

interface RouteParams {
  id: string;
}

const EditExpense: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const ionRouter = useIonRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // 🔹 โหลดข้อมูลเดิม
  useEffect(() => {
    const loadExpense = async () => {
      const docRef = doc(db, "expenses", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title);
        setAmount(data.amount);
        setType(data.type);
        setCategory(data.category || "");
        setNote(data.note || "");
      }
    };

    loadExpense();
  }, [id]);

  // 🔹 อัปเดตข้อมูล
  const updateExpense = async () => {
    const docRef = doc(db, "expenses", id);

    await updateDoc(docRef, {
      title,
      amount: Number(amount),
      type,
      category,
      note,
    });

    ionRouter.push("/tabs/tab1", "root");
  };

  // 🔹 ลบข้อมูล
  const deleteExpense = async () => {
    const docRef = doc(db, "expenses", id);
    await deleteDoc(docRef);

    ionRouter.push("/tabs/tab1", "root");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>แก้ไขรายการ</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          label="ชื่อรายการ"
          labelPlacement="stacked"
          value={title}
          onIonChange={(e) => setTitle(e.detail.value!)}
        />

        <IonInput
          label="จำนวนเงิน"
          labelPlacement="stacked"
          type="number"
          value={amount}
          onIonChange={(e) => setAmount(Number(e.detail.value))}
        />

        <IonSelect
          label="ประเภท"
          labelPlacement="stacked"
          value={type}
          onIonChange={(e) => setType(e.detail.value)}
        >
          <IonSelectOption value="income">รายรับ</IonSelectOption>
          <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
        </IonSelect>

        <IonInput
          label="หมวดหมู่"
          labelPlacement="stacked"
          value={category}
          onIonChange={(e) => setCategory(e.detail.value!)}
        />

        <IonTextarea
          label="หมายเหตุ"
          labelPlacement="stacked"
          value={note}
          onIonChange={(e) => setNote(e.detail.value!)}
        />

        {/* 🔹 ปุ่มอัปเดต */}
        <IonButton expand="block" onClick={updateExpense}>
          อัปเดตข้อมูล
        </IonButton>

        {/* 🔹 ปุ่มลบ */}
        <IonButton
          expand="block"
          color="danger"
          onClick={() => setShowDeleteAlert(true)}
        >
          ลบรายการนี้
        </IonButton>

        {/* 🔹 กล่องยืนยันลบ */}
        <IonAlert
          isOpen={showDeleteAlert}
          header="ยืนยันการลบ"
          message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?"
          buttons={[
            {
              text: "ยกเลิก",
              role: "cancel",
              handler: () => setShowDeleteAlert(false),
            },
            {
              text: "ลบ",
              role: "destructive",
              handler: deleteExpense,
            },
          ]}
          onDidDismiss={() => setShowDeleteAlert(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditExpense;
