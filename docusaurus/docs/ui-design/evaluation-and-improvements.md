---
sidebar_position: 5
---

# Evaluation and Improvements

## Heuristic Evaluation

**Severity scale:** 1 — not very severe &nbsp;|&nbsp; 2 — not severe &nbsp;|&nbsp; 3 — severe &nbsp;|&nbsp; 4 — very severe

| No. | Heuristic | Location & Description | Solution | Severity |
|-----|-----------|----------------------|----------|----------|
| 1 | Visibility of system status | All LLM features. Responses may take time to receive and users need to be informed. | Implement a loading indicator and streamed output to show that a response is being fetched. | 2 |
| 2 | Match between system and real world | All app components. The two primary languages of teachers in Kenya are English and Swahili, and some terminology may not be understood in English. | Add a translation button to convert text between English and Swahili. | 3 |
| 3 | Consistency and standards | All LLM features. Buttons that trigger LLM-generated responses should be clearly distinguishable. | Add an icon (e.g. a magic star) next to the button to indicate the response is AI-generated. | 1 |
| 4 | Aesthetic and minimalist design | User insights dashboard. The summary card takes up significant space and may distract from other content. | Replace the always-visible summary with a collapsible dropdown that users can expand on demand. | 1 |

## Improvements

### Issue 1: Loading icon and LLM streaming

![Improvement 1 - Loading indicator and streaming](/img/ui-design-images/prototype-improvements1.png)

### Issue 2: Button to translate between English and Swahili

![Improvement 2 - Translation button](/img/ui-design-images/prototype-improvements2.png)

### Issue 3: Icon to indicate LLM-generated content

![Improvement 3 - LLM generation icon](/img/ui-design-images/prototype-improvements3.png)

### Issue 4: Dropdown button for user insights

![Improvement 4 - Collapsible user insight](/img/ui-design-images/prototype-improvements4.png)
