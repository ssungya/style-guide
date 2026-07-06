import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { useSessionStore } from "../store/useSessionStore";

function ConsentCard({
  title,
  summary,
  details,
  checked,
  onChange,
}: {
  title: string;
  summary: string;
  details: string[];
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="mb-2 text-base font-bold">{title}</p>
      <p className="mb-3 text-sm text-[var(--text-muted)]">{summary}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-3 text-sm font-semibold text-[var(--primary)] underline"
      >
        {open ? "자세히 보기 접기" : "무엇을 모으고 언제 지우는지 자세히 보기"}
      </button>
      {open && (
        <ul className="mb-3 space-y-1 rounded-xl bg-[var(--surface-muted)] p-3 text-sm text-[var(--text-muted)]">
          {details.map((d, i) => (
            <li key={i}>• {d}</li>
          ))}
        </ul>
      )}
      <label className="flex cursor-pointer items-center gap-3 text-[15px] font-semibold">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-6 w-6 accent-[var(--primary)]"
        />
        네, 동의합니다
      </label>
    </div>
  );
}

export default function Consent() {
  const navigate = useNavigate();
  const { consent, setConsent } = useSessionStore();
  const [diagnosisAgreed, setDiagnosisAgreed] = useState(consent.diagnosisAgreed);
  const [tryOnAgreed, setTryOnAgreed] = useState(consent.tryOnAgreed);
  const [isMinor, setIsMinor] = useState(consent.isMinor);
  const [guardianName, setGuardianName] = useState(consent.guardianName);
  const [guardianAgreed, setGuardianAgreed] = useState(consent.guardianAgreed);

  const canProceed =
    diagnosisAgreed && tryOnAgreed && (!isMinor || (guardianName.trim() && guardianAgreed));

  function handleNext() {
    const now = new Date().toISOString();
    setConsent({
      diagnosisAgreed,
      diagnosisAgreedAt: diagnosisAgreed ? now : null,
      tryOnAgreed,
      tryOnAgreedAt: tryOnAgreed ? now : null,
      isMinor,
      guardianName,
      guardianAgreed,
    });
    navigate("/basic-info");
  }

  return (
    <Layout title="이용 동의">
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-muted)]">
          서비스를 이용하려면 아래 두 가지에 각각 동의해주세요. 언제든 설정에서
          철회할 수 있어요.
        </p>

        <ConsentCard
          title="① 체형 진단을 위한 정보 수집"
          summary="키, 성별, 문진 응답을 체형 진단에 사용해요. 전신사진은 선택사항이며, 등록할 경우 분석이 끝나면 바로 지우고 수치 결과만 남겨요."
          details={[
            "수집 항목: 키, 성별, 문진 응답, 전신사진(정면/측면, 등록 시에만 · 선택사항)",
            "이용 목적: 체형 타입 진단 및 스타일링 추천 (신원 확인 목적 아님)",
            "보관 기간: 사진은 분석 완료 즉시 삭제, 진단 수치 결과만 보관",
            "삭제 요청: 마이페이지에서 언제든 진단 이력을 삭제할 수 있어요",
          ]}
          checked={diagnosisAgreed}
          onChange={setDiagnosisAgreed}
        />

        <ConsentCard
          title="② 가상 피팅(옷 합성 이미지) 생성"
          summary="선택한 옷을 사진에 합성해 미리 보여주는 기능이에요. 합성이 끝나면 원본 사진은 즉시 폐기하고 다시 사용하지 않아요."
          details={[
            "수집 항목: 전신사진, 선택한 옷 이미지",
            "이용 목적: AI 합성 이미지 생성(참고용 시뮬레이션)",
            "보관 기간: 요청 처리 후 원본 사진 즉시 폐기, 합성 결과는 내 기기에만 저장",
            "유의사항: 실제 착용감과 다를 수 있는 AI 시뮬레이션 결과예요",
          ]}
          checked={tryOnAgreed}
          onChange={setTryOnAgreed}
        />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <label className="flex cursor-pointer items-center gap-3 text-[15px] font-semibold">
            <input
              type="checkbox"
              checked={isMinor}
              onChange={(e) => setIsMinor(e.target.checked)}
              className="h-6 w-6 accent-[var(--primary)]"
            />
            사용자가 만 14세 미만이에요
          </label>
          {isMinor && (
            <div className="mt-3 space-y-3 border-t border-[var(--border)] pt-3">
              <p className="text-sm text-[var(--text-muted)]">
                만 14세 미만은 법정대리인(부모님 등)의 동의가 필요해요.
              </p>
              <label className="block text-sm font-semibold">
                법정대리인 성함
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-base"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-[15px] font-semibold">
                <input
                  type="checkbox"
                  checked={guardianAgreed}
                  onChange={(e) => setGuardianAgreed(e.target.checked)}
                  className="h-6 w-6 accent-[var(--primary)]"
                />
                법정대리인으로서 위 내용에 동의합니다
              </label>
            </div>
          )}
        </div>

        <Button disabled={!canProceed} onClick={handleNext}>
          다음으로
        </Button>
      </div>
    </Layout>
  );
}
