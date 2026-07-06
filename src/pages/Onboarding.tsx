import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <Layout showBack={false} title="바디라인 스타일링">
      <div className="flex min-h-[70vh] flex-col justify-between">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--surface-muted)] text-5xl">
            🧵
          </div>
          <h2 className="text-2xl font-bold">
            문진과 사진 한 장으로
            <br />
            나에게 어울리는 스타일을 찾아드려요
          </h2>
          <p className="text-base leading-relaxed text-[var(--text-muted)]">
            간단한 질문과 전신사진으로 체형 특징을 살펴본 뒤,
            어울리는 옷차림을 추천하고 직접 입은 모습까지
            미리 보여드리는 참고용 스타일링 가이드예요.
          </p>
          <ul className="space-y-3 rounded-2xl bg-[var(--surface)] p-5 text-left text-[15px] text-[var(--text-muted)] shadow-sm">
            <li>1. 간단한 질문 7가지에 답해요</li>
            <li>2. 전신사진을 촬영하거나 올려요 (선택사항)</li>
            <li>3. 체형 진단 결과와 스타일 추천을 확인해요</li>
            <li>4. 마음에 드는 옷을 골라 입은 모습을 미리 봐요 (사진 등록 시)</li>
          </ul>
          <p className="text-sm text-[var(--text-muted)]">
            ※ 의학적 진단이 아닌 참고용 스타일링 가이드입니다.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Button onClick={() => navigate("/consent")}>시작하기</Button>
          <Button variant="ghost" onClick={() => navigate("/help")}>
            촬영 가이드 먼저 보기
          </Button>
        </div>
      </div>
    </Layout>
  );
}
