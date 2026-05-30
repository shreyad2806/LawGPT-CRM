def score_lead(lead):

    score = 0

    reasons = []

    role = (
        lead.get(
            "role",
            ""
        ).lower()
    )

    if "partner" in role:

        score += 40

        reasons.append(
            "Law firm decision maker"
        )

    if "head legal" in role:

        score += 35

        reasons.append(
            "Legal department lead"
        )

    if "general counsel" in role:

        score += 40

        reasons.append(
            "Corporate legal buyer"
        )

    # Use `notes` or `comment` fields for textual lead content
    comment = (
        (lead.get("notes") or lead.get("comment") or "")
        .lower()
    )

    keywords = [

        "contract",

        "compliance",

        "legal",

        "automation",

        "review"
    ]

    for keyword in keywords:

        if keyword in comment:

            score += 10

    if score >= 80:

        status = "hot"

    elif score >= 50:

        status = "warm"

    else:

        status = "cold"

    return score, status, reasons