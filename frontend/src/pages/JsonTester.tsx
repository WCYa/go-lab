import ParserTester from "../components/ParserTester";

export default function JsonTester() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">JSON Tester</h1>
      <ParserTester defaultType="json" />
    </div>
  );
}
