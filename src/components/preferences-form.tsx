import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { fetchCategories } from "@/lib/utils";
import { Categories } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

export default function PreferencesForm({
  buttonLabel,
  startTrivia,
}: {
  buttonLabel: "Start Trivia" | "Play Again" | "Loading...";
  startTrivia: (
    total: number,
    category: string,
    difficulty: "easy" | "medium" | "hard"
  ) => Promise<void>;
}) {
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [fetchedCategories, setFetchedCategories] = useState<Categories[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedCategories = await fetchCategories();
      setFetchedCategories(fetchedCategories);
    })();
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input
        className="text-lg"
        value={total === 0 ? "" : total}
        onChange={(e) => setTotal(Number(e.target.value))}
        type="number"
        placeholder="Total questions"
      />
      <Select onValueChange={(value) => setCategory(value)} value={category}>
        <SelectTrigger className="text-lg">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {fetchedCategories.map((category) => (
              <SelectItem
                className="text-lg"
                key={category.id}
                value={category.id.toString()}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="text-lg">
          <SelectValue className="text-lg" placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent className="text-lg">
          <SelectGroup>
            <SelectItem
              className="text-lg"
              onClick={() => setDifficulty("easy")}
              value="easy"
            >
              Easy
            </SelectItem>
            <SelectItem
              className="text-lg"
              onClick={() => setDifficulty("medium")}
              value="medium"
            >
              Medium
            </SelectItem>
            <SelectItem
              className="text-lg"
              onClick={() => setDifficulty("hard")}
              value="hard"
            >
              Hard
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        className="text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => startTrivia(total, category, difficulty)}
        disabled={!total || !category || !difficulty}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
