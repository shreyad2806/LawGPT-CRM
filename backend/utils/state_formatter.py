def format_execution_summary(state):

    print("\n" + "=" * 60)
    print("LAWGPT CRM EXECUTION SUMMARY")
    print("=" * 60)

    print(f"\nGoal: {state.get('user_goal')}")

    print("\nCompleted Tasks:")
    for task in state.get("completed_tasks", []):
        print(f"  ✓ {task}")

    print("\nAgent Retries:")
    print(
        f"  Trend: {state.get('trend_agent_retries', 0)}"
    )

    print(
        f"  Strategy: {state.get('strategy_agent_retries', 0)}"
    )

    print(
        f"  Content: {state.get('content_agent_retries', 0)}"
    )

    print(
        f"  Analytics: {state.get('analytics_agent_retries', 0)}"
    )

    print(
        f"\nExecution Status: "
        f"{state.get('execution_status')}"
    )

    print("\nGenerated Assets:")

    tool_results = state.get(
        "tool_results",
        {}
    )

    if "trend_data" in tool_results:
        print("  ✓ Trend Analysis")

    if "strategy_data" in tool_results:
        print("  ✓ Strategy Generated")

    if "content_data" in tool_results:
        print("  ✓ Content Generated")

    if "analytics_data" in tool_results:
        print("  ✓ Analytics Generated")

    print("\n" + "=" * 60)