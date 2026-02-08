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
} from "@ionic/react";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useIonRouter } from "@ionic/react";

const AddExpense: React.FC = () => {
  const ionRouter = useIonRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const saveExpense = async () => {
    try {
      console.log("กดบันทึก", {
        title,
        amount,
        type,
        category,
        note,
      });

      await addDoc(collection(db, "expenses"), {
        title: title.trim(),
        amount: Number(amount),
        type,
        category: category.trim(),
        note: note.trim(),
        createdAt: new Date(),
      });

      console.log("บันทึกเข้า Firestore แล้ว");

      ionRouter.push("/tabs/tab1", "root");
    } catch (error) {
      console.error("บันทึกไม่เข้า:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>เพิ่มรายการรายรับ–รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonInput
          label="ชื่อรายการ"
          labelPlacement="stacked"
          value={title}
          onIonChange={(e) => setTitle(e.detail.value ?? "")}
        />

        <IonInput
          label="จำนวนเงิน"
          labelPlacement="stacked"
          type="number"
          value={amount}
          onIonChange={(e) => setAmount(Number(e.detail.value ?? 0))}
        />

        <IonSelect
          label="ประเภท"
          labelPlacement="stacked"
          value={type}
          onIonChange={(e) => setType(e.detail.value ?? "expense")}
        >
          <IonSelectOption value="income">รายรับ</IonSelectOption>
          <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
        </IonSelect>

        <IonInput
          label="หมวดหมู่"
          labelPlacement="stacked"
          value={category}
          onIonChange={(e) => setCategory(e.detail.value ?? "")}
        />

        <IonTextarea
          label="หมายเหตุ"
          labelPlacement="stacked"
          value={note}
          onIonChange={(e) => setNote(e.detail.value ?? "")}
        />

        <IonButton
  expand="block"
  onClick={() => {
    console.log("กดปุ่มแล้ว");
    saveExpense();
  }}
>
  บันทึกข้อมูล
</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default AddExpense;
