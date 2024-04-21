import { QuestionCardProps } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";

export default function QuestionCard({
  answers,
  callback,
  question,
  nextQuestion,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("");

  return (
    <div className="space-y-2">
      <p
        className="text-2xl text-blue-600 font-semibold"
        dangerouslySetInnerHTML={{ __html: question }}
      />
      <div className="flex flex-col gap-2">
        <RadioGroup>
          {answers.map((answer, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem
                onClick={() => setSelectedAnswer(answer)}
                value={answer}
                id={answer}
              />
              <Label htmlFor={answer} className="text-lg text-gray-700">
                {answer}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <Button
        className="w-full text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          callback(selectedAnswer);
          nextQuestion();
          setSelectedAnswer("");
        }}
        disabled={selectedAnswer ? false : true}
      >
        Next
      </Button>
    </div>
  );
}
