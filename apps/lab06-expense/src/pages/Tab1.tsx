import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useIonRouter } from "@ionic/react";

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
}

const Tab1: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const ionRouter = useIonRouter();

  useEffect(() => {
    const q = query(
      collection(db, "expenses"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Expense[] = [];
      let income = 0;
      let expense = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as Expense;

        list.push({
          id: doc.id,
          ...data,
        });

        if (data.type === "income") {
          income += data.amount;
        } else {
          expense += data.amount;
        }
      });

      setExpenses(list);
      setTotalIncome(income);
      setTotalExpense(expense);
    });

    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายการรายรับ–รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* 🔹 สรุป */}
        <IonText color="success">
          <h2>รายรับรวม: {totalIncome} บาท</h2>
        </IonText>

        <IonText color="danger">
          <h2>รายจ่ายรวม: {totalExpense} บาท</h2>
        </IonText>

        <IonText>
          <h3>คงเหลือ: {totalIncome - totalExpense} บาท</h3>
        </IonText>

        {/* 🔹 รายการ */}
        <IonList>
          {expenses.map((item) => (
            <IonItem
              key={item.id}
              button
              onClick={() => ionRouter.push(`/edit/${item.id}`)}
            >
              <IonLabel>
                <h2>{item.title}</h2>
                <p>{item.type === "income" ? "รายรับ" : "รายจ่าย"}</p>
              </IonLabel>

              <IonText
                color={item.type === "income" ? "success" : "danger"}
              >
                {item.type === "income" ? "+" : "-"}
                {item.amount}
              </IonText>
            </IonItem>
          ))}
        </IonList>

        {/* 🔹 ปุ่มเพิ่มข้อมูล (Floating Button) */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => ionRouter.push("/add")}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
