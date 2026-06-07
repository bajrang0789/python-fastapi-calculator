import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Operation = "add" | "subtract" | "multiply" | "divide";

const operationMeta: Record<
  Operation,
  { label: string; symbol: "+" | "-" | "×" | "÷" }
> = {
  add: { label: "Add", symbol: "+" },
  subtract: { label: "Subtract", symbol: "-" },
  multiply: { label: "Multiply", symbol: "×" },
  divide: { label: "Divide", symbol: "÷" },
};

const buttons: Array<
  | { kind: "action"; label: "AC" | "±" | "%" }
  | { kind: "digit"; label: string }
  | { kind: "operator"; label: Operation }
  | { kind: "equals"; label: "=" }
> = [
  { kind: "action", label: "AC" },
  { kind: "action", label: "±" },
  { kind: "action", label: "%" },
  { kind: "operator", label: "divide" },
  { kind: "digit", label: "7" },
  { kind: "digit", label: "8" },
  { kind: "digit", label: "9" },
  { kind: "operator", label: "multiply" },
  { kind: "digit", label: "4" },
  { kind: "digit", label: "5" },
  { kind: "digit", label: "6" },
  { kind: "operator", label: "subtract" },
  { kind: "digit", label: "1" },
  { kind: "digit", label: "2" },
  { kind: "digit", label: "3" },
  { kind: "operator", label: "add" },
  { kind: "digit", label: "0" },
  { kind: "digit", label: "." },
  { kind: "equals", label: "=" },
];

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "Error";
  if (Number.isInteger(value)) return value.toString();
  return Number(value.toFixed(10)).toString();
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

async function calculateOnServer(
  left: number,
  right: number,
  operation: Operation,
) {
  const response = await fetch(`${API_BASE_URL}/api/v1/calc/${operation}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a: left, b: right }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { detail?: string }
      | null;
    throw new Error(data?.detail ?? "Request failed");
  }

  return (await response.json()) as { result: number };
}

export default function App() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [pendingOperation, setPendingOperation] = useState<Operation | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const subtitle = useMemo(
    () =>
      "A UI ported into the existing React frontend and connected to the FastAPI calculator endpoints.",
    [],
  );

  const reset = () => {
    setDisplay("0");
    setStoredValue(null);
    setPendingOperation(null);
    setWaitingForOperand(false);
    setError("");
  };

  const inputDigit = (digit: string) => {
    if (display === "Error") reset();
    setError("");

    if (waitingForOperand) {
      setDisplay(digit === "." ? "0." : digit);
      setWaitingForOperand(false);
      return;
    }

    if (digit === "." && display.includes(".")) return;
    setDisplay(display === "0" && digit !== "." ? digit : display + digit);
  };

  const applyPercent = () => {
    if (display === "Error") return;
    setDisplay(formatNumber(Number(display) / 100));
  };

  const toggleSign = () => {
    if (display === "Error") return;
    setDisplay(formatNumber(Number(display) * -1));
  };

  const runOperation = async (nextOperation: Operation) => {
    const inputValue = Number(display);
    setError("");

    if (storedValue === null) {
      setStoredValue(inputValue);
      setPendingOperation(nextOperation);
      setWaitingForOperand(true);
      return;
    }

    if (pendingOperation) {
      setIsCalculating(true);
      try {
        const { result } = await calculateOnServer(
          storedValue,
          inputValue,
          pendingOperation,
        );
        const formatted = formatNumber(result);
        setDisplay(formatted);
        setStoredValue(result);
        if (Number.isFinite(result)) {
          setHistory((current) =>
            [
              `${formatNumber(storedValue)} ${operationMeta[pendingOperation].symbol} ${display} = ${formatted}`,
              ...current,
            ].slice(0, 4),
          );
        }
      } catch (cause) {
        setDisplay("Error");
        setError(cause instanceof Error ? cause.message : "Request failed");
        setStoredValue(null);
        setPendingOperation(null);
      } finally {
        setIsCalculating(false);
      }
    }

    setPendingOperation(nextOperation);
    setWaitingForOperand(true);
  };

  const handleEquals = async () => {
    if (pendingOperation === null || storedValue === null) return;

    const inputValue = Number(display);
    setIsCalculating(true);
    setError("");

    try {
      const { result } = await calculateOnServer(
        storedValue,
        inputValue,
        pendingOperation,
      );
      const formatted = formatNumber(result);
      const entry = `${formatNumber(storedValue)} ${operationMeta[pendingOperation].symbol} ${display} = ${formatted}`;

      setDisplay(formatted);
      setStoredValue(null);
      setPendingOperation(null);
      setWaitingForOperand(true);

      if (Number.isFinite(result)) {
        setHistory((current) => [entry, ...current].slice(0, 4));
      }
    } catch (cause) {
      setDisplay("Error");
      setError(cause instanceof Error ? cause.message : "Request failed");
      setStoredValue(null);
      setPendingOperation(null);
      setWaitingForOperand(false);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        inputDigit(event.key);
        return;
      }

      if (event.key === ".") {
        event.preventDefault();
        inputDigit(".");
        return;
      }

      if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        void handleEquals();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        reset();
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        if (display === "Error") {
          reset();
          return;
        }

        if (waitingForOperand) return;

        setDisplay((current) => {
          const nextValue =
            current.length <= 1 || (current.length === 2 && current.startsWith("-"))
              ? "0"
              : current.slice(0, -1);
          return nextValue;
        });
        return;
      }

      if (event.key === "+") {
        event.preventDefault();
        void runOperation("add");
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        void runOperation("subtract");
        return;
      }

      if (event.key === "*") {
        event.preventDefault();
        void runOperation("multiply");
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        void runOperation("divide");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [display, handleEquals, inputDigit, reset, runOperation, waitingForOperand]);

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="eyebrow">Python FastAPI Calculator</div>
        <h1>Calculator program, ported into the existing React frontend.</h1>
        <p>{subtitle}</p>

        <div className="feature-grid">
          <article>
            <span>Core ops</span>
            <strong>Add, subtract, multiply, divide</strong>
          </article>
          <article>
            <span>Backend-backed</span>
            <strong>Calls the existing FastAPI API</strong>
          </article>
          <article>
            <span>History</span>
            <strong>Recent calculations stay visible</strong>
          </article>
        </div>
      </section>

      <section className="calculator-card" aria-label="Calculator">
        <div className="calculator-topbar">
          <span>{isCalculating ? "Calculating..." : "React + FastAPI"}</span>
          <button type="button" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="display">
          <div className="expression">
            {pendingOperation && storedValue !== null
              ? `${formatNumber(storedValue)} ${operationMeta[pendingOperation].symbol}`
              : "Ready"}
          </div>
          <div className="value">{display}</div>
          {error ? <div className="error">{error}</div> : null}
        </div>

        <div className="button-grid">
          {buttons.map((button) => {
            const className = [
              "key",
              button.kind,
              button.kind === "digit" && button.label === "0" ? "wide" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={`${button.kind}-${button.label}`}
                className={className}
                disabled={isCalculating}
                type="button"
                onClick={() => {
                  if (button.kind === "digit") inputDigit(button.label);
                  if (button.kind === "operator") void runOperation(button.label);
                  if (button.kind === "equals") void handleEquals();
                  if (button.kind === "action") {
                    if (button.label === "AC") reset();
                    if (button.label === "±") toggleSign();
                    if (button.label === "%") applyPercent();
                  }
                }}
              >
                {button.kind === "operator" ? operationMeta[button.label].symbol : button.label}
              </button>
            );
          })}
        </div>

        <div className="history-panel">
          <div className="history-header">
            <h2>Recent calculations</h2>
            <button type="button" onClick={() => setHistory([])}>
              Clear
            </button>
          </div>
          <div className="history-list">
            {history.length === 0 ? (
              <p>No calculations yet.</p>
            ) : (
              history.map((entry) => <p key={entry}>{entry}</p>)
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
