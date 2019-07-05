export function formatDate(date) {
  return new Date(date).toLocaleDateString(["en-US"], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function handleErrors(response) {
  if (!response.ok) throw Error(response.statusText);
  return response.json();
}
