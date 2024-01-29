import { getAiApiResponse } from "@/app/services/apiService";

export async function POST(request: Request) {
  const { message } = await request.json();
  const data = await getAiApiResponse(message);
  return Response.json(data);
}
