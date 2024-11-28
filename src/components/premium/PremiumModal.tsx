import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

const premiumFeatures = ["AIツール", "最大3つの履歴書"];
const premiumPlusFeatures = ["無制限の履歴書", "デザインのカスタマイズ"];

export default function PremiumModal() {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CareerRise プレミアム</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>
            より多くの機能を利用するにはプレミアムサブスクリプションにアップグレードしてください。
          </p>
          <div className="flex">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">プレミアム</h3>
              <ul className="list-inside space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button>プレミアムを取得</Button>
            </div>
            <div className="border-1 mx-6" />
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-center text-lg font-bold text-transparent">
                プレミアムプラス
              </h3>
              <ul className="list-inside space-y-2">
                {premiumPlusFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="premium">プレミアムプラスを取得</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
