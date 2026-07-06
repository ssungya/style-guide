import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { useSessionStore } from "../store/useSessionStore";
import type { Gender } from "../types";

const genderOptions: { id: Gender; label: string }[] = [
  { id: "female", label: "여성" },
  { id: "male", label: "남성" },
  { id: "unspecified", label: "선택 안 함" },
];

export default function BasicInfo() {
  const navigate = useNavigate();
  const { basicInfo, setBasicInfo } = useSessionStore();

  const canProceed = !!basicInfo.heightCm && basicInfo.heightCm >= 100 && basicInfo.heightCm <= 220;

  return (
    <Layout title="기본 정보">
      <div className="space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          사진 속 비율을 실제 크기로 환산하기 위해 키를 입력해주세요. 이
          정보는 진단 계산에만 사용돼요.
        </p>

        <label className="block">
          <span className="mb-2 block text-base font-bold">키 (cm)</span>
          <input
            type="number"
            inputMode="numeric"
            min={100}
            max={220}
            placeholder="예: 162"
            value={basicInfo.heightCm ?? ""}
            onChange={(e) =>
              setBasicInfo({
                heightCm: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] p-4 text-xl"
          />
        </label>

        <div>
          <span className="mb-2 block text-base font-bold">성별 (선택)</span>
          <div className="grid grid-cols-3 gap-2">
            {genderOptions.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setBasicInfo({ gender: g.id })}
                className={`min-h-14 rounded-2xl border-2 text-base font-semibold ${
                  basicInfo.gender === g.id
                    ? "border-[var(--primary)] bg-[var(--surface-muted)]"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <Button disabled={!canProceed} onClick={() => navigate("/photo")}>
          다음으로
        </Button>
      </div>
    </Layout>
  );
}
