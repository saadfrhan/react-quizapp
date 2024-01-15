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
	const [selectedAnswer, setSelectedAnswer] = useState('');

  return (
    <div className="space-y-2">
      <p dangerouslySetInnerHTML={{ __html: question }} />
      <div className="flex flex-col gap-2">
			<RadioGroup>
        {answers.map((answer, index) => (
          <div className="flex items-center space-x-2" key={index}>
					<RadioGroupItem onClick={() => setSelectedAnswer(answer)} value={answer} id={answer} />
					<Label htmlFor={answer}>{answer}</Label>
				</div>
        ))}
				</RadioGroup>
      </div>
			<Button className="w-full" onClick={() => {
				callback(selectedAnswer);
				nextQuestion();
			setSelectedAnswer('');
			}} disabled={selectedAnswer ? false : true}>
				Next
			</Button>
    </div>
  );
}
