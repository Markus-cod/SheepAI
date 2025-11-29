from huggingface_hub import InferenceClient

MAX_CHARS_PER_CHUNK = (
    4000  # HuggingFace models often handle ~4k tokens; adjust as needed
)


# -----------------------
# HELPERS
# -----------------------


def chunk_text(text: str, size: int = MAX_CHARS_PER_CHUNK) -> list[str]:
    """Splits very large text into model-friendly chunks."""
    return [text[i : i + size] for i in range(0, len(text), size)]


def summarize_chunk(client: InferenceClient, chunk: str) -> str:
    """Summarizes a single chunk via HuggingFace."""
    prompt = (
        "Summarize the following text clearly and concisely. "
        "Focus on the key ideas:\n\n"
        f"{chunk}"
    )

    response = client.text_generation(
        prompt,
        max_new_tokens=300,
        temperature=0.3,
    )

    return response


def summarize_large_text(client: InferenceClient, text: str) -> list[str]:
    """Summarizes all chunks and returns a list of partial summaries."""
    chunks = chunk_text(text)
    summaries = []

    print(f"Summarizing {len(chunks)} chunks...")

    for i, chunk in enumerate(chunks, start=1):
        print(f" → Summarizing chunk {i}/{len(chunks)}...")
        summaries.append(summarize_chunk(client, chunk))

    return summaries


# -----------------------
# HTML GENERATOR
# -----------------------


def generate_html_page(title: str, summaries: list[str]) -> str:
    """Generates a consistent, styled HTML summary page."""
    newline = "\n"
    summary_sections = "\n".join(
        f"""
        <section class="chunk">
            <h2>Section {i+1}</h2>
            <p>{s.replace(newline, "<br>")}</p>
        </section>
        """
        for i, s in enumerate(summaries)
    )

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>{title}</title>
<style>
    body {{
        font-family: Arial, sans-serif;
        background: #fafafa;
        margin: 0;
        padding: 0;
        color: #333;
    }}

    header {{
        padding: 20px;
        background: #2e3b4e;
        color: white;
        text-align: center;
        border-bottom: 4px solid #1f2937;
    }}

    .container {{
        width: 80%;
        margin: 20px auto;
        max-width: 900px;
    }}

    section.chunk {{
        background: white;
        padding: 20px;
        margin: 20px 0;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }}

    h2 {{
        margin-top: 0;
        color: #1f2937;
    }}

    p {{
        line-height: 1.6;
    }}

    footer {{
        margin-top: 40px;
        text-align: center;
        padding: 20px;
        color: #888;
    }}
</style>
</head>
<body>
    <header>
        <h1>{title}</h1>
        <p>Automatically generated summary</p>
    </header>

    <div class="container">
        {summary_sections}
    </div>

    <footer>
        Generated via Hugging Face Inference API
    </footer>
</body>
</html>
"""


def generate_page(client: InferenceClient, text: str) -> str:
    summaries = summarize_large_text(client, text)
    html = generate_html_page("Summary of Document", summaries)
    return html
