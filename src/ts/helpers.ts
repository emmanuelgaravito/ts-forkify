import { TIMEOUT_SEC } from './config.ts';

// Time out promise function that throws an error if the request takes too long
const timeout = function (s: number): Promise<never> {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Api reusable Fetch with ts generics to receive and return slightly different types depending on the endpoint
export const getJSON = async function <T extends object>(
  url: string
): Promise<T> {
  try {
    const res = (await Promise.race([
      timeout(TIMEOUT_SEC),
      fetch(url),
    ])) as Response;

    const data = (await res.json()) as T;

    if (!res.ok) {
      // TS guard clauses
      let errorMessage = 'An error occurred';
      if (data && 'error' in data) {
        errorMessage = `${data.error}`;
      }
      if (res && 'status' in res) {
        errorMessage += ` (${res.status})`;
      }
      throw new Error(errorMessage);
    }
    return data;
  } catch (err) {
    throw err; // Throwing the error to be handled by the controller
  }
};
