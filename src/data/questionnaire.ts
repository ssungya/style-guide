import type { Question } from "../types";

export const questions: Question[] = [
  {
    id: "q1",
    prompt: "손등이나 팔의 피부를 만졌을 때 느낌은 어느 쪽에 가깝나요?",
    helper: "옷을 입었을 때 편한 소재를 고르는 데 참고해요.",
    options: [
      { id: "q1a", label: "탄탄하고 두꺼운 편이에요", leaning: "straight" },
      { id: "q1b", label: "부드럽고 말랑한 편이에요", leaning: "wave" },
      { id: "q1c", label: "얇고 잔주름이 있는 편이에요", leaning: "natural" },
    ],
  },
  {
    id: "q2",
    prompt: "손목이나 발목처럼 관절이 있는 부위의 두께는 어떤가요?",
    options: [
      { id: "q2a", label: "굵고 단단한 편이에요", leaning: "straight" },
      { id: "q2b", label: "가늘고 얇은 편이에요", leaning: "wave" },
      { id: "q2c", label: "뼈마디가 도드라져 보여요", leaning: "natural" },
    ],
  },
  {
    id: "q3",
    prompt: "체중이 늘면 어느 부위부터 붙는 편인가요?",
    options: [
      { id: "q3a", label: "배와 등 위주로 붙어요", leaning: "straight" },
      { id: "q3b", label: "엉덩이와 허벅지 위주로 붙어요", leaning: "wave" },
      { id: "q3c", label: "잘 안 찌거나 팔다리부터 붙어요", leaning: "natural" },
    ],
  },
  {
    id: "q4",
    prompt: "어깨와 목 아래 가로 뼈(쇄골) 느낌은 어떤가요?",
    helper: "쇄골은 목 아래 옷깃 부근에 있는 가로로 긴 뼈예요.",
    options: [
      { id: "q4a", label: "어깨가 두툼하고 쇄골이 잘 안 보여요", leaning: "straight" },
      { id: "q4b", label: "어깨가 좁고 둥글며 쇄골이 얇게 보여요", leaning: "wave" },
      { id: "q4c", label: "어깨가 각지고 쇄골이 뚜렷하게 보여요", leaning: "natural" },
    ],
  },
  {
    id: "q5",
    prompt: "목의 길이와 굵기는 어떤 편인가요?",
    options: [
      { id: "q5a", label: "목이 짧고 굵은 편이에요", leaning: "straight" },
      { id: "q5b", label: "목이 가늘고 긴 편이에요", leaning: "wave" },
      { id: "q5c", label: "목이 길고 힘줄이나 뼈가 도드라져요", leaning: "natural" },
    ],
  },
  {
    id: "q6",
    prompt: "손이나 손가락 마디의 느낌은 어떤가요?",
    options: [
      { id: "q6a", label: "손이 도톰하고 마디가 잘 안 보여요", leaning: "straight" },
      { id: "q6b", label: "손이 작고 부드러운 편이에요", leaning: "wave" },
      { id: "q6c", label: "손가락 마디와 힘줄이 도드라져요", leaning: "natural" },
    ],
  },
  {
    id: "q7",
    prompt: "평소 옷을 입을 때 더 편하게 느끼는 쪽은?",
    options: [
      { id: "q7a", label: "몸에 붙기보다 약간 여유 있는 옷", leaning: "straight" },
      { id: "q7b", label: "부드럽게 흘러내리는 얇은 옷", leaning: "wave" },
      { id: "q7c", label: "헐렁하고 편안한 오버핏 옷", leaning: "natural" },
    ],
  },
];
