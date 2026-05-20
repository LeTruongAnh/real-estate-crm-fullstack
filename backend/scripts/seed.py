from datetime import date, timedelta

from app.core.security import hash_password
from app.db.database import SessionLocal
from app.db.models import Lead, Note, Task, User


def clear_data(db):
    db.query(Note).delete()
    db.query(Task).delete()
    db.query(Lead).delete()
    db.query(User).delete()
    db.commit()


def create_user(db, name: str, email: str, role: str):
    user = User(
        name=name,
        email=email,
        password_hash=hash_password("password123"),
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def main():
    db = SessionLocal()

    try:
        clear_data(db)

        manager = create_user(
            db,
            name="Manager User",
            email="manager@example.com",
            role="manager",
        )

        sales_1 = create_user(
            db,
            name="Sales One",
            email="sales1@example.com",
            role="sales",
        )

        sales_2 = create_user(
            db,
            name="Sales Two",
            email="sales2@example.com",
            role="sales",
        )

        viewer = create_user(
            db,
            name="Viewer User",
            email="viewer@example.com",
            role="viewer",
        )

        lead_1 = Lead(
            name="Nguyen Van A",
            phone="0909123456",
            email="vana@example.com",
            source="facebook",
            interest="2-bedroom apartment near river",
            budget=2500000000,
            status="new",
            assigned_to=sales_1.id,
        )

        lead_2 = Lead(
            name="Tran Thi B",
            phone="0911222333",
            email="tranb@example.com",
            source="website",
            interest="Villa near river",
            budget=5000000000,
            status="qualified",
            assigned_to=sales_1.id,
        )

        lead_3 = Lead(
            name="Le Van C",
            phone="0922333444",
            email="vanc@example.com",
            source="zalo",
            interest="Townhouse with flexible payment",
            budget=3500000000,
            status="contacted",
            assigned_to=sales_2.id,
        )

        lead_4 = Lead(
            name="Pham Thi D",
            phone="0933444555",
            email="thid@example.com",
            source="referral",
            interest="Investment apartment",
            budget=4200000000,
            status="negotiating",
            assigned_to=sales_2.id,
        )

        lead_5 = Lead(
            name="Hoang Van E",
            phone="0944555666",
            email="vane@example.com",
            source="facebook",
            interest="Studio apartment",
            budget=1800000000,
            status="won",
            assigned_to=sales_1.id,
        )

        db.add_all([lead_1, lead_2, lead_3, lead_4, lead_5])
        db.commit()

        for lead in [lead_1, lead_2, lead_3, lead_4, lead_5]:
            db.refresh(lead)

        today = date.today()

        task_1 = Task(
            lead_id=lead_1.id,
            title="Call customer about payment policy",
            description="Send brochure and explain payment timeline",
            assignee_id=sales_1.id,
            status="todo",
            priority="high",
            deadline=today + timedelta(days=2),
        )

        task_2 = Task(
            lead_id=lead_2.id,
            title="Prepare villa price comparison",
            description="Compare river-view villa options",
            assignee_id=sales_1.id,
            status="in_progress",
            priority="medium",
            deadline=today + timedelta(days=5),
        )

        task_3 = Task(
            lead_id=lead_3.id,
            title="Follow up Zalo lead",
            description="Ask customer about preferred payment plan",
            assignee_id=sales_2.id,
            status="todo",
            priority="high",
            deadline=today - timedelta(days=1),
        )

        task_4 = Task(
            lead_id=lead_4.id,
            title="Send investment projection",
            description="Prepare ROI summary for investment apartment",
            assignee_id=sales_2.id,
            status="blocked",
            priority="high",
            deadline=today + timedelta(days=1),
        )

        task_5 = Task(
            lead_id=lead_5.id,
            title="Prepare handover checklist",
            description="Customer already won, prepare next admin steps",
            assignee_id=sales_1.id,
            status="done",
            priority="low",
            deadline=today - timedelta(days=2),
        )

        db.add_all([task_1, task_2, task_3, task_4, task_5])
        db.commit()

        note_1 = Note(
            lead_id=lead_1.id,
            user_id=sales_1.id,
            content="Customer asked for bank loan support and payment schedule.",
        )

        note_2 = Note(
            lead_id=lead_2.id,
            user_id=sales_1.id,
            content="Customer prefers river-view unit and wants comparison by this week.",
        )

        note_3 = Note(
            lead_id=lead_3.id,
            user_id=sales_2.id,
            content="Customer contacted via Zalo and requested flexible payment plan.",
        )

        db.add_all([note_1, note_2, note_3])
        db.commit()

        print("Seed data created successfully.")
        print("")
        print("Login accounts:")
        print("manager@example.com / password123")
        print("sales1@example.com / password123")
        print("sales2@example.com / password123")
        print("viewer@example.com / password123")

    finally:
        db.close()


if __name__ == "__main__":
    main()