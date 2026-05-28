def evaluate_execution(state):

    tool_results = state.get("tool_results", {})

    if not tool_results:
        return "failed"

    for _, result in tool_results.items():

        if "error" in str(result).lower():
            return "failed"

    return "success"