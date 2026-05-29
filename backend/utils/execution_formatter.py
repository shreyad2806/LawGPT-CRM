def print_summary(state):

    print("\n")
    print("=" * 60)

    print(
        "LAWGPT CRM EXECUTION SUMMARY"
    )

    print("=" * 60)

    print(
        f"Goal: "
        f"{state.get('user_goal')}"
    )

    print("\nCompleted Tasks:")

    for task in state.get(
        "completed_tasks",
        []
    ):
        print(f"✓ {task}")

    print(
        f"\nStatus: "
        f"{state.get('execution_status')}"
    )

    print("\nTimeline:")

    for item in state.get(
        "execution_timeline",
        []
    ):

        print(
            f"{item['timestamp']} | "
            f"{item['agent']} | "
            f"{item['event']}"
        )

    print("=" * 60)