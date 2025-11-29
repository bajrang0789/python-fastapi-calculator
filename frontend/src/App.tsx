import { useState } from 'react'

const API_BASE = 'http://localhost:8000'

type Op = 'add' | 'subtract' | 'multiply' | 'divide'

export default function App() {
  const [a, setA] = useState<string>('')
  const [b, setB] = useState<string>('')
  const [op, setOp] = useState<Op>('add')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')

  const calculate = async () => {
    setError(''); setResult('')
    const aNum = Number(a), bNum = Number(b)
    if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
      setError('Please enter valid numbers');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/v1/calc/${op}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a: aNum, b: bNum })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || 'Request failed')
        return
      }
      const data = await res.json()
      setResult(String(data.result))
    } catch (e) {
      setError('Network error')
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Calculator</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        <input placeholder="a" value={a} onChange={e => setA(e.target.value)} />
        <input placeholder="b" value={b} onChange={e => setB(e.target.value)} />
        <select value={op} onChange={e => setOp(e.target.value as Op)}>
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
          <option value="divide">Divide</option>
        </select>
        <button onClick={calculate}>Calculate</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {result && <div>Result: {result}</div>}
      </div>
    </div>
  )
}
