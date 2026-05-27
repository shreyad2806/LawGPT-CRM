export async function fetchAPI(
  url: string,
  options?: RequestInit
) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}