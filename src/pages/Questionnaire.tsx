import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { questions } from "../data/questionnaire";
import { useSessionStore } from "../store/useSessionStore";

export default function Questionnaire() {
  const navigate = useNavigate();
  const { questionnaireAnswers, setAnswer } = useSessionStore();
  const [index, setIndex] = useState(0);

  const question = questions[index];
  const selected = questionnaireAnswers[question.id];
  const isLast = index === questions.length - 1;

  function handleNext() {
    if (isLast) {
      navigate("/processing");
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <Layout title="간단한 질문">
      <div className="space-y-6">
        <p className="text-sm font-semibold text-[var(--text-muted)]">
          {index + 1} / {questions.length}
        </p>
        <h2 className="text-xl font-bold leading-snug">{question.prompt}</h2>
        {question.helper && (
          <p className="text-sm text-[var(--text-muted)]">{question.helper}</p>
        )}

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setAnswer(question.id, option.id)}
              className={`min-h-16 w-full rounded-2xl border-2 px-5 text-left text-lg font-semibold ${
                selected === option.id
                  ? "border-[var(--primary)] bg-[var(--surface-muted)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {index > 0 && (
            <Button variant="secondary" onClick={() => setIndex((i) => i - 1)}>
              이전 문항
            </Button>
          )}
          <Button disabled={!selected} onClick={handleNext}>
            {isLast ? "진단 시작하기" : "다음 문항"}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
