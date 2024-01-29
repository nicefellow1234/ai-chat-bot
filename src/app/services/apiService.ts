import { unstable_noStore as noStore } from "next/cache";
import { marked } from "marked";

interface AiApiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface ApiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

interface ApiRequestBody {
  [key: string]: any;
}

export const getAiApiResponse = async (text: string) => {
  noStore();
  const body = generateRequest(text);
  let endpoint =
    process.env.API_ENDPOINT + ":generateContent?key=" + process.env.API_KEY;
  const res = await sendApiRequest(endpoint, body);
  return parseAiResponse(res);
};

const generateRequest = (text: string): ApiRequest => {
  let request = {
    contents: [
      {
        parts: [
          {
            text
          }
        ]
      }
    ]
  };
  return request;
};

const parseAiResponse = (res: AiApiResponse) => {
  return marked.parse(res?.candidates[0]?.content.parts[0].text);
};

export const sendApiRequest = async (
  endpoint: string,
  body: ApiRequestBody
) => {
  const data = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const res = await data.json();
  return res;
};
