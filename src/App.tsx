import { useState } from "react";
import { AnswerObject, Difficulty, QuestionsState } from "./lib/types";
import { fetchQuizQuestions } from "./lib/utils";
import QuestionCard from "./components/question-card";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import PreferencesForm from "./components/preferences-form";

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState<"new" | boolean>("new");

  async function startTrivia(
    total: number,
    category: string,
    difficulty: `${Difficulty}`
  ) {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(total, difficulty, category);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  async function checkAnswer(answer: string) {
    if (!gameOver) {
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  }

  function nextQuestion() {
    const nextQuestion = number + 1;
    if (nextQuestion === questions.length) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Todo App</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {gameOver || userAnswers.length === questions.length ? (
            <div className="flex justify-center flex-col items-center gap-2">
							{gameOver === true && (
								<p className="text-center">
									You answered {score}/{questions.length} questions correctly.
								</p>
							)}
              <PreferencesForm
                startTrivia={startTrivia}
                buttonLabel={gameOver === "new" ? "Start Trivia" : "Play Again"}
              />
            </div>
          ) : loading ? (
            <p>Loading questions...</p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                {!gameOver && <p>Score: {score}</p>}
                {!gameOver && (
                  <p>
                    Question: {number + 1} / {questions.length}
                  </p>
                )}
              </div>
              {loading && <p>Loading Questions...</p>}
              {!loading && !gameOver && (
                <QuestionCard
                  answers={questions[number].answers}
                  callback={checkAnswer}
                  question={questions[number].question}
                  nextQuestion={nextQuestion}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
