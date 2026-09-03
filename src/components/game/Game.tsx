import { useCallback, useMemo, useReducer } from "react";
import { QUESTIONS_PER_GAME } from "@/config";
import { gameReducer, initGame } from "@/game/reducer";
import { LanguageProvider, useLang } from "@/i18n/LanguageContext";
import { drawQuestionIds, questionsByIds } from "@/lib/questions";
import { HomeScreen } from "./HomeScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ScoreScreen } from "./ScoreScreen";

function GameInner() {
  const { lang, t } = useLang();
  const [state, dispatch] = useReducer(gameReducer, undefined, initGame);

  const questions = useMemo(
    () => questionsByIds(state.questionIds, lang),
    [state.questionIds, lang],
  );
  const question = questions[state.index];

  const handleStart = useCallback(() => {
    dispatch({ type: "start", questionIds: drawQuestionIds(QUESTIONS_PER_GAME) });
  }, []);

  const handleReplay = useCallback(() => {
    dispatch({ type: "restart", questionIds: drawQuestionIds(QUESTIONS_PER_GAME) });
  }, []);

  const handleAnswer = useCallback(
    (selected: number | null) => {
      if (!question) return;
      dispatch({
        type: "answer",
        questionId: question.id,
        selected,
        correctIndex: question.correctIndex,
      });
    },
    [question],
  );

  const handleNext = useCallback(() => dispatch({ type: "next" }), []);
  const handleHome = useCallback(() => dispatch({ type: "home" }), []);

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-3 focus:text-foreground"
      >
        {t.skipToContent}
      </a>

      {state.phase === "home" && <HomeScreen onStart={handleStart} />}

      {(state.phase === "playing" || state.phase === "feedback") && question && (
        <QuestionScreen
          key={`${state.runId}-${state.index}`}
          question={question}
          index={state.index}
          total={state.questionIds.length}
          phase={state.phase}
          selected={state.selected}
          timedOut={state.timedOut}
          results={state.answers.map((a) => a.correct)}
          score={state.score}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}

      {state.phase === "score" && (
        <ScoreScreen
          score={state.score}
          total={state.questionIds.length}
          onReplay={handleReplay}
          onMenu={handleHome}
        />
      )}
    </>
  );
}

export function Game() {
  return (
    <LanguageProvider>
      <GameInner />
    </LanguageProvider>
  );
}
