import { TrendingUp, TrendingDown } from "./icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PriceComparisonProps {
  gasTypes: any[];
}

export default function PriceComparison({ gasTypes }: PriceComparisonProps) {
  const getValueScore = (gasType: any) => {
    const pricePerKg = parseFloat(gasType.price) / parseFloat(gasType.name.replace('kg', ''));
    return pricePerKg;
  };

  const sortedByValue = [...gasTypes].sort((a, b) => getValueScore(a) - getValueScore(b));
  const bestValue = sortedByValue[0];

  return (
    <div className="space-y-2">
        {gasTypes.map((gasType, index) => {
          const pricePerKg = Math.round(parseFloat(gasType.price) / parseFloat(gasType.name.replace('kg', '')));
          const isBestValue = gasType.id === bestValue?.id;
          
          return (
            <Card key={gasType.id} className={`transition-all ${isBestValue ? 'border-green-500 bg-green-50' : ''}`}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="font-bold">{gasType.name}</p>
                    <p className="text-xs text-neutral">₦{pricePerKg}/kg</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₦{parseFloat(gasType.price).toLocaleString()}</p>
                  {isBestValue && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Best Value
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
  );
}