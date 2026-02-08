import React, { useEffect, useState } from "react";
import axios from "axios";

interface ParserTesterProps {
  defaultType?: "json" | "xml" | "form";
}

type ParsedResult = object | XMLDocument | string | null;

const ParserTester: React.FC<ParserTesterProps> = ({
  defaultType = "json",
}) => {
  const [apiUrl, setApiUrl] = useState<string>("/api/learning/bindBodyMultiple");
  const [input, setInput] = useState<string>("");
  const [parsedResult, setParsedResult] = useState<ParsedResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<object | null>(null);

  useEffect(() => {
    if (defaultType === "form") {
    setParsedResult("name=WCYa&addresses=baba&addresses=papa");
    setApiUrl("/api/learning/BindDefaultsForForm")
  }
  }, [defaultType]);

  const handleParse = () => {
    setError(null);
    setParsedResult(null);

    if (defaultType === "json") {
      try {
        const json = JSON.parse(input);
        setParsedResult(json);
        return;
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unknown error");
        }
      }
    } else if (defaultType === "xml") {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, "application/xml");
        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) throw new Error("Invalid XML");
        setParsedResult(xmlDoc);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unknown error");
        }
      }
    } else if (defaultType === "form") {
      setParsedResult(input);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: ParsedResult = parsedResult;
      let type: string = "application/json";
      if (defaultType === "xml") {
        type = "application/xml";
        if (parsedResult instanceof XMLDocument) {
          data = new XMLSerializer().serializeToString(parsedResult);
        } else {
          data = null;
        }
      } else if (defaultType === "form") {
        type = "application/x-www-form-urlencoded";
      }
      const res = await axios.post(apiUrl, data,
        {
        headers: {
          "Content-Type": type,
        },
      });
      setResponseData(res.data);
      alert("Response: " + JSON.stringify(res.data));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || e.message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        list="api-options"
        className="w-full p-2 border border-gray-300 rounded"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        placeholder="Enter or select API URL..."
      />
      <datalist id="api-options">
        <option value="/api/learning/bindBodyOnce"></option>
        <option value="/api/learning/bindBodyMultiple"></option>
        <option value="/api/learning/BindDefaultsForForm"></option>
      </datalist>
      <textarea
        className="w-full h-48 p-2 border border-gray-300 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Paste ${defaultType.toUpperCase()} here...`}
      />
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleParse}
        >
          Parse
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send to Backend"}
        </button>
      </div>
      {error && <div className="text-red-500">Error: {error}</div>}
      {parsedResult && (
        <div className="bg-gray-100 p-2 rounded overflow-auto max-h-64">
          <pre>
            {parsedResult instanceof XMLDocument
              ? new XMLSerializer().serializeToString(parsedResult)
              : JSON.stringify(parsedResult, null, 2)}
          </pre>
        </div>
      )}
      {responseData && (
        <div className="bg-gray-100 p-2 rounded overflow-auto max-h-64">
          <h3 className="font-semibold mb-1">Response Data:</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ParserTester;
