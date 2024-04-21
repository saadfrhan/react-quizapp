import { useState } from "react";
import { AnswerObject, Difficulty, QuestionsState } from "./lib/types";
import { fetchQuizQuestions } from "./lib/utils";
import QuestionCard from "./components/question-card";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import PreferencesForm from "./components/preferences-form";

type GameState = "new" | "playing" | "over";

function App() {
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>("new");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  async function startTrivia(
    total: number,
    category: string,
    difficulty: `${Difficulty}`
  ) {
    setIsLoadingQuestions(true);
    const newQuestions = await fetchQuizQuestions(total, difficulty, category);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setGameState("playing");
    setIsLoadingQuestions(false);
  }

  async function checkAnswer(answer: string) {
    if (gameState === "playing") {
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
      setGameState("over");
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle className="text-3xl text-blue-600 font-semibold">
            Quiz App
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-lg">
          {gameState !== "playing" ||
          userAnswers.length === questions.length ? (
            <div className="flex justify-center flex-col items-center gap-2">
              {gameState === "over" && (
                <p className="text-center text-2xl text-green-600">
                  You answered {score}/{questions.length} questions correctly.
                </p>
              )}
              <PreferencesForm
                startTrivia={startTrivia}
                buttonLabel={
                  gameState === "new"
                    ? "Start Trivia"
                    : isLoadingQuestions
                    ? "Loading..."
                    : "Play Again"
                }
              />
            </div>
          ) : isLoadingQuestions ? (
            <p className="text-center text-2xl text-red-600">
              Loading questions...
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                {gameState === "playing" && (
                  <p className="text-xl text-gray-700">Score: {score}</p>
                )}
                {gameState === "playing" && (
                  <p className="text-xl text-gray-700">
                    Question: {number + 1} / {questions.length}
                  </p>
                )}
              </div>
              {isLoadingQuestions && (
                <p className="text-center text-2xl text-red-600">
                  Loading Questions...
                </p>
              )}
              {gameState === "playing" && (
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
