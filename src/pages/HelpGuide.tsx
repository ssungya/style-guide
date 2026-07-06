import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { PoseGuideSvg } from "../components/PoseGuideSvg";
import { speak, isSpeechSupported } from "../lib/speech";

const GUIDE_TEXT =
  "전신사진 촬영 안내입니다. 첫째, 몸 전체가 다 나오도록 두세 걸음 뒤로 떨어져 주세요. " +
  "둘째, 밝은 곳에서 배경이 복잡하지 않은 곳을 골라주세요. " +
  "셋째, 혼자 찍기 어려우면 거울에 비춰 찍거나 가족에게 도움을 요청해보세요. " +
  "넷째, 몸매가 드러나는 옷을 입으면 더 정확하게 진단할 수 있어요.";

export default function HelpGuide() {
  return (
    <Layout title="촬영 가이드">
      <div className="space-y-6">
        {isSpeechSupported() && (
          <Button variant="secondary" onClick={() => speak(GUIDE_TEXT)}>
            🔊 음성으로 안내 듣기
          </Button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--surface)] p-3 text-center">
            <div className="mx-auto h-40 w-24 text-[var(--text-muted)]">
              <PoseGuideSvg />
            </div>
            <p className="mt-2 text-sm font-bold">정면 자세</p>
            <p className="text-xs text-[var(--text-muted)]">
              카메라를 정면으로 바라보고 서주세요
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--surface)] p-3 text-center">
            <div className="mx-auto h-40 w-24 text-[var(--text-muted)]">
              <PoseGuideSvg side />
            </div>
            <p className="mt-2 text-sm font-bold">측면 자세</p>
            <p className="text-xs text-[var(--text-muted)]">
              몸을 90도로 돌려 옆모습을 보여주세요
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-[var(--surface-muted)] p-4 text-[15px]">
          <p>
            <strong>1. 거리:</strong> 몸 전체가 화면에 다 들어오도록 두세 걸음
            뒤로 떨어져서 찍어주세요.
          </p>
          <p>
            <strong>2. 조명:</strong> 창문 앞처럼 밝은 곳에서 찍으면 더 정확해요.
          </p>
          <p>
            <strong>3. 배경:</strong> 벽처럼 단순한 배경이 좋아요.
          </p>
          <p>
            <strong>4. 혼자 찍기 어렵다면:</strong> 거울 앞에서 찍거나, 가족이나
            보호자에게 촬영을 부탁해보세요.
          </p>
          <p>
            <strong>5. 옷차림:</strong> 몸매 라인이 드러나는 옷이 진단에 도움이
            돼요.
          </p>
        </div>
      </div>
    </Layout>
  );
}
