import { SubscriptionLevel } from "./subscription";

export function canCreateResume(
  userSubscriptionLevel: SubscriptionLevel,
  currentResumeCount: number,
) {
  const maxResumeMap: Record<SubscriptionLevel, number> = {
    free: 1,
    pro: 3,
    pro_plus: Infinity,
  };

  const maxResumes = maxResumeMap[userSubscriptionLevel];
  return currentResumeCount < maxResumes;
}

export function canUseAITools(userSubscriptionLevel: SubscriptionLevel) {
  return userSubscriptionLevel !== "free";
}

export function canUseCustomizations(userSubscriptionLevel: SubscriptionLevel) {
  return userSubscriptionLevel === "pro_plus";
}
