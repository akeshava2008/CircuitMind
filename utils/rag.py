"""Lightweight RAG for datasheet Q&A: extract + chunk a PDF with pypdf, then
rank chunks against a question using a hand-rolled TF-IDF cosine similarity
(pure Python, no vector DB)."""

from __future__ import annotations
import math
import re
from collections import Counter
from pypdf import PdfReader

CHUNK_SIZE_WORDS = 500
CHUNK_OVERLAP_WORDS = 50

_STOPWORDS = {
    "the", "a", "an", "and", "or", "of", "to", "in", "is", "are", "for", "on",
    "with", "as", "at", "by", "be", "this", "that", "it", "from", "can", "will",
    "shall", "may", "which", "if", "when", "into", "than", "then", "these",
    "those", "was", "were", "has", "have", "had", "but", "not", "all", "any",
    "each", "such", "its", "their", "there", "what", "how", "does", "do",
}


def _tokenize(text: str) -> list:
    tokens = re.findall(r"[a-zA-Z0-9]+", text.lower())
    return [t for t in tokens if t not in _STOPWORDS and len(t) > 1]


def load_pdf_and_chunk(uploaded_file) -> list:
    reader = PdfReader(uploaded_file)
    parts = []
    for page in reader.pages:
        try:
            page_text = page.extract_text() or ""
        except Exception:
            page_text = ""
        if page_text.strip():
            parts.append(page_text)
    words = "\n".join(parts).split()
    if not words:
        return []
    chunks = []
    step = CHUNK_SIZE_WORDS - CHUNK_OVERLAP_WORDS
    for start in range(0, len(words), step):
        window = words[start:start + CHUNK_SIZE_WORDS]
        if not window:
            break
        chunks.append(" ".join(window))
        if start + CHUNK_SIZE_WORDS >= len(words):
            break
    return chunks


def _build_idf(tokenized_chunks: list) -> dict:
    n_docs = len(tokenized_chunks)
    doc_freq = Counter()
    for tokens in tokenized_chunks:
        for term in set(tokens):
            doc_freq[term] += 1
    return {term: math.log(n_docs / (1 + df)) + 1.0 for term, df in doc_freq.items()}


def _tfidf_vector(tokens: list, idf: dict) -> dict:
    tf = Counter(tokens)
    return {term: count * idf.get(term, 1.0) for term, count in tf.items()}


def _cosine(vec_a: dict, vec_b: dict) -> float:
    if not vec_a or not vec_b:
        return 0.0
    if len(vec_a) > len(vec_b):
        vec_a, vec_b = vec_b, vec_a
    dot = sum(w * vec_b.get(term, 0.0) for term, w in vec_a.items())
    na = math.sqrt(sum(w * w for w in vec_a.values()))
    nb = math.sqrt(sum(w * w for w in vec_b.values()))
    if na == 0.0 or nb == 0.0:
        return 0.0
    return dot / (na * nb)


def get_relevant_chunks(question: str, chunks: list, top_k: int = 3) -> str:
    if not chunks:
        return ""
    if len(chunks) <= top_k:
        return _join_chunks(list(range(len(chunks))), chunks)
    tokenized_chunks = [_tokenize(c) for c in chunks]
    idf = _build_idf(tokenized_chunks)
    q_vec = _tfidf_vector(_tokenize(question), idf)
    scored = [(_cosine(q_vec, _tfidf_vector(tokens, idf)), i) for i, tokens in enumerate(tokenized_chunks)]
    scored.sort(key=lambda pair: pair[0], reverse=True)
    if scored[0][0] == 0.0:
        best = list(range(top_k))
    else:
        best = [i for _, i in scored[:top_k]]
    return _join_chunks(sorted(best), chunks)


def _join_chunks(indices: list, chunks: list) -> str:
    parts = []
    for rank, idx in enumerate(indices, start=1):
        parts.append(f"[Excerpt {rank}]\n{chunks[idx]}")
    return "\n\n---\n\n".join(parts)
